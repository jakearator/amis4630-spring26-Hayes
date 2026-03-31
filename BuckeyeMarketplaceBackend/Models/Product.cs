using System.Text.Json.Serialization;

namespace BuckeyeMarketplaceBackend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public string? Brand { get; set; }
        public DateTime PostedDate { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsAvailable { get; set; } = true;
        public int StockQuantity { get; set; }
        [JsonIgnore]
        public List<CartItem> CartItems { get; set; } = new();
    }
}
