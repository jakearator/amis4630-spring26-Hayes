# Buckeye Marketplace

Buckeye Marketplace is a full-stack online marketplace built for students and the surrounding community to buy and sell everyday items such as textbooks, electronics, clothing, and dorm essentials. The project supports public product browsing, optional account-based shopping, and guest checkout, making it easy for users to purchase items with or without creating an account.

## Project Overview

- Full-stack marketplace application for student and community buying/selling
- Supports optional authentication with login/register for account-based features
- Supports guest checkout for users who want to browse and place an order without creating an account
- Designed as a separated frontend/backend architecture so the UI, business logic, and data layer can be deployed and scaled independently

## Live Website

- Production URL: https://proud-sand-0c6111510.7.azurestaticapps.net
- The application is fully deployed, publicly accessible, and connected to its production backend and database on Azure

## Features

- Public product browsing with no login required
- Optional authentication with registration and login
- Guest shopping cart stored in `localStorage`
- Guest checkout using email and shipping address without requiring an account
- Authenticated user cart backed by the backend API and persisted to the database
- Guest cart merge into the authenticated cart after login
- Order placement for both guest and authenticated users
- Order history page for logged-in users
- Admin dashboard for product management and order status updates
- Secure backend validation for stock, availability, cart ownership, and order creation
- Server-side order total calculation without trusting frontend totals or client-supplied `UserId` values

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: ASP.NET Core (.NET 8 Web API)
- Database: Azure SQL Database
- Hosting: Azure Static Web Apps for the frontend
- Hosting: Azure App Service for the backend API
- CI/CD: GitHub Actions

## Architecture

- The React frontend communicates with a REST API built in ASP.NET Core
- The backend owns business logic for authentication, cart management, checkout, stock validation, and order processing
- Azure SQL Database stores products, users, carts, refresh tokens, orders, and order items
- Production configuration is provided through environment variables and Azure app settings rather than checked-in secrets
- Key runtime configuration includes:
  - `VITE_API_URL` for the frontend API host
  - `Jwt__Key`, `Jwt__Issuer`, and `Jwt__Audience` for authentication
  - `ConnectionStrings__DefaultConnection` for the database connection
  - `CORS__AllowedOrigins` for approved frontend origins

## Security Highlights

- JWT-based authentication secures protected API endpoints
- Guest checkout is supported without requiring or exposing an authenticated user identity
- All order, cart, and auth inputs are validated server-side
- Order totals are calculated by the backend from trusted product data
- Authenticated cart and order ownership are resolved from JWT claims, not a client-supplied `UserId`
- Secrets such as the JWT signing key and production database connection string are stored in Azure environment variables, not in the repository
- CORS is configured to allow approved frontend origins, including the production frontend URL

## How It Works

1. Users can browse the marketplace and view products without logging in.
2. Users add items to their cart either as a guest or as an authenticated account holder.
3. At checkout, users can choose to log in, create an account, or continue as a guest.
4. Guest users provide an email address and shipping address, while authenticated users place orders from their server-backed cart.
5. The backend validates product availability, verifies quantities, calculates the final total, creates the order, and updates inventory.
6. Logged-in users can return later to review their order history.

## Local Development

### Frontend

- Create `BuckeyeMarketplaceFrontend/.env` from `BuckeyeMarketplaceFrontend/.env.example`
- The default local frontend configuration expects `VITE_API_URL=http://localhost:5000`

```bash
cd BuckeyeMarketplaceFrontend
npm install
npm run dev
```

- Local frontend runs on `http://localhost:5173`

### Backend

- Configure local JWT settings with user-secrets or environment variables before running the API
- Production uses Azure SQL Database; local development can use the default local database configuration unless you override it with a SQL Server connection string

```bash
cd BuckeyeMarketplaceBackend
dotnet restore
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "<your-local-jwt-key>"
dotnet user-secrets set "Jwt:Issuer" "BuckeyeMarketplace"
dotnet user-secrets set "Jwt:Audience" "BuckeyeMarketplaceClient"
dotnet run
```

- Local backend runs on `http://localhost:5000`
- For production-style frontend builds, use `BuckeyeMarketplaceFrontend/.env.production.example` as the template for `VITE_API_URL`

## Deployment

- Pushes to `main` trigger the GitHub Actions deployment workflow
- The frontend is built from `BuckeyeMarketplaceFrontend` and automatically deployed to Azure Static Web Apps
- The backend is published from `BuckeyeMarketplaceBackend` and automatically deployed to Azure App Service
- Production configuration is supplied through environment variables and Azure app settings, including API URL, JWT settings, database connection string, and allowed CORS origins
- Azure infrastructure configuration for the backend is documented in `infra/`

## Repository Structure

- `BuckeyeMarketplaceFrontend/` - React + Vite + TypeScript frontend
- `BuckeyeMarketplaceBackend/` - ASP.NET Core 8 Web API
- `BuckeyeMarketplaceBackend.Tests/` - backend unit and integration tests
- `docs/` - architecture notes, ADRs, ERD, and run documentation
- `infra/` - Azure infrastructure templates
- `scripts/` - repository utility scripts for artifact cleanup and tracking hygiene

## Notes / Future Improvements

- Add payment processing integration
- Improve inventory concurrency handling for simultaneous purchases
- Expand the admin dashboard with richer analytics and management tools
- Add email confirmations for successful orders

## Additional Documentation

- Frontend details: `BuckeyeMarketplaceFrontend/README.md`
- Backend details: `BuckeyeMarketplaceBackend/README.md`
- Change history: `CHANGELOG.md`
