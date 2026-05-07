# StackAudit

> Free AI spend auditor for startups — find where you're overpaying on Cursor, Claude, Copilot, and more in 60 seconds.

**For** engineering managers and founders at seed-to-Series-A startups who pay for multiple AI tools and want to know if they're overspending.

## Screenshots / Demo

_[30-second Loom walkthrough — link to be added on Day 7]_

## Live URL

_[Vercel URL — to be added after deploy]_

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL,
# NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
# RESEND_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

# Run locally
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Decisions

Five non-trivial trade-offs made during this build:

1. **Rule-based audit engine, not LLM-powered** — The audit recommendations are deterministic rules against cited pricing data. Using an LLM for the math would add latency, cost, and non-determinism with no accuracy benefit. The LLM is used only for the 100-word personalized summary narrative on top of already-computed results.

2. **Next.js App Router over a separate API server** — SSR is required for the shareable result URL's Open Graph tags (`generateMetadata`). A separate Express/Hono API would need client-side OG injection hacks. Next.js handles it natively in one repo, one deploy target.

3. **Supabase over Cloudflare D1** — Better local DX (Supabase Studio), built-in RLS policies for the public share URL security model, and a dashboard that makes debugging stored audits trivial. D1 wins at extreme scale; Supabase wins for a time-boxed sprint.

4. **Honeypot + Upstash rate limiting over hCaptcha** — hCaptcha adds a friction step before value is shown, hurting conversion on a tool whose whole pitch is "60 seconds to value." A token-bucket rate limiter (10 audits/hour/IP) covers 99% of abuse. Explicit trade-off: good enough for launch, documented in README.

5. **`@react-pdf/renderer` over headless Chrome for PDF export** — Puppeteer on Vercel causes cold-start and memory issues in serverless functions. `@react-pdf/renderer` runs in the same Node.js process, produces clean PDFs, no infrastructure overhead.

## Required Files

| File | Purpose |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagram, data flow, stack rationale |
| [DEVLOG.md](DEVLOG.md) | Daily progress log (7 entries) |
| [REFLECTION.md](REFLECTION.md) | Post-week reflection (5 questions) |
| [PRICING_DATA.md](PRICING_DATA.md) | Sourced pricing for all 8 AI tools |
| [PROMPTS.md](PROMPTS.md) | LLM prompts used in the product |
| [TESTS.md](TESTS.md) | Test inventory and how to run |
| [GTM.md](GTM.md) | Go-to-market strategy |
| [ECONOMICS.md](ECONOMICS.md) | Unit economics analysis |
| [USER_INTERVIEWS.md](USER_INTERVIEWS.md) | Notes from 3 user interviews |
| [LANDING_COPY.md](LANDING_COPY.md) | Marketing copy for the landing page |
| [METRICS.md](METRICS.md) | North Star metric and instrumentation plan |
