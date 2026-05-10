# TESTS.md — Test Coverage and Strategy

## Summary

| Metric | Value |
|---|---|
| Total test cases | 24 |
| Test files | 8 |
| Pass rate | 100% (24/24) |
| Test framework | Vitest |
| Coverage approach | Rule-by-rule unit tests on the pure audit engine |

---

## Test files and what they cover

### `src/lib/audit/__tests__/audit.use-case.test.ts`
**Tests:** Use-case fit rule — wrong tool category recommendations

| Test | Description |
|---|---|
| ChatGPT for pure coding team | Should recommend switching to Cursor/Copilot |
| Cursor for writing-only team | Should recommend switching to Claude/ChatGPT |
| Claude for mixed use case | Should be kept (Claude fits mixed) |
| Gemini for coding | Should recommend Cursor/Copilot as better fit |

### `src/lib/audit/__tests__/audit.api-vs-seat.test.ts`
**Tests:** API vs subscription rule — when direct API access is cheaper

| Test | Description |
|---|---|
| Developer on ChatGPT Plus using it as API | Recommend OpenAI API ($5 effective vs $20 Plus) |
| Developer on Claude Pro using it programmatically | Recommend Anthropic API ($6 effective vs $20 Pro) |
| Non-developer on Claude Pro | No API recommendation (not a coding use case) |

### `src/lib/audit/__tests__/audit.plan-fit.test.ts`
**Tests:** Plan fit rule — over-paying for tier capacity

| Test | Description |
|---|---|
| Solo founder on ChatGPT Team (min 2 seats) | Recommend ChatGPT Plus (saves $10/mo) |
| Small team on Cursor Business (1–3 seats) | Recommend Cursor Pro (saves $20/seat/mo) |
| 10-person team on Claude Pro | Recommend Claude Team (better per-seat + admin) |
| Team appropriately on Cursor Pro | No recommendation (already optimal) |

### `src/lib/audit/__tests__/audit.redundancy.test.ts`
**Tests:** Redundancy detection — two tools doing the same job

| Test | Description |
|---|---|
| Cursor Pro + GitHub Copilot Business | Recommend consolidating to one coding tool |
| Cursor Pro + Windsurf Pro | Same — two IDE coding assistants, pick one |
| Claude Pro + ChatGPT Team for mixed use | Flag as likely redundant writing tools |
| Copilot + Claude (different use cases) | No redundancy (coding vs writing) |

### `src/lib/audit/__tests__/audit.honesty.test.ts`
**Tests:** Honest savings calculation — never overstate

| Test | Description |
|---|---|
| Downgrade recommendation savings = current - recommended | Exact math check |
| Switch vendor savings accounts for new tool cost | Net savings, not gross |
| Consolidation savings = removed tool cost only | Don't double-count |

### `src/lib/audit/__tests__/audit.credex-threshold.test.ts`
**Tests:** Credex CTA threshold logic

| Test | Description |
|---|---|
| Total savings = $600/mo | showCredexCta = true |
| Total savings = $499/mo | showCredexCta = false |
| Total savings = $500/mo (boundary) | showCredexCta = true (≥ threshold) |
| isAlreadyOptimal = true | showCredexCta = false regardless of any savings |

### `src/lib/audit/__tests__/audit.totals.test.ts`
**Tests:** Aggregate calculation accuracy

| Test | Description |
|---|---|
| totalMonthlySavings = sum of all rec savings | Exact arithmetic |
| totalAnnualSavings = totalMonthlySavings × 12 | No rounding errors |
| isAlreadyOptimal = true when savings < $100 | Threshold correctly applied |

### `src/lib/audit/__tests__/audit.edge-empty.test.ts`
**Tests:** Edge cases and empty inputs

| Test | Description |
|---|---|
| Empty tools array | Returns isAlreadyOptimal = true, no crash |
| Single tool already on free tier | No recommendations |
| Team size = 1 | Rules still apply correctly |
| Very large team (100 seats) | Savings scale correctly |

---

## Test philosophy

### Why unit tests on the engine only (no integration tests)

The audit engine is a pure function: `run(AuditInput) → AuditResult`. It has no side effects, no external dependencies, no async behavior. This makes it the ideal unit test target — fast, deterministic, exhaustive.

API routes (`/api/audit`, `/api/leads`) are tested manually and rely on external services (Supabase, Resend) that would require test doubles or test environments to unit test. Given the 7-day timeline, the tradeoff is: **test the logic exhaustively, test the plumbing manually**.

### Why test each rule in isolation

Rule order determines which recommendation wins when multiple rules fire for the same tool. Testing rules in isolation catches "rule swallowing" — where a lower-priority rule fires before a higher-priority one and produces a suboptimal recommendation. This exact bug was found and fixed during Day 2 development.

### Regression value

All 24 tests guard against:
- Pricing data changes breaking recommendation logic
- Rule execution order changes producing wrong winners
- Calculation errors in savings math
- Edge cases (empty input, boundary thresholds) causing crashes

---

## Running tests

```bash
npx vitest run          # single pass
npx vitest              # watch mode
npx vitest run --coverage  # with coverage report
```

Expected output:
```
Test Files  8 passed (8)
Tests      24 passed (24)
```
