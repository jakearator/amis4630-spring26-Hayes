using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BuckeyeMarketplaceBackend.Models
{
    [JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
    public class PlaceOrderRequest
    {
        [Required]
        [StringLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(256)]
        public string? CustomerEmail { get; set; }

        public List<PlaceOrderItemRequest> Items { get; set; } = new();
    }
}
