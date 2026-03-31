# AI Usage Log

This file records how AI tools were used during development for transparency and grading.

## Entry Template

- Date:
- Task/Goal:
- Prompt Summary:
- Generated Output:
- Human Modifications:
- Validation Performed:
- Notes:

## 2026-03-30 - Frontend readability refactor

- Date: 2026-03-30
- Task/Goal: Improve code quality readability with cleaner component boundaries and data-fetch separation.
- Prompt Summary: "Review code quality, clean component structure, separate concerns, enforce naming patterns, and document AI usage + commit message quality."
- Generated Output:
  - New hooks: `useProducts`, `useProductDetail`
  - New cart components: `CartItemRow`, `CartItemList`, `CartSummary`
  - Page refactors: `CartPage`, `ProductListPage`, `ProductDetailPage`
  - Documentation updates for code quality and commit standards
- Human Modifications:
  - Verified naming consistency (`isLoading`, `handle*` actions)
  - Reviewed extracted components for prop clarity and accessibility labels
  - Adjusted page logic to avoid non-null assertions in product detail rendering
- Validation Performed:
  - Frontend production build via `npm run build`
- Notes:
  - Goal is to keep presentation, state, and data-loading responsibilities easier to read for professors, students, and contributors.
