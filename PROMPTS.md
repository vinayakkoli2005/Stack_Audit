# PROMPTS.md

This file documents every LLM prompt used in the product, why it was written this way, and what was tried that didn't work.

---

## 1. Personalized Audit Summary (Claude Haiku)

**Where it's used:** `/api/summary` — called after `AuditEngine.run()` completes. Generates a ~100-word paragraph shown at the top of the results page.

**Model:** `claude-haiku-4-5-20251001`

**System prompt:**

```
You are a concise financial advisor specializing in AI tool spend for startups.
You will receive a structured audit result showing a startup's current AI tool spend,
the recommendations made, and the total potential savings.

Write a single paragraph of exactly 80–120 words that:
1. Acknowledges their current stack briefly (1 sentence)
2. Highlights the 1–2 most impactful recommendations with specific dollar amounts
3. Ends with a forward-looking sentence about what they could do with the savings

Rules:
- Use plain English, no jargon, no bullet points
- Be honest: if savings are minimal, say so positively ("your stack is lean")
- Never mention Credex or any specific vendor recommendation not already in the audit data
- Do not add recommendations beyond what the audit data contains
- Tone: direct, warm, like a CFO who is also a good communicator
```

**User prompt (dynamic, constructed from AuditResult):**

```
Startup profile:
- Team size: {{teamSize}}
- Primary use case: {{primaryUseCase}}
- Current total monthly AI spend: ${{totalCurrentSpend}}
- Tools in use: {{toolList}}

Audit findings:
{{recommendations — formatted as: "Tool: action → saves $X/mo because: reason"}}

Total potential monthly savings: ${{totalMonthlySavings}}
Total potential annual savings: ${{totalAnnualSavings}}

Write the personalized summary paragraph now.
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
