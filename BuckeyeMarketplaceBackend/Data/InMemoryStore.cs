using BuckeyeMarketplaceBackend.Models;

namespace BuckeyeMarketplaceBackend.Data
{
    public static class InMemoryStore
    {
        public static List<Product> Products { get; } = new()
        {
            new Product
            {
                Id = 1,
                Title = "Calculus 1 Textbook (Math 1151)",
                Description = "Calculus 1 textbook/course material for Math 1151. Useful for homework, studying, and exam review.",
                Price = 89.99m,
                Category = "Textbooks",
                Brand = "Pearson",
                PostedDate = new DateTime(2026, 3, 1),
                ImageUrl = "/assets/product-fallbacks/textbooks.png"
            },
            new Product
            {
                Id = 2,
                Title = "Physics 1200 Lab Manual & Textbook Bundle",
                Description = "Physics 1200 textbook and lab manual bundle. Useful for lab prep, homework, and class reference.",
                Price = 125.00m,
                Category = "Textbooks",
                Brand = "McGraw-Hill",
                PostedDate = new DateTime(2026, 2, 28),
                ImageUrl = "/assets/product-fallbacks/textbooks.png"
            },
            new Product
            {
                Id = 3,
                Title = "Ergonomic Laptop Stand",
                Description = "Silver aluminum laptop stand with a raised fixed-angle platform. Fits a dorm desk or study setup.",
                Price = 34.50m,
                Category = "Electronics",
                Brand = "Rain Design",
                PostedDate = new DateTime(2026, 3, 2),
                ImageUrl = "/assets/products/laptop-stand.jpg"
            },
            new Product
            {
                Id = 4,
                Title = "Wireless Mouse & USB Receiver",
                Description = "Black Logitech wireless mouse with USB receiver. Compact option for class, studying, or office work.",
                Price = 19.99m,
                Category = "Electronics",
                Brand = "Logitech",
                PostedDate = new DateTime(2026, 2, 25),
                ImageUrl = "/assets/products/wireless-mouse-usb-receiver.jpg"
            },
            new Product
            {
                Id = 5,
                Title = "Compact Mini Fridge (3.2 cu ft)",
                Description = "Compact black beverage-style mini fridge with glass door and drink shelves. Good for dorm drinks or shared apartment space.",
                Price = 79.99m,
                Category = "Furniture",
                Brand = "Frigidaire",
                PostedDate = new DateTime(2026, 3, 3),
                ImageUrl = "/assets/products/compact-mini-fridge.jpg"
            },
            new Product
            {
                Id = 6,
                Title = "LED Desk Lamp with USB Charging",
                Description = "Black LED desk lamp with touch controls and a phone charging base. Useful for a dorm desk or nightstand.",
                Price = 32.95m,
                Category = "Furniture",
                Brand = "BenQ",
                PostedDate = new DateTime(2026, 2, 20),
                ImageUrl = "/assets/products/led-desk-lamp-usb-charging.jpg"
            },
            new Product
            {
                Id = 7,
                Title = "Official Ohio State Buckeyes Sweatshirt",
                Description = "Black Ohio State zip hoodie with front pockets and small chest logo. Casual sweatshirt for campus wear.",
                Price = 48.00m,
                Category = "Clothing",
                Brand = "Nike",
                PostedDate = new DateTime(2026, 2, 15),
                ImageUrl = "/assets/products/ohio-state-buckeyes-sweatshirt.jpg"
            },
            new Product
            {
                Id = 8,
                Title = "Winter Parka Jacket - North Face Style",
                Description = "Long insulated green winter parka with hood. Warm outerwear option for cold Ohio winters.",
                Price = 89.99m,
                Category = "Clothing",
                Brand = "The North Face",
                PostedDate = new DateTime(2026, 3, 4),
                ImageUrl = "/assets/products/winter-parka-jacket-north-face-style.jpg"
            }
        };

        public static Cart Cart { get; } = new()
        {
            UserId = "user-123",
            Items = new List<CartItem>()
        };

        public static int NextCartItemId { get; set; } = 1;
    }
}
