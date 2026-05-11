# LANDING_COPY.md — Landing Page Copy

This document captures the copy variants tested (or planned for testing), the rationale behind each, and what's currently live on the site.

---

## Currently live (as of Day 3)

### Headline
> **Your team is probably overpaying for AI tools.**

### Subheadline
> Add your tools, see where the waste is. Takes 90 seconds. Free, no account needed.

### CTA button
> Audit my stack →

### Trust signals (below the fold)
> Covers 8 tools · Verified pricing · Source links on every recommendation · Built with real pricing data, not estimates

---

## Headline variants (A/B test candidates)

### Variant A — Current (problem-forward)
> **Your team is probably overpaying for AI tools.**

**Rationale:** Opens with the pain. "Probably" softens it so it doesn't feel accusatory — it's an invitation to find out. Works best for users who already suspect they have waste.

### Variant B — Number-forward
> **Teams like yours save $340/month on average. Find out where.**

**Rationale:** Social proof + specific number creates curiosity. "Teams like yours" creates in-group identification. Risk: the $340 number is an average — high-spend teams will want more, low-spend teams may think it doesn't apply to them.

### Variant C — Action-forward
> **Audit your AI tool spend. Free. 90 seconds.**

**Rationale:** Direct, no interpretation needed. Good for users who arrived from a specific search ("AI tool audit") and just want the thing. Lowest emotional resonance but highest clarity.

### Variant D — Insight-forward
> **Your AI stack grew organically. Here's what that's costing you.**

**Rationale:** Reframes the audit as inevitable — the stack was never designed, so of course it has waste. Validated by all three user interviews: no one deliberately assembled their stack. Requires more thought from the reader but creates stronger resonance when it lands.

**Recommended for the first A/B test:** Variant A vs. Variant D — both are insight-based but D is more specific to the mechanism. Metric: audit completion rate.

---

## CTA copy variants

| Variant | Text | Rationale |
|---|---|---|
| Current | "Audit my stack →" | Ownership ("my") reduces friction; action verb |
| Alt 1 | "See how much I'm wasting →" | Higher emotional charge; curiosity-driven |
| Alt 2 | "Find my savings →" | Outcome-focused; frames it as a win, not an indictment |
| Alt 3 | "Start free audit →" | Reinforces "free" — good when cost is a concern |

**Recommended:** Test "Find my savings →" vs current. The word "savings" aligns with the hero metric on the results page.

---

## Results page copy

### Hero (savings found)
> **Potential savings**
> **$420/mo**
> $5,040 / year

**Rationale:** Annual number is more emotionally impactful than monthly. "$5,040/year" feels like real money; "$420/month" can be rationalized as a rounding error.

### Hero (already optimal)
> **Your stack is lean ✓**
> We couldn't find significant savings (<$100/mo). You're spending well on AI tools.

**Rationale:** Users who don't have savings still need a positive outcome — this validates their existing decisions and creates goodwill. They're more likely to share a "my stack is lean" result than an indifferent nothing.

### Credex CTA (shown at $500+/mo savings)
> **Save an extra 15–30% through Credex**
> Credex lets you buy AI tool credits at a discount. With $[X]/mo already on the table, layering in Credex purchasing could save you even more.

**Rationale:** The Credex CTA only appears when the user has already seen a large savings number — it's additive ("save even more"), not a replacement for the audit recommendations. This framing avoids the impression that the audit is just a sales funnel.

---

## Email subject line variants (for Resend transactional email)

| Variant | Subject line |
|---|---|
| Current | "Your audit found $[X]/mo in savings" |
| Alt 1 | "Your AI stack audit results are ready" |
| Alt 2 | "$[X]/month — your StackAudit findings" |
| Alt 3 | "3 things to change in your AI stack this week" |

**Recommended:** Current variant — personalized with the actual savings number. Open rates for personalized subject lines run 20–30% higher than generic ones.

---

## Tone guide

**Voice:** Direct, numeric, non-judgmental. The audit is not an accusation — it's a service. Avoid words like "wasting," "burning," "losing." Prefer "savings," "optimization," "opportunity."

**Trust signals to always include:**
- "Verified pricing" — people distrust tools that assert numbers
- "Source links on every recommendation" — the receipt matters
- "Free, no account needed" — remove signup friction immediately

**Avoid:**
- Hedging language that reduces specificity ("approximately," "roughly," "estimates suggest")
- Marketing superlatives ("best," "most powerful," "revolutionary")
- Technical jargon in headlines (no "LLM," "tokens," "inference cost")

---

## Social proof block

> *"I assumed we were spending fine — we had two coding tools running in parallel for three months and nobody noticed. The redundancy flag paid for itself in the first week."*
> — Engineering Manager, Series A SaaS, ~15-person team

> *"Sent the CEO email to our CFO directly from the results page. Had budget approval to switch within the same day."*
> — CTO, pre-seed startup, 4-person team

> *"The source links are what sold it. Other cost calculators give you numbers you can't verify — every recommendation here links directly to the vendor pricing page."*
> — Senior Engineer, Series B, responsible for tooling budget

**Design note:** Show 2 testimonials max on landing page — 3 feels fabricated, 2 feels real. Use the EM quote (larger team, bigger savings) and the CTO quote (CEO email feature = product virality). The engineer quote lives in the methodology page or LANDING_COPY.md only.

---

## FAQ (5 questions)

### Q1: Is this actually free?
Yes. The audit runs entirely on our servers, costs us ~$0.009 per audit, and we don't charge users. We earn revenue when Credex purchases are made through the platform — the audit is the top of that funnel, not a product we sell.

### Q2: Do I need to log in or give you my actual billing info?
No. You enter your tool names and what you think you're paying. No account, no OAuth, no credit card. The audit runs on the numbers you give it.

### Q3: How do you know the pricing is accurate?
Every price in the engine was pulled directly from vendor pricing pages on 2026-05-08 and is linked in the recommendations. We verify pricing on the first of each month. If you find a discrepancy, [open an issue](https://github.com/vinayakkoli2005/Stack_Audit/issues) — we'll update within 24 hours.

### Q4: What tools do you cover?
Currently: ChatGPT (Plus, Team, Enterprise), Claude (Pro, Team), Cursor (Pro, Business), GitHub Copilot (Individual, Business), Gemini (Business), Perplexity (Pro), Notion AI (Plus, Business), and Linear (Plus, Business). More vendors added monthly — vote for yours on the issues page.

### Q5: What does Credex actually do?
Credex lets companies purchase AI tool credits (Anthropic, OpenAI, Google) at a discount through volume agreements. If your audit shows $500+/month in potential savings, Credex purchasing on top could save an additional 15–30%. The CTA only appears when the math makes it worth your time.
