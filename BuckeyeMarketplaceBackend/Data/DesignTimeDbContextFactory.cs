using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BuckeyeMarketplaceBackend.Data
{
    // Force SQL Server for EF Core design-time operations so generated migrations
    // stay Azure SQL-compatible regardless of runtime provider switching.
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MarketplaceDbContext>
    {
        public MarketplaceDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MarketplaceDbContext>();

            const string designTimeConnectionString =
                "Server=(localdb)\\mssqllocaldb;Database=BuckeyeMarketplaceDesignTime;Trusted_Connection=True;TrustServerCertificate=True;";

            optionsBuilder.UseSqlServer(designTimeConnectionString);

            return new MarketplaceDbContext(optionsBuilder.Options);
        }
    }
}
