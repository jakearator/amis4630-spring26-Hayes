using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BuckeyeMarketplaceBackend.Data;
using BuckeyeMarketplaceBackend.Models;
using BuckeyeMarketplaceBackend.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuckeyeMarketplaceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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

            var userId = GetCurrentUserId();
            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || cart.Items.Count == 0)
            {
                return BadRequest("Your cart is empty. Add items before placing an order.");
            }

            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            foreach (var cartItem in cart.Items)
            {
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

            var order = CartToOrderMapper.MapToOrder(
                cart,
                userId,
                shippingAddress,
                DateTime.UtcNow,
                GenerateConfirmationNumber());

            foreach (var cartItem in cart.Items)
            {
                cartItem.Product!.StockQuantity -= cartItem.Quantity;
                if (cartItem.Product.StockQuantity <= 0)
                {
                    cartItem.Product.StockQuantity = 0;
                    cartItem.Product.IsAvailable = false;
                }
            }

            _dbContext.Orders.Add(order);
            _dbContext.CartItems.RemoveRange(cart.Items);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(MapOrderResponse(order));
        }

        // GET: api/orders/mine
        [HttpGet("mine")]
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

        private string GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
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
