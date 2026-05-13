# USER_INTERVIEWS.md — User Research

## Overview

Two interviews conducted May 13, 2026. Participants from personal network. Both are students/interns actively using paid AI tools.

---

## Interview 1 — Yashasvi

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

## Interview 2 — Nishant

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

## Synthesis — What both interviews agree on

1. **Paid plans are often unjustified for solo use.** Both users are on paid plans but don't use them daily enough to justify the cost — the audit surfaces this clearly.

2. **Awareness of alternatives exists but confidence to switch is low.** Users have heard of competing tools but don't know if they're better. The audit gives them a specific, sourced recommendation to act on.

3. **The email/share feature is the most valued for team contexts.** Nishant immediately saw the value of forwarding findings to a manager — the handoff to a decision-maker is the key workflow.

4. **Solo users don't share; team users do.** Yashasvi had no reason to share because she uses the tool individually. Nishant, as an intern at a company, would share with his manager immediately.

---

## Changes made to the product based on interviews

| Interview finding | Change made |
|---|---|
| Source URLs are a trust signal | Every recommendation in the engine includes `sourceUrl` pointing to live vendor pricing page |
| Specificity of savings number matters | Hero savings number is exact (e.g., "$420/mo"), not rounded or estimated |
| Managers need to share findings upward | Share URL at `/r/[shareId]` with OG metadata — easy to paste into a Slack or email |
| Stack accumulates bottom-up | Landing copy reframes: "your stack grew organically — here's what that's costing you" |
