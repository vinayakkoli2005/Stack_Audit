import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("Totals calculation", () => {
  it("annual savings = monthly savings × 12", () => {
    const result = run({
      tools: [{ vendor: "cursor", tier: "business", monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      primaryUseCase: "coding",
    });

    expect(result.totalAnnualSavings).toBe(
      Math.round(result.totalMonthlySavings * 12 * 100) / 100
    );
  });

  it("total monthly savings = sum of all recommendation savings", () => {
    const result = run({
      tools: [
        { vendor: "cursor",  tier: "business", monthlySpend: 80,  seats: 2 },
        { vendor: "copilot", tier: "business", monthlySpend: 38,  seats: 2 },
      ],
      teamSize: 2,
      primaryUseCase: "coding",
    });

    const sumFromRecs = result.recommendations.reduce(
      (sum, r) => sum + r.monthlySavings,
      0
    );
    expect(result.totalMonthlySavings).toBeCloseTo(sumFromRecs, 2);
  });

  it("returns zero totals for empty tool list", () => {
    const result = run({
      tools: [],
      teamSize: 5,
      primaryUseCase: "coding",
    });

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
  });
});
