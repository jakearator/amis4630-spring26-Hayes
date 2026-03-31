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
                Description = "Used Calculus textbook in excellent condition. Covers limits, derivatives, and integrals. No highlighting or damage.",
                Price = 89.99m,
                Category = "Textbooks",
                Brand = "Pearson",
                PostedDate = new DateTime(2026, 3, 1),
                ImageUrl = "https://images.unsplash.com/photo-1543002588-d83ceddf1f7f?w=800&auto=format&fit=crop&q=80"
            },
            new Product
            {
                Id = 2,
                Title = "Physics 1200 Lab Manual & Textbook Bundle",
                Description = "Complete Physics 1200 course materials. Lab manual with notes included. Barely used, like new condition.",
                Price = 125.00m,
                Category = "Textbooks",
                Brand = "McGraw-Hill",
                PostedDate = new DateTime(2026, 2, 28),
                ImageUrl = "https://images.unsplash.com/photo-1507842872343-583f20270319?w=800&auto=format&fit=crop&q=80"
            },
            new Product
            {
                Id = 3,
                Title = "Ergonomic Laptop Stand",
                Description = "Adjustable aluminum laptop stand for improved ergonomics. Works with 11-17 inch laptops. Great for dorm desk setup.",
                Price = 34.50m,
                Category = "Electronics",
                Brand = "Rain Design",
                PostedDate = new DateTime(2026, 3, 2),
                ImageUrl = "https://images.pexels.com/photos/968631/pexels-photo-968631.jpeg"
            },
            new Product
            {
                Id = 4,
                Title = "Wireless Mouse & USB Receiver",
                Description = "Silent click wireless mouse with 2.4GHz connection. Long battery life. Perfect for studying or gaming.",
                Price = 19.99m,
                Category = "Electronics",
                Brand = "Logitech",
                PostedDate = new DateTime(2026, 2, 25),
                ImageUrl = "https://images.unsplash.com/photo-1587829191301-2dd0dfa42fa6?w=800&auto=format&fit=crop&q=80"
            },
            new Product
            {
                Id = 5,
                Title = "Compact Mini Fridge (3.2 cu ft)",
                Description = "Perfect dorm-sized mini fridge with freezer compartment. Energy efficient. Slightly used, works great.",
                Price = 79.99m,
                Category = "Furniture",
                Brand = "Frigidaire",
                PostedDate = new DateTime(2026, 3, 3),
                ImageUrl = "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=80"
            },
            new Product
            {
                Id = 6,
                Title = "LED Desk Lamp with USB Charging",
                Description = "Adjustable brightness LED lamp with USB charging port built-in. Great for late-night studying. Modern design.",
                Price = 32.95m,
                Category = "Furniture",
                Brand = "BenQ",
                PostedDate = new DateTime(2026, 2, 20),
                ImageUrl = "https://images.unsplash.com/photo-1565204666-9f1be4d60001?w=800&auto=format&fit=crop&q=80"
            },
            new Product
            {
                Id = 7,
                Title = "Official Ohio State Buckeyes Sweatshirt",
                Description = "Authentic OSU maroon and gray crew neck sweatshirt. Size Medium. Worn only a few times, excellent condition.",
                Price = 48.00m,
                Category = "Clothing",
                Brand = "Nike",
                PostedDate = new DateTime(2026, 2, 15),
                ImageUrl = "https://images.unsplash.com/photo-1556821552-5ff41cf988d7?w=800&auto=format&fit=crop&q=80"
            },
            new Product
            {
                Id = 8,
                Title = "Winter Parka Jacket - North Face Style",
                Description = "Waterproof insulated winter parka. Black with grey trim. Perfect for Ohio winters. Size Large. Great for dorm life.",
                Price = 89.99m,
                Category = "Clothing",
                Brand = "The North Face",
                PostedDate = new DateTime(2026, 3, 4),
                ImageUrl = "https://images.unsplash.com/photo-1539533057592-4ee42f35b72e?w=800&auto=format&fit=crop&q=80"
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