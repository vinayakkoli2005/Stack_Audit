import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("Credex CTA threshold rule", () => {
  it("shows Credex CTA when monthly savings exceed $500", () => {
    // 3 redundant coding tools for 10 people — large savings
    const result = run({
      tools: [
        { vendor: "cursor",   tier: "business", monthlySpend: 400,  seats: 10 },
        { vendor: "copilot",  tier: "business", monthlySpend: 190,  seats: 10 },
        { vendor: "windsurf", tier: "teams",    monthlySpend: 350,  seats: 10 },
      ],
      teamSize: 10,
      primaryUseCase: "coding",
    });

    expect(result.totalMonthlySavings).toBeGreaterThan(500);
    expect(result.showCredexCta).toBe(true);
  });

  it("does not show Credex CTA when savings are below $500", () => {
    const result = run({
      tools: [{ vendor: "cursor", tier: "business", monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      primaryUseCase: "coding",
    });

    // Savings = $40/mo — well below threshold
    expect(result.totalMonthlySavings).toBeLessThanOrEqual(500);
    expect(result.showCredexCta).toBe(false);
  });

  it("shows Credex CTA exactly at the boundary (savings = $501)", () => {
    // Cursor Business × 13 seats = $520/mo. Pro × 13 = $260. Savings = $260
    // Add Copilot Business × 13 = $247. Savings = $247+$260 = $507 > $500
    const result = run({
      tools: [
        { vendor: "cursor",  tier: "business", monthlySpend: 520, seats: 13 },
        { vendor: "copilot", tier: "business", monthlySpend: 247, seats: 13 },
      ],
      teamSize: 13,
      primaryUseCase: "coding",
    });

    expect(result.showCredexCta).toBe(result.totalMonthlySavings > 500);
  });
});
