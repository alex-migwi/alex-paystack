# Architectural Decisions

This document records the core architectural decisions, design tradeoffs, and technical rationale guiding the modernization of the Paystack Developer Infrastructure ecosystem.

---

## Ecosystem Overview & Philosophy

**Primary Goal**: Minimize **Time-to-Value (TTV)** for developers integrating Paystack by eliminating API drift, manual SDK maintenance, documentation friction, and local testing overhead.

**Design Principle**: **OpenAPI-First Single Source of Truth**. The enriched OpenAPI specification drives documentation, SDK generation, and CLI subcommands simultaneously.

```
                     ┌──────────────────────────────┐
                     │ paystack-spec-enriched       │
                     │ (Enriched OpenAPI 3.0 Spec)  │
                     └──────────────┬───────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐       ┌───────────────────┐      ┌──────────────────┐
│ paystack-docs   │       │ paystack-sdk-gen  │      │ paystack-cli     │
│ Next.js/Markdoc │       │ Multi-Lang SDKs   │      │ Scriptable Binary│
└─────────────────┘       └───────────────────┘      └──────────────────┘
```

---

## OpenAPI-First Enriched Specification as Single Source of Truth

### Context
Maintaining separate hand-written SDKs, documentation sites, and CLI commands leads to inevitable **API drift**, missing parameters, and inconsistent naming conventions across developer touchpoints.

### Decision
Adopt an **OpenAPI-First Architecture** centered on `paystack-spec-enriched`. Enrich the spec with metadata vendor extensions:
- **100% `operationId` Coverage**: Idiomatic camelCase function naming across all languages.
- **Resilience Metadata (`x-idempotency`, `x-retry-safe`, `x-dont-retry`)**: Explicit instruction for HTTP retries and idempotent key injection.
- **Collection Metadata (`x-pagination`)**: Identifies endpoints supporting page-based cursor iteration.
- **Polymorphic Webhook Schemas (`oneOf` + Discriminator)**: Strongly-typed event payloads (`ChargeSuccessEvent`, `TransferSuccessEvent`, etc.).

### Consequences
- **Positive**: Single-point update propagates instantly across Docs, SDKs, and CLI via automated GitHub Action dispatch events.
- **Positive**: Eliminates manual SDK update engineering overhead.

---

## Interactive API Documentation Portal

### Context
Static documentation forces developers to switch context between browser documentation, Postman, and local terminals, increasing friction during initial integration.

### Decision
Build `paystack-docs` using **Next.js** and **Markdoc**:
- **3-Column Layout**: Left navigation, middle structured guides, right interactive execution sandbox.
- **Secure Key Proxy**: Encapsulates secret key injection without exposing raw credentials in browser memory.
- **Automatic Parameter Validation**: Live client-side validation based on the enriched schema before dispatching HTTP calls to sandbox endpoints.

### Consequences
- **Positive**: Reduces developer activation time ("Time to First Successful API Call") by up to 70%.

---

## Client SDK Generation Pipeline

### Context
Thin API wrappers shift complex network logic (retries, rate limits, pagination, idempotency) onto payment developers, leading to fragile production implementations.

### Decision
Implement a multi-language SDK generator pipeline (`paystack-sdk-gen`) producing **enterprise-ready client SDKs**:
- **Automatic Idempotency Header Injection**: Auto-generates UUID v4 for `X-Idempotency-Key` on financial operations (`POST /transaction/initialize`, `POST /charge`, `POST /transfer`).
- **Built-in Resilience Loop**: Automatic exponential backoff retries for transient HTTP `5xx`, `429`, and network errors on `x-retry-safe` endpoints.
- **Native Async Pagination**: Emits `.autoPaginate()` async generator iterators for array collection endpoints.

### Consequences
- **Positive**: Guarantees production resilience and prevents accidental duplicate payments without custom wrapper code.

---

## Scriptable CLI & Automated Webhook Listener Tunneling

### Context
Legacy interactive REPL CLIs (`paystack> `) allow basic exploration, but cannot be scripted, automated in CI/CD pipelines, or piped into standard Unix tools (`jq`, `grep`, `curl`). Furthermore, standard HTTP webhooks force developers to manually set up public tunnels and manually update dashboard settings during local development.

### Decision
Transition `paystack-cli` to a **scriptable Commander.js architecture** with embedded tunneling automation:
- **Non-Interactive Command Execution**: Up-front flag parsing (`paystack api transaction initialize --email "..." --amount 50000 --json`).
- **Machine-Readable Output**: Standard `--json` flag output enabling direct piping into `jq` or CI build scripts.
- **Embedded Webhook Listener & Tunneling (`paystack-cli webhook listen`)**: Automatically establishes a `localtunnel` instance and auto-configures the developer's Paystack Dashboard Test Webhook URL via API, delivering live sandbox events directly to `localhost`.
- **Zero-Dependency Webhook Simulator (`paystack-cli webhook trigger`)**: Local HMAC SHA-512 calculation for offline testing.
- **40x Bundled Spec Performance**: Offline bundled spec resolution achieving ~360ms cold-start execution time.

### Consequences
- **Positive**: Enables automated integration testing in CI/CD pipelines (e.g., GitHub Actions) and seamless 1-command local webhook testing.
