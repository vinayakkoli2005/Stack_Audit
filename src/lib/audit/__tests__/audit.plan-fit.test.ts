import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("Rule 1 — plan-fit", () => {
  it("recommends downgrading Cursor Business to Pro for 2 seats", () => {
    const result = run({
      tools: [{ vendor: "cursor", tier: "business", monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      primaryUseCase: "coding",
    });

    expect(result.recommendations).toHaveLength(1);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.toTier).toBe("pro");
    // Cursor Pro = $20/seat × 2 = $40. Savings = $80 - $40 = $40
    expect(rec.monthlySavings).toBe(40);
    expect(rec.annualSavings).toBe(480);
    expect(result.totalMonthlySavings).toBe(40);
  });

  it("recommends downgrading Cursor Pro to free Hobby tier when spend > $0", () => {
    // Cursor Hobby is free — plan-fit correctly surfaces this as a savings opportunity.
    // The user may have a reason to stay on Pro (unlimited usage), but the engine
    // surfaces the option; the reasonDetailed explains the trade-off.
    const result = run({
      tools: [{ vendor: "cursor", tier: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      primaryUseCase: "coding",
    });

    const downgradeRec = result.recommendations.find(
      (r) => r.action === "downgrade" && r.vendor === "cursor"
    );
    expect(downgradeRec).toBeDefined();
    expect(downgradeRec?.toTier).toBe("hobby");
    expect(downgradeRec?.monthlySavings).toBe(20);
  });

  it("recommends downgrading Copilot Enterprise to Business for 3 seats", () => {
    const result = run({
      tools: [{ vendor: "copilot", tier: "enterprise", monthlySpend: 117, seats: 3 }],
      teamSize: 3,
      primaryUseCase: "coding",
    });

    const rec = result.recommendations.find((r) => r.action === "downgrade");
    expect(rec).toBeDefined();
    expect(rec?.toTier).toBe("business");
    // Copilot Business = $19/seat × 3 = $57. Savings = $117 - $57 = $60
    expect(rec?.monthlySavings).toBe(60);
  });
});
