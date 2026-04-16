using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplaceBackend.Models
{
    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}