using BuckeyeMarketplaceBackend.Models;

namespace BuckeyeMarketplaceBackend.Services
{
    public interface ITokenService
    {
        AuthResponse CreateAccessToken(ApplicationUser user, IEnumerable<string> roles);
        string CreateRefreshToken();
    }
}