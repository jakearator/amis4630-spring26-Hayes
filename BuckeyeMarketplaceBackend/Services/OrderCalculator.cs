using BuckeyeMarketplaceBackend.Models;

namespace BuckeyeMarketplaceBackend.Services
{
    public static class OrderCalculator
    {
        public static decimal CalculateTotal(IEnumerable<OrderItem> items)
        {
            return items.Sum(item => item.UnitPrice * item.Quantity);
        }
    }
}
