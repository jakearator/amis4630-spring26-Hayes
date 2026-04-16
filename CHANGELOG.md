# Changelog

## 2026-04-15 - Milestone Patch: Security Regression Test Hardening

### Added - Automated Security Tests

- Strengthened backend integration coverage in `AuthProtectedEndpointsTests` with explicit checks for:
  - unauthenticated requests to protected routes return `401 Unauthorized`.
  - non-admin users are denied (`403 Forbidden`) on admin-only order endpoints.
  - admin users can access admin order endpoints successfully.
  - `/api/orders/mine` returns only orders scoped to the authenticated JWT user claim.

### Fixed

- Fixed integration-test reliability by switching the test host to a deterministic in-memory database name and seeding test data per scenario.
- Fixed test authentication simulation to parse user-id and role claims from the test `Authorization` header, enabling accurate role and claim-scoped access assertions.

### Commit Message Notes

Suggested commit titles for this patch:

- `test(api): add authz regression tests for 401, 403, admin access, and claim-scoped orders`
- `fix(tests): stabilize integration db setup and auth claim simulation`

## 2026-04-15 - Milestone: Automated Tests and Security Practices

### Added - Automated Tests

- Backend: created `BuckeyeMarketplaceBackend.Tests` with xUnit.
- Backend unit tests (pure logic):
  - `OrderCalculatorTests`
  - `PasswordRuleValidatorTests`
  - `CartToOrderMapperTests`
- Backend integration test:
  - `AuthProtectedEndpointsTests` using `WebApplicationFactory<Program>` and EF Core InMemory provider.
- Frontend: added Vitest + React Testing Library setup and tests:
  - `authValidation.test.ts`
  - `authClaims.test.ts`
  - `LoginPage.test.tsx`
- End-to-end: added Playwright spec:
  - `BuckeyeMarketplaceFrontend/e2e/checkout-happy-path.spec.ts`

### Changed - Security Practices Applied

- Added secure response headers middleware in backend startup (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy`).
- Preserved and reinforced JWT claim-scoped access for cart and order user endpoints (user ID taken from `ClaimTypes.NameIdentifier`).
- Kept database access in LINQ/EF Core query paths (no string-interpolated `FromSqlRaw`) to reduce SQL injection risk.
- Continued JWT signing key retrieval from user-secrets (`Jwt:Key`) rather than checked-in config values.
- Kept `UseHttpsRedirection()` enabled in backend pipeline.

### Fixed

- Login page now surfaces explicit empty-field validation feedback to users before API calls.
- Backend startup now supports integration-test in-memory provider by calling `EnsureCreated()` when the provider is non-relational.

### Commit Message Notes

Suggested commit titles for this milestone history:

- `test(backend): add xUnit unit and authenticated integration tests`
- `test(frontend): add vitest/rtl and login validation rendering tests`
- `test(e2e): add playwright happy-path checkout flow`
- `security(api): add secure headers middleware and preserve claim-scoped access`
