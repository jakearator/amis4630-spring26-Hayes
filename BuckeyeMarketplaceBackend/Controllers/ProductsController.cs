using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BuckeyeMarketplaceBackend.Models;
using BuckeyeMarketplaceBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplaceBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly MarketplaceDbContext _dbContext;

        public ProductsController(MarketplaceDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            var products = await _dbContext.Products
                .OrderBy(p => p.Id)
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _dbContext.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        // POST: api/products
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] Product request)
        {
            if (string.IsNullOrWhiteSpace(request.Title) || request.Price < 0 || request.StockQuantity < 0)
            {
                return BadRequest("Title is required. Price and stock quantity must be non-negative.");
            }

            var newProduct = new Product
            {
                Title = request.Title.Trim(),
                Description = request.Description,
                Price = request.Price,
                Category = request.Category,
                Brand = request.Brand,
                ImageUrl = request.ImageUrl,
                IsAvailable = request.IsAvailable,
                StockQuantity = request.StockQuantity,
                PostedDate = request.PostedDate == default ? DateTime.UtcNow : request.PostedDate
            };

            _dbContext.Products.Add(newProduct);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = newProduct.Id }, newProduct);
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] Product request)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            if (string.IsNullOrWhiteSpace(request.Title) || request.Price < 0 || request.StockQuantity < 0)
            {
                return BadRequest("Title is required. Price and stock quantity must be non-negative.");
            }

            product.Title = request.Title.Trim();
            product.Description = request.Description;
            product.Price = request.Price;
            product.Category = request.Category;
            product.Brand = request.Brand;
            product.ImageUrl = request.ImageUrl;
            product.IsAvailable = request.IsAvailable;
            product.StockQuantity = request.StockQuantity;

            await _dbContext.SaveChangesAsync();
            return Ok(product);
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            _dbContext.Products.Remove(product);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
