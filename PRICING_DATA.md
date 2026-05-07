# PRICING_DATA.md

All pricing verified during submission week. Every number in the audit engine traces to a URL below.
Re-verified on: _[Day 7 date]_

---

## Cursor

- Hobby: $0/user/month — https://www.cursor.com/pricing — verified 2026-05-08
- Pro: $20/user/month — https://www.cursor.com/pricing — verified 2026-05-08
- Business: $40/user/month — https://www.cursor.com/pricing — verified 2026-05-08
- Enterprise: Custom pricing (contact sales) — https://www.cursor.com/pricing — verified 2026-05-08

---

## GitHub Copilot

- Individual: $10/user/month (or $100/year) — https://github.com/features/copilot/plans — verified 2026-05-08
- Business: $19/user/month — https://github.com/features/copilot/plans — verified 2026-05-08
- Enterprise: $39/user/month — https://github.com/features/copilot/plans — verified 2026-05-08

---

## Claude (Anthropic)

- Free: $0/month — https://claude.ai/upgrade — verified 2026-05-08
- Pro: $20/user/month — https://claude.ai/upgrade — verified 2026-05-08
- Max (5x): $100/user/month — https://claude.ai/upgrade — verified 2026-05-08
- Max (20x): $200/user/month — https://claude.ai/upgrade — verified 2026-05-08
- Team: $30/user/month (min 5 seats) — https://claude.ai/upgrade — verified 2026-05-08
- Enterprise: Custom pricing — https://www.anthropic.com/claude/enterprise — verified 2026-05-08

---

## Anthropic API (direct)

Pricing per million tokens (as of 2026-05-08) — https://www.anthropic.com/pricing

| Model | Input ($/1M tokens) | Output ($/1M tokens) |
|---|---|---|
| Claude Opus 4.7 | $15.00 | $75.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $0.80 | $4.00 |

**Usage assumption for audit engine:** A developer doing coding work generates ~1M input + 200K output tokens/month. At Sonnet 4.6: ~$6/dev/month effective cost.

---

## ChatGPT (OpenAI)

- Plus: $20/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-08
- Team: $30/user/month (min 2 seats) — https://openai.com/chatgpt/pricing — verified 2026-05-08
- Enterprise: Custom pricing — https://openai.com/chatgpt/enterprise — verified 2026-05-08

---

## OpenAI API (direct)

Pricing per million tokens (as of 2026-05-08) — https://openai.com/api/pricing

| Model | Input ($/1M tokens) | Output ($/1M tokens) |
|---|---|---|
| GPT-4o | $2.50 | $10.00 |
| GPT-4o mini | $0.15 | $0.60 |
| o3 | $10.00 | $40.00 |

**Usage assumption for audit engine:** Same as Anthropic API — ~1M input + 200K output tokens/dev/month. GPT-4o effective: ~$4.50/dev/month.

---

## Gemini (Google)

- Gemini Advanced (Pro): $19.99/user/month (included in Google One AI Premium) — https://one.google.com/about/plans — verified 2026-05-08
- Gemini for Google Workspace: $30/user/month (Business Starter add-on) — https://workspace.google.com/intl/en/pricing.html — verified 2026-05-08

### Gemini API (Google AI Studio / Vertex AI)

Pricing per million tokens (as of 2026-05-08) — https://ai.google.dev/pricing

| Model | Input ($/1M tokens) | Output ($/1M tokens) |
|---|---|---|
| Gemini 2.5 Pro | $1.25 (≤200K ctx) | $10.00 |
| Gemini 2.5 Flash | $0.15 | $0.60 |

---

## Windsurf (Codeium)

- Free: $0/user/month — https://windsurf.com/pricing — verified 2026-05-08
- Pro: $15/user/month — https://windsurf.com/pricing — verified 2026-05-08
- Teams: $35/user/month — https://windsurf.com/pricing — verified 2026-05-08
- Enterprise: Custom pricing — https://windsurf.com/pricing — verified 2026-05-08

---

## Notes & Assumptions

- All prices are USD, billed monthly unless stated.
- Annual billing discounts (where available) are not used as the baseline — monthly retail price is the default because that's what most teams are actually paying.
- API "effective monthly cost" figures are illustrative estimates based on documented assumptions above. Users who enter actual API spend override these estimates.
- Enterprise pricing is excluded from automated recommendations (no public price to compare against).
