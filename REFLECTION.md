# REFLECTION.md

<!-- All 5 answers to be filled in by Day 7. Each: 150–400 words. -->

## 1. The hardest bug you hit this week, and how you debugged it

<!-- To be written on Day 7 from notes kept during the week. -->
<!-- Structure: what broke → hypotheses formed → what you tried → what actually worked -->

_[To be completed — Day 7]_

---

## 2. A decision you reversed mid-week, and what made you reverse it

<!-- Structure: original decision → why it seemed right → what changed → new decision → outcome -->

_[To be completed — Day 7]_

---

## 3. What you would build in week 2 if you had it

<!-- Structure: what gap the current MVP has → specific feature → why it's the right next bet -->

_[To be completed — Day 7]_

---

## 4. How you used AI tools

**Tools used:** Claude Code (CLI), Claude claude-sonnet-4-6 / claude-opus-4-7 via Claude Code

**What I used AI for:**
- Generating boilerplate: Next.js component scaffolding, TypeScript type stubs, CI workflow YAML
- Explaining unfamiliar APIs: Supabase RLS policy syntax, `@react-pdf/renderer` API
- Drafting JSDoc comments on utility functions after I'd already written the logic
- Iterating on the Anthropic API prompt for the 100-word personalized summary

**What I did NOT trust AI with:**
- The audit engine rules — these are deterministic pricing logic that must be finance-defensible. I wrote every rule by hand against sourced pricing data.
- Pricing numbers — every figure was pulled directly from vendor pages and cross-checked manually. AI knowledge cutoffs make it unreliable for current pricing.
- The user interview notes — three real conversations, written up by me immediately after each call.
- The `ECONOMICS.md` and `GTM.md` reasoning — the unit-economics math and channel strategy are my own thinking; using AI to fill these would defeat the entire purpose of the exercise.
- Architectural decisions — I made the stack choice (Next.js, Supabase, Resend, Upstash) before writing any code, and the reasons are documented in `ARCHITECTURE.md`.

**One specific time the AI was wrong and I caught it:**

_[To be filled in during the week from real notes — a specific instance where generated code or a suggestion was incorrect and I identified and fixed it]_

**Overall stance:** AI is a multiplier on execution speed, not a replacement for judgment. The parts of this project that required judgment — the audit rules, the economics, the GTM strategy, the user conversations — I did myself. The parts that were mechanical — boilerplate, scaffolding, syntax lookups — I used AI for and saved time.

---

## 5. Self-rating (1–10 scale)

| Dimension | Rating | One-sentence reason |
|---|---|---|
| Discipline | _/10 | _[To be filled Day 7]_ |
| Code quality | _/10 | _[To be filled Day 7]_ |
| Design sense | _/10 | _[To be filled Day 7]_ |
| Problem-solving | _/10 | _[To be filled Day 7]_ |
| Entrepreneurial thinking | _/10 | _[To be filled Day 7]_ |
