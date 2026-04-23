using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BuckeyeMarketplaceBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: true),
                    Brand = table.Column<string>(type: "TEXT", nullable: true),
                    PostedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CartId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Carts_CartId",
                        column: x => x.CartId,
                        principalTable: "Carts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "Category", "Description", "ImageUrl", "PostedDate", "Price", "Title" },
                values: new object[,]
                {
                    { 1, "Pearson", "Textbooks", "Used Calculus textbook in excellent condition. Covers limits, derivatives, and integrals. No highlighting or damage.", "https://images.unsplash.com/photo-1543002588-d83ceddf1f7f?w=800&auto=format&fit=crop&q=80", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 89.99m, "Calculus 1 Textbook (Math 1151)" },
                    { 2, "McGraw-Hill", "Textbooks", "Complete Physics 1200 course materials. Lab manual with notes included. Barely used, like new condition.", "https://images.unsplash.com/photo-1507842872343-583f20270319?w=800&auto=format&fit=crop&q=80", new DateTime(2026, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 125.00m, "Physics 1200 Lab Manual & Textbook Bundle" },
                    { 3, "Rain Design", "Electronics", "Adjustable aluminum laptop stand for improved ergonomics. Works with 11-17 inch laptops. Great for dorm desk setup.", "https://images.pexels.com/photos/968631/pexels-photo-968631.jpeg", new DateTime(2026, 3, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 34.50m, "Ergonomic Laptop Stand" },
                    { 4, "Logitech", "Electronics", "Silent click wireless mouse with 2.4GHz connection. Long battery life. Perfect for studying or gaming.", "https://images.unsplash.com/photo-1587829191301-2dd0dfa42fa6?w=800&auto=format&fit=crop&q=80", new DateTime(2026, 2, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 19.99m, "Wireless Mouse & USB Receiver" },
                    { 5, "Frigidaire", "Furniture", "Perfect dorm-sized mini fridge with freezer compartment. Energy efficient. Slightly used, works great.", "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=80", new DateTime(2026, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 79.99m, "Compact Mini Fridge (3.2 cu ft)" },
                    { 6, "BenQ", "Furniture", "Adjustable brightness LED lamp with USB charging port built-in. Great for late-night studying. Modern design.", "https://images.unsplash.com/photo-1565204666-9f1be4d60001?w=800&auto=format&fit=crop&q=80", new DateTime(2026, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 32.95m, "LED Desk Lamp with USB Charging" },
                    { 7, "Nike", "Clothing", "Authentic OSU maroon and gray crew neck sweatshirt. Size Medium. Worn only a few times, excellent condition.", "https://images.unsplash.com/photo-1556821552-5ff41cf988d7?w=800&auto=format&fit=crop&q=80", new DateTime(2026, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 48.00m, "Official Ohio State Buckeyes Sweatshirt" },
                    { 8, "The North Face", "Clothing", "Waterproof insulated winter parka. Black with grey trim. Perfect for Ohio winters. Size Large. Great for dorm life.", "https://images.unsplash.com/photo-1539533057592-4ee42f35b72e?w=800&auto=format&fit=crop&q=80", new DateTime(2026, 3, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 89.99m, "Winter Parka Jacket - North Face Style" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId",
                table: "CartItems",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                table: "Carts",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
