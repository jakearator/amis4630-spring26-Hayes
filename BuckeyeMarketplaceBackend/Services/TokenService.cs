using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BuckeyeMarketplaceBackend.Models;
using Microsoft.IdentityModel.Tokens;

namespace BuckeyeMarketplaceBackend.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public AuthResponse CreateAccessToken(ApplicationUser user, IEnumerable<string> roles)
        {
            var key = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT key not configured. Set it with 'dotnet user-secrets set Jwt:Key \"<key>\"'.");

            var issuer = _configuration["Jwt:Issuer"] ?? "BuckeyeMarketplace";
            var audience = _configuration["Jwt:Audience"] ?? "BuckeyeMarketplaceClient";
            var expiresAt = DateTime.UtcNow.AddMinutes(30);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(ClaimTypes.NameIdentifier, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new(ClaimTypes.Email, user.Email ?? string.Empty),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);

            return new AuthResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                TokenExpiresAtUtc = expiresAt
            };
        }

        public string CreateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes);
        }
    }
}