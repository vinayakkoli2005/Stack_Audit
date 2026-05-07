# ARCHITECTURE.md

## System Diagram

```mermaid
flowchart TD
    A[User fills spend form] -->|POST /api/audit| B[AuditEngine.run — pure function]
    B -->|AuditResult| C[Store in Supabase audits table]
    C -->|share_id| D[POST /api/summary — Claude Haiku]
    D -->|100-word summary| E[Render /r/shareId/private — owner view]
    E -->|User submits email| F[POST /api/leads]
    F --> G[Supabase leads table]
    F --> H[Resend transactional email]
    E -->|Share link| I[/r/shareId — public view, PII stripped]
    I -->|SSR generateMetadata| J[Open Graph / Twitter Card]
```

## Data Flow

1. **Input** — React Hook Form (zod-validated) persists to `localStorage` on every change. On submit: `POST /api/audit` with the `AuditInput` payload.
2. **Engine** — `src/lib/audit/engine.ts` is a pure function: `AuditEngine.run(input) → AuditResult`. No I/O, no side effects. Fully unit-testable.
3. **Storage** — Result stored in Supabase `audits` table, returns a `share_id` (nanoid). RLS policy: anon key can read a single row by `share_id`, cannot list or enumerate.
4. **AI Summary** — `/api/summary` calls Claude Haiku with the structured audit result. Falls back to a templated string on any API error or timeout.
5. **Lead capture** — `/api/leads` writes email + optional fields to `leads` table, triggers Resend email, and flags the audit row if `monthly_savings > 500`.
6. **Share URL** — `/r/[shareId]` is SSR'd. `company_name` and `email` are never included in the public render. Tools and savings numbers are shown.

## Stack & Why

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | SSR for OG tags, API routes co-located, one deploy target |
| Language | TypeScript strict | Audit engine is money math — type safety catches unit/logic bugs |
| UI | shadcn/ui + Tailwind | Owned components (not template), Radix gives a11y for free |
| Database | Supabase (Postgres) | RLS policies, Studio DX, free tier sufficient |
| LLM | Anthropic Claude Haiku | Assignment preference, cheap for 100-word summaries |
| Email | Resend | Simple API, free tier (3k/mo), fast onboarding |
| Rate limiting | Upstash Redis | Serverless-compatible token bucket, no persistent server needed |
| Tests | Vitest | Faster than Jest, native ESM, works with Next.js |
| Deploy | Vercel | Native Next.js support, preview URLs, zero config |

## What Would Change at 10k Audits/Day

1. **Database:** Add a read replica and connection pooling (PgBouncer via Supabase). Current schema has indexes on `share_id` and `created_at` — adequate to ~1M rows.
2. **Rate limiting:** Move from per-IP to fingerprint-based (Cloudflare Turnstile + device fingerprint) to handle proxies and shared IPs.
3. **AI summary:** Batch or queue the summary generation — at 10k/day, synchronous Haiku calls add latency and cost. Move to a background job with Supabase Edge Functions or a queue.
4. **CDN:** Static assets and OG images behind Cloudflare. The shareable URL is the viral loop — it must be fast globally.
5. **Observability:** Replace the simple `audit_events` table with a proper event pipeline (Tinybird or ClickHouse) for real-time funnel analytics.
