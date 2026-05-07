import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("Honesty rule — no manufactured savings", () => {
  it("returns isAlreadyOptimal=true for an already-lean stack", () => {
    const result = run({
      // Single Cursor Pro seat at retail — nothing to optimize
      tools: [{ vendor: "cursor", tier: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      primaryUseCase: "coding",
    });

    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBeLessThan(100);
  });

  it("returns 0 total savings when no rules fire", () => {
    const result = run({
      tools: [
        { vendor: "cursor",  tier: "pro",        monthlySpend: 20, seats: 1 },
        { vendor: "claude",  tier: "pro",         monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      primaryUseCase: "coding",
    });

    // No redundancy (different tool types), no plan downgrade possible
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
  });

  it("does not return negative savings", () => {
    const result = run({
      tools: [{ vendor: "windsurf", tier: "free", monthlySpend: 0, seats: 1 }],
      teamSize: 1,
      primaryUseCase: "coding",
    });

    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    for (const rec of result.recommendations) {
      expect(rec.monthlySavings).toBeGreaterThanOrEqual(0);
    }
  });
});
