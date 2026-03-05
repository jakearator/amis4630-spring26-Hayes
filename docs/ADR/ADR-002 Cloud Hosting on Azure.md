# ADR-002: Cloud Hosting on Azure

**Status:**
Accepted

**Date:**
2/13/2026

---

## Context

The system must be deployed to the cloud to meet milestone requirements and ensure public accessibility.
The hosting platform must support both the React frontend and the .NET backend, as well as integrate with a relational database.

---

## Decision

We will deploy the application using **Microsoft Azure**.

* The **React frontend** will be hosted using Azure web hosting services.
* The **.NET backend** will be deployed to **Azure App Service**.
* The **database** will be hosted on **Azure SQL Database**.

---

## Consequences

### Positive

* Centralized cloud environment for frontend, backend, and database
* Strong compatibility with .NET
* Scalable and reliable hosting

### Negative

* Requires configuration of Azure services and environment settings
* Introduces cloud service management responsibilities

---

## AI Tool Usage

**LLM Used:** ChatGPT

ChatGPT was used to locate a GitHub repository that contains a commonly used Architecture Decision Record format and to assist in identifying the pros and cons within the consequences section.

**Reference Template:**
https://github.com/joelparkerhenderson/architecture-decision-record/tree/main/locales/en/templates/decision-record-template-by-michael-nygard
