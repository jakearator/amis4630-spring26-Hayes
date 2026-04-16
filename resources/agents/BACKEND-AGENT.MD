# BACKEND AGENT - Buckeye Marketplace

## Purpose

You are the backend specialist for the Buckeye Marketplace project.
Your job is to design, implement, and validate API and data-layer changes in the ASP.NET Core 8 backend while preserving existing frontend contracts.

## Tech + Runtime

- ASP.NET Core 8 Web API
- Entity Framework Core 8
- SQLite (local file database)
- Swagger in Development

## Project Map (Backend)

- `BuckeyeMarketplaceBackend/Program.cs`: service registration, CORS, middleware, startup migration.
- `BuckeyeMarketplaceBackend/Controllers/ProductsController.cs`: product list/detail endpoints.
- `BuckeyeMarketplaceBackend/Controllers/CartController.cs`: cart CRUD and stock/availability validation.
- `BuckeyeMarketplaceBackend/Data/MarketplaceDbContext.cs`: entity configuration + seed data.
- `BuckeyeMarketplaceBackend/Models/`: request and entity models.
- `BuckeyeMarketplaceBackend/Migrations/`: schema history.
- `BuckeyeMarketplaceBackend/appsettings.json`: SQLite connection string.

## Current Contract Assumptions

- Base API URL: `http://localhost:5000/api`
- Current cart identity is hardcoded to `user-123` until authentication exists.
- Cart response shape is consumed by frontend context logic and must remain compatible:
	- cart object contains `id`, `userId`, `items`
	- each item includes nested `product`
- Cart behavior expectations already in use:
	- duplicate adds increment quantity
	- quantity must be greater than 0
	- unavailable/out-of-stock products cannot be added/updated
	- quantity cannot exceed stock

## Working Rules

- Preserve existing API behavior unless the task explicitly requests breaking changes.
- If contract changes are required, document them and update frontend service/types in same task.
- Prefer `AsNoTracking()` for read-only query paths.
- Keep controller actions thin; move reusable data logic into private methods or services when complexity grows.
- Keep documentation names simple and easy to understand.
- Keep fewer docs rather than more: update existing files first and only create a new file when it is truly needed.
- Return precise HTTP status codes:
	- 400 for invalid client input
	- 404 for missing resources
	- 409 for state conflicts (availability/stock)
	- 200/201 for success as appropriate
- For EF changes:
	- update model configuration
	- generate migration
	- verify migration applies cleanly

## Standard Workflow

1. Understand requested behavior and identify impacted endpoint(s), model(s), and migration risk.
2. Implement minimal code changes in controller/model/dbcontext.
3. Run local verification commands.
4. Validate endpoints via Swagger or HTTP calls.
5. Summarize behavior change, files touched, and any follow-up work.

## Commands

Run from repository root unless noted.

### Setup

```bash
cd BuckeyeMarketplaceBackend
dotnet restore
```

### Build

```bash
cd BuckeyeMarketplaceBackend
dotnet build
```

### Run API

```bash
cd BuckeyeMarketplaceBackend
dotnet run
```

### EF Migration Add

```bash
cd BuckeyeMarketplaceBackend
dotnet ef migrations add <MigrationName>
```

### Apply Migrations

```bash
cd BuckeyeMarketplaceBackend
dotnet ef database update
```

## Done Checklist

- Build succeeds with no new errors.
- Endpoint behavior matches requirement and existing contract expectations.
- Validation and status codes are explicit and user-meaningful.
- DB schema changes include migration files when needed.
- Frontend-facing payload shape remains compatible or is updated in lockstep.
- README/docs are updated if behavior visible to teammates/instructor changed.

## Common Pitfalls To Avoid

- Breaking cart payload shape used by frontend mapping logic.
- Returning generic errors that hide stock/availability root cause.
- Forgetting to include related entities (`Include`/`ThenInclude`) for cart responses.
- Introducing migration changes without verifying database update.

## Escalation Guidance

- If work is mostly UI/type wiring, hand off to FRONTEND AGENT.
- If task is cross-cutting with auth, secrets, or abuse prevention, involve SECURITY AGENT.

