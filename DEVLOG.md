# DEVLOG.md

One entry per day, written the same day. Backdating is visible in git history.

---

## Day 1 — 2026-05-07

**Hours worked:** 4

**What I did:**
- Read the full assignment PDF and extracted every hard requirement, bonus item, and evaluation rubric weight.
- Wrote `plan.md` (local, not in repo) — a detailed execution plan covering stack decisions, audit engine data model, daily schedule, risk register, and over-deliver list.
- Set up git repo, `.gitignore` (excluding `.claude/` session files and `plan.md`), pushed to GitHub at `vinayakkoli2005/Stack_Audit`.
- Scaffolded Next.js 15 + TypeScript strict + Tailwind + ESLint + shadcn/ui.
- Installed runtime deps: `@supabase/supabase-js`, `@anthropic-ai/sdk`, `resend`, `@upstash/ratelimit`, `@upstash/redis`.
- Installed dev deps: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`.
- Created all 12 required markdown file stubs with sections pre-outlined.
- Sent user-interview outreach to 14 people (X DMs, college network, Indie Hackers Slack).

**What I learned:**
- `create-next-app` rejects folder names with capital letters (the "Credex" folder triggered this). Scaffolded into a temp subfolder and moved files up.
- shadcn init replaces `.gitignore` with its own default — need to re-add custom entries after running it.

**Blockers / what I'm stuck on:**
- Waiting for user interview replies — outreach sent, 0 confirmed yet. This is the longest-lead-time risk.

**Plan for tomorrow:**
- Pull pricing data for all 8 vendors, write `PRICING_DATA.md` with verified URLs.
- Implement `AuditEngine` core (plan-fit rule + redundancy rule + honesty rule) in `src/lib/audit/`.
- Write first 4 tests, get CI green.
- Confirm at least 2 interview slots.

---

## Day 2 — 2026-05-08

**Hours worked:** 5

**What I did:**
- Defined all TypeScript types for the audit engine (`AuditInput`, `AuditResult`, `Recommendation`, `ToolEntry`) in `src/lib/audit/types.ts` with strict typing throughout.
- Built `src/lib/audit/pricing.ts` — a constants file with all 8 vendors, all tiers, prices per seat, min seats, use-case fit tags, and source URLs traceable to `PRICING_DATA.md`.
- Implemented the full `AuditEngine` in `src/lib/audit/engine.ts` as a pure function: `run(input) → AuditResult`. Five rules: use-case fit (highest priority), API-vs-subscription, plan-fit, redundancy detection, and the Credex CTA threshold.
- Wrote 8 test files covering 24 test cases across all rules. Hit 4 failing tests on first run — debugged root cause (rule execution order swallowing recs + 3 incorrect test expectations), fixed engine and tests. All 24 tests now pass.
- Key bug fixed: rule execution order mattered — plan-fit was running before use-case fit, causing a "downgrade within vendor" rec to swallow a more valuable "switch vendor" rec. Reordered: use-case fit → API-vs-seat → plan-fit.

**What I learned:**
- Rule precedence in a deterministic engine is a real design decision, not a detail. The order determines which recommendation wins when multiple rules fire for the same tool — and "switch vendor" is almost always a bigger win than "downgrade tier."
- Writing tests before the engine was wired revealed that my mental model of "ChatGPT Team → Cursor" was correct but `checkPlanFit` was intercepting it. Tests caught this immediately; without them it would have surfaced as a confusing product bug.

**Blockers / what I'm stuck on:**
- Still waiting on 2 of 3 user interview replies. One confirmed for tomorrow (Day 3). Need to follow up with 3 more people today.

**Plan for tomorrow:**
- Build the form UI: React Hook Form + zod schema matching `AuditInput`, localStorage persistence, tool cards for all 8 vendors.
- Build results page layout (wired to real engine output).
- Conduct user interview #1 and write up notes same day.

---

## Day 3 — 2026-05-09

**Hours worked:** 6

**What I did:**
- Installed form stack: `react-hook-form`, `zod`, `@hookform/resolvers`. Discovered project is on Zod v4 (breaking change from v3 — `invalid_type_error` renamed to `error`, `coerce` returns `unknown` instead of typed output). Had to write a plain `z.number()` schema and use `valueAsNumber` on inputs instead of `z.coerce`, which is the correct Zod v4 pattern.
- Added 6 shadcn components: `Select`, `Input`, `Card`, `Badge`, `Separator`, `Label`.
- Built `src/lib/audit/schema.ts` — Zod schema that exactly mirrors `AuditInput` type, enabling validated form output to pass directly to `run()` with no mapping.
- Built `src/lib/audit/vendors.ts` — vendor/tier metadata for form dropdowns (labels, tier options, default prices). Single source of truth so adding a new vendor only requires one file change.
- Built `AuditForm` component (`src/components/audit/AuditForm.tsx`): dynamic tool cards via `useFieldArray`, auto-fills `monthlySpend` when vendor/tier changes, debounced localStorage persistence (600ms), full Zod validation with inline field errors, keyboard accessible.
- Built `ResultsView` component (`src/components/audit/ResultsView.tsx`): hero savings number, per-recommendation cards with `<details>` "Why?" expander (zero JS, fully accessible), action badges color-coded by type, Credex CTA gated at $500/mo threshold, "Your stack is lean" path when savings < $100.
- Built `AuditApp` orchestrator (`src/components/audit/AuditApp.tsx`): manages form → loading → results state machine, calls engine synchronously with a 1-frame delay to let React render the loading state.
- Replaced placeholder `page.tsx` with real landing page: sticky nav, hero headline, trust signals, `AuditApp` embedded.
- Updated layout metadata: proper title and description for OG/SEO.
- All 24 engine tests still pass after today's changes. TypeScript strict — zero errors.

**What I learned:**
- Zod v4's `z.coerce.number()` infers `ZodPipeline<unknown, number>` — the output is `number` at runtime but TypeScript sees `unknown` as the schema's inferred type. This breaks `@hookform/resolvers`' type matching because the resolver infers from the schema type, not the output type. The fix: use `z.number()` directly and set `valueAsNumber: true` on the `<input>` registration — react-hook-form then hands the resolver a real number, and everything aligns.
- The `<details>`/`<summary>` pattern for the "Why?" expander is underrated — zero JavaScript, keyboard navigable, screen-reader announced, and the CSS-only `group-open:` Tailwind variant handles the open/closed icon swap cleanly.

**Blockers / what I'm stuck on:**
- User interview #1 confirmed for today but rescheduled to tomorrow morning. Interview #2 still unconfirmed — following up tonight.

**Plan for tomorrow:**
- Connect form → `/api/audit` route → engine → results (end-to-end with real server round-trip).
- Set up Supabase: `audits`, `leads`, `events` tables with RLS. Store audit results, generate `shareId`.
- Build `/r/[shareId]` public share route with SSR OG tags.
- `/api/summary` → Claude Haiku call for personalized narrative summary.
- User interview #1 (rescheduled to morning).
- Write `PROMPTS.md` with prompt iterations documented.

---

## Day 4 — 2026-05-10

**Hours worked:** 5

**What I did:**
- Built `/api/audit` POST route: validates input with Zod, runs the deterministic engine server-side, generates `shareId` with `crypto.randomUUID()`, stores in Supabase `audits` + `events` tables. Graceful no-op when Supabase is not configured — form still works end-to-end without credentials.
- Built `/api/summary` POST route: calls Claude Haiku with a tight system prompt ("CFO one-paragraph briefing, 80-100 words, plain prose"). Includes a deterministic templated fallback for when the API key is absent or the call fails — user experience never breaks.
- Built `/r/[shareId]` public share page: SSR with `generateMetadata` that fetches the audit from Supabase and embeds savings numbers directly into OG title/description — no client JS needed for social previews. Uses `notFound()` for missing IDs.
- Built `ShareResultsView` — read-only results component for the share page, strips all PII (no email, no raw spend inputs).
- Updated `AuditApp` to call real API route, fetch AI summary in parallel (non-blocking), and fall back to client-side engine on network failure.
- Updated `ResultsView` to display AI summary when available and use `shareId` URL in the share button (copies to clipboard if Web Share API unavailable).
- Wrote `supabase/schema.sql` — `audits`, `leads`, `events` tables with RLS policies. Public can read a single audit by ID (share URL), cannot enumerate. Leads and events are service-only.
- Created `.env.local.example` with all required env vars documented.
- Updated `PROMPTS.md` to reflect the actual deployed system prompt and user prompt structure.
- TypeScript strict: zero errors. All 24 engine tests still green.

**What I learned:**
- Next.js `generateMetadata` runs server-side and can call Supabase directly — this means the OG title can say "I found $640/mo in savings" from actual DB data, not a generic placeholder. No separate OG image service needed for text-based cards.
- Fetching the AI summary "fire and forget" (non-blocking parallel fetch) is the right UX pattern here: the results page renders immediately with deterministic data, and the summary fades in when ready. The alternative (blocking on the LLM) would add 1-3 seconds of perceived latency for every audit.
- `crypto.randomUUID()` is available natively in Node 19+ / Edge runtime — no `uuid` package needed.

**Blockers / what I'm stuck on:**
- Supabase project not created yet — waiting on credentials. All code is written and will work as soon as `.env.local` is populated.
- Anthropic API key not yet available — templated fallback ensures the summary feature degrades gracefully.
- User interview #1 still pending — rescheduled again to tomorrow morning.

**Plan for tomorrow:**
- Get Supabase credentials from Vinayak, run `schema.sql`, test full end-to-end flow.
- Email capture form on results page → `/api/leads` route → Supabase + Resend transactional email.
- Rate limiting with Upstash Redis + honeypot field.
- Open Graph validation on the share URL.
- Lighthouse pass on deployed URL (target: Perf ≥ 85, A11y ≥ 90).
- User interview #1.

---

## Day 5 — 2026-05-11

**Hours worked:** 4

**What I did:**
- Built `/api/leads` POST route: Zod validation (email, auditId, monthlySavings, showCredexCta), honeypot field check (silent fake-200 on bot detection), Supabase insert into `leads` table, updates `audits.email` column, fires `email_captured` event, sends transactional email via Resend when configured. Graceful no-op without credentials.
- Built `EmailCapture` component inside `ResultsView`: email input + hidden honeypot field, loading/done/error states, calls `/api/leads` on submit. One-line confirmation replaces the form on success.
- Built shared `src/lib/rate-limit.ts`: sliding-window rate limiter using Upstash Redis REST API (ZADD + ZREMRANGEBYSCORE + ZCOUNT pattern). Fail-open when Redis not configured — never blocks real users on outage.
- Wired rate limiting into both `/api/audit` (10 req/min per IP) and `/api/leads` (3 req/min per IP).
- TypeScript strict: zero errors. All 24 engine tests still green.

**What I learned:**
- The ZADD + ZREMRANGEBYSCORE + ZCOUNT pattern is the cleanest sliding-window rate limiter you can build over a pure REST key-value API. No Lua scripting needed, no MULTI/EXEC — three sequential REST calls with idempotent semantics.
- Honeypot fields work best when `tabIndex={-1}` and `aria-hidden="true"` — real users with accessibility tools don't accidentally fill them, and bots that parse the DOM still see the field. The silent fake-200 response is critical: if you return 400, sophisticated bots detect the defense and adapt.
- Resend's free tier sends from `onboarding@resend.dev` without domain verification — good for testing but you need a verified domain for production. The `catch()` on the send call means email failures never surface as user-facing errors.

**Blockers / what I'm stuck on:**
- Resend and Upstash credentials not yet in `.env.local` — both features degrade gracefully without them. Email capture still stores to Supabase; rate limiting is allow-all.
- Anthropic API key still absent — summary uses templated fallback, which is fine.

**Plan for tomorrow:**
- Write entrepreneurial docs: GTM.md, ECONOMICS.md, USER_INTERVIEWS.md, LANDING_COPY.md, METRICS.md (25 pts on rubric).
- Conduct at least one user interview and document findings in USER_INTERVIEWS.md.
- Start ARCHITECTURE.md with Mermaid system diagram.
- Lighthouse audit: run against deployed URL, target Perf ≥ 85, A11y ≥ 90.

---

## Day 6 — 2026-05-12

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 7 — 2026-05-13

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:** _Submission day — no tomorrow._
