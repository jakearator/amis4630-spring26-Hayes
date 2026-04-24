using BuckeyeMarketplaceBackend.Models;

namespace BuckeyeMarketplaceBackend.Services
{
    public static class CartToOrderMapper
    {
        public static Order MapToOrder(
            Cart cart,
            string? userId,
            string shippingAddress,
            DateTime orderDateUtc,
            string confirmationNumber,
            string? customerEmail = null)
        {
            return MapToOrder(
                cart.Items.Select(cartItem => new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.Product?.Price ?? 0m,
                    ProductTitle = cartItem.Product?.Title ?? "Untitled Product"
                }).ToList(),
                userId,
                shippingAddress,
                orderDateUtc,
                confirmationNumber,
                customerEmail);
        }

        public static Order MapToOrder(
            List<OrderItem> items,
            string? userId,
            string shippingAddress,
            DateTime orderDateUtc,
            string confirmationNumber,
            string? customerEmail = null)
        {
            var order = new Order
            {
                UserId = userId,
                CustomerEmail = customerEmail,
                OrderDate = orderDateUtc,
                Status = "Placed",
                ShippingAddress = shippingAddress,
                ConfirmationNumber = confirmationNumber,
                Items = items
            };

            order.Total = OrderCalculator.CalculateTotal(order.Items);
            return order;
        }
    }
}
