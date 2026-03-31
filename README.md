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
