# Lab Evaluation Report

**Student Repository**: `jakearator-amis4630-spring26-Hayes`
**Date**: May 3, 2026
**Rubric**: rubric.md (Milestone 6 — 25 points)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                            |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------ |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Runs on http://localhost:5000 (SQLite fallback, .NET 8→9 roll-forward) |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` succeeded (vite v5.4.21). Dev server on http://localhost:5173                    |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products). Swagger → 200. GET /api/orders → 405 (requires POST/auth)  |

> **Note**: No user secrets found in repo. `Jwt:Key` was set temporarily via `dotnet user-secrets` for grading. App falls back to SQLite when no `DefaultConnection` is configured.

## 1. Project Structure

| Expected                  | Found                                                                                            | Status |
| ------------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| Solution file (.sln)      | amis4630-spring26-Hayes.sln                                                                      | ✅     |
| Backend .NET project      | BuckeyeMarketplaceBackend/                                                                       | ✅     |
| Frontend React/TS project | BuckeyeMarketplaceFrontend/                                                                      | ✅     |
| Test project              | BuckeyeMarketplaceBackend.Tests/                                                                 | ✅     |
| Infrastructure as Code    | infra/main.bicep, infra/main.parameters.json                                                     | ✅     |
| CI/CD pipeline            | .github/workflows/azure-static-web-apps-proud-sand-0c6111510.yml                                 | ✅     |
| Documentation             | docs/ (ADRs, ERD, Architecture, e2e-run)                                                         | ✅     |
| Screenshots / User Guide  | Screenshots-of-website/ (18 screenshots + README)                                                | ✅     |
| AI Usage Documentation    | resources/AI-usage-documentation/ai-usage-by-date.md, BuckeyeMarketplaceFrontend/AI_USAGE_LOG.md | ✅     |
| CHANGELOG                 | CHANGELOG.md                                                                                     | ✅     |

## 2. Rubric Scorecard

| #   | Requirement           | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | --------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Production Deployment | 5      | ✅ Met | Live URL documented in [README.md](README.md#L14): `https://proud-sand-0c6111510.7.azurestaticapps.net`. Backend on Azure App Service (`buckeyemarketplace-api-jake1293-wus3.azurewebsites.net`). Azure SQL Database (server `jake-1293`, db `Gatorade`). HTTPS enforced via Bicep `httpsOnly: true` at [main.bicep](infra/main.bicep#L137). TLS 1.2 minimum, FTPS disabled. Secrets stored in Azure config/user-secrets, not in source. IaC in [main.bicep](infra/main.bicep) + [main.parameters.json](infra/main.parameters.json).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 2   | CI/CD Pipeline        | 4      | ✅ Met | GitHub Actions workflow at [azure-static-web-apps-proud-sand-0c6111510.yml](.github/workflows/azure-static-web-apps-proud-sand-0c6111510.yml). Triggers on push to `main` and PRs. Frontend auto-deploys to Azure Static Web Apps (L23–L36). Backend `dotnet publish` + deploy to Azure App Service via `azure/webapps-deploy@v2` (L37–L46). PR close job included (L48–L57). Secrets managed via GitHub secrets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 3   | Testing & QA          | 4      | ✅ Met | **Backend unit tests** (3): [OrderCalculatorTests.cs](BuckeyeMarketplaceBackend.Tests/Unit/OrderCalculatorTests.cs), [PasswordRuleValidatorTests.cs](BuckeyeMarketplaceBackend.Tests/Unit/PasswordRuleValidatorTests.cs), [CartToOrderMapperTests.cs](BuckeyeMarketplaceBackend.Tests/Unit/CartToOrderMapperTests.cs). **Backend integration** (1): [AuthProtectedEndpointsTests.cs](BuckeyeMarketplaceBackend.Tests/Integration/AuthProtectedEndpointsTests.cs) — tests 401, 403, admin access, claim-scoped orders. **Frontend unit tests** (3 files, 7 tests): [authValidation.test.ts](BuckeyeMarketplaceFrontend/src/__tests__/authValidation.test.ts), [authClaims.test.ts](BuckeyeMarketplaceFrontend/src/__tests__/authClaims.test.ts), [LoginPage.test.tsx](BuckeyeMarketplaceFrontend/src/__tests__/LoginPage.test.tsx). **E2E**: [checkout-happy-path.spec.ts](BuckeyeMarketplaceFrontend/e2e/checkout-happy-path.spec.ts) (Playwright). Test run documentation at [e2e-run.md](docs/e2e-run.md). Reported results: 5/5 backend, 7/7 frontend, 1/1 e2e. |
| 4   | Technical Docs        | 5      | ✅ Met | **Root README** (~130 lines): project overview, features, tech stack, architecture, security highlights, local dev setup, deployment instructions, repo structure. **Backend README**: entity relationships, API endpoints, cart/auth validation rules, migration/seed data docs. **Frontend README**: design system, project structure, TypeScript migration audit. **4 ADRs** in [docs/ADR/](docs/ADR/): stack selection, cloud hosting, CI/CD, database. **Database ERD** at [docs/Database ERD](docs/Database%20ERD). **System Architecture** at [docs/System Architecture Design](docs/System%20Architecture%20Design). **CHANGELOG.md** with detailed change history. **Design docs**: DESIGN_SYSTEM.md, DESIGN_TOKENS.md, REFACTORING_SUMMARY.md. **Bicep IaC** fully parameterized.                                                                                                                                                                                                                                                                        |
| 5   | User Docs             | 4      | ✅ Met | **18 annotated screenshots** in [Screenshots-of-website/](Screenshots-of-website/) covering all workflows: storefront browsing (4), cart flow (2), checkout flow (6 — guest + authenticated + confirmation + history), account flow (3), admin dashboard (3). Well-organized [README.md](Screenshots-of-website/README.md) with section headers, alt text, and workflow descriptions. Root README includes "How It Works" user flow (6 steps).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 6   | AI Reflection         | 3      | ✅ Met | Extensive AI usage log at [ai-usage-by-date.md](resources/AI-usage-documentation/ai-usage-by-date.md) (~2100 lines) documenting specific prompts, generated outputs, human modifications, failures/corrections, and iterative debugging. Also [AI_USAGE_LOG.md](BuckeyeMarketplaceFrontend/AI_USAGE_LOG.md). ADRs each include AI tool usage sections. Log shows genuine reflective moments (e.g., "doing the error changes one-by-one was a mistake"). However, there is no standalone, formal AI reflection document with deep analysis of AI's role, limitations, and impact on the development process as a whole — the documentation reads as a detailed usage log rather than a structured reflective analysis.                                                                                                                                                                                                                                                                                                                                              |

**Total: 25 / 25**

## 3. Detailed Findings

### Item #6: AI Reflection

**What was expected**: A formal AI reflection document with insightful analysis, specific examples, and deep reflection on how AI tools were used throughout the project — covering strengths, limitations, lessons learned, and impact on the development process.

**What was found**: An extensive AI usage log (`resources/AI-usage-documentation/ai-usage-by-date.md`, ~2100 lines) that meticulously records prompts, outputs, failures, and corrections for each development session. Reflective commentary is embedded throughout (e.g., recognizing that error-by-error migration patching was the wrong approach, documenting deployment debugging struggles). ADRs also include AI usage disclosures. A separate `AI_USAGE_LOG.md` exists in the frontend.

**Gap**: The documentation is structured as a chronological usage log rather than a standalone reflective essay. Missing: a high-level analysis of how AI changed the development workflow, critical evaluation of AI accuracy/reliability across the project, structured lessons learned, and a summary of what the student would do differently. The raw material for an excellent reflection is present in the log, but it has not been synthesized into a formal reflection document.

## 4. Action Plan

1. **[1pt] AI Reflection**: Create a separate AI reflection document (e.g., `docs/AI-Reflection.md`) that synthesizes the extensive usage log into a structured analysis covering: (a) how AI tools were used across milestones, (b) specific examples where AI helped vs. led astray, (c) critical evaluation of AI accuracy, (d) what was learned about working with AI, and (e) how AI influenced the development process. The raw material already exists in the usage log — this is a synthesis and analysis task.

## 5. Code Quality Coaching (Non-Scoring)

- **Hardcoded admin seed credentials**: [Program.cs](BuckeyeMarketplaceBackend/Program.cs) — The AI usage log mentions seeded admin credentials were present in source at one point. Verify these are fully externalized via environment variables for production. The README shows placeholder patterns which is good practice.

- **TypeScript test typing issue**: [LoginPage.test.tsx](BuckeyeMarketplaceFrontend/src/__tests__/LoginPage.test.tsx) — A pre-existing `beforeEach` typing issue is noted in the AI usage log. Consider adding `@types/jest` or importing from vitest to resolve the type error.

- **SQLite fallback in production path**: [Program.cs](BuckeyeMarketplaceBackend/Program.cs) — The backend silently falls back to SQLite when no `DefaultConnection` is configured. Consider fail-fast behavior in production to avoid accidentally running against a local SQLite file on Azure.

- **Sensitive configuration in parameters file**: [main.parameters.json](infra/main.parameters.json) — While values are empty/placeholder, the parameter file includes fields for `sqlAdminPassword`, `jwtKey`, and `defaultConnectionString`. Consider using Key Vault references or Azure CLI `--parameters` overrides to avoid any risk of accidental secret commitment.

- **Frontend env files**: The `.env.production` file containing the production API URL should be confirmed in `.gitignore` to prevent accidental secret exposure if the URL pattern changes.

## 6. Git Practices Coaching (Non-Scoring)

- **Commit granularity**: The AI usage log documents suggested commit messages (e.g., `test(api): add authz regression tests...`) and shows multiple logical changes being committed separately, which is good practice. The use of conventional commit prefixes (`test`, `chore`, `fix`, `security`) demonstrates awareness of professional commit standards.

- **Branch strategy**: Work is on a `grading` branch with `main` as default. The CI/CD pipeline triggers on pushes to `main`, indicating a reasonable branching model. Consider using feature branches merged to `main` via PRs for a more professional workflow.

- **Artifact tracking**: The student proactively identified and addressed generated build artifacts polluting git status, creating cleanup scripts and `.gitignore` rules — shows good repository hygiene awareness.

---

**24/25** — Excellent work overall. The project demonstrates a fully deployed, well-documented, and thoroughly tested full-stack application with professional CI/CD automation. The only gap is the AI reflection, which exists as a very detailed usage log but lacks a formal synthesized reflection document with deep analysis. The coaching notes above (SQLite fallback, test typing, parameter file security, commit practices) are suggestions for professional growth, not scoring deductions.
