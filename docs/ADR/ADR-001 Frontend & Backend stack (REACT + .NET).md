# ADR-001: Frontend & Backend Stack (React + .NET)

**Status:**
ACCEPTED

**Date:**
2/13/2026

---

## Context

Buckeye Marketplace requires a web-based system that supports product browsing, shopping cart functionality, role-based login, discounts, and order processing. The system must separate user interface logic from backend business logic and integrate with Azure hosting.

---

## Decision

We will use **React** for the frontend and **ASP.NET Core Web API (.NET)** for the backend. React will handle the user interface, while the .NET API will manage authentication, role-based discounts, business logic, and database communication through RESTful APIs.

---

## Consequences

### Positive

* Clear separation between frontend and backend
* Secure backend enforcement of role-based discounts
* Strong compatibility with Azure hosting

### Negative

* Requires managing and integrating two separate applications

---

## AI Tool Usage

**LLM Used:** ChatGPT

ChatGPT was used to assist in identifying the pros and cons within the consequences section and to help locate a common format used for Architecture Decision Records.

**Reference Template:**
https://github.com/joelparkerhenderson/architecture-decision-record/tree/main/locales/en/templates/decision-record-template-by-michael-nygard
