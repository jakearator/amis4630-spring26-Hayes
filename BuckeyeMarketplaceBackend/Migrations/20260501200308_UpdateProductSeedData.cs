using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuckeyeMarketplaceBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Calculus 1 textbook/course material for Math 1151. Useful for homework, studying, and exam review.", "/assets/product-fallbacks/textbooks.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Physics 1200 textbook and lab manual bundle. Useful for lab prep, homework, and class reference.", "/assets/product-fallbacks/textbooks.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Silver aluminum laptop stand with a raised fixed-angle platform. Fits a dorm desk or study setup.", "/assets/products/laptop-stand.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Black Logitech wireless mouse with USB receiver. Compact option for class, studying, or office work.", "/assets/products/wireless-mouse-usb-receiver.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Compact black beverage-style mini fridge with glass door and drink shelves. Good for dorm drinks or shared apartment space.", "/assets/products/compact-mini-fridge.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Black LED desk lamp with touch controls and a phone charging base. Useful for a dorm desk or nightstand.", "/assets/products/led-desk-lamp-usb-charging.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Black Ohio State zip hoodie with front pockets and small chest logo. Casual sweatshirt for campus wear.", "/assets/products/ohio-state-buckeyes-sweatshirt.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Long insulated green winter parka with hood. Warm outerwear option for cold Ohio winters.", "/assets/products/winter-parka-jacket-north-face-style.jpg" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Used Calculus textbook in excellent condition. Covers limits, derivatives, and integrals. No highlighting or damage.", "https://images.unsplash.com/photo-1543002588-d83ceddf1f7f?w=800&auto=format&fit=crop&q=80" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Complete Physics 1200 course materials. Lab manual with notes included. Barely used, like new condition.", "https://images.unsplash.com/photo-1507842872343-583f20270319?w=800&auto=format&fit=crop&q=80" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Adjustable aluminum laptop stand for improved ergonomics. Works with 11-17 inch laptops. Great for dorm desk setup.", "https://images.pexels.com/photos/968631/pexels-photo-968631.jpeg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Silent click wireless mouse with 2.4GHz connection. Long battery life. Perfect for studying or gaming.", "https://images.unsplash.com/photo-1587829191301-2dd0dfa42fa6?w=800&auto=format&fit=crop&q=80" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Perfect dorm-sized mini fridge with freezer compartment. Energy efficient. Slightly used, works great.", "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=80" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Adjustable brightness LED lamp with USB charging port built-in. Great for late-night studying. Modern design.", "https://images.unsplash.com/photo-1565204666-9f1be4d60001?w=800&auto=format&fit=crop&q=80" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Authentic OSU maroon and gray crew neck sweatshirt. Size Medium. Worn only a few times, excellent condition.", "https://images.unsplash.com/photo-1556821552-5ff41cf988d7?w=800&auto=format&fit=crop&q=80" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Description", "ImageUrl" },
                values: new object[] { "Waterproof insulated winter parka. Black with grey trim. Perfect for Ohio winters. Size Large. Great for dorm life.", "https://images.unsplash.com/photo-1539533057592-4ee42f35b72e?w=800&auto=format&fit=crop&q=80" });
        }
    }
}
