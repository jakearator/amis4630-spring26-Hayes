using BuckeyeMarketplaceBackend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplaceBackend.Data
{
    public class MarketplaceDbContext : IdentityDbContext<ApplicationUser>
    {
        public MarketplaceDbContext(DbContextOptions<MarketplaceDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cart>()
                .HasIndex(c => c.UserId)
                .IsUnique();

            modelBuilder.Entity<Cart>()
                .Property(c => c.UserId)
                .HasMaxLength(450)
                .IsRequired();

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(t => t.Token)
                .IsUnique();

            modelBuilder.Entity<RefreshToken>()
                .Property(t => t.Token)
                .HasMaxLength(200)
                .IsRequired();

            modelBuilder.Entity<RefreshToken>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Cart>()
                .HasMany(c => c.Items)
                .WithOne(i => i.Cart)
                .HasForeignKey(i => i.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CartItem>()
                .HasOne(i => i.Product)
                .WithMany(p => p.CartItems)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CartItem>()
                .Property(i => i.Quantity)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.UserId)
                .HasMaxLength(450)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.ShippingAddress)
                .HasMaxLength(500)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .Property(o => o.ConfirmationNumber)
                .HasMaxLength(40)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.ConfirmationNumber)
                .IsUnique();

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.UserId);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .Property(i => i.Quantity)
                .IsRequired();

            modelBuilder.Entity<OrderItem>()
                .Property(i => i.UnitPrice)
                .HasPrecision(18, 2)
                .IsRequired();

            modelBuilder.Entity<OrderItem>()
                .Property(i => i.ProductTitle)
                .HasMaxLength(200)
                .IsRequired();

            modelBuilder.Entity<OrderItem>()
                .HasOne<Product>()
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Title = "Calculus 1 Textbook (Math 1151)",
                    Description = "Used Calculus textbook in excellent condition. Covers limits, derivatives, and integrals. No highlighting or damage.",
                    Price = 89.99m,
                    Category = "Textbooks",
                    Brand = "Pearson",
                    PostedDate = new DateTime(2026, 3, 1),
                    ImageUrl = "https://images.unsplash.com/photo-1543002588-d83ceddf1f7f?w=800&auto=format&fit=crop&q=80",
                    IsAvailable = true,
                    StockQuantity = 5
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
                    ImageUrl = "https://images.unsplash.com/photo-1507842872343-583f20270319?w=800&auto=format&fit=crop&q=80",
                    IsAvailable = true,
                    StockQuantity = 2
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
                    ImageUrl = "https://images.pexels.com/photos/968631/pexels-photo-968631.jpeg",
                    IsAvailable = true,
                    StockQuantity = 10
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
                    ImageUrl = "https://images.unsplash.com/photo-1587829191301-2dd0dfa42fa6?w=800&auto=format&fit=crop&q=80",
                    IsAvailable = true,
                    StockQuantity = 0
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
                    ImageUrl = "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=80",
                    IsAvailable = true,
                    StockQuantity = 3
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
                    ImageUrl = "https://images.unsplash.com/photo-1565204666-9f1be4d60001?w=800&auto=format&fit=crop&q=80",
                    IsAvailable = false,
                    StockQuantity = 0
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
                    ImageUrl = "https://images.unsplash.com/photo-1556821552-5ff41cf988d7?w=800&auto=format&fit=crop&q=80",
                    IsAvailable = true,
                    StockQuantity = 6
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
                    ImageUrl = "https://images.unsplash.com/photo-1539533057592-4ee42f35b72e?w=800&auto=format&fit=crop&q=80",
                    IsAvailable = true,
                    StockQuantity = 4
                }
            );
        }
    }
}
