using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BuckeyeMarketplaceBackend.Models
{
    [JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
    public class UpdateCartItemRequest
    {
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
