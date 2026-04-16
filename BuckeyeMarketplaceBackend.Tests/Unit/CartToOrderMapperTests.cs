using BuckeyeMarketplaceBackend.Models;
using BuckeyeMarketplaceBackend.Services;

namespace BuckeyeMarketplaceBackend.Tests.Unit;

public class CartToOrderMapperTests
{
    [Fact]
    public void MapToOrder_MapsCartItemsAndCalculatesTotal()
    {
        var cart = new Cart
        {
            UserId = "user-abc",
            Items =
            [
                new CartItem
                {
                    ProductId = 1,
                    Quantity = 2,
                    Product = new Product { Title = "Notebook", Price = 12.50m }
                },
                new CartItem
                {
                    ProductId = 2,
                    Quantity = 1,
                    Product = new Product { Title = "Pen", Price = 2.00m }
                }
            ]
        };

        var order = CartToOrderMapper.MapToOrder(
            cart,
            "user-abc",
            "123 College Ave",
            new DateTime(2026, 4, 15, 12, 0, 0, DateTimeKind.Utc),
            "BM-20260415-ABC12345");

        Assert.Equal("user-abc", order.UserId);
        Assert.Equal("123 College Ave", order.ShippingAddress);
        Assert.Equal("BM-20260415-ABC12345", order.ConfirmationNumber);
        Assert.Equal(2, order.Items.Count);
        Assert.Equal(27.00m, order.Total);
    }
}
