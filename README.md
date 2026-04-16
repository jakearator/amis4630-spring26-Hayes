# amis4630-spring26-Hayes
AMIS 4630 Buckeye Marketplace Project

## Repository Overview

This repository contains a full-stack Buckeye Marketplace implementation:

- `BuckeyeMarketplaceFrontend` - React + TypeScript frontend (Vite)
- `BuckeyeMarketplaceBackend` - ASP.NET Core 8 Web API + EF Core + SQLite

## Recent Cart UX and Error-Handling Updates (March 30, 2026)

- Added explicit cart loading states during initial cart fetch.
- Added user-visible error and success feedback for cart API actions.
- Enforced quantity minimum of `1` in cart update flows.
- Added product availability and stock checks (frontend + backend).
- Preserved duplicate add-to-cart behavior by incrementing quantity when valid.
- Kept empty-cart browse prompt for recovery.

For implementation details:

- Frontend details: `BuckeyeMarketplaceFrontend/README.md`
- Backend/data model details: `BuckeyeMarketplaceBackend/README.md`

## Code Quality and Documentation Practices

- Frontend component and hook quality workflow: `BuckeyeMarketplaceFrontend/README.md`
- AI-assisted development log: `BuckeyeMarketplaceFrontend/AI_USAGE_LOG.md`
- Commit message convention: documented in `BuckeyeMarketplaceFrontend/README.md`

## Artifact and Output Hygiene

To reduce Git noise and keep generated files from being committed accidentally:

- Repository-level ignore rules now cover .NET and frontend build/test outputs in `.gitignore`.
- A reusable cleanup script is available at `scripts/clean-artifacts.ps1`.
- A one-time tracked-artifact migration script is available at `scripts/untrack-artifacts.ps1`.
- Frontend convenience scripts:
	- `npm run clean:artifacts`
	- `npm run test:run:clean`
	- `npm run artifacts:preview`
	- `npm run artifacts:untrack`

Recommended migration flow:

1. Run `npm run artifacts:preview` to see tracked artifacts.
2. Run `npm run artifacts:untrack` once.
3. Commit that change.
4. Use `npm run clean:artifacts` as needed going forward.
