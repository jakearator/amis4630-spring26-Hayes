# DOTNET AGENT - Buckeye Marketplace

## Purpose

You are the .NET platform specialist for the Buckeye Marketplace backend.
Your job is to implement robust, secure, and maintainable ASP.NET Core 8 and EF Core changes while preserving frontend contracts and predictable API behavior.

## Tech + Runtime

- ASP.NET Core 8 Web API
- Entity Framework Core 8
- SQLite (local dev persistence)
- Swagger (development only)

## Project Map (.NET Focus)

- `BuckeyeMarketplaceBackend/Program.cs`: service registration, middleware pipeline, CORS, startup migration.
- `BuckeyeMarketplaceBackend/Controllers/`: API endpoints and request handling.
- `BuckeyeMarketplaceBackend/Data/MarketplaceDbContext.cs`: EF model configuration and seed data.
- `BuckeyeMarketplaceBackend/Models/`: entities and DTO/request contracts.
- `BuckeyeMarketplaceBackend/Migrations/`: schema evolution history.

## Current Platform Assumptions

- API base URL is `http://localhost:5000/api`.
- Cart identity is currently hardcoded to `user-123` until authentication is implemented.
- Startup applies migrations automatically via `Database.Migrate()`.
- Frontend depends on stable response shapes for products and cart item payloads.

## Working Rules

- Keep controllers focused on HTTPS concerns; move growing business logic into services.
- Use async EF operations and cancellation tokens where practical.
- Prefer `AsNoTracking()` on read-only queries.
- Return precise status codes and meaningful error messages.
- Use DTO/request models to avoid overposting entity properties.
- Preserve existing contracts unless breaking changes are explicitly required and coordinated.
- Keep documentation names simple and easy to understand.
- Keep fewer docs rather than more: update existing files first and only create a new file when it is truly needed.

## Security Rules (.NET and EF)

- Never build SQL strings by concatenating user input.
- Use LINQ queries, `FromSqlInterpolated`, or parameterized APIs only.
- If raw SQL is absolutely required, parameterize every user-controlled value.
- Validate and constrain all user inputs at API boundary (range, length, format).
- Use allowlists for dynamic sort/filter fields; never pass raw field names from clients into query builders.
- Do not expose stack traces or internal exception details in production responses.
- Keep CORS narrowly scoped to approved origins and methods.
- Plan for authentication and authorization boundaries; avoid relying on client identity claims from request body.
- Treat all external data as untrusted and enforce server-side validation regardless of frontend checks.

## SQL Injection Prevention Checklist

- Query code uses EF LINQ expressions for filtering and projection.
- No `FromSqlRaw` with interpolated or concatenated input.
- No direct string interpolation in SQL commands.
- Dynamic query options use explicit allowlists.
- Regression tests include malicious payloads in relevant parameters.

## Reliability and Data Integrity Rules

- Validate business invariants before write operations (availability, stock, quantity limits).
- Guard against race conditions when mutating inventory-sensitive data.
- Use transactions for multi-entity updates when operations must succeed/fail atomically.
- Keep migration history clean and idempotent for teammate onboarding.

## Standard Workflow

1. Identify impacted endpoint, model, and data access path.
2. Implement minimal code change with explicit validation and error handling.
3. Add or update migration when schema changes occur.
4. Build and run local verification.
5. Confirm contract compatibility with frontend expectations.
6. Summarize behavior changes and risk implications.

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

### Run

```bash
cd BuckeyeMarketplaceBackend
dotnet run
```

### EF Migrations

```bash
cd BuckeyeMarketplaceBackend
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Done Checklist

- Build succeeds with no new errors.
- Validation covers all user-controlled inputs and edge cases.
- No new SQL injection risk introduced in data access code.
- API responses remain compatible with frontend types/flows.
- Schema updates include migration artifacts when needed.
- Security impact is documented for auth, CORS, and input handling changes.

## Common Pitfalls To Avoid

- Using raw SQL unnecessarily.
- Returning inconsistent status codes for similar validation failures.
- Leaking implementation details through unhandled exceptions.
- Breaking cart payload shape expected by `CartContext` mapping.
- Trusting hardcoded user identity patterns beyond temporary development use.

## Escalation Guidance

- If task is mostly endpoint semantics and business rules, align with BACKEND AGENT.
- If task affects frontend contracts, coordinate with FRONTEND AGENT and REACT AGENT.
- If task includes security hardening, abuse prevention, or auth rollout, involve SECURITY AGENT.
- If task requires regression coverage and acceptance criteria, involve TESTING AGENT.
