import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("Rule 3 — API vs subscription", () => {
  it("flags Claude Team with fewer than 5 seats as overspend", () => {
    // Claude Team min 5 seats. 2 users paying for 5-seat minimum = paying for 3 unused
    const result = run({
      tools: [{ vendor: "claude", tier: "team", monthlySpend: 150, seats: 2 }],
      teamSize: 2,
      primaryUseCase: "mixed",
    });

    const rec = result.recommendations.find(
      (r) => r.vendor === "claude" && r.action === "downgrade"
    );
    expect(rec).toBeDefined();
    expect(rec?.toTier).toBe("pro");
    // Claude Pro × 2 = $40. Savings = $150 - $40 = $110
    expect(rec?.monthlySavings).toBe(110);
  });

  it("plan-fit fires for Claude Team at 5 seats because Pro is cheaper per-seat", () => {
    // Claude Team = $30/seat × 5 = $150. Claude Pro = $20/seat × 5 = $100.
    // Plan-fit correctly surfaces this: Team adds collaboration features,
    // but if the team doesn't need them, Pro saves $50/mo.
    // This is a "medium confidence" finding — the reasonDetailed explains the trade-off.
    const result = run({
      tools: [{ vendor: "claude", tier: "team", monthlySpend: 150, seats: 5 }],
      teamSize: 5,
      primaryUseCase: "mixed",
    });

    const rec = result.recommendations.find(
      (r) => r.vendor === "claude" && r.currentTier === "team"
    );
    expect(rec).toBeDefined();
    expect(rec?.toTier).toBe("pro");
    expect(rec?.monthlySavings).toBe(50);
  });
});
