using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BuckeyeMarketplaceBackend.Models
{
    [JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
    public class UpdateOrderStatusRequest
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;
    }
}
