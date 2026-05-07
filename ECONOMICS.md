# ECONOMICS.md

## Unit Economics for Credex

All numbers are estimates with documented assumptions. Approximate numbers > no numbers.

---

## What Is a Converted Lead Worth?

A "converted lead" = a team that purchases AI credits through Credex.

**Assumptions:**
- Average Credex deal: team buys $1,500–$2,000/year in discounted AI credits
- Using midpoint: **$1,750 ACV (Annual Contract Value)**
- Credex gross margin on resold credits: ~25–35% (sourced from typical software reseller economics; exact margin undisclosed)
- Using conservative 25%: **$437.50 gross profit per customer/year**
- Average customer lifespan: 2 years (switching costs are low, but satisfied customers re-order)
- **LTV = $875 per customer**

---

## CAC by Channel

| Channel | Estimated CAC | Basis |
|---|---|---|
| Organic HN / Twitter | ~$0 direct | Time cost only (~3 hrs/post × $50/hr opportunity cost = $150, amortized over 500+ leads = ~$0.30) |
| Newsletter placement | ~$1–3/lead | Typical B2B newsletter CPL at this audience size |
| Community drops (IH, Reddit) | ~$0.50/lead | Time cost amortized over ~200 leads per post |
| Referral (share mechanic) | ~$0.10/lead | Near-zero marginal cost once built |
| Paid social (not Day-1 channel) | $15–40/lead | Industry benchmark for B2B SaaS at this stage |

**Blended organic CAC (first 6 months):** ~$2–5 per audit completed
**Blended organic CAC to customer:** ~$40–80 (assuming 5% audit→customer conversion, see below)

---

## Conversion Funnel

| Stage | Rate | Basis |
|---|---|---|
| Visit → audit started | 35% | Typical free tool conversion; no login friction helps |
| Audit started → audit completed | 55% | Form has ~12 fields; shorter = higher completion |
| Audit completed → email captured | 40% | Post-value gate; comparable to lead-gen tools |
| Email captured → consult booked | 8% | High-intent only (savings > $500/mo); Calendly link |
| Consult booked → credit purchase | 30% | Credex has existing relationships; not cold outreach |

**End-to-end: visit → customer ≈ 0.6%**

For every 1,000 visitors: 350 start, 193 complete, 77 emails, 6 consults booked, 2 customers.

---

## What Makes This Profitable

At $875 LTV and $60 blended CAC-to-customer:
- **LTV:CAC = ~14.6x** — excellent for a B2B tool
- Payback period: < 1 month (credits purchased upfront)

The tool itself costs ~$50–100/month to run at moderate traffic (Supabase free tier + Vercel hobby + Resend free tier + ~$5–10 Anthropic API for summaries). Effectively free.

---

## $1M ARR in 18 Months — What Would Have to Be True

**Target:** $1M ARR = ~571 customers at $1,750 ACV

**Math:**
- Months 1–6: Build distribution. Target 100 customers. Requires ~17k visitors, ~100 emails/month, ~8 customers/month closing.
- Months 7–12: Scale distribution (1 newsletter deal, referral loop running). Target 300 total customers. Requires ~50k visitors/month by month 10.
- Months 13–18: Paid channel profitable. Target 571 total customers.

**What must be true:**
1. At least one high-distribution newsletter placement (Pragmatic Engineer or equivalent) in month 1–2. One placement can drive 2,000–5,000 audits in a week.
2. The referral/share mechanic drives a K-factor > 0.3 (each customer refers 0.3 more via share link).
3. Credex closes ≥30% of booked consultations (requires a good sales motion, not just a great tool).
4. Pricing holds: Credex can sustain 25%+ margin on credits (inventory supply risk).

**The single biggest assumption:** This tool converts *existing Credex conversations* into faster closes. If Credex is already talking to 50 teams/month about credits, and 30% of those use the audit first, that's 15 warmer leads/month without any new marketing — worth ~$2,600/mo gross profit from month 1.

---

## Sensitivity Analysis

| Variable | Base case | Downside | Upside |
|---|---|---|---|
| Email capture rate | 40% | 20% | 60% |
| Consult → purchase | 30% | 15% | 45% |
| Monthly visitors (month 6) | 10,000 | 3,000 | 30,000 |
| Customers by month 18 | 571 | 120 | 1,400 |
| ARR by month 18 | $1M | $210K | $2.45M |

Downside is still a real business. Upside requires one viral moment (HN front page + newsletter). The tool structure (shareable OG result cards) is designed to create that moment.
