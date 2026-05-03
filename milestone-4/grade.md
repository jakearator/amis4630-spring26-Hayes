# Lab Evaluation Report

**Student Repository**: `jakearator-amis4630-spring26-Hayes`
**Date**: 2026-05-03
**Rubric**: rubric.md (Milestone 4 — Cart Feature, 25 points)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                            |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------ |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Runs on http://localhost:5000 (SQLite fallback, .NET 8→9 roll-forward) |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` succeeded (vite v5.4.21). Dev server on http://localhost:5173                    |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products). Swagger → 200. GET /api/orders → 405 (requires POST/auth)  |

> **Note**: No user secrets found in repo. `Jwt:Key` was set temporarily via `dotnet user-secrets` for grading. App falls back to SQLite when no `DefaultConnection` is configured.

## 1. Project Structure

| Component                        | Found                                                                                              | Status |
| -------------------------------- | -------------------------------------------------------------------------------------------------- | ------ |
| Backend .NET project             | `BuckeyeMarketplaceBackend/`                                                                       | ✅     |
| Frontend React/TS project        | `BuckeyeMarketplaceFrontend/`                                                                      | ✅     |
| Cart Controller                  | `BuckeyeMarketplaceBackend/Controllers/CartController.cs`                                          | ✅     |
| Cart / CartItem models           | `BuckeyeMarketplaceBackend/Models/Cart.cs`, `CartItem.cs`                                          | ✅     |
| EF DbContext with Cart entities  | `BuckeyeMarketplaceBackend/Data/MarketplaceDbContext.cs`                                           | ✅     |
| Migrations including Cart tables | `BuckeyeMarketplaceBackend/Migrations/` (3 migrations)                                             | ✅     |
| Frontend CartContext             | `BuckeyeMarketplaceFrontend/src/context/CartContext.tsx`                                           | ✅     |
| Frontend API service             | `BuckeyeMarketplaceFrontend/src/services/api.ts`                                                   | ✅     |
| Cart UI components               | `CartPage.tsx`, `CartItemList.tsx`, `CartItemRow.tsx`, `CartSummary.tsx`, `CartFeedbackBanner.tsx` | ✅     |
| AI Usage Log                     | `BuckeyeMarketplaceFrontend/AI_USAGE_LOG.md`                                                       | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                              | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                         |
| --- | ---------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1a  | useReducer or Context API for cart state | 2      | ✅ Met | [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L52) — `CartContext` created via `createContext`, `CartProvider` wraps the app at [App.tsx](BuckeyeMarketplaceFrontend/src/App.tsx#L43), uses `useState` + `useCallback` + `useMemo` for state management                                                               |
| 1b  | Add, update quantity, remove operations  | 2      | ✅ Met | [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L163-L313) — `addItem`, `updateItemQuantity`, `removeItem` callbacks all implemented with optimistic updates and rollback                                                                                                                                               |
| 1c  | Cart count in header + calculated totals | 1      | ✅ Met | [Header.tsx](BuckeyeMarketplaceFrontend/src/components/organisms/Header.tsx#L112) — `{itemCount > 0 && <span className="site-header__cart-count">{itemCount}</span>}`; [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L360-L361) — `itemCount` and `subtotal` calculated via `reduce`                                  |
| 2a  | GET /api/cart                            | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplaceBackend/Controllers/CartController.cs#L24-L29) — `[HttpGet]` returns `Ok(cart)`                                                                                                                                                                                                                            |
| 2b  | POST /api/cart (add item)                | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplaceBackend/Controllers/CartController.cs#L32-L95) — `[HttpPost]` with `AddCartItemRequest`, returns `CreatedAtAction` or `Ok` for existing item                                                                                                                                                               |
| 2c  | PUT /api/cart/{cartItemId} (update qty)  | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplaceBackend/Controllers/CartController.cs#L98-L133) — `[HttpPut("{cartItemId}")]` with `UpdateCartItemRequest`, returns `Ok(cart)`                                                                                                                                                                             |
| 2d  | DELETE endpoints (item + clear)          | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplaceBackend/Controllers/CartController.cs#L136-L177) — `[HttpDelete("{cartItemId}")]` for single item; `[HttpDelete("clear")]` for clearing cart                                                                                                                                                               |
| 2e  | Proper status codes and responses        | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplaceBackend/Controllers/CartController.cs) — Uses `Ok`, `CreatedAtAction`, `BadRequest`, `NotFound`, `Conflict` appropriately throughout                                                                                                                                                                       |
| 3a  | Cart/CartItem EF entities                | 2      | ✅ Met | [Cart.cs](BuckeyeMarketplaceBackend/Models/Cart.cs) — `Id`, `UserId`, `Items` collection; [CartItem.cs](BuckeyeMarketplaceBackend/Models/CartItem.cs) — `Id`, `CartId`, `Cart`, `ProductId`, `Quantity`, `Product`                                                                                                                               |
| 3b  | Relationships and navigation properties  | 1      | ✅ Met | [MarketplaceDbContext.cs](BuckeyeMarketplaceBackend/Data/MarketplaceDbContext.cs#L90-L104) — `Cart.HasMany(Items).WithOne(Cart)` with cascade delete; `CartItem.HasOne(Product).WithMany(CartItems)` with restrict delete; unique index on `Cart.UserId`                                                                                         |
| 3c  | Migrations applied, data persists        | 1      | ✅ Met | [20260423233131_InitialCreateSqlServer.cs](BuckeyeMarketplaceBackend/Migrations/20260423233131_InitialCreateSqlServer.cs#L56) — `Carts` and `CartItems` tables created with foreign keys; 3 migrations present; backend runs with SQLite fallback confirmed                                                                                      |
| 4a  | Real API replaces mock/localStorage      | 2      | ✅ Met | [api.ts](BuckeyeMarketplaceFrontend/src/services/api.ts#L145-L205) — `getCart`, `addCartItem`, `updateCartItemQuantity`, `removeCartItem`, `clearCart` all call real API endpoints; localStorage only used for guest cart ([guestCartStorage.ts](BuckeyeMarketplaceFrontend/src/services/guestCartStorage.ts)) which merges into server on login |
| 4b  | All cart operations call API             | 2      | ✅ Met | [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L163-L350) — `addItem` calls `addCartItemRequest`, `updateItemQuantity` calls `updateCartItemQuantityRequest`, `removeItem` calls `removeCartItemRequest`, `clearCart` calls `clearCartRequest`, all followed by `syncServerCart`                                       |
| 4c  | State synchronization                    | 1      | ✅ Met | [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L100-L140) — `syncServerCart` re-fetches from API after every mutation; optimistic updates with rollback on error; guest cart merged into server cart on authentication                                                                                                 |
| 5a  | Loading states                           | 1      | ✅ Met | [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L79-L80) — `isLoadingCart` and `isMutatingCart` state flags; [CartPage.tsx](BuckeyeMarketplaceFrontend/src/pages/CartPage.tsx#L102-L111) — shows "Loading your cart..." while loading; mutation buttons disabled via `isMutatingCart`                                   |
| 5b  | Error messages and edge cases            | 1      | ✅ Met | [CartFeedbackBanner.tsx](BuckeyeMarketplaceFrontend/src/components/molecules/CartFeedbackBanner.tsx) — dismissible error/success banner with `role="status"` and `aria-live="polite"`; [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L163-L185) — checks availability, stock quantity, validates quantity ≥ 1         |
| 5c  | Success feedback                         | 1      | ✅ Met | [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx#L199-L203) — `setCartSuccess` messages for add, update, remove, and clear operations; auto-dismiss after 3 seconds (L148-L156)                                                                                                                                          |
| 6a  | Clean component structure                | 1      | ✅ Met | Atomic design: atoms (`Button`, `Image`, `Text`), molecules (`CartItemRow`, `CartFeedbackBanner`), organisms (`CartItemList`, `CartSummary`, `Header`), pages (`CartPage`); clear separation of concerns                                                                                                                                         |
| 6b  | Service layer / custom hooks             | 1      | ✅ Met | [api.ts](BuckeyeMarketplaceFrontend/src/services/api.ts) — centralized API service with auth header injection and error parsing; custom hooks in `hooks/` (`useProducts`, `useProductDetail`); `useCart` hook exported from CartContext                                                                                                          |
| 6c  | AI usage documented                      | 1      | ✅ Met | [AI_USAGE_LOG.md](BuckeyeMarketplaceFrontend/AI_USAGE_LOG.md) — entry dated 2026-03-30 documenting AI-assisted frontend refactor with task, prompt, output, modifications, and validation                                                                                                                                                        |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Optimistic update consistency**: [CartContext.tsx](BuckeyeMarketplaceFrontend/src/context/CartContext.tsx) — The optimistic update pattern is well-implemented with rollback, but `addItem` performs the optimistic update using `upsertGuestCartItem` even for authenticated users, which conflates guest and authenticated code paths. Consider extracting separate strategies for guest vs. authenticated mutations.

- **Inline styles vs. CSS**: [CartPage.tsx](BuckeyeMarketplaceFrontend/src/pages/CartPage.tsx), [CartItemRow.tsx](BuckeyeMarketplaceFrontend/src/components/molecules/CartItemRow.tsx) — Heavy use of inline `CSSProperties` objects. While functional, migrating to CSS modules or the project's existing stylesheet approach would improve maintainability and enable pseudo-class styling (`:hover`, `:focus`).

- **Error boundary**: The cart feature has good error handling within the context, but there is no React Error Boundary wrapping the cart flow. An unexpected render error could crash the entire app tree.

- **Stock validation duplication**: Stock quantity validation exists in both `CartContext.tsx` (frontend) and `CartController.cs` (backend). The frontend checks are good for UX, but ensure they are always treated as advisory — the backend is the source of truth, which it is here.

## 6. Git Practices Coaching (Non-Scoring)

- **Incremental development**: The migration history (3 migrations) suggests iterative schema evolution, which is a good practice. Continue making small, focused commits with descriptive messages.

- **Branch strategy**: Work is on a `grading` branch separate from `main`, indicating awareness of branch-based workflows. Consider adopting feature branches (e.g., `feature/cart-api`) for clearer history.

---

**25/25** — All rubric items are fully met with excellent implementation quality. The coaching notes above (optimistic update patterns, inline styles, error boundaries, git branching) are suggestions for professional growth, not scoring deductions.
