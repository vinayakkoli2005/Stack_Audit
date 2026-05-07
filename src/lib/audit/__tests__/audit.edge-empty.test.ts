import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("AuditEngine — edge cases", () => {
  it("returns empty recommendations for an empty tool list", () => {
    const result = run({
      tools: [],
      teamSize: 5,
      primaryUseCase: "coding",
    });
    expect(result.recommendations).toHaveLength(0);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.showCredexCta).toBe(false);
  });

  it("does not throw for unknown vendor/tier combinations", () => {
    expect(() =>
      run({
        // @ts-expect-error intentional unknown vendor for edge case test
        tools: [{ vendor: "unknown-tool", tier: "enterprise", monthlySpend: 500, seats: 10 }],
        teamSize: 10,
        primaryUseCase: "mixed",
      })
    ).not.toThrow();
  });

  it("returns a valid ISO timestamp in createdAt", () => {
    const result = run({ tools: [], teamSize: 1, primaryUseCase: "coding" });
    expect(() => new Date(result.createdAt)).not.toThrow();
    expect(new Date(result.createdAt).getTime()).toBeGreaterThan(0);
  });
});
