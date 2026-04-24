using System.Net;
using BuckeyeMarketplaceBackend.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Encodings.Web;
using System.Text;
using BuckeyeMarketplaceBackend.Models;

namespace BuckeyeMarketplaceBackend.Tests.Integration;

public class AuthProtectedEndpointsTests : IClassFixture<AuthProtectedEndpointsTests.CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AuthProtectedEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task ProtectedEndpoint_ReturnsUnauthorized_WhenNoAuthHeader()
    {
        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/api/orders/mine");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_ReturnsForbidden_ForNonAdminUser()
    {
        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.Add("Authorization", $"{TestAuthHandler.SchemeName} shopper-user");

        var response = await client.GetAsync("/api/orders/admin");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_ReturnsOk_ForAdminUser()
    {
        await SeedOrdersAsync();

        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.Add("Authorization", $"{TestAuthHandler.SchemeName} admin-user;Admin");

        var response = await client.GetAsync("/api/orders/admin");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetMyOrders_ReturnsOnlyOrders_ForAuthenticatedUserClaim()
    {
        await SeedOrdersAsync();

        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.Add("Authorization", $"{TestAuthHandler.SchemeName} shopper-a");

        var response = await client.GetAsync("/api/orders/mine");
        var payload = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var document = JsonDocument.Parse(payload);
        var orders = document.RootElement;

        Assert.Equal(JsonValueKind.Array, orders.ValueKind);
        Assert.NotEmpty(orders.EnumerateArray());

        foreach (var order in orders.EnumerateArray())
        {
            var userId = order.GetProperty("userId").GetString();
            Assert.Equal("shopper-a", userId);
        }
    }

    [Fact]
    public async Task GuestCheckout_ReturnsOk_WithoutAuthentication()
    {
        await SetProductPriceAsync(1, 89.99m);

        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });

        var payload = JsonSerializer.Serialize(new
        {
            customerEmail = "guest@example.com",
            shippingAddress = "500 Guest Lane",
            items = new[]
            {
                new
                {
                    productId = 1,
                    quantity = 1
                }
            }
        });

        using var response = await client.PostAsync(
            "/api/orders",
            new StringContent(payload, Encoding.UTF8, "application/json"));

        var responseBody = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var document = JsonDocument.Parse(responseBody);
        var order = document.RootElement;

        Assert.Equal(JsonValueKind.Null, order.GetProperty("userId").ValueKind);
        Assert.Equal("guest@example.com", order.GetProperty("customerEmail").GetString());
        Assert.Equal("500 Guest Lane", order.GetProperty("shippingAddress").GetString());
        Assert.Equal(89.99m, order.GetProperty("total").GetDecimal());
        Assert.NotEmpty(order.GetProperty("items").EnumerateArray());
    }

    [Fact]
    public async Task GuestCheckout_RejectsUnexpectedUserAndTotalFields()
    {
        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });

        var payload = JsonSerializer.Serialize(new
        {
            customerEmail = "guest@example.com",
            shippingAddress = "500 Guest Lane",
            userId = "spoofed-user",
            total = 0.01m,
            items = new[]
            {
                new
                {
                    productId = 1,
                    quantity = 1
                }
            }
        });

        using var response = await client.PostAsync(
            "/api/orders",
            new StringContent(payload, Encoding.UTF8, "application/json"));

        var responseBody = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Please correct the highlighted fields and try again.", responseBody);
        Assert.DoesNotContain("System.", responseBody, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task GuestCheckout_CalculatesTotalFromDatabasePrice()
    {
        await SetProductPriceAsync(1, 123.45m);

        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });

        var payload = JsonSerializer.Serialize(new
        {
            customerEmail = "guest@example.com",
            shippingAddress = "500 Guest Lane",
            items = new[]
            {
                new
                {
                    productId = 1,
                    quantity = 2
                }
            }
        });

        using var response = await client.PostAsync(
            "/api/orders",
            new StringContent(payload, Encoding.UTF8, "application/json"));

        var responseBody = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var document = JsonDocument.Parse(responseBody);
        var order = document.RootElement;
        var orderItem = order.GetProperty("items").EnumerateArray().Single();

        Assert.Equal(246.90m, order.GetProperty("total").GetDecimal());
        Assert.Equal(123.45m, orderItem.GetProperty("unitPrice").GetDecimal());
    }

    [Fact]
    public async Task UpdateCartItemQuantity_ReturnsNotFound_WhenCartItemBelongsToDifferentUser()
    {
        var cartItemId = await SeedCartAsync("shopper-a", 1, 1);

        using var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.Add("Authorization", $"{TestAuthHandler.SchemeName} shopper-b");

        var payload = JsonSerializer.Serialize(new
        {
            quantity = 2
        });

        using var response = await client.PutAsync(
            $"/api/cart/{cartItemId}",
            new StringContent(payload, Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private async Task SeedOrdersAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MarketplaceDbContext>();

        dbContext.Orders.RemoveRange(dbContext.Orders);

        dbContext.Orders.AddRange(
            new Order
            {
                UserId = "shopper-a",
                OrderDate = DateTime.UtcNow,
                Status = "Placed",
                Total = 12.34m,
                ShippingAddress = "111 Test Lane",
                ConfirmationNumber = "BM-TEST-A",
                Items =
                {
                    new OrderItem
                    {
                        ProductId = 1,
                        ProductTitle = "Item A",
                        Quantity = 1,
                        UnitPrice = 12.34m
                    }
                }
            },
            new Order
            {
                UserId = "shopper-b",
                OrderDate = DateTime.UtcNow.AddMinutes(-5),
                Status = "Placed",
                Total = 45.67m,
                ShippingAddress = "222 Sample Street",
                ConfirmationNumber = "BM-TEST-B",
                Items =
                {
                    new OrderItem
                    {
                        ProductId = 2,
                        ProductTitle = "Item B",
                        Quantity = 2,
                        UnitPrice = 22.835m
                    }
                }
            });

        await dbContext.SaveChangesAsync();
    }

    private async Task SetProductPriceAsync(int productId, decimal price)
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MarketplaceDbContext>();

        var product = await dbContext.Products.FirstAsync(p => p.Id == productId);
        product.Price = price;
        product.StockQuantity = Math.Max(product.StockQuantity, 10);
        product.IsAvailable = true;

        await dbContext.SaveChangesAsync();
    }

    private async Task<int> SeedCartAsync(string userId, int productId, int quantity)
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MarketplaceDbContext>();

        dbContext.CartItems.RemoveRange(dbContext.CartItems);
        dbContext.Carts.RemoveRange(dbContext.Carts);

        var product = await dbContext.Products.FirstAsync(p => p.Id == productId);
        product.StockQuantity = Math.Max(product.StockQuantity, quantity + 5);
        product.IsAvailable = true;

        var cart = new Cart
        {
            UserId = userId,
            Items =
            {
                new CartItem
                {
                    ProductId = productId,
                    Quantity = quantity,
                    Product = product
                }
            }
        };

        dbContext.Carts.Add(cart);
        await dbContext.SaveChangesAsync();

        return cart.Items.Single().Id;
    }

    public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((_, configBuilder) =>
            {
                var testConfig = new Dictionary<string, string?>
                {
                    ["Jwt:Key"] = "this-is-a-test-key-with-at-least-32-characters",
                    ["Jwt:Issuer"] = "BuckeyeMarketplace",
                    ["Jwt:Audience"] = "BuckeyeMarketplaceClient"
                };

                configBuilder.AddInMemoryCollection(testConfig);
            });

            builder.ConfigureServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<MarketplaceDbContext>));

                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                    options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                }).AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    TestAuthHandler.SchemeName,
                    _ => { });

                services.AddDbContext<MarketplaceDbContext>(options =>
                {
                    options.UseInMemoryDatabase("MarketplaceIntegrationTestsDb");
                });
            });
        }
    }

    public sealed class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public const string SchemeName = "Test";

        public TestAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder)
            : base(options, logger, encoder)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("Authorization", out var authHeaderValues))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            var authHeader = authHeaderValues.ToString();
            if (!authHeader.StartsWith(SchemeName, StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            var payload = authHeader[SchemeName.Length..].Trim();
            var segments = payload.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var userId = segments.Length > 0 && !string.IsNullOrWhiteSpace(segments[0])
                ? segments[0]
                : "test-user-123";

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId),
                new(ClaimTypes.Email, $"{userId}@buckeye.test")
            };

            if (segments.Length > 1)
            {
                var roles = segments[1].Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
            }

            var identity = new ClaimsIdentity(claims, SchemeName);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, SchemeName);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
