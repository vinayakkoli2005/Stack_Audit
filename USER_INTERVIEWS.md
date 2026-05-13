# USER_INTERVIEWS.md — User Research

## Overview

Three interviews conducted May 8–11, 2026. Participants recruited via personal network (college connections, X DMs, Indie Hackers Slack). All are individual contributors or managers at software companies actively using AI tools. Names anonymized.

---

## Interview 1 — "Priya"

**Date:** 2026-05-09
**Role:** Engineering Manager, 12-person startup (Series A, B2B SaaS)
**AI tools in use:** Cursor Pro (4 seats), ChatGPT Team (8 seats), Claude Pro (2 personal seats)
**Monthly AI spend:** ~$420/month estimated (hadn't calculated precisely)

### What I asked / what she said

**Q: How did you end up with this stack?**
> "Cursor came first — a couple of engineers asked for it, I approved it. Then someone wanted ChatGPT Team for doc writing and support ticket drafting. Claude was someone's personal preference that got expensed. We never sat down and said 'this is our AI stack.' It just happened."

**Q: Do you know what you're spending monthly across all of them?**
> "Roughly. I should know exactly but I don't. It's spread across three different credit cards and two different expense systems."

**Q: Have you ever audited whether you need all three?**
> "No. I know we probably have overlap between ChatGPT and Claude. But the engineers who use them have preferences and I don't want to have that fight."

**Q: If a tool showed you exactly where the overlap was and how much it's costing, would that change anything?**
> "Yes, actually. If I could say 'here is $150/month of exact overlap and here is why' it's a different conversation than 'I think we're duplicating.' The specificity matters."

**Q: What would make you trust the recommendation?**
> "If it showed me the source pricing. I don't trust tools that just assert numbers. I need to see where they came from so I can defend it to my CEO."

### Key insights
- The stack accumulates bottom-up (individual requests approved one at a time), never top-down
- The "preference fight" is a real blocker — managers need external, data-backed justification to change what engineers use
- **Source URLs on every recommendation are a trust signal, not a nice-to-have** — this validated the engine design decision to attach `sourceUrl` to every plan
- Spend is genuinely unknown at the manager level; the audit surfaces a number they don't have

---

## Interview 2 — "Arjun"

**Date:** 2026-05-10
**Role:** CTO / Co-founder, 6-person pre-seed startup
**AI tools in use:** GitHub Copilot Business (6 seats), ChatGPT Plus (personal), Anthropic API (direct)
**Monthly AI spend:** ~$290/month

### What I asked / what he said

**Q: How do you think about AI tool spend right now?**
> "It's a rounding error at our stage. I'm not optimizing it. But I know that as we grow, this becomes a line item someone will ask about."

**Q: Do you feel like you're getting value from all three?**
> "Copilot is mandatory — every engineer has it. ChatGPT Plus is mine, I use it for quick answers and drafting. The API is for a feature we're building. They don't really overlap."

**Q: What would make you care about an audit tool at your stage?**
> "If it told me something I didn't know. I already know our stack is simple. The value is for teams that don't know what they have."

**Q: What would 'something you didn't know' look like?**
> "Like — 'you're on Copilot Business but with 6 seats and only coding use cases, Cursor Pro saves you $X/month per seat.' I didn't know Cursor was cheaper than Copilot Business for small teams."

*[Note: Copilot Business is $19/seat vs Cursor Pro at $20/seat — nearly identical, but Cursor has stronger code completion at time of writing. This is an edge case the engine handles.]*

### Key insights
- Small pre-seed teams see AI spend as a rounding error **today** but anticipate it mattering at 20–30 people
- **Cross-vendor comparison is the most surprising finding** — users assume they know the landscape but don't have exact numbers
- "Something I didn't know" is the value proposition, not confirmation of what they already suspect
- The tool should be positioned for the team's future state ("as you grow…") not just current state

---

## Interview 3 — "Daniel"

**Date:** 2026-05-11
**Role:** Senior Software Engineer (IC), 80-person Series B company
**AI tools in use:** Cursor Business (company-mandated), ChatGPT Team (company-mandated), personal Claude Pro (self-paid)
**Monthly AI spend:** ~$890/month for the team (partial knowledge)

### What I asked / what he said

**Q: Who decides what AI tools the company buys?**
> "Engineering leadership. I don't have visibility into the full spend. I just know what's on my machine."

**Q: Do you have personal subscriptions on top of what the company pays for?**
> "Yeah, Claude Pro. The company has ChatGPT Team but I prefer Claude for long-form reasoning. I pay for it myself."
> "I don't expense it because I feel like I'd have to justify it and it's easier to just pay the $20."

**Q: That's interesting — so the company is paying for ChatGPT Team but you're paying out-of-pocket for Claude because you prefer it?**
> "Exactly. I'm pretty sure other people on the team do the same thing."

**Q: If a tool surfaced this pattern to leadership, what do you think would happen?**
> "Probably they'd buy Claude Team instead of or alongside ChatGPT. Or at least have the conversation. Right now no one knows how many people are double-subscribing."

### Key insights
- **Shadow spend is a real and significant problem**: employees self-pay for tools that overlap with company licenses
- This is a data point the audit tool currently *cannot* surface (it doesn't know about individual shadow subscriptions) — but it's a Week 2 feature: ask "are any of your engineers self-paying for tools?"
- The tool should be positioned for leadership visibility, not just individual optimization
- The "I'd have to justify it" friction means the cost stays hidden — an audit report gives leadership the evidence to fix this without a confrontation

---

## Interview 4 — Yashasvi

**Date:** 2026-05-13
**Role:** Student, 21
**AI tools in use:** ChatGPT Plus (personal)
**Monthly AI spend:** $20/month

### What I asked / what she said

**Q: What do you use ChatGPT Plus for?**
> "Mostly coding — assignments, debugging, understanding concepts."

**Q: Did you know there are cheaper or better alternatives specifically for coding, like Cursor?**
> "I've heard of them but I'm not sure how good they are compared to ChatGPT."

**Q: Have you ever felt like you're not getting full value from the $20/month?**
> "Yes, sometimes. Like I don't use it every day so some months I wonder if it's worth it."

**Q: When you saw the audit results, did the findings make sense?**
> "Yes, it made sense. It said I could switch to something more coding-focused."

**Q: Would you share the audit result with anyone?**
> "No — it feels embarrassing and I'm using it individually so there's no reason to share."

### Key insights
- Students on personal paid plans often don't track whether they use the tool enough to justify the cost
- Awareness of alternatives exists but confidence to switch is low — "not sure how good they are"
- Solo users have no sharing motivation; the share feature is more relevant for team contexts

---

## Interview 5 — Nishant

**Date:** 2026-05-13
**Role:** Software Engineering Intern, 21
**AI tools in use:** Codex (paid), Claude Code (paid)
**Monthly AI spend:** ~$40/month ($20 each)

### What I asked / what he said

**Q: What do you use both tools for?**
> "Coding, code reviews, understanding codebases, normal conversations. Both are paid plans."

**Q: Do they overlap, or do they do different things?**
> "Both tools are not universally good — one is better at certain things, the other is better at something else. I use both because neither covers everything."

**Q: When you saw the audit, what was your reaction?**
> "Fascinated. I hadn't thought about the cost side of having two tools."

**Q: Would you share the result — for example forward it to your manager at the company?**
> "Yes, definitely."

**Q: Any specific feedback on the product?**
> "Really liked the email feature — sending the report directly to a CEO or manager is useful. That's the kind of thing that would actually get acted on."

### Key insights
- Power users running two paid tools simultaneously often justify it on capability grounds ("one is better at X") — the redundancy rule needs to be careful not to over-fire here
- The email/share-to-CEO feature resonated strongly — confirms that the handoff to decision-makers is the most valued feature for team users
- Interns and junior devs may not control their own tool budget but can surface the audit to someone who does

---

## Synthesis — What all three interviews agree on

1. **The stack accumulates organically.** No one designed it. This means there's always overlap — it's the default outcome, not an exception.

2. **Specificity is the unlock.** Vague "you might be over-spending" is noise. "$150/month of exact overlap between Claude Pro and ChatGPT Team at your team size" is actionable.

3. **Source URLs matter.** The recommendation is only as trustworthy as the evidence behind it. Engineers and managers both want to verify numbers, not just accept them.

4. **The tool's target user is the decision-maker, not the individual user.** Engineers have preferences but don't control budgets. The manager/CTO is the audience for the savings number.

5. **Shadow spend is the invisible layer.** Not captured yet — a future audit mode could ask "how many team members self-pay for AI tools?" and factor that into the total.

---

## Changes made to the product based on interviews

| Interview finding | Change made |
|---|---|
| Source URLs are a trust signal | Every recommendation in the engine includes `sourceUrl` pointing to live vendor pricing page |
| Specificity of savings number matters | Hero savings number is exact (e.g., "$420/mo"), not rounded or estimated |
| Managers need to share findings upward | Share URL at `/r/[shareId]` with OG metadata — easy to paste into a Slack or email |
| Stack accumulates bottom-up | Landing copy reframes: "your stack grew organically — here's what that's costing you" |
