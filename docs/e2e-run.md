# E2E Run Notes (Playwright MCP)

## Prompt Used In Copilot Agent Mode

Primary prompt:

Use Playwright MCP to drive the Buckeye Marketplace happy-path flow end-to-end:
register -> login -> browse products -> add to cart -> checkout -> view order in order history.
Generate a reusable Playwright spec in BuckeyeMarketplaceFrontend/e2e/checkout.spec.ts and use resilient role/label selectors.

Execution prompt:

Run the generated Playwright test and do not skip or weaken assertions just to pass. If the test fails, fix selectors or app issues and rerun until it passes.

## First Failure

- The first generated run failed on Add to Cart because multiple buttons matched the same accessible name.
- Failure symptom: strict mode violation for getByRole('button', { name: 'Add to Cart' }).

## Correction Applied

- Disambiguated the selector with first() so one specific button is targeted:
  - page.getByRole('button', { name: 'Add to Cart' }).first().click()
- Kept assertions meaningful (URL transitions + confirmation/order-history assertions) rather than removing checks.

## Re-Validation Failure And Correction (April 15, 2026)

- During a fresh rerun, the spec timed out on Add to Cart because the first matching button was disabled (first product unavailable/out of stock).
- Failure symptom: locator resolved to `<button disabled type="button">Add to Cart</button>`.
- Applied a more robust selector that targets an enabled Add to Cart button:
  - `const enabledAddToCart = page.locator('button:has-text("Add to Cart"):not([disabled])').first();`
  - `await enabledAddToCart.click();`

## Generated Spec

- BuckeyeMarketplaceFrontend/e2e/checkout.spec.ts

## Verified Run (April 15, 2026)

Command run from BuckeyeMarketplaceFrontend:

```bash
npx playwright test e2e/checkout.spec.ts
```

Result:

- 1 passed (happy path completed: register -> login -> browse -> add to cart -> checkout -> order history)

## Preconditions

- Backend API running at http://localhost:5000
- Frontend running at http://127.0.0.1:5173
- JWT user-secrets configured for backend
