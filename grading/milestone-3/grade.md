# Lab Evaluation Report

**Student Repository**: `jakearator/amis4630-spring26-Hayes`  
**Date**: March 22, 2026  
**Rubric**: milestone-3/rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                          |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (1 NuGet warning: Swashbuckle 6.4.6→6.5.0 resolved). Server runs on http://localhost:5000.            |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` succeeded — 44 modules transformed, dist output produced. Vite v5.4.21 dev server starts cleanly on port 5173. |
| API Endpoints       | —     | ✅   | `GET /api/products` → 200, 8 products returned. `GET /api/products/1` → 200, correct JSON. `GET /api/products/999` → 404.      |

### Project Structure Comparison

The rubric specifies a solution layout standard of `/backend`, `/frontend`, `/docs`.

| Expected    | Found                         | Status |
| ----------- | ----------------------------- | ------ |
| `/backend`  | `BuckeyeMarketplaceBackend/`  | ❌     |
| `/frontend` | `BuckeyeMarketplaceFrontend/` | ❌     |
| `/docs`     | `docs/`                       | ✅     |

The backend and frontend directories use different names than the standard (`BuckeyeMarketplaceBackend` and `BuckeyeMarketplaceFrontend` instead of `backend` and `frontend`). This is a naming deviation but does not affect functionality or scoring.

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ------------------------------------ | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met | [ProductListPage.tsx](BuckeyeMarketplaceFrontend/src/pages/ProductListPage.tsx) — Fetches products via `getProducts()`, renders `ProductGrid` organism with `ProductCard` molecules using `Image` atoms (Atomic Design). Loading state shown at [L64-L68](BuckeyeMarketplaceFrontend/src/pages/ProductListPage.tsx#L64-L68). Error state at [L70-L74](BuckeyeMarketplaceFrontend/src/pages/ProductListPage.tsx#L70-L74). Empty state handled in [ProductGrid.tsx](BuckeyeMarketplaceFrontend/src/components/organisms/ProductGrid.tsx#L37-L43). All fields (title, category, brand, price, image) displayed in ProductCard.                          |
| 2   | React Product Detail Page            | 5      | ✅ Met | [ProductDetailPage.tsx](BuckeyeMarketplaceFrontend/src/pages/ProductDetailPage.tsx) — Separate route `/products/:id` defined in [App.tsx](BuckeyeMarketplaceFrontend/src/App.tsx#L12). All fields displayed: category, title, brand, postedDate, price, description, image. Back navigation via `← Back to Products` link at [L204](BuckeyeMarketplaceFrontend/src/pages/ProductDetailPage.tsx#L204). List→detail navigation via `Link` in [ProductCard.tsx](BuckeyeMarketplaceFrontend/src/components/molecules/ProductCard.tsx#L89). Not-found state handled at [L197-L216](BuckeyeMarketplaceFrontend/src/pages/ProductDetailPage.tsx#L197-L216). |
| 3   | API Endpoint: GET /api/products      | 5      | ✅ Met | [ProductsController.cs](BuckeyeMarketplaceBackend/Controllers/ProductsController.cs) — `GetAllProducts()` at [L109-L112](BuckeyeMarketplaceBackend/Controllers/ProductsController.cs#L109-L112) returns `Ok(Products)` (200 with JSON array). In-memory static `List<Product>` with 8 items at [L11-L107](BuckeyeMarketplaceBackend/Controllers/ProductsController.cs#L11-L107). Verified: status 200, 8 products returned with correct JSON shape.                                                                                                                                                                                                  |
| 4   | API Endpoint: GET /api/products/{id} | 5      | ✅ Met | [ProductsController.cs](BuckeyeMarketplaceBackend/Controllers/ProductsController.cs) — `GetProductById(int id)` at [L115-L123](BuckeyeMarketplaceBackend/Controllers/ProductsController.cs#L115-L123) returns `Ok(product)` or `NotFound()`. Verified: `/api/products/1` → 200, `/api/products/999` → 404.                                                                                                                                                                                                                                                                                                                                           |
| 5   | Frontend-to-API Integration          | 5      | ✅ Met | [api.ts](BuckeyeMarketplaceFrontend/src/services/api.ts) — `getProducts()` and `getProductById()` use `fetch()` against `http://localhost:5000/api`. No hardcoded product data in any component. Error state handled in both pages ([ProductListPage.tsx](BuckeyeMarketplaceFrontend/src/pages/ProductListPage.tsx#L22-L25), [ProductDetailPage.tsx](BuckeyeMarketplaceFrontend/src/pages/ProductDetailPage.tsx#L33-L35)). 404 from API is translated to `null` and shown as "Product not found" UI. CORS configured in [Program.cs](BuckeyeMarketplaceBackend/Program.cs#L10-L15) for `localhost:5173`.                                             |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Nullable string properties on Product model**: [Product.cs](BuckeyeMarketplaceBackend/Models/Product.cs) — All string properties are defined as `string?` (nullable). Since the in-memory data always populates these fields, consider making them required (`string`) with default values to express the domain invariant that products must have a title, description, etc.

- **Inline styles vs. CSS modules**: All frontend components use inline `CSSProperties` objects. While functional, this approach makes responsive design difficult and results in large component files. Consider migrating to CSS modules or a styling library (e.g., styled-components, Tailwind CSS) for better maintainability and media query support.

- **No TypeScript strict mode in tsconfig**: [tsconfig.json](BuckeyeMarketplaceFrontend/tsconfig.json) — Consider enabling `"strict": true` to catch more potential bugs at compile time.

- **Duplicate vite config files**: Both [vite.config.js](BuckeyeMarketplaceFrontend/vite.config.js) and [vite.config.ts](BuckeyeMarketplaceFrontend/vite.config.ts) exist. Only one is needed — the `.ts` version is preferred and the `.js` file should be removed to avoid confusion.

- **Directory naming convention**: The rubric's solution layout standard expects `/backend` and `/frontend`, but the project uses `BuckeyeMarketplaceBackend/` and `BuckeyeMarketplaceFrontend/`. Aligning with the standard would improve consistency across course submissions.

## 6. Git Practices Coaching (Non-Scoring)

- **Large monolithic commits**: The core implementation was done in essentially two commits (`5ddcafd` — full frontend and backend implementation, `05f4728` — TypeScript migration). Breaking work into smaller, incremental commits (e.g., "Add Product model", "Create ProductsController with GET endpoints", "Add ProductListPage component") makes code review easier and provides better rollback points.

- **Meaningful commit messages**: Messages like "Implemented Buckeye Marketplace frontend and backend logic" are descriptive at a high level, but more specific messages tied to individual features would be more professional. Consider following Conventional Commits format (e.g., `feat: add GET /api/products endpoint`).

- **AI-assisted development disclosure**: The commit message for `5ddcafd` mentions using "GitHub Copilot AI to assist with development and code generation." This transparency is good practice. In a professional setting, document which parts were AI-assisted in PR descriptions.

---

**25/25** — All rubric requirements are fully met. The backend API returns correct JSON with proper status codes, the React frontend fetches live data and handles all states (loading, error, empty, not-found), and navigation between list and detail pages works bidirectionally. The coaching notes above (inline styles, directory naming, git commit granularity) are suggestions for professional growth, not scoring deductions.
