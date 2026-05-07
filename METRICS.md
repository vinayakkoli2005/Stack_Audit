# METRICS.md

## North Star Metric

**Weekly high-intent audits completed**

Definition: an audit where the user entered ≥3 tools, reached the results page, and spent ≥30 seconds on it.

**Why this metric:**
This is a B2B lead-gen tool that most users will touch once per quarter, not daily. DAU is the wrong shape — it would reward re-runs, which are noise. "High-intent audit completed" directly predicts both (a) a qualified lead for Credex and (b) a product experience good enough to generate a share. It's the moment value was delivered. Everything upstream is funnel health; everything downstream (email capture, consult booking) is conversion optimization. The North Star lives at value delivery.

---

## 3 Input Metrics That Drive the North Star

### 1. Form completion rate
`audits_completed / audits_started`

Target: ≥50%. If this drops below 35%, the form is too long or confusing. This is the most actionable metric — a single field removal or reorder can move it 10–15 points.

### 2. Average tools entered per audit
`sum(tools_per_audit) / audits_completed`

Target: ≥3.5 tools/audit. If users are only entering 1–2 tools, either they're not the right persona, or the form doesn't make it obvious they should enter all their tools. This also affects recommendation quality — a 1-tool audit rarely surfaces meaningful savings.

### 3. Landing page → audit start rate
`audits_started / landing_page_visits`

Target: ≥30%. If this is low, the headline/CTA isn't landing with the right persona. This metric detects distribution mismatch — we're reaching people who aren't the target user, or the value prop isn't immediately clear.

---

## What to Instrument First

In priority order (all tracked in the `audit_events` Supabase table from Day 1):

1. `audit_started` — form first interaction (captures drop-off before completion)
2. `audit_completed` — results page rendered with real data
3. `email_captured` — lead form submitted
4. `share_clicked` — share button clicked (viral loop signal)
5. `consult_clicked` — Credex CTA clicked (high-value conversion)
6. `pdf_downloaded` — bonus feature engagement
7. `landing_page_view` — with referrer to track channel performance

These 7 events give a complete funnel view with no third-party analytics tool required (Supabase query is sufficient at early stage).

---

## Pivot Trigger

**If form completion rate < 25% after 500 audit starts AND average tools entered < 2.5:**

The form is too friction-heavy OR the wrong persona is landing. Action: cut the tool list to 5 tools (most common), remove the "primary use case" field, re-test. If completion rate doesn't recover to ≥35% within the next 200 starts, consider a simpler "single tool benchmark" mode as the primary flow.

**If email capture rate < 20% after 200 completed audits:**

The audit results aren't delivering enough perceived value to justify an email. Action: add more specificity to recommendations (show the math inline), add social proof above the email gate, test removing the gate entirely and replacing with a passive newsletter signup.

**If share rate < 5% after 100 completed audits:**

The share card design isn't compelling. Action: redesign the OG image to show the savings number more prominently (large font, brand color), A/B test the share button copy.
