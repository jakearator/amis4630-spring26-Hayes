namespace BuckeyeMarketplaceBackend.Models
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime TokenExpiresAtUtc { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiresAtUtc { get; set; }
    }
}