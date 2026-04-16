using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BuckeyeMarketplaceBackend.Data;
using BuckeyeMarketplaceBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuckeyeMarketplaceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly MarketplaceDbContext _dbContext;

        public CartController(MarketplaceDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/cart
        [HttpGet]
        public async Task<ActionResult<Cart>> GetCart()
        {
            var cart = await GetOrCreateCartAsync();
            return Ok(cart);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<ActionResult<Cart>> AddToCart([FromBody] AddCartItemRequest request)
        {
            if (request.ProductId <= 0 || request.Quantity <= 0)
            {
                return BadRequest("ProductId and quantity must be greater than 0.");
            }

            var product = await _dbContext.Products
                .FirstOrDefaultAsync(p => p.Id == request.ProductId);

            if (product == null)
            {
                return NotFound($"Product with id {request.ProductId} was not found.");
            }

            if (!product.IsAvailable)
            {
                return Conflict("This product is currently unavailable.");
            }

            if (product.StockQuantity <= 0)
            {
                return Conflict("This product is out of stock.");
            }

            var cart = await GetOrCreateCartAsync();
            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);

            if (existingItem != null)
            {
                var updatedQuantity = existingItem.Quantity + request.Quantity;

                if (updatedQuantity > product.StockQuantity)
                {
                    return BadRequest($"Only {product.StockQuantity} unit(s) are available for this product.");
                }

                existingItem.Quantity += request.Quantity;
                existingItem.Product = product;
                await _dbContext.SaveChangesAsync();
                var updatedCart = await GetOrCreateCartAsync();
                return Ok(updatedCart);
            }

            if (request.Quantity > product.StockQuantity)
            {
                return BadRequest($"Only {product.StockQuantity} unit(s) are available for this product.");
            }

            var newItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Product = product
            };

            _dbContext.CartItems.Add(newItem);
            await _dbContext.SaveChangesAsync();

            var createdCart = await GetOrCreateCartAsync();
            return CreatedAtAction(nameof(GetCart), createdCart);
        }

        // PUT: api/cart/{cartItemId}
        [HttpPut("{cartItemId}")]
        public async Task<ActionResult<Cart>> UpdateCartItemQuantity(int cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            if (request.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            var item = await _dbContext.CartItems
                .Include(i => i.Cart)
                .Include(i => i.Product)
                .FirstOrDefaultAsync(i => i.Id == cartItemId && i.Cart != null && i.Cart.UserId == GetCurrentUserId());

            if (item == null)
            {
                return NotFound($"Cart item with id {cartItemId} was not found.");
            }

            if (item.Product == null || !item.Product.IsAvailable)
            {
                return Conflict("This product is currently unavailable.");
            }

            if (request.Quantity > item.Product.StockQuantity)
            {
                return BadRequest($"Only {item.Product.StockQuantity} unit(s) are available for this product.");
            }

            item.Quantity = request.Quantity;
            await _dbContext.SaveChangesAsync();

            var cart = await GetOrCreateCartAsync();

            return Ok(cart);
        }

        // DELETE: api/cart/{cartItemId}
        [HttpDelete("{cartItemId}")]
        public async Task<ActionResult<Cart>> RemoveCartItem(int cartItemId)
        {
            var item = await _dbContext.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == cartItemId && i.Cart != null && i.Cart.UserId == GetCurrentUserId());

            if (item == null)
            {
                return NotFound($"Cart item with id {cartItemId} was not found.");
            }

            _dbContext.CartItems.Remove(item);
            await _dbContext.SaveChangesAsync();

            var cart = await GetOrCreateCartAsync();
            return Ok(cart);
        }

        // DELETE: api/cart/clear
        [HttpDelete("clear")]
        public async Task<ActionResult<Cart>> ClearCart()
        {
            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == GetCurrentUserId());

            if (cart == null)
            {
                cart = await GetOrCreateCartAsync();
                return Ok(cart);
            }

            _dbContext.CartItems.RemoveRange(cart.Items);
            await _dbContext.SaveChangesAsync();

            var updatedCart = await GetOrCreateCartAsync();
            return Ok(updatedCart);
        }

        private async Task<Cart> GetOrCreateCartAsync()
        {
            var userId = GetCurrentUserId();

            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart != null)
            {
                return cart;
            }

            cart = new Cart
            {
                UserId = userId
            };

            _dbContext.Carts.Add(cart);
            await _dbContext.SaveChangesAsync();

            return await _dbContext.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstAsync(c => c.Id == cart.Id);
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
    }
}