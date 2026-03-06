# Buckeye Marketplace Backend

Minimal .NET Web API backend for Milestone 3: Product Catalog Vertical Slice.

## Project Structure

```
BuckeyeMarketplaceBackend/
├── Models/
│   └── Product.cs          # Product data model
├── Controllers/
│   └── ProductsController.cs # API endpoints
├── Properties/
│   └── launchSettings.json  # Development configuration
├── Program.cs              # Application entry point with CORS setup
├── appsettings.json        # Application settings
└── BuckeyeMarketplaceBackend.csproj # Project file
```

## Running the Backend

### Prerequisites
- .NET 8.0 SDK

### Development
```bash
cd BuckeyeMarketplaceBackend
dotnet run
```

The API will run on: `http://localhost:5000` or `https://localhost:5001`

## API Endpoints

Once the server is running, you can access the API:

### Get All Products
Open your browser and go to:
```
http://localhost:5000/api/products
```

This returns a JSON array of all 8 products.

### Get Product by ID
Open your browser and go to:
```
http://localhost:5000/api/products/1
```

Replace `1` with any product ID (1-8). Returns a single product or **404** if not found.

Example URLs:
- `http://localhost:5000/api/products/1` - Calculus Textbook
- `http://localhost:5000/api/products/3` - MacBook Pro Stand
- `http://localhost:5000/api/products/5` - Wooden Desk Organizer
- `http://localhost:5000/api/products/99` - Returns 404 (product doesn't exist)

## Product Model

```json
{
  "id": 1,
  "title": "Calculus Textbook",
  "description": "Introductory calculus textbook used in Math 1151.",
  "price": 89.99,
  "category": "Books",
  "sellerName": "Campus Bookstore",
  "postedDate": "2026-03-01T00:00:00",
  "imageUrl": "https://via.placeholder.com/300?text=Calculus+Textbook"
}
```

## Features

- ✅ In-memory data store (no database)
- ✅ 8 seeded products across 4 categories (Books, Electronics, Furniture, Clothing)
- ✅ CORS enabled for React frontend at `http://localhost:5173`
- ✅ Minimal and simple implementation (~100 lines)
- ✅ No authentication, databases, or external dependencies

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` to support the React frontend development server.

## Categories

The seeded products include:
- **Textbooks** (2 products)
- **Electronics** (2 products)
- **Furniture** (2 products)
- **Clothing** (2 products)

## Implementation Notes

### In-Memory Data Store
**Decision**: Used a static `List<Product>` for simplicity rather than a database, keeping the API lightweight and easy to test.
```csharp
private static List<Product> Products = new() { ... };
```

### Product Model Extension
**Decision**: Added `Brand` field to products for better marketplace context.
```csharp
public class Product
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? Brand { get; set; }
    public DateTime PostedDate { get; set; }
    public string? ImageUrl { get; set; }
}
```

### CORS Configuration
**Decision**: Configured CORS to allow requests only from the React dev server at `http://localhost:5173`, ensuring secure frontend-backend communication.
```csharp
options.AddPolicy("ReactFrontend", policy =>
{
    policy.WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader();
});
```

### API Endpoints with Error Handling
**Decision**: Implemented standard REST endpoints with proper HTTP status codes (200, 404) for improved frontend error handling.
- `GET /api/products` → Returns all products
- `GET /api/products/{id}` → Returns single product or 404
