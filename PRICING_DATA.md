# PRICING_DATA.md — Verified Vendor Pricing

All prices are USD, per seat, per month, on monthly billing (not annual). Verified 2026-05-08. Source URLs included for every entry — follow the link to verify the current price.

Annual billing discounts exist for most vendors but are not used in the engine — we compare monthly-to-monthly to be conservative and to reflect how most small teams actually pay.

---

## Cursor

**Source:** https://www.cursor.com/pricing

| Tier | Price/seat/month | Notes |
|---|---|---|
| Hobby | $0 | 2,000 completions/month limit |
| Pro | $20 | Unlimited completions, priority access |
| Business | $40 | SSO, centralized billing, admin controls |

**Use case fit:** Coding only. Not suitable for writing, research, or data tasks.

**Credex eligible:** Yes — Credex can supply Cursor credits at a discount.

---

## GitHub Copilot

**Source:** https://github.com/features/copilot/plans

| Tier | Price/seat/month | Notes |
|---|---|---|
| Individual | $10 | Personal accounts only |
| Business | $19 | Org management, policy controls |
| Enterprise | $39 | Adds Copilot Workspace, IP indemnity |

**Use case fit:** Coding only. IDE integration; no standalone chat product worth paying for separately.

**Credex eligible:** Yes.

**Key comparison:** Copilot Business ($19) vs Cursor Pro ($20) — nearly identical cost, different UX. Cursor is widely preferred for completions quality at time of writing; Copilot Business wins on GitHub integration.

---

## Claude (Anthropic consumer)

**Source:** https://claude.ai/upgrade

| Tier | Price/seat/month | Notes |
|---|---|---|
| Free | $0 | Limited usage, no API |
| Pro | $20 | 5× usage vs free, priority |
| Max 5× | $100 | 5× Pro usage limits |
| Max 20× | $200 | 20× Pro usage limits |
| Team | $30 | Min 5 seats, centralized billing, 25% more usage than Pro |

**Use case fit:** Writing, research, coding, mixed. Claude excels at long-context reasoning and document analysis.

**Credex eligible:** Yes.

**Note:** Claude Team requires minimum 5 seats. At exactly 5 seats, Claude Team ($30/seat) is more expensive than Claude Pro ($20/seat) but includes admin controls. For 5+ seats where management matters, Team is the right call.

---

## ChatGPT (OpenAI consumer)

**Source:** https://openai.com/chatgpt/pricing

| Tier | Price/seat/month | Notes |
|---|---|---|
| Plus | $20 | Individual; GPT-4o, image gen, plugins |
| Team | $30 | Min 2 seats; workspace, admin, no data training |

**Use case fit:** Writing, research, mixed. Not the strongest choice for pure coding (Cursor/Copilot win on IDE integration).

**Credex eligible:** Yes.

**Note:** ChatGPT Team minimum is 2 seats. A solo founder on ChatGPT Team is overpaying — Plus ($20) has identical capabilities for individual use.

---

## Anthropic API (direct)

**Source:** https://www.anthropic.com/pricing

| Model | Input | Output | Effective $/seat/month |
|---|---|---|---|
| claude-sonnet-4-6 | $3/MTok | $15/MTok | ~$6* |
| claude-haiku-4-5 | $0.80/MTok | $4/MTok | ~$1.50* |
| claude-opus-4-7 | $15/MTok | $75/MTok | ~$30* |

*Effective monthly cost assumes 1M input tokens + 200K output tokens per developer per month at a typical coding workload. This assumption is documented and conservative — light users will pay less.

**Use case fit:** Coding, data, research, mixed. API access is the right choice for developers building AI features or running high-volume queries that would exhaust consumer plan limits.

**Credex eligible:** Yes — Anthropic API credits are Credex's primary product.

**Engine note:** The `anthropic-api` tier in the engine uses $6/seat/month as the effective price, making it cheaper than any consumer Claude plan for developers with typical usage. If a team is on Claude Pro primarily for API-equivalent tasks, the engine recommends switching to direct API.

---

## OpenAI API (direct)

**Source:** https://openai.com/api/pricing

| Model | Input | Output | Effective $/seat/month |
|---|---|---|---|
| gpt-4o | $2.50/MTok | $10/MTok | ~$5* |
| gpt-4o-mini | $0.15/MTok | $0.60/MTok | ~$0.30* |

*Same assumption as Anthropic API above.

**Use case fit:** Coding, data, research, mixed.

**Engine note:** OpenAI API at $5/seat effective is cheaper than ChatGPT Plus ($20) for developers who are primarily using ChatGPT as an API proxy. The engine flags this.

---

## Gemini (Google)

**Source:**
- Consumer: https://one.google.com/about/plans
- Workspace: https://workspace.google.com/intl/en/pricing.html
- API: https://ai.google.dev/pricing

| Tier | Price/seat/month | Notes |
|---|---|---|
| Advanced (consumer) | $20 | Gemini 2.0 Pro, 2TB storage, personal |
| Workspace (business) | $30 | Integrated with Google Workspace apps |
| API (effective) | $2* | Gemini 2.0 Flash, very low per-token cost |

*API effective cost at 1M input + 200K output tokens/month using Gemini 2.0 Flash pricing ($0.10/MTok input, $0.40/MTok output).

**Use case fit:** Writing, research, mixed. Gemini Workspace is compelling for teams already on Google Workspace. API is extremely cheap for high-volume data tasks.

---

## Windsurf (Codeium)

**Source:** https://windsurf.com/pricing

| Tier | Price/seat/month | Notes |
|---|---|---|
| Free | $0 | Limited completions |
| Pro | $15 | Unlimited, all models |
| Teams | $35 | Admin, SSO, usage analytics |

**Use case fit:** Coding only. Windsurf is an IDE; not suitable for non-coding tasks.

**Key comparison:** Windsurf Pro ($15) is the cheapest paid coding tool in the engine — $5/seat cheaper than Cursor Pro ($20) and $4/seat cheaper than Copilot Individual ($10 is individual only; Business is $19). For pure coding on a budget, Windsurf Pro is often the downgrade recommendation.

---

## Pricing verification methodology

1. Prices pulled directly from vendor pricing pages — no third-party aggregators.
2. Each entry in `src/lib/audit/pricing.ts` includes a `sourceUrl` pointing to the live pricing page.
3. The engine's recommendations display this `sourceUrl` — users can verify in one click.
4. Prices should be re-verified quarterly. Anthropic, OpenAI, and Google update API pricing frequently; Cursor and Windsurf less often.
5. Annual vs monthly: all engine comparisons use monthly billing to avoid comparing different billing periods. Annual discounts (typically 10–20%) are noted but not modeled.

---

## Pricing last verified

| Vendor | Last verified | By |
|---|---|---|
| Cursor | 2026-05-08 | Vinayak Koli |
| GitHub Copilot | 2026-05-08 | Vinayak Koli |
| Claude (Anthropic consumer) | 2026-05-08 | Vinayak Koli |
| ChatGPT (OpenAI consumer) | 2026-05-08 | Vinayak Koli |
| Anthropic API | 2026-05-08 | Vinayak Koli |
| OpenAI API | 2026-05-08 | Vinayak Koli |
| Gemini (Google) | 2026-05-08 | Vinayak Koli |
| Windsurf (Codeium) | 2026-05-08 | Vinayak Koli |
