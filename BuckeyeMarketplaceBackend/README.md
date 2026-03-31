# Buckeye Marketplace Backend

ASP.NET Core 8 Web API with Entity Framework Core + SQLite persistence for products and cart workflows.

## Database Setup Status (March 30, 2026)

- Cart and CartItem entities are defined as EF Core entities.
- Cart-to-Product relationship is implemented through CartItem navigation properties.
- Initial cart/product migration is created and applied.
- Product inventory metadata (`IsAvailable`, `StockQuantity`) is added and migrated.
- Cart data persists in SQLite across page refreshes and browser sessions.
- Seed data and test scenarios are documented below.

## Project Structure

```text
BuckeyeMarketplaceBackend/
|- Controllers/
|  |- ProductsController.cs
|  |- CartController.cs
|- Data/
|  |- MarketplaceDbContext.cs
|- Models/
|  |- Product.cs
|  |- Cart.cs
|  |- CartItem.cs
|  |- AddCartItemRequest.cs
|  |- UpdateCartItemRequest.cs
|- Migrations/
|  |- 20260330234343_InitialCreate.cs
|  |- 20260330234343_InitialCreate.Designer.cs
|  |- 20260330235442_AddProductAvailabilityAndStock.cs
|  |- 20260330235442_AddProductAvailabilityAndStock.Designer.cs
|  |- MarketplaceDbContextModelSnapshot.cs
|- Program.cs
|- appsettings.json
|- BuckeyeMarketplaceBackend.csproj
```

## EF Core Entities and Relationships

- `Cart`
  - `Id` (PK)
  - `UserId` (unique)
  - `Items` navigation (`List<CartItem>`)
- `CartItem`
  - `Id` (PK)
  - `CartId` (FK -> `Cart.Id`)
  - `ProductId` (FK -> `Product.Id`)
  - `Quantity`
  - `Cart` navigation
  - `Product` navigation
- `Product`
  - Product catalog fields (`Title`, `Price`, `Category`, etc.)
   - `IsAvailable`
   - `StockQuantity`
  - `CartItems` reverse navigation

Relationship summary:

- One `Cart` to many `CartItem` rows.
- One `Product` to many `CartItem` rows.
- `Cart` to `Product` is many-to-many via `CartItem`.

## Connection and Persistence

`appsettings.json` uses:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=buckeye-marketplace.db"
}
```

Data is persisted in `buckeye-marketplace.db`, so cart state survives:

- Browser refresh
- Browser close/reopen
- Frontend restart
- Backend restart (same DB file)

## Migrations

Migration created and applied:

- `20260330234343_InitialCreate`
- `20260330235442_AddProductAvailabilityAndStock`

Commands used:

```bash
cd BuckeyeMarketplaceBackend
dotnet ef migrations add InitialCreate
dotnet ef database update
```

At runtime, `Program.cs` also runs `Database.Migrate()` so schema updates are auto-applied on startup.

## Seed Data

`MarketplaceDbContext` seeds 8 products across categories:

- Textbooks
- Electronics
- Furniture
- Clothing

Products are inserted via `HasData(...)` in `OnModelCreating`.

## API Endpoints

### Products

- `GET /api/products`
- `GET /api/products/{id}`

### Cart

- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/{cartItemId}`
- `DELETE /api/cart/{cartItemId}`
- `DELETE /api/cart/clear`

Current user is hardcoded as `user-123` until authentication is added.

## Cart Validation and Edge-Case Handling

`CartController` enforces the following:

- Duplicate adds increment existing cart item quantity.
- Quantity must be greater than `0` in update requests.
- Product must exist before cart add.
- Product must be available (`IsAvailable = true`) for add/update.
- Product must have stock (`StockQuantity > 0`) for add.
- Requested quantity cannot exceed stock on add/update.

Typical backend responses include:

- `400 BadRequest` for invalid quantity or quantity exceeding stock.
- `404 NotFound` for missing product/cart item.
- `409 Conflict` for unavailable or out-of-stock products.

## Test Scenarios

1. Add item and refresh persistence
   - `POST /api/cart` with `{ "productId": 1, "quantity": 2 }`
   - Refresh frontend page
   - `GET /api/cart` still returns the item

2. Session persistence
   - Add multiple items from frontend
   - Close browser tab/window
   - Reopen app and navigate to cart
   - Items remain present

3. Quantity update persistence
   - `PUT /api/cart/{cartItemId}` with `{ "quantity": 3 }`
   - Refresh page
   - Quantity remains `3`

4. Stock and availability validation
   - Attempt add on product with `StockQuantity = 0`
   - API returns a conflict with out-of-stock message
   - Attempt add/update above `StockQuantity`
   - API returns bad request with stock-limit message

5. Remove and clear
   - `DELETE /api/cart/{cartItemId}` removes one row
   - `DELETE /api/cart/clear` removes all rows for `user-123`

6. Migration/schema verification
   - Start backend on clean machine
   - Confirm tables exist: `Carts`, `CartItems`, `Products`, `__EFMigrationsHistory`

## Running the Backend

```bash
cd BuckeyeMarketplaceBackend
dotnet restore
dotnet run
```

Default API URL is `http://localhost:5000`.
