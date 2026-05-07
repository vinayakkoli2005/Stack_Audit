# TESTS.md

## How to run all tests

```bash
npm run test          # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

## Audit Engine Tests (minimum 5 required — target 8)

All tests live in `src/lib/audit/__tests__/`.

| # | File | What it covers |
|---|---|---|
| 1 | `audit.plan-fit.test.ts` | Cursor Business at 2 seats → recommends downgrade to Pro (saves $40/mo) |
| 2 | `audit.redundancy.test.ts` | Team using Cursor + Copilot + Claude for coding → flags redundant overlap |
| 3 | `audit.use-case.test.ts` | Writing-only team on Cursor Pro → recommends Claude Pro instead |
| 4 | `audit.honesty.test.ts` | Already-optimal stack returns 0 savings and no manufactured recommendations |
| 5 | `audit.credex-threshold.test.ts` | Credex CTA fires only when monthly_savings > $500, not below |
| 6 | `audit.api-vs-seat.test.ts` | API spend < equivalent seat cost → recommends dropping subscription |
| 7 | `audit.totals.test.ts` | Monthly and annual totals sum correctly across all recommendations |
| 8 | `audit.edge-empty.test.ts` | Empty tool list input returns valid empty result without throwing |

## Additional Tests

| File | What it covers |
|---|---|
| `src/lib/audit/__tests__/audit.share-id.test.ts` | Share ID generation produces unique nanoid strings |

## CI

Tests run automatically on every push to `main` via `.github/workflows/ci.yml`.
See the [Actions tab](https://github.com/vinayakkoli2005/Stack_Audit/actions) for the latest run status.
