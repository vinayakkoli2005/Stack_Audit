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

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 4 — 2026-05-10

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 5 — 2026-05-11

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

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
