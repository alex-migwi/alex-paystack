---
title: Paystack Developer Tooling Suite
theme: dark
resolution: 1920x1080
fps: 30
---

# Accelerating Developer Velocity at Paystack.

## Next-Gen API Infrastructure & Developer Experience

Enriched OpenAPI 3.0 Spec • Interactive Docs • Multi-Language SDK Generator • Modern CLI

##

<!-- duration: 8s -->
<!-- columns: 2 -->

### 🏛️ Ecosystem Overview

- **1. Enriched OpenAPI Spec**: Single source of truth with Stripe-quality metadata & 100% operationId coverage.
- **2. Interactive Docs**: Next.js & Markdoc interactive developer experience with live API execution.
- **3. Multi-Language SDK Gen**: 10-language SDK generator with exponential backoff & auto-idempotency.
- **4. Modern Scriptable CLI**: Fast, non-interactive terminal tool with automatic key resolution & zero-dependency webhooks.

<!-- col-break -->

```bash
# @title "Dev Ecosystem Health Check"
# @type "echo 'Checking Paystack Developer Tooling Suite...'"
echo 'Checking Paystack Developer Tooling Suite...'
# @wait 500ms
echo '[OK] paystack-spec-enriched (0 errors, 0 warnings)'
echo '[OK] paystack-docs (Next.js 14 + Markdoc)'
echo '[OK] paystack-sdk-gen (10 language targets)'
echo '[OK] paystack-cli (@paystack-oss/paystack-cli ~360ms latency)'
```

> Note: Welcome everyone! Today I'm presenting the modernization of Paystack's developer ecosystem across four core pillars: the Enriched Spec, Interactive Docs Portal, Multi-Language SDK Generator, and the new scriptable CLI.

---

# The "Developer Velocity" Lens

> **Time-to-Value (TTV)**. The core problem is not just missing features, we have friction that slows down the loop from "Idea" to "First Successful Transaction."

## Ranked Gaps (Priority Order):

<!-- columns: 3 -->

### Critical: The "Static" Documentation & Manual Integration Loop
- The Gap: `Docs are read-only`. Developers must `manually copy keys, switch tabs to the dashboard, configure Postman, and guess error states`.
- Impact: `High drop-off during activation`. Senior developers (target market) view this as "legacy" compared to Stripe.
- Evidence: Paystack’s own 2024 research noted developers want "better documentation to understand how to maximize use of tools" and cited a lack of advanced technical content.
- Why Fix First: It blocks everyone. You cannot activate a user who cannot successfully make their first API call within 5 minutes. 

<!-- col-break -->
### High: Unreliable & Fragmented Tooling (CLI & SDKs)
- The Gap: The CLI updates are far between (last update Aug 2024, relies on unmaintained libraries like vorpal, requires manual ngrok setup). SDKs are manually maintained, leading to likely hood of drift from the API spec.
- Impact: High churn for scaling companies. As merchants grow, they need scriptable CI/CD pipelines and type-safe code. The current state forces them to build internal wrappers or switch providers.
- Evidence: GitHub issues on PaystackOSS/paystack-cli show errors from 2020 that may still be unresolved. Community forks exist to fill the void. 

<!-- col-break -->
### Medium: Webhook Complexity
- The Gap: Testing webhooks requires third-party tools (ngrok) and manual configuration. There is no "one-click" local testing.
- Impact: Slows down development of critical post-payment flows (subscriptions, disputes). 

---

# The Enriched OpenAPI Spec

## Single Source of Truth (`paystack-spec-enriched`)

> Adopt an OpenAPI-First workflow where the Enriched Spec drives Docs, SDKs, and CLI simultaneously.

<!-- duration: 10s -->
<!-- columns: 2 -->

This serves as the single source of truth for the **Stripe-Quality Enriched Paystack OpenAPI Specification**. It synchronizes with the official `PaystackOSS/openapi` repository, applies structural, resilience, and developer-experience enrichments (`x-code-samples`, `x-operation-id`, `x-idempotency`, `x-retry-safe`, `x-dont-retry`, `x-pagination`, `x-deprecated-reason`, polymorphic webhook event schemas), and outputs unified distribution files (`dist/paystack-enriched.yaml` and `dist/paystack-enriched.json`).

- `**How it helps Developers**`: Eliminates drift. If the API changes, the docs, SDKs, and CLI update instantly. Guarantees type safety and accurate examples.
- `**How it helps Paystack**`: Reduces engineering maintenance overhead (no manual SDK updates). Increases activation rates by lowering TTV. Positions Paystack as "Enterprise Ready" for senior devs.

<!-- col-break -->
### 1. Stripe Like OpenAPI Spec Enrichment Features

| Extension / Metadata | Purpose & Target Operations |
| :--- | :--- |
| **`x-idempotency: true`** | Added to resource creation & financial endpoints </br>(`POST /transaction/initialize`, `POST /charge`, `POST /transfer`, `POST /refund`, `POST /customer`, etc.). |
| **`x-retry-safe: true`** | Added to 97 GET operations and idempotent POST operations. |
| **`x-dont-retry: true`** | Added to non-idempotent state-mutating actions (`POST`, `PUT`, `DELETE`). |
| **`x-pagination`** | Defined on 17 collection list endpoints (`/transaction`, `/customer`, `/transfer`, `/subscription`, `/plan`, `/refund`, `/subaccount`, `/dispute`, `/dedicated_account`, etc.). |
| **`x-operation-id`** | Standardized camelCase names with 100% coverage (163/163 HTTP operations mapped). |
| **`x-code-samples`** | Modular code snippets per endpoint (`snippets/<operationId>/[node|python|curl|go|php].*`). |
| **`x-deprecated-reason`** | Migration guidance notices for deprecated endpoints. | IDEs highlight deprecation warnings with actionable guidance. |
| **`WebhookEvent`** | Polymorphic (`oneOf` + `discriminator`) typed event payload models (`ChargeSuccessEvent`, `TransferSuccessEvent`, `SubscriptionCreateEvent`, etc.). | Downstream SDK users receive strongly-typed webhook event deserialization. |



> Note: The Enriched Spec is the foundation of our entire ecosystem. Have enriched OpenAPI vendor extensions like x-idempotency, x-retry-safe, and x-pagination metadata across 163 operations.

---

# Interactive API Documentation Portal

## Next.js & Markdoc Interactive Portal (`paystack-docs`)

<!-- duration: 10s -->

### Interactive Explorer Feature Set

> This is a 3-Column Developer Layout with the following features:

- **Sidebar Navigation**: Hierarchical category & operation tree generated directly from spec paths.
- **Markdoc Guide Overlays**: Markdown developer guides rendered with custom interactive tags.
- **Live API Explorer**: Right-hand interactive console for executing real HTTP requests.
- **Secure Key Proxy**: Encapsulates secret key injection without exposing raw credentials in browser memory.

<!-- columns: 2 -->


## Main Page

<img src="./images/Interactive API Explorer.png" alt="Interactive API Explorer" width="640" height="480"/>

<!-- col-break -->

## Split API Endpoint Interaction Page

<img src="./images/Interactive Split.png" alt="Interactive Split Endpoint API Explorer" width="640" height="480"/>


> Note: New documentation portal uses Next.js and Markdoc to provide a seamless Developer Experience combining rich developer guides with real-time API testing. Documentation is the front door. If a developer cannot successfully test an endpoint in the browser within minutes of landing on the page, they often never proceed to install the CLI or SDK.

> Note: With the API Explorer, developers can test API endpoints right inside the documentation body, with automatic parameter validation and live response inspection.

---

# Multi-Language Client SDK Pipeline

## Enterprise Multi-Language SDK Generator (`paystack-sdk-gen`)

<!-- duration: 10s -->
<!-- columns: 2 -->

### 10 Target Languages & Decoupled Architecture

- **10 Language Matrix**: TypeScript, Python, Go, Java, PHP, C#, Ruby, Flutter, Android (Kotlin), and iOS (Swift). OpenAPI Generator supports almost 5 languages.
- **Decoupled Spec Storage**: Local spec copy (`spec/paystack-enriched.yaml`) enables fast, zero-network local generation scripts.
- **Automated Cross-Repo Sync**: Listens to `repository_dispatch` release events from `paystack-spec-enriched`. When a new release of `paystack-spec-enriched` occurs:
  - **GitHub Dispatch Trigger (`repository_dispatch`)**:
    - `paystack-spec-enriched` emits a `repository_dispatch` event named `enriched-spec-updated`.
  - **Automated Spec Retrieval & Generation**:
    - GitHub Action step downloads `paystack-enriched.yaml` over HTTPS into `spec/paystack-enriched.yaml`.
    - Node.js generator engine reads `spec/paystack-enriched.yaml` and re-generates SDK packages.
    - Executes Prism Mock Server validation tests (`npx paystack-sdk-gen test`).
    - Auto-commits updated spec files and generated packages.

<!-- col-break -->

### Local On-Demand Development Workflow
Internaly, Paystack Developers can also run the generator CLI locally operating strictly on `spec/paystack-enriched.yaml` for testing and validation purposes:

```bash
# 1. Verify local spec copy and trigger generation + Prism testing
npx paystack-sdk-gen sync

# 2. Generate specific target language SDKs from local spec copy
npx paystack-sdk-gen generate --lang typescript,python

# 3. Verify generated SDKs against local Prism Mock Server
npx paystack-sdk-gen test
```

> Note: The SDK Generator turns our OpenAPI spec into enterprise thick-client libraries across 10 languages using custom Mustache templates and automated GitHub Actions workflows.

---

# Modern Scriptable CLI

## Modern Paystack CLI (`@paystack-oss/paystack-cli`)

<!-- duration: 10s -->
<!-- columns: 2 -->

### Improved DevEx

- **Scriptable Commander Architecture**: Replaces legacy interactive REPL with non-interactive, CI/CD-friendly subcommands.
- **Automatic Key Resolution**: Secure `paystack login` session storage; auto-resolves test/live keys per request.
- **40x Native Spec Speedup**: Offline bundled spec (`lib/paystack/openapi.json`) achieves ~360ms total command time.
- **JSON Output Piping**: Pass `--json` to pipe response payloads directly into `jq` or CI/CD pipelines.


```bash
# @title "CLI Verification"
# @type "paystack status"
paystack status
# @type "paystack api transaction initialize --email 'alex@example.com' --amount 50000 --domain test"
paystack api transaction initialize --email "alex@example.com" --amount 50000 --domain test
```

### Paystack CLI modernization

- **Old REPL CLI**: Acted like a chat session (paystack> ). This supports exploration, but breaks continuous integration and automation.
- **New Scriptable CLI**: Acts like standard Unix tools (git, docker, stripe-cli). Every command can be scripted, automated, piped, and embedded in production build pipelines.

<!-- col-break -->

### Why Scriptability Matters
1. Piping Data to Other Shell Tools (jq, grep, curl). The CLI supports the --json flag and non-interactive flags, you can chain commands together in bash:

```bash
# Fetch transaction status and extract just the status string using jq
STATUS=$(paystack api transaction verify --reference "qTPrJoy9Bx" --json | jq -r '.data.status')
if [ "$STATUS" = "success" ]; then
  echo "Payment confirmed!"
fi
```

2. Running in CI/CD Pipelines (e.g., GitHub Actions) to test API integrations automatically during pull requests:

```yaml
# .github/workflows/test-integration.yml
steps:
  - name: Run Paystack API Healthcheck
    run: |
      paystack api transaction initialize \
        --email "ci-runner@example.com" \
        --amount 1000 \
        --domain test \
        --json > response.json
```
> Note: We completely revamped the Paystack CLI from an interactive REPL into a lightning-fast, scriptable CLI with automatic secret key resolution and standard JSON output.

---

# Zero-Dependency Local Webhooks & Auto-Updates

## Zero-Dependency Webhook Engine & Package Updates

<!-- duration: 10s -->

### Webhook Simulation & Maintenance

- **Authentic HMAC SHA-512**: Computes authentic `x-paystack-signature` headers locally using secret keys.
- **Zero Tunneling Overhead**: `paystack webhook trigger` and `listen` forward events directly without `ngrok`.
- **Self-Reporting Package Updates**: 24-hour non-blocking background check alerts developers to npm updates.
- **Single Update Command**: `npm install -g @paystack-oss/paystack-cli` updates both binary logic and the bundled OpenAPI spec.

```bash
# @title "Webhook Trigger"
# @type "paystack webhook trigger charge.success --forward-to http://localhost:3000/api/webhook"
paystack webhook trigger charge.success --forward-to http://localhost:3000/api/webhook
```

> Note: Webhook testing no longer requires ngrok. The CLI generates authentic HMAC SHA-512 signatures locally and forwards events directly to your local development server.

---

# Unified Developer Infrastructure

## End-to-End Synergy Across the Ecosystem

<!-- duration: 10s -->
<!-- columns: 2 -->

### Unified Architecture Impact

- **Single Source of Truth**: `paystack-spec-enriched` powers Docs, SDKs, and CLI in total sync.
- **Zero API Drift**: Automated GitHub Actions workflows ensure spec changes propagate instantly.
- **Stripe-Quality Standards**: Resilience, auto-pagination, typed errors, and high performance.
- **Developer First**: Built for seamless integration in local terminal sessions, IDEs, and CI/CD pipelines.

<img src="./images/Enriched Architecture Flow.png" alt="Unified Developer Infrastructure Flow" />

<!-- col-break -->

**Ranked Gaps**
- Static Docs (Activation Blocker).
- Fragmented Tooling (Retention Blocker).
- Webhook Friction (Complexity Blocker).

**The Solution**
- One Enriched OpenAPI First Spec → [Interactive Docs, Generated SDKs, Generated CLI].
- Interactive API Explorer with auto-injected keys, and real-time execution.
- Auto SDK Generation using OpenAPI Generator.
- Modern Scriptable CLI with Zero-Dependency Webhook Engine & Auto-Updates

**Impact & ROI**
- Activation: Reduce "Time to First Call" by ~70%.
- Retention: Signal to enterprise devs that Paystack is "modern."
- Efficiency: Engineering time saved on manual SDK updates.
- Benefit: Zero drift, automated maintenance.

**Next Steps:** 
- Phase 1: Roll out Explorer to 10% of users.
- Phase 2: Deprecate manual SDKs in favor of generated ones.
- Phase 3: Rebuild CLI on top of the generated SDK.

> Note: In summary, by unifying spec, docs, SDK generator, and CLI around an enriched single source of truth, Paystack now delivers a world-class, zero-drift developer experience.
