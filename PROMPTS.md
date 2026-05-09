# PROMPTS.md

This file documents every LLM prompt used in the product, why it was written this way, and what was tried that didn't work.

---

## 1. Personalized Audit Summary (Claude Haiku)

**Where it's used:** `/api/summary` — called after `AuditEngine.run()` completes. Generates a ~100-word paragraph shown at the top of the results page.

**Model:** `claude-haiku-4-5-20251001`

**System prompt (as deployed in `src/app/api/summary/route.ts`):**

```
You are a concise financial analyst specializing in AI tool spend optimization.
Write a 80-100 word personalized summary of an audit result.
Be specific about the numbers. Mention the top recommendation.
Sound like a CFO giving a one-paragraph briefing — direct, numeric, no fluff.
Do not use bullet points. Plain prose only.
```

**User prompt (dynamic, constructed from AuditResult):**

```
Audit result:
- Total monthly savings: ${{totalMonthlySavings}}
- Total annual savings: ${{totalAnnualSavings}}
- Is already optimal: {{isAlreadyOptimal}}
- Top recommendations: [vendor, action, monthlySavings, reasonShort — top 3]
- Team size: {{teamSize}}
- Primary use case: {{primaryUseCase}}

Write the 80-100 word summary now.
```

**Why written this way:**
- The system prompt front-loads the constraint ("80–120 words") so the model doesn't produce a 400-word essay.
- "Never mention Credex" is explicit — the summary is a trust-building neutral voice; the Credex CTA is a separate UI element triggered by business logic, not the LLM.
- "Do not add recommendations beyond what the audit data contains" prevents hallucinated suggestions that contradict the deterministic engine.
- The user prompt uses structured data, not prose, so the model doesn't need to parse ambiguous text.

**What didn't work:**
- First draft asked for "a friendly paragraph" — got varying lengths (50 words to 300 words). Adding "exactly 80–120 words" stabilized output dramatically.
- Tried combining system + user into one prompt — the model occasionally added its own tool recommendations not in the audit. Separating the role ("neutral advisor") from the data ("here is what the engine found") fixed this.
- Tried `claude-sonnet-4-6` first — output quality was marginally better but cost ~4x more per call. For a 100-word summary, Haiku is indistinguishable in practice.

**Fallback (when API fails or times out):**

```ts
`Your team is currently spending $${totalCurrentSpend}/month across ${toolCount} AI tools. 
Based on your usage profile, we identified ${recommendationCount} optimization opportunities 
that could save up to $${totalMonthlySavings}/month ($${totalAnnualSavings}/year). 
${totalMonthlySavings > 0 
  ? `The biggest opportunity is ${topRecommendation}.` 
  : "Your current stack looks well-optimized for your team size and use case."
}`
```

The fallback is deterministic, accurate, and doesn't require any external calls.

---

## Prompt Caching Note

The system prompt is static and eligible for Anthropic's prompt caching (5-minute TTL). The `cache_control: { type: "ephemeral" }` header is set on the system prompt block. At moderate traffic, this reduces cost by ~90% on the system prompt tokens.
