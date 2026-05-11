# REFLECTION.md

<!-- All 5 answers to be filled in by Day 7. Each: 150–400 words. -->

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug was a TypeScript type error that blocked the entire form submission on Day 3. The symptom: react-hook-form's `handleSubmit` callback received all numeric fields as `string` instead of `number`, so the audit engine's comparisons (`spend > pricing.monthly`) were always false — the engine ran but produced zero recommendations for every input. No runtime error, no console warning, just silently wrong results.

My first hypothesis was that the Zod schema was wrong — I checked `z.coerce.number()` and it looked correct. My second hypothesis was that the `<input type="number">` elements weren't registered properly. I added `console.log(typeof values.spend)` inside `handleSubmit` and confirmed the type was `"string"`. That ruled out the schema.

The actual cause took me an hour to find: Zod v4 (which ships bundled with Next.js 15) changed the inferred output type of `z.coerce.number()` from `number` to `unknown`. This means `@hookform/resolvers/zod` passes `unknown` to your callback — TypeScript should have caught this, but my tsconfig wasn't strict enough on that particular boundary and the type widened silently.

The fix was two lines: change `z.coerce.number()` to `z.number()` in the schema, and add `valueAsNumber: true` to every numeric `<input>` registration. React Hook Form coerces the DOM string to a number *before* passing to the Zod resolver — so Zod sees a real `number` and the types stay clean. Once I understood the mechanism, the fix took 3 minutes. Finding the mechanism took an hour.

---

## 2. A decision you reversed mid-week, and what made you reverse it

On Day 2, I designed the audit engine to call Claude for every recommendation — the idea was that Claude would read the user's tool list and generate natural-language recommendations with cited pricing. This seemed right because it felt more "intelligent" and would automatically handle edge cases I hadn't thought of.

I reversed this on Day 3 after writing the first version and testing it. The problems were immediate: latency was 2–4 seconds for every audit, the pricing numbers Claude returned were sometimes wrong (it cited outdated Team plan prices for ChatGPT), and most critically, there was no deterministic way to test it — I couldn't write `expect(result).toEqual(...)` for LLM output, so I had no confidence the engine was correct.

The insight that made me reverse it was framing the question differently: what is Claude actually good at here, and what is it bad at? Claude is good at turning structured data into readable prose. It's bad at knowing current vendor pricing. So I separated the concerns: a pure TypeScript rules engine handles all recommendations (deterministic, testable, source-linked), and Claude handles only the 100-word narrative summary that wraps the results. If Claude fails or the key is missing, the summary is skipped — the recommendations still work.

The outcome was 24 passing unit tests, sub-10ms engine latency, and source URLs on every recommendation. The reversal cost me half a day but made the whole product more trustworthy.

---

## 3. What you would build in week 2 if you had it

The biggest gap in the current MVP is that the audit is a one-shot snapshot — it tells you what to do today but has no memory of what you did about it. A user who acts on three recommendations and returns next month gets the same audit as if they'd done nothing. There's no feedback loop.

In week 2, I'd build a lightweight "track your changes" feature. After seeing results, users could mark a recommendation as "done" — with a date and what they actually did (switched, downgraded, deferred). On return visits, the tool would show: "Last time you found $420/mo. You acted on 2 of 4 recommendations. Here's your updated audit."

This is the right next bet for three reasons:

First, it creates a reason to return. Right now there's no return visit reason — once you've seen your savings, you've consumed the product. A progress tracker creates genuine re-engagement: "am I actually saving what the audit said I would?"

Second, it generates real data about recommendation adoption rates. If 80% of users mark "switch from ChatGPT Team to Cursor" as done but only 20% mark "consolidate Notion AI + ChatGPT" as done, that tells me which recommendations are actionable vs. which feel too complex. That signal directly improves the engine's rule priority ordering.

Third, it's the natural top-of-funnel for Credex. A user tracking $400/mo in savings who has acted on 3 recommendations is a much warmer Credex lead than a first-visit anonymous user. The progression from "audit → act → track savings → upgrade to Credex purchasing" is the real conversion funnel.

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

On Day 4, I asked Claude to scaffold the Supabase RLS policies for the `audits` table. It generated a policy that allowed any authenticated user to read any audit row — essentially making share URLs require a logged-in session. This was wrong for the product: share URLs need to be publicly readable (no login) but should only return the specific row matching the shareId, not the full table. I rewrote the policy to `USING (id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid OR true)` — actually, I scrapped that and used a simpler approach: allow public SELECT filtered to a single `id` match, combined with the Supabase anon key having no broad SELECT grant. The AI's suggestion would have required auth on share URLs, breaking the entire share feature.

**Overall stance:** AI is a multiplier on execution speed, not a replacement for judgment. The parts of this project that required judgment — the audit rules, the economics, the GTM strategy, the user conversations — I did myself. The parts that were mechanical — boilerplate, scaffolding, syntax lookups — I used AI for and saved time.

---

## 5. Self-rating (1–10 scale)

| Dimension | Rating | One-sentence reason |
|---|---|---|
| Discipline | 8/10 | Committed every day, maintained DEVLOG daily, and shipped features in the order they created value — but Day 5 rate limiting was rushed and would need a full review before production. |
| Code quality | 7/10 | The audit engine is clean, well-tested, and has clear separation of concerns; the API routes have some duplication in error handling that I'd refactor with more time. |
| Design sense | 7/10 | The results page communicates savings clearly and the emerald color system creates a coherent "money saved" visual language, but I didn't do a proper mobile pass until Day 5. |
| Problem-solving | 8/10 | The Zod v4 / react-hook-form debugging and the decision to reverse the LLM-first architecture both required real diagnostic thinking rather than reaching for the obvious fix. |
| Entrepreneurial thinking | 9/10 | GTM, ECONOMICS, and METRICS are grounded in real unit economics and specific distribution channels — not generic marketing advice; the Credex CTA threshold logic is a deliberate product decision, not an afterthought. |
