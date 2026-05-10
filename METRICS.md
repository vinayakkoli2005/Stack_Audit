# METRICS.md — Success Metrics and KPIs

## North Star Metric

**Credex-qualified leads generated per week** — defined as a completed audit where total monthly savings > $500/mo AND the user provided their email.

This is the metric that directly ties StackAudit's usage to Credex revenue. Everything else is either an input to this number or a health check.

---

## Funnel metrics (ordered by stage)

| Stage | Metric | Target (Month 1) | Target (Month 3) |
|---|---|---|---|
| Awareness | Unique visitors to landing page | 500/week | 2,000/week |
| Activation | Audit completion rate (visitor → results) | 40% | 55% |
| Value | Median savings found per audit | $280/mo | $280/mo (stable) |
| Capture | Email capture rate (of completions) | 20% | 30% |
| Qualify | % of email captures with savings > $500/mo | 25% | 25% (stable) |
| Convert | Credex inquiry rate (of qualified leads) | 8% | 10% |
| Revenue | New Credex ARR attributed to StackAudit | $24k/mo | $96k/mo |

---

## Product health metrics

### Audit quality
- **Mean savings per audit** — proxy for whether the engine is finding real opportunities (should be $150–$400 for a typical 3-tool team)
- **% audits returning isAlreadyOptimal** — if this is >60%, the engine rules may be too lenient; if <10%, they may be too aggressive
- **Top recommendation action distribution** — expect ~40% downgrade, ~30% switch_vendor, ~20% consolidate, ~10% keep. Major deviation signals a pricing data issue.

### Engagement
- **Share link clicked / audit completed** — target >15%. Low share rate means the results aren't surprising enough to share.
- **Return visits to share page** — proxy for how often managers are sending the link to their CEO/CFO

### Performance
- **Audit API p95 latency** — target <500ms (engine is synchronous; this should be easy)
- **Summary API p95 latency** — target <3s (Claude Haiku; non-blocking so less critical)
- **Email delivery rate** — target >98% (Resend SLA)

---

## Acquisition metrics

| Channel | Metric | Target |
|---|---|---|
| Organic / SEO | Weekly organic sessions | 200 by Month 2 |
| HN / community | Audits completed in first 48h post-launch | >50 |
| Credex email blast | Email open rate | >35% (warm list) |
| Share mechanic | % of audits that generate a share link click | >15% |
| LinkedIn outbound | Reply rate | >8% |

---

## Quality guardrails (things to watch for problems)

| Signal | Threshold | Response |
|---|---|---|
| Audit completion rate drops | <30% | Check for JS errors, form UX issues |
| Email capture rate drops | <15% | A/B test email form placement/copy |
| Credex CTA click rate drops | <5% of eligible users | Review CTA copy and threshold logic |
| API error rate rises | >1% | Page on-call; check Supabase / rate limiter |
| Savings number complaints in email/Slack | Any | Audit the pricing data; recheck sourceUrls |

---

## Weekly review cadence (once live)

Every Monday, review:
1. **Audits completed last 7 days** — is the funnel growing?
2. **Email captures and Credex CTA shows** — is lead quality stable?
3. **Any new pricing changes from vendors?** — Cursor, OpenAI, Anthropic update pricing quarterly; we need to catch this before it invalidates recommendations

---

## Definition of success at Day 7 (submission)

For this internship project specifically, success means:
- [ ] The audit engine runs end-to-end without errors in the live app
- [ ] At least 3 real audits completed by real people (not test data)
- [ ] At least 1 Credex-qualified lead (savings > $500/mo + email captured) in Supabase
- [ ] All 24 engine tests passing
- [ ] Lighthouse Performance ≥ 85, Accessibility ≥ 90
- [ ] All required markdown files present with real content (not stubs)
