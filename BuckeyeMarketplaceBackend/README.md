# Buckeye Marketplace Backend

ASP.NET Core 8 Web API with Entity Framework Core + SQLite persistence for products, carts, and user authentication.

## Backend Status (April 15, 2026)

- ASP.NET Core Identity is configured using EF Core.
- JWT access token authentication/authorization is implemented.
- Refresh token mechanism is implemented and persisted in the database.
- Cart endpoints now use the authenticated user from JWT claims.
- Password hashing is handled by ASP.NET Core Identity.
- Password policy is enforced:
   - minimum 8 characters
   - at least one uppercase letter
   - at least one digit
- Email format validation is enforced on register/login requests.
- Admin user seeding is enabled on startup.

## Project Structure

```text
BuckeyeMarketplaceBackend/
|- Controllers/
|  |- ProductsController.cs
|  |- CartController.cs
|  |- AuthController.cs
|- Data/
|  |- MarketplaceDbContext.cs
|- Services/
|  |- ITokenService.cs
|  |- TokenService.cs
|- Models/
|  |- Product.cs
|  |- Cart.cs
|  |- CartItem.cs
|  |- AddCartItemRequest.cs
|  |- UpdateCartItemRequest.cs
|  |- ApplicationUser.cs
|  |- RegisterRequest.cs
|  |- LoginRequest.cs
|  |- RefreshTokenRequest.cs
|  |- AuthResponse.cs
|  |- RefreshToken.cs
|- Migrations/
|  |- 20260330234343_InitialCreate.cs
|  |- 20260330234343_InitialCreate.Designer.cs
|  |- 20260330235442_AddProductAvailabilityAndStock.cs
|  |- 20260330235442_AddProductAvailabilityAndStock.Designer.cs
|  |- 20260415193245_AddIdentityAndAuth.cs
|  |- 20260415193245_AddIdentityAndAuth.Designer.cs
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
- `ApplicationUser` (Identity user)
- `RefreshToken`
   - `Token` (unique)
   - `CreatedAtUtc`
   - `ExpiresAtUtc`
   - `RevokedAtUtc`
   - `UserId` (FK -> `AspNetUsers.Id`)

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

## JWT Key and User Secrets Setup

JWT signing key is loaded from user secrets (not from `appsettings.json`).

Run this once in the backend folder:

```bash
cd BuckeyeMarketplaceBackend
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "<your-strong-jwt-key>"
dotnet user-secrets set "Jwt:Issuer" "BuckeyeMarketplace"
dotnet user-secrets set "Jwt:Audience" "BuckeyeMarketplaceClient"
```

## Migrations

Migration created and applied:

- `20260330234343_InitialCreate`
- `20260330235442_AddProductAvailabilityAndStock`
- `20260415193245_AddIdentityAndAuth`

Commands used:

```bash
cd BuckeyeMarketplaceBackend
dotnet ef migrations add AddIdentityAndAuth
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

Admin user is seeded at startup in `Program.cs` (created if missing):

- Email: `admin@buckeyemarketplace.local`
- Password: `Admin1234`
- Role: `Admin`

## API Endpoints

### Products

- `GET /api/products`
- `GET /api/products/{id}`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Cart

- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/{cartItemId}`
- `DELETE /api/cart/{cartItemId}`
- `DELETE /api/cart/clear`

All cart endpoints require `Authorization: Bearer <jwt>`.

## Cart Validation and Edge-Case Handling

`CartController` enforces the following:

- Duplicate adds increment existing cart item quantity.
- Quantity must be greater than `0` in update requests.
- Product must exist before cart add.
- Product must be available (`IsAvailable = true`) for add/update.
- Product must have stock (`StockQuantity > 0`) for add.
- Requested quantity cannot exceed stock on add/update.
- Cart ownership is enforced by authenticated user ID claim.

Typical backend responses include:

- `400 BadRequest` for invalid quantity or quantity exceeding stock.
- `404 NotFound` for missing product/cart item.
- `409 Conflict` for unavailable or out-of-stock products.

`AuthController` enforces the following:

- registration and login require valid email format.
- registration duplicates return `409 Conflict`.
- invalid login returns `401 Unauthorized`.
- refresh token endpoint rotates refresh token and revokes previous token.

## Test Scenarios

1. Register and login flow
   - `POST /api/auth/register` with valid email + password policy-compliant password
   - `POST /api/auth/login` with same credentials
   - verify token + refresh token are returned

2. Access protected cart endpoint
   - call `GET /api/cart` without JWT -> unauthorized
   - call `GET /api/cart` with JWT -> cart loads

3. Refresh token rotation
   - `POST /api/auth/refresh` with valid refresh token
   - verify new JWT + new refresh token are returned
   - old refresh token can no longer be reused

4. Stock and availability validation
   - Attempt add on product with `StockQuantity = 0`
   - API returns a conflict with out-of-stock message
   - Attempt add/update above `StockQuantity`
   - API returns bad request with stock-limit message

5. Remove and clear
   - `DELETE /api/cart/{cartItemId}` removes one row
   - `DELETE /api/cart/clear` removes all rows for authenticated user

6. Migration/schema verification
   - Start backend on clean machine
   - Confirm tables exist: `AspNetUsers`, `AspNetRoles`, `RefreshTokens`, `Carts`, `CartItems`, `Products`, `__EFMigrationsHistory`

## Running the Backend

```bash
cd BuckeyeMarketplaceBackend
dotnet restore
dotnet run
```

Default API URL is `http://localhost:5000`.
