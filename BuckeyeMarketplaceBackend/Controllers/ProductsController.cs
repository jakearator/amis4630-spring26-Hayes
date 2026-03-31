using Microsoft.AspNetCore.Mvc;
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
    }
}
