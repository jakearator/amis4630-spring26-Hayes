namespace BuckeyeMarketplaceBackend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? CustomerEmail { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "Placed";
        public decimal Total { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string ConfirmationNumber { get; set; } = string.Empty;
        public List<OrderItem> Items { get; set; } = new();
    }
}
