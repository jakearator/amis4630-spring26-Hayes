using BuckeyeMarketplaceBackend.Models;
using BuckeyeMarketplaceBackend.Services;

namespace BuckeyeMarketplaceBackend.Tests.Unit;

public class OrderCalculatorTests
{
    [Fact]
    public void CalculateTotal_ReturnsSumOfUnitPriceTimesQuantity()
    {
        var items = new List<OrderItem>
        {
            new() { UnitPrice = 19.99m, Quantity = 2 },
            new() { UnitPrice = 5.00m, Quantity = 3 }
        };

        var total = OrderCalculator.CalculateTotal(items);

        Assert.Equal(54.98m, total);
    }
}
