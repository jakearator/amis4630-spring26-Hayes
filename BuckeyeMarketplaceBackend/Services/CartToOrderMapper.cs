using BuckeyeMarketplaceBackend.Models;

namespace BuckeyeMarketplaceBackend.Services
{
    public static class CartToOrderMapper
    {
        public static Order MapToOrder(Cart cart, string userId, string shippingAddress, DateTime orderDateUtc, string confirmationNumber)
        {
            var order = new Order
            {
                UserId = userId,
                OrderDate = orderDateUtc,
                Status = "Placed",
                ShippingAddress = shippingAddress,
                ConfirmationNumber = confirmationNumber,
                Items = cart.Items.Select(cartItem => new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.Product?.Price ?? 0m,
                    ProductTitle = cartItem.Product?.Title ?? "Untitled Product"
                }).ToList()
            };

            order.Total = OrderCalculator.CalculateTotal(order.Items);
            return order;
        }
    }
}
