# ADR-003: Continuous Integration and Deployment with GitHub

**Status:**
Accepted

**Date:**
2/13/2026

---

## Context

The project requires a reliable way to build and deploy both the frontend and backend applications to Azure. Manual deployments increase the risk of errors and inconsistencies between environments.

---

## Decision

We will use **GitHub Actions** to implement a CI/CD pipeline.

* Code pushed to the GitHub repository will trigger automated builds.
* The **React frontend** and **.NET backend** will be automatically deployed to Azure hosting services.

---

## Consequences

### Positive

* Automated and consistent deployments
* Reduced manual deployment errors
* Integrated workflow within GitHub

### Negative

* Requires initial pipeline configuration
* Requires secure management of Azure credentials

---

## AI Tool Usage

**LLM Used:** ChatGPT

ChatGPT was used to assist in identifying the positives and negatives of using GitHub (specifically disadvantages) and to help locate a common layout used for Architecture Decision Records.

**Reference Template:**
https://github.com/joelparkerhenderson/architecture-decision-record/tree/main/locales/en/templates/decision-record-template-by-michael-nygard
