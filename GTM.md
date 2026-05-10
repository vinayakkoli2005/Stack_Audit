# GTM.md — Go-To-Market Strategy

## Product in one sentence

StackAudit tells a software team, in 90 seconds and for free, exactly how much they're overpaying for AI tools and what to do about it — then hands the hottest leads to Credex.

---

## Target customer

**Primary:** Engineering managers and CTOs at seed-to-Series B startups (10–150 employees) who adopted 3–5 AI tools fast, on separate credit cards, and have never audited the overlap.

**Why this segment:**
- Budget authority is concentrated in one or two people — no procurement committee to navigate
- Moved fast during the AI tooling boom of 2023–2025; likely have redundant seat licenses
- Pain is real and immediate: the tools are on the P&L, the CFO is starting to ask questions
- Small enough that a free self-serve audit replaces what a consultant would charge $5–10k for

**Secondary (Month 3+):** Finance and ops leads at 150–500 person companies where the AI stack has grown across departments without central visibility. Longer sales cycle, but the audit report becomes a procurement artifact that travels up the org.

---

## Channels (ranked by CAC and time-to-first-user)

### 1. Organic / SEO — zero cost, Day 1
Target long-tail queries with purchase intent:
- "is cursor worth it for small teams"
- "chatgpt team vs anthropic api cost comparison"
- "github copilot vs cursor which is cheaper"
- "ai tool stack audit"

The audit tool itself is the content. Every share page at `/r/[shareId]` is publicly indexed with real savings numbers in the OG title ("I found $640/mo in savings"). Each shared result is a backlink and a social proof impression.

### 2. Developer communities — Week 1–2, sweat equity
- Show HN post: "I built a free tool that audits your team's AI tool spend in 90 seconds"
- Indie Hackers: post the honest builder story with real numbers
- r/SaaS and r/ExperiencedDevs: frame as a cost-optimization resource

The story IS the product demo. Even 50 HN upvotes drives thousands of audits from the exact target audience.

### 3. Credex existing customer base — Week 2, highest conversion
Credex already has relationships with companies buying AI credits. Email existing customers:
> "We built a free audit tool — run it in 90 seconds and see where you could save more."

These users already trust Credex and are already spending on AI tools. Expected conversion to Credex inquiry: 15–25% (vs. ~2% for cold traffic).

### 4. LinkedIn outbound — Month 2
Sequence targeting EMs and CTOs at 50–200 person startups:
1. Connection with a relevant benchmark ("teams your size typically spend $X/seat on Cursor")
2. Personalized note linking to the tool
3. Follow-up after they audit with specific recommendations

Scalable with 1 SDR at ~$3k/month loaded cost.

### 5. Ecosystem partnerships — Month 3+
Windsurf, Cursor, and GitHub Copilot all have affiliate/partner programs. Pitch:
> "We send you warm, pre-qualified teams who are actively evaluating coding tools."

Revenue share on seat upgrades creates a natural distribution flywheel — the tools benefit from StackAudit recommending them.

---

## Funnel

```
Organic / referral / Credex email
        ↓
  Landing page → audit form (no signup required)
        ↓
  Audit completes in <2s → results page
        ↓
  Email capture ("send me these results")       ← lead collected
        ↓
  Credex CTA (shown if savings > $500/mo)       ← high-intent lead
        ↓
  Credex sales conversation
```

**Key insight:** The audit is the top-of-funnel AND the qualification step. A user who finds $600/mo in savings and sees the Credex CTA has already sold themselves on the problem. The sales conversation starts from "I know I have waste" — not "do I have waste?"

---

## Launch sequencing

| Week | Action | Goal |
|------|--------|------|
| 1 | Show HN + Indie Hackers post | 100 audits completed |
| 1 | Email Credex existing customers | 20 warm Credex leads |
| 2 | Share 3 viral audit results on Twitter/LinkedIn | 500 total audits |
| 3 | LinkedIn outbound to 200 EMs | 10 booked Credex calls |
| 4 | "State of AI Tool Spend" report from anonymized audit data | Press coverage + SEO |
| 6 | First ecosystem partnership conversation | Distribution deal signed |

---

## Competitive landscape

| Alternative | Weakness vs. StackAudit |
|---|---|
| Torii / Blissfully (SaaS management) | Enterprise-only, $1k+/month, 2-week onboarding |
| Cledara / Spendflo (SaaS spend) | Not AI-specific, no use-case fit logic |
| Manual spreadsheet | 3–5 hours of EM time; StackAudit does it in 90 seconds |
| Asking vendors | Vendors don't tell you to buy less |

No direct competitor does instant, free, personalized AI tool audits. The market is open.

---

## Pricing strategy for StackAudit

**Free forever. No account required.**

Every friction point between a visitor and completing the audit reduces lead quality. No signup = higher completion rate = more Credex leads. The audit compute cost is <$0.01/audit (no Claude key needed for the deterministic engine), making "free forever" economically trivial at any realistic traffic volume.
