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
        Assert.NotEmpty(order.GetProperty("items").EnumerateArray());
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
