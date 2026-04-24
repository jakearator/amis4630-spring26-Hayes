namespace BuckeyeMarketplaceBackend.Models
{
    public class PlaceOrderRequest
    {
        public string ShippingAddress { get; set; } = string.Empty;
        public string? CustomerEmail { get; set; }
        public List<PlaceOrderItemRequest> Items { get; set; } = new();
    }
}
