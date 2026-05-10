# StackAudit

**Audit your team's AI tool spend in 90 seconds. Free, no account required.**

StackAudit is a deterministic AI tool spend auditor built for Credex. It takes your current AI tool subscriptions, runs them through a 5-rule engine with verified pricing data, and tells you exactly where you're overpaying and what to do about it.

---

## Live demo

> Run the app locally with `npm run dev` — see setup below.

---

## What it does

1. You enter your team's AI tools (vendor, plan tier, monthly spend, seat count)
2. The audit engine runs 5 rules against verified pricing data
3. You get a prioritized list of savings recommendations with source URLs
4. An optional Claude Haiku summary wraps the findings in plain English
5. A shareable link lets you send results to your CEO/CFO
6. Email capture sends you a one-time results summary

---

## Audit rules (in execution order)

| Rule | What it checks | Example finding |
|---|---|---|
| Use-case fit | Is this tool the right category for your primary use case? | "ChatGPT Team for a pure coding team — switch to Cursor, save $10/seat/mo" |
| API vs. subscription | Would direct API access be cheaper than a seat subscription? | "Claude Pro for a developer — Anthropic API costs $6/mo effective vs $20/mo" |
| Plan fit | Are you on more plan than you need? | "ChatGPT Team (2-seat min) for 1 person — downgrade to Plus, save $10/mo" |
| Redundancy | Do you have two tools doing the same job? | "Cursor Pro + GitHub Copilot Business — pick one, save $19–20/seat/mo" |
| Credex threshold | Does total savings exceed $500/mo? | → Show Credex CTA (15–30% additional savings via discounted credits) |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| UI | shadcn/ui + Tailwind CSS |
| Forms | react-hook-form + Zod v4 |
| Database | Supabase (Postgres + RLS) |
| Email | Resend |
| Rate limiting | Upstash Redis |
| AI summary | Anthropic claude-haiku-4-5 |
| Testing | Vitest (24 tests, 100% pass) |
| Hosting | Vercel |

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/vinayakkoli2005/Stack_Audit.git
cd Stack_Audit
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
# Required — get from supabase.com → project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional — get from console.anthropic.com
# Without this, a deterministic templated summary is used
ANTHROPIC_API_KEY=sk-ant-...

# Optional — get from resend.com
# Without this, email capture stores to Supabase but sends no email
RESEND_API_KEY=re_...

# Optional — get from upstash.com → Redis → REST API
# Without this, rate limiting is disabled (allow-all)
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

**The app runs fully end-to-end with only Supabase configured.** All other services degrade gracefully.

### 3. Set up Supabase schema

In the Supabase SQL editor, run the contents of `supabase/schema.sql`. This creates:
- `audits` table (audit results + share URLs)
- `leads` table (email captures)
- `events` table (funnel analytics)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Run tests

```bash
npx vitest run
```

Expected: 24 tests passing, 0 failing.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout + metadata
│   ├── api/
│   │   ├── audit/route.ts        # POST — run engine + store audit
│   │   ├── summary/route.ts      # POST — Claude Haiku summary
│   │   └── leads/route.ts        # POST — email capture
│   └── r/[shareId]/page.tsx      # SSR share page with OG tags
├── components/
│   └── audit/
│       ├── AuditApp.tsx          # State machine orchestrator
│       ├── AuditForm.tsx         # Dynamic tool form
│       ├── ResultsView.tsx       # Results + email capture
│       └── ShareResultsView.tsx  # Read-only share page view
└── lib/
    ├── audit/
    │   ├── engine.ts             # Core audit engine (pure function)
    │   ├── pricing.ts            # Vendor/tier/price constants
    │   ├── schema.ts             # Zod v4 form schema
    │   ├── types.ts              # TypeScript types
    │   └── vendors.ts            # Dropdown metadata
    ├── rate-limit.ts             # Upstash Redis sliding-window limiter
    └── supabase/client.ts        # Supabase client (null when unconfigured)

supabase/schema.sql               # Database schema + RLS policies
```

---

## Documentation

| File | Contents |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagram, component breakdown, key decisions |
| [PRICING_DATA.md](PRICING_DATA.md) | Verified vendor pricing with source URLs |
| [PROMPTS.md](PROMPTS.md) | LLM prompt design, iterations, fallback logic |
| [GTM.md](GTM.md) | Go-to-market strategy and channel plan |
| [ECONOMICS.md](ECONOMICS.md) | Unit economics and LTV:CAC model |
| [USER_INTERVIEWS.md](USER_INTERVIEWS.md) | Three user interviews with synthesis |
| [LANDING_COPY.md](LANDING_COPY.md) | Headline variants and copy rationale |
| [METRICS.md](METRICS.md) | KPIs, funnel metrics, success criteria |
| [TESTS.md](TESTS.md) | Test strategy and coverage breakdown |
| [DEVLOG.md](DEVLOG.md) | Day-by-day build log |
| [REFLECTION.md](REFLECTION.md) | Post-build reflection (completed Day 7) |

---

## Built by

Vinayak Koli — internship assignment for Credex, May 2026.
