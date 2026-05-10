# ECONOMICS.md — Unit Economics

## Business model

StackAudit is a free lead-generation tool for Credex. Revenue comes entirely from Credex sales conversions, not from the audit product itself. This document models the unit economics of the funnel end-to-end.

---

## Cost to run one audit

| Component | Cost per audit | Notes |
|---|---|---|
| Next.js serverless function | ~$0.0001 | Vercel Hobby: 100k free invocations/month |
| Supabase write (1 row) | ~$0.000005 | Well within free tier (500MB storage) |
| Claude Haiku summary | $0.008 | 600 input tokens × $0.80/MTok + 120 output × $4/MTok — only when API key present |
| Resend email | $0.001 | Free tier: 3,000 emails/month |
| Upstash Redis | ~$0.00002 | Free tier: 10k commands/day |
| **Total (with Claude)** | **~$0.009** | ~$9 per 1,000 audits |
| **Total (without Claude)** | **~$0.001** | Templated fallback — near-zero |

At 10,000 audits/month with Claude enabled: ~$90/month infrastructure cost.

---

## Revenue model via Credex

### Assumptions (conservative)

| Metric | Value | Basis |
|---|---|---|
| Monthly audits | 1,000 | Realistic for a new tool post-HN launch |
| Email capture rate | 25% | Form is low-friction, results are high-value |
| Credex CTA shown (savings > $500/mo) | 30% of audits | Based on engine rule: teams spending on 3+ tools commonly exceed threshold |
| CTA → Credex inquiry conversion | 8% | Conservative; user already quantified the pain |
| Credex inquiry → closed deal | 25% | Typical SMB SaaS sales close rate |
| Average Credex ACV | $8,000/year | Midpoint for 10–50 seat team buying $667/month in AI credits |

### Monthly revenue calculation

```
1,000 audits/month
  × 30% shown Credex CTA      = 300 high-intent users
  × 8% inquiry conversion     = 24 Credex inquiries
  × 25% close rate            = 6 new Credex customers/month
  × $8,000 ACV                = $48,000 ARR added/month
```

At steady state (Month 6): **$48,000 ARR added per month** from StackAudit-sourced leads.

### Customer acquisition cost (CAC)

| Cost item | Monthly |
|---|---|
| Infrastructure (10k audits) | $90 |
| SDR (0.5 FTE for LinkedIn outbound) | $2,500 |
| Content / distribution | $500 |
| **Total marketing cost** | **$3,090/month** |

```
CAC = $3,090 / 6 new customers = $515 per Credex customer
LTV = $8,000 ACV × 3 year avg retention = $24,000
LTV:CAC = 46:1
```

**LTV:CAC of 46:1 is exceptional.** SaaS benchmark is 3:1 to 5:1. The reason: StackAudit does the qualification work automatically — Credex salespeople only talk to prospects who have already proven they have AI tool spend waste.

---

## Sensitivity analysis

| Monthly audits | Close rate | New Credex customers/mo | ARR added/mo |
|---|---|---|---|
| 500 | 25% | 3 | $24k |
| 1,000 | 25% | 6 | $48k |
| 5,000 | 25% | 30 | $240k |
| 1,000 | 15% | 3.6 | $29k |
| 1,000 | 40% | 9.6 | $77k |

Even in the pessimistic scenario (500 audits, 15% close rate): **$14k ARR/month** from a tool that costs $90/month to run.

---

## Break-even

StackAudit reaches break-even on its own infrastructure + SDR cost in Month 1 if it closes even 1 Credex deal ($8k ACV > $3,090 monthly cost). Everything after that is margin.

---

## Why "free forever" makes economic sense

The marginal cost of one more audit is ~$0.009. The marginal revenue of one more Credex customer is $8,000. The optimal strategy is to remove every barrier to completing an audit and maximize the top of the funnel — not to charge for the audit itself.

Charging for audits (even $9/month) would reduce conversion by an estimated 80% (typical free-to-paid conversion friction). The math strongly favors free.

---

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Audit completion rate drops below 20% | A/B test landing page copy; reduce form to 3 fields for a "quick audit" mode |
| Credex close rate declines | Better lead qualification via email capture questions ("how many seats?") |
| Infrastructure costs spike (viral traffic) | Vercel autoscaling; Supabase free tier handles 500MB — well above 10k audits |
| Vendors change pricing faster than we update | Source URLs in every recommendation; quarterly pricing refresh in `pricing.ts` |
