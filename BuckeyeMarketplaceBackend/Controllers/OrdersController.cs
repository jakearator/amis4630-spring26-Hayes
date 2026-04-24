using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BuckeyeMarketplaceBackend.Data;
using BuckeyeMarketplaceBackend.Models;
using BuckeyeMarketplaceBackend.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplaceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
        {
            "Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

        private readonly MarketplaceDbContext _dbContext;

        public OrdersController(MarketplaceDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // POST: api/orders
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<object>> PlaceOrder([FromBody] PlaceOrderRequest request)
        {
            var shippingAddress = request.ShippingAddress.Trim();
            if (string.IsNullOrWhiteSpace(shippingAddress))
            {
                return BadRequest("Shipping address is required.");
            }

            if (shippingAddress.Length > 500)
            {
                return BadRequest("Shipping address cannot exceed 500 characters.");
            }

            var userId = TryGetCurrentUserId();
            var customerEmail = userId != null
                ? TryGetCurrentUserEmail() ?? ResolveCustomerEmail(request.CustomerEmail)
                : ResolveCustomerEmail(request.CustomerEmail);

            if (userId == null && customerEmail == null)
            {
                return BadRequest("Email is required for guest checkout.");
            }

            if (userId == null && !string.IsNullOrWhiteSpace(request.CustomerEmail) && customerEmail == null)
            {
                return BadRequest("A valid email address is required.");
            }

            Order order;

            if (userId != null)
            {
                var cart = await _dbContext.Carts
                    .Include(c => c.Items)
                        .ThenInclude(i => i.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || cart.Items.Count == 0)
                {
                    return BadRequest("Your cart is empty. Add items before placing an order.");
                }

                foreach (var cartItem in cart.Items)
                {
                    if (cartItem.Quantity <= 0)
                    {
                        return Conflict("Your cart contains an invalid quantity. Update your cart and try again.");
                    }

                    if (cartItem.Product == null)
                    {
                        return NotFound($"Product with id {cartItem.ProductId} was not found.");
                    }

                    if (!cartItem.Product.IsAvailable)
                    {
                        return Conflict($"{cartItem.Product.Title ?? "This product"} is currently unavailable.");
                    }

                    if (cartItem.Quantity > cartItem.Product.StockQuantity)
                    {
                        return Conflict($"Only {cartItem.Product.StockQuantity} unit(s) are available for {cartItem.Product.Title ?? "this product"}.");
                    }
                }

                order = CartToOrderMapper.MapToOrder(
                    cart,
                    userId,
                    shippingAddress,
                    DateTime.UtcNow,
                    GenerateConfirmationNumber(),
                    customerEmail ?? TryGetCurrentUserEmail());

                foreach (var cartItem in cart.Items)
                {
                    cartItem.Product!.StockQuantity -= cartItem.Quantity;
                    if (cartItem.Product.StockQuantity <= 0)
                    {
                        cartItem.Product.StockQuantity = 0;
                        cartItem.Product.IsAvailable = false;
                    }
                }

                _dbContext.CartItems.RemoveRange(cart.Items);
            }
            else
            {
                var requestedItems = request.Items ?? new List<PlaceOrderItemRequest>();
                if (requestedItems.Count == 0)
                {
                    return BadRequest("Your cart is empty. Add items before placing an order.");
                }

                var normalizedItems = requestedItems
                    .GroupBy(item => item.ProductId)
                    .Select(group => new PlaceOrderItemRequest
                    {
                        ProductId = group.Key,
                        Quantity = group.Sum(item => item.Quantity)
                    })
                    .ToList();

                var requestedProductIds = normalizedItems.Select(item => item.ProductId).ToList();
                var products = await _dbContext.Products
                    .Where(product => requestedProductIds.Contains(product.Id))
                    .ToDictionaryAsync(product => product.Id);

                var orderItems = new List<OrderItem>();

                foreach (var requestedItem in normalizedItems)
                {
                    if (!products.TryGetValue(requestedItem.ProductId, out var product))
                    {
                        return NotFound($"Product with id {requestedItem.ProductId} was not found.");
                    }

                    if (!product.IsAvailable)
                    {
                        return Conflict($"{product.Title ?? "This product"} is currently unavailable.");
                    }

                    if (requestedItem.Quantity > product.StockQuantity)
                    {
                        return Conflict($"Only {product.StockQuantity} unit(s) are available for {product.Title ?? "this product"}.");
                    }

                    orderItems.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        ProductTitle = product.Title ?? "Untitled Product",
                        Quantity = requestedItem.Quantity,
                        UnitPrice = product.Price
                    });
                }

                order = CartToOrderMapper.MapToOrder(
                    orderItems,
                    null,
                    shippingAddress,
                    DateTime.UtcNow,
                    GenerateConfirmationNumber(),
                    customerEmail);

                foreach (var requestedItem in normalizedItems)
                {
                    var product = products[requestedItem.ProductId];
                    product.StockQuantity -= requestedItem.Quantity;
                    if (product.StockQuantity <= 0)
                    {
                        product.StockQuantity = 0;
                        product.IsAvailable = false;
                    }
                }
            }

            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            return Ok(MapOrderResponse(order));
        }

        // GET: api/orders/mine
        [HttpGet("mine")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyOrders()
        {
            var userId = GetCurrentUserId();

            var orders = await _dbContext.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders.Select(MapOrderResponse));
        }

        // GET: api/orders/admin
        [HttpGet("admin")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllOrdersForAdmin()
        {
            var orders = await _dbContext.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders.Select(MapOrderResponse));
        }

        // PUT: api/orders/{orderId}/status
        [HttpPut("{orderId}/status")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<object>> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
        {
            var status = request.Status.Trim();
            if (string.IsNullOrWhiteSpace(status))
            {
                return BadRequest("Order status is required.");
            }

            if (status.Length > 50)
            {
                return BadRequest("Order status cannot exceed 50 characters.");
            }

            if (!AllowedStatuses.Contains(status))
            {
                return BadRequest("Invalid order status. Allowed values: Placed, Processing, Shipped, Delivered, Cancelled.");
            }

            var order = await _dbContext.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound($"Order with id {orderId} was not found.");
            }

            order.Status = status;
            await _dbContext.SaveChangesAsync();

            return Ok(MapOrderResponse(order));
        }

        private static string? ResolveCustomerEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            var normalizedEmail = email.Trim();
            var validator = new EmailAddressAttribute();

            return validator.IsValid(normalizedEmail) ? normalizedEmail : null;
        }

        private string? TryGetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        private string? TryGetCurrentUserEmail()
        {
            return User.FindFirstValue(ClaimTypes.Email);
        }

        private string GetCurrentUserId()
        {
            var userId = TryGetCurrentUserId();
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new InvalidOperationException("Authenticated user id was not found in JWT claims.");
            }

            return userId;
        }

        private static string GenerateConfirmationNumber()
        {
            return $"BM-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
        }

        private static object MapOrderResponse(Order order)
        {
            return new
            {
                id = order.Id,
                userId = order.UserId,
                customerEmail = order.CustomerEmail,
                orderDate = order.OrderDate,
                status = order.Status,
                total = order.Total,
                shippingAddress = order.ShippingAddress,
                confirmationNumber = order.ConfirmationNumber,
                items = order.Items.Select(i => new
                {
                    id = i.Id,
                    orderId = i.OrderId,
                    productId = i.ProductId,
                    productTitle = i.ProductTitle,
                    quantity = i.Quantity,
                    unitPrice = i.UnitPrice
                })
            };
        }
    }
}
