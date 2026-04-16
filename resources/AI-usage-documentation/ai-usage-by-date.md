# Milestone 5: Authentication, security, & order processing

# 1. User Authentication Backend (4/15/2026)

Implemented full authentication backend with Identity, JWT, admin seeding, and refresh tokens, and verified with a clean build.

What is now in place

ASP.NET Core Identity configured
Identity + role management + password policy configured in Program.cs.
Identity-backed DbContext enabled in MarketplaceDbContext.cs.
Register/Login endpoints
Added auth controller with:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
File: AuthController.cs.
JWT generation and validation
JWT bearer auth middleware + token validation configured in Program.cs.
Token creation service added:
ITokenService.cs
TokenService.cs
Password hashing and rules (Identity-native)
Password hashing is handled by ASP.NET Core Identity.
Enforced rules:
Minimum 8 chars
At least one digit
At least one uppercase letter
Config in Program.cs.
Email format validation
Request models use DataAnnotations email validation:
RegisterRequest.cs
LoginRequest.cs
JWT key in user secrets (not appsettings)
User secrets enabled in BuckeyeMarketplaceBackend.csproj.
I initialized and set:
Jwt:Key
Jwt:Issuer
Jwt:Audience
Key is not stored in appsettings.json.
Admin user seeded for testing
Startup seed creates Admin role and admin user if missing.
Seed logic in Program.cs.
Documented credentials in README.md:

Email: adminsecretnotellhaha
Password: adminsecretnotellhaha
Role: adminsecretnotellhaha

Refresh token mechanism (bonus)
Implemented persistent refresh tokens with rotation/revocation.
Model and storage:
RefreshToken.cs
MarketplaceDbContext.cs
Endpoint in AuthController.cs.
Cart now uses authenticated user identity
Removed hardcoded user cart behavior and switched to claim-based user ID.
File: CartController.cs.
Database/migrations and validation

Added and applied migration:
20260415193245_AddIdentityAndAuth.cs
20260415193245_AddIdentityAndAuth.Designer.cs
Final backend build succeeded with 0 warnings and 0 errors.
Updated backend documentation with all auth setup and submission details:
README.md

# 2. Protected API Endpoints (4/15/2026)

JWT authentication middleware configured
Confirmed and hardened in Program.cs:39.
JWT bearer validation is active, and middleware order is correct with authentication before authorization in Program.cs:182.
[Authorize] on protected endpoints
Cart controller is protected at controller level in CartController.cs:12.
Orders controller is protected at controller level in OrdersController.cs:8.
Role-based authorization (User vs Admin)
Added AdminOnly policy requiring Admin role in Program.cs:89.
Admin-only product management endpoints added with policy protection in ProductsController.cs:43, ProductsController.cs:73, and ProductsController.cs:103.
Admin-only orders endpoint added in OrdersController.cs:42.
Cart and order endpoints require authentication
Cart: protected via controller-level authorize in CartController.cs:12.
Orders: new protected controller in OrdersController.cs:8.
Admin endpoints require Admin role
Product create/update/delete now require AdminOnly policy in ProductsController.cs:43.
Orders admin route requires AdminOnly in OrdersController.cs:42.
Proper 401/403 error responses
Added explicit JSON 401 response on challenge in Program.cs:60.
Added explicit JSON 403 response on forbidden in Program.cs:74.
Validation run

dotnet build completed successfully for backend with 0 errors and 0 warnings.

# 3. Frontend authentication integration (4/15/2026)

What I changed

Auth state management and token persistence
Added Auth context/provider with:
isAuthenticated, isLoadingAuth, authError
loginUser, registerUser, logout, clearAuthError
Added token storage helpers in authStorage using localStorage for access + refresh tokens.
API auth integration (automatic token inclusion)
Refactored API service to use a centralized apiFetch wrapper that:
Automatically injects Authorization: Bearer <token> from storage.
Handles unauthorized responses by dispatching an auth event.
Added auth endpoints:
login(request)
register(request)
Login and registration pages
Added functional Login page:
Form submit to backend auth API
Error display
Redirect to intended protected page after successful login
Added functional Register page:
Email/password/confirm-password validation
Calls register API
Auto-login on successful registration (stores tokens)
Protected routes + redirect behavior
Added ProtectedRoute that redirects unauthenticated users to /login.
Updated App routing:
Added /login, /register
Protected /products, /products/:id, /cart
Root and wildcard routes now redirect based on auth state
Waits for auth initialization before routing to avoid redirect flicker
Logout integration
Updated Header:
Shows Logout button when authenticated
Shows Login/Register links when unauthenticated
Logout clears tokens via auth context; protected routes then redirect to login
Cart context auth awareness
Updated Cart context to:
Avoid cart API calls when logged out
Clear cart state on logout to prevent stale user data
Type updates
Added auth request/response types in shared types.
Validation

Ran frontend build successfully:
npm run build passed (Vite production build completed)
Checked changed files for TypeScript problems: no errors reported.
Notes

Token storage is implemented with localStorage (meets your localStorage/sessionStorage requirement).
If you want sessionStorage instead, I can switch with a small config toggle in authStorage.

# 4. Order Placement (4/15/2026)

Backend order domain + persistence
Added order entities:
Order.cs
OrderItem.cs
PlaceOrderRequest.cs
Updated EF Core mappings and DbSets for orders/order items:
MarketplaceDbContext.cs
Generated migration:
20260416003410_AddOrdersAndCheckout.cs
20260416003410_AddOrdersAndCheckout.Designer.cs
MarketplaceDbContextModelSnapshot.cs
Orders API implementation
Replaced placeholder orders controller with real functionality:
OrdersController.cs
Implemented:
POST /api/orders
Creates order from current user cart
Validates shipping address
Validates product availability and stock before placement
Creates order item rows from cart items
Generates confirmation number in format BM-yyyyMMdd-XXXXXXXX
Clears cart after successful placement
Decrements stock and marks product unavailable when stock reaches zero
GET /api/orders/mine
Uses JWT name identifier claim
Never takes user id from URL
Returns only current user orders (BOLA-safe pattern)
Frontend checkout + confirmation + history
Extended order-related frontend types:
index.ts
Added API calls:
placeOrder
getMyOrders
api.ts
Added checkout page with order summary + shipping address form:
CheckoutPage.tsx
Added order confirmation page:
OrderConfirmationPage.tsx
Added order history page for current user:
OrderHistoryPage.tsx
Exposed cart reload action so checkout can resync after backend clears cart:
CartContext.tsx
Added cart and header navigation updates:
Proceed to Checkout button:
CartSummary.tsx
Orders icon link in header:
Header.tsx
Wired routes:
/checkout
/order-confirmation
/orders
App.tsx
Validation run

Backend build succeeded:
dotnet build in backend completed with 0 errors.
Frontend production build succeeded:
npm run build in frontend completed successfully.
Checkpoint notes for submission

Required endpoints are now implemented with JWT-scoped user access:
POST /api/orders
GET /api/orders/mine
Required order fields are persisted:
OrderDate, Status, Total, ShippingAddress, ConfirmationNumber
Required flow behavior is implemented:
Order items created from cart items
Cart cleared after placement
Confirmation page shown after success
Checkout page includes shipping address form + order summary

# 5. Basic Admin Features

Admin-only orders backend endpoints
Added admin list endpoint:
GET /api/orders/admin
Added admin status update endpoint:
PUT /api/orders/{orderId}/status
Both are protected with AdminOnly policy.
Files:
OrdersController.cs
UpdateOrderStatusRequest.cs
Admin dashboard route restricted to admin role
Added client-side admin route guard that redirects non-admin users.
Files:
AdminRoute.tsx
App.tsx
AuthContext.tsx
Product management UI (add, edit, delete)
Built admin dashboard UI with product creation form, edit flow, and delete actions.
Uses existing backend admin-protected product APIs.
File:
AdminDashboardPage.tsx
View all orders + update status in UI
Admin dashboard now loads all orders and shows status.
Added status dropdown and update action that calls:
PUT /api/orders/{orderId}/status
File:
AdminDashboardPage.tsx
Frontend API/types support for admin workflows
Added admin API calls for:
create/update/delete product
get all orders (admin)
update order status (admin)
Added shared types for product upsert and status update request.
Files:
api.ts
index.ts
Admin navigation
Added admin dashboard icon/link in header for admin users only.
File:
Header.tsx
Build validation

Backend build: success, 0 errors.
Frontend build: success, Vite production build completed.

# 6. Automated Tests & Security Practices 

What I added

Backend tests (xUnit + integration with WebApplicationFactory and InMemory EF)
New test project: BuckeyeMarketplaceBackend.Tests.csproj
Unit tests (pure logic, no DB/HTTP):
OrderCalculatorTests.cs
PasswordRuleValidatorTests.cs
CartToOrderMapperTests.cs
Authenticated integration test (WebApplicationFactory + InMemory provider):
AuthProtectedEndpointsTests.cs
Solution wiring:
amis4630-spring26-Hayes.sln
Backend production logic extracted for testability
OrderCalculator.cs
PasswordRuleValidator.cs
CartToOrderMapper.cs
Controller integration with these services:
AuthController.cs
OrdersController.cs
Frontend tests (Vitest + RTL)
Test config:
vitest.config.ts
setup.ts
Test files:
authValidation.test.ts
authClaims.test.ts
LoginPage.test.tsx
Support helpers added:
authValidation.ts
authClaims.ts
Package scripts/deps updated:
package.json
E2E Playwright
Spec file committed:
checkout-happy-path.spec.ts
Playwright config:
playwright.config.ts
E2E run doc with prompt + first failure + correction:
e2e-run.md
Security practices applied
Secure response headers middleware added:
Program.cs
HTTPS redirection remains enabled:
Program.cs
JWT claim-scoped user access enforced for protected user resources:
CartController.cs
OrdersController.cs
SQL injection-safe EF/LINQ query patterns maintained (no string-interpolated FromSqlRaw introduced).
Secrets handling already in place via user-secrets for JWT key; preserved:
BuckeyeMarketplaceBackend.csproj
Changelog update
Added milestone summary and suggested commit message titles:
CHANGELOG.md
Validation results

dotnet test on solution: passed, 5/5 tests.
npm test -- --run in frontend: passed, 5/5 tests.
Playwright happy-path run: passed, 1/1 test using:
npm run test:e2e -- e2e/checkout-happy-path.spec.ts --reporter=line
Notes

I initially hit a Playwright runner mismatch when using a global-style npx call from the wrong directory; corrected by running through the frontend project script, and documented the failure/correction in e2e-run.md.
Your repo has many pre-existing untracked/modified files unrelated to this request; I did not alter or revert those.

# (4/15/2026) - Double checking the tests 

Backend double check: 

Automated backend test requirements are already satisfied in your workspace, and I verified they actually execute successfully.

What is in place:

Pure logic unit tests (no DB, no HTTP):
OrderCalculatorTests.cs
PasswordRuleValidatorTests.cs
CartToOrderMapperTests.cs
Authenticated integration test using WebApplicationFactory plus EF Core in-memory:
AuthProtectedEndpointsTests.cs
Verification performed:

Ran dotnet test from solution root.
Result: Failed 0, Passed 5, Skipped 0, Total 5.
This confirms backend tests are not being skipped and are passing end-to-end.
No code changes were needed because the required test suite is already implemented and currently green.

Frontend double check:

Implemented and verified the frontend automated testing milestone requirements.

What I changed

Expanded component test coverage in LoginPage.test.tsx.
Added test setup reset logic for mocks to prevent false positives and improve reliability.
Added two additional meaningful assertions:
Valid submit calls login with trimmed email and password.
Auth error from context state is rendered in the UI.
Current automated test coverage status

Form validation helper tests exist and pass in authValidation.test.ts.
Login form rendering and empty-submit error behavior exist and pass in LoginPage.test.tsx.
Additional auth-related unit tests exist and pass in authClaims.test.ts.
Verification performed

Ran npm test -- --run in BuckeyeMarketplaceFrontend.
Result: 3 test files passed, 7 tests passed, 0 skipped.
Confirmed no skipped tests by searching for skip markers in frontend test files.

End-to-end (Playwright MCP, driven by Copilot agent mode)

Implemented and validated the milestone E2E deliverables.

What I changed

Added the Playwright happy-path spec at checkout.spec.ts:1.
Updated the run-notes doc at e2e-run.md:1 with:
The exact Copilot Agent prompt(s) used
The first failure encountered
The correction applied
Verified rerun result and prerequisites
What I validated

Ran: npx playwright test e2e/checkout.spec.ts
Result: 1 passed
Flow covered in the passing test:
Register
Login
Browse
Add to cart
Checkout
View order history
Important implementation detail captured in docs

First-run failure was strict-mode ambiguity on Add to Cart.
Fix used a disambiguated selector with first(), then reran to green.
Environment cleanup

Frontend dev server was stopped.
Backend listener on port 5000 is no longer active.
Notes

I did not revert or alter your unrelated existing workspace changes.
Your repo is currently very dirty with many pre-existing modified/untracked files, so only the two files above are the new deliverables from this request.

Security test double checking:

Implemented and verified stronger automated security testing, plus changelog updates for this milestone.

What I changed

Expanded backend integration security coverage in AuthProtectedEndpointsTests.cs:27:
Added unauthenticated access assertion for protected endpoint returns 401: AuthProtectedEndpointsTests.cs:27
Added non-admin blocked from admin endpoint (403): AuthProtectedEndpointsTests.cs:40
Added admin access allowed on admin endpoint (200): AuthProtectedEndpointsTests.cs:54
Added JWT claim-scoped order filtering verification for /api/orders/mine: AuthProtectedEndpointsTests.cs:70
Added deterministic seed helper for two different users to prove access scoping: AuthProtectedEndpointsTests.cs:102
Improved test auth handler to parse user and role claims from Authorization header for realistic authz checks: AuthProtectedEndpointsTests.cs:190
Stabilized test DB setup with deterministic in-memory database name: AuthProtectedEndpointsTests.cs:176
Updated changelog with bug-fix and commit-message-ready summary in CHANGELOG.md:3:
Added milestone patch section for security regression hardening: CHANGELOG.md:3
Added commit message note suggestions tied to these fixes: CHANGELOG.md:20
Security checklist coverage confirmed

SQL injection mitigation via EF/LINQ query paths (no string-interpolated FromSqlRaw in app code).
JWT claim-scoped access checks on protected user data paths (cart/orders) with explicit regression tests.
HTTPS redirection enabled in backend pipeline.
Secure response headers middleware present (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
JWT signing key loaded via configuration/user-secrets pattern.
Test verification

Backend integration tests: 4 passed, 0 failed for AuthProtectedEndpointsTests.cs:1.
Frontend Vitest suite: 3 files passed, 7 tests passed.
Important workspace note
Because this repository currently tracks many generated outputs, cleaning artifact folders caused large build-output deletions to appear in Git status. I did not modify unrelated source code, but you should review current status before committing and keep only the files you want in version control.

# (4/15/2026) ARTIFACT / FOLDER (RESULTS OF TEST) MANAGEMENT (PULLUTING MY GIT CHANGES.... SO MAKING A FIX FOR IT.... DON'T KNOW IF I WAS SUPPOSED TO DO THIS OR NOT... BUT I AM)...

You can make this reliable and low-maintenance with a one-time migration plus daily cleanup automation. I already wired that in for you.

What I set up

Repo-wide ignore rules so generated outputs are not re-added:
.gitignore
Daily cleanup script (safe behavior):
clean-artifacts.ps1
It now skips folders that still contain tracked files and tells you what to do next, so you do not get surprise mass deletions.
One-time untracking script (automated migration):
untrack-artifacts.ps1
Preview mode and apply mode included.
Frontend command shortcuts for all of this:
package.json
Docs added so your team has the workflow:
README.md
Best workflow going forward

Preview tracked artifacts:
npm run artifacts:preview
One-time untrack (this is the key fix):
npm run artifacts:untrack
Commit that untracking change once.

Normal day-to-day cleanup:

npm run clean:artifacts
or npm run test:run:clean
Why this solves your pain

.gitignore prevents new artifact noise.
One-time untrack removes existing tracked artifact debt.
Cleanup stays fast and repeatable.
Guarded cleanup avoids accidental giant D diffs when old tracked outputs still exist.

Done. I completed both commits.

New commits

cc0a02b
test(api): add authz regression tests and document fixes in changelog

1e8b8bc
chore(repo): automate artifact cleanup and untrack generated outputs

Key files committed

AuthProtectedEndpointsTests.cs
CHANGELOG.md
.gitignore
clean-artifacts.ps1
untrack-artifacts.ps1
package.json
README.md
You are now at 5/5 for the items, including fixes recorded in commit messages and changelog coverage.