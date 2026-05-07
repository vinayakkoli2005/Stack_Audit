import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("Rule 2 — use-case fit", () => {
  it("recommends switching ChatGPT Team to Cursor Pro for a coding team", () => {
    const result = run({
      tools: [{ vendor: "chatgpt", tier: "team", monthlySpend: 150, seats: 5 }],
      teamSize: 5,
      primaryUseCase: "coding",
    });

    const switchRec = result.recommendations.find(
      (r) => r.action === "switch_vendor"
    );
    expect(switchRec).toBeDefined();
    expect(switchRec?.toVendor).toBe("cursor");
    expect(switchRec?.toTier).toBe("pro");
    // Cursor Pro = $20 × 5 = $100. Savings = $150 - $100 = $50
    expect(switchRec?.monthlySavings).toBe(50);
  });

  it("does not fire switch rec when costs are equal (Cursor Pro = Claude Pro at same seats)", () => {
    // Cursor Pro = $20/seat × 5 = $100. Claude Pro = $20/seat × 5 = $100.
    // Savings = $0 < MIN_SAVINGS_THRESHOLD — no switch recommendation fired.
    const result = run({
      tools: [{ vendor: "cursor", tier: "pro", monthlySpend: 100, seats: 5 }],
      teamSize: 5,
      primaryUseCase: "writing",
    });

    const switchRec = result.recommendations.find(
      (r) => r.action === "switch_vendor"
    );
    expect(switchRec).toBeUndefined();
  });

  it("fires switch rec when coding tool is significantly more expensive than Claude Pro", () => {
    // Cursor Business = $40/seat × 5 = $200. Claude Pro = $20/seat × 5 = $100. Savings = $100.
    const result = run({
      tools: [{ vendor: "cursor", tier: "business", monthlySpend: 200, seats: 5 }],
      teamSize: 5,
      primaryUseCase: "writing",
    });

    const switchRec = result.recommendations.find(
      (r) => r.action === "switch_vendor"
    );
    expect(switchRec).toBeDefined();
    expect(switchRec?.toVendor).toBe("claude");
    expect(switchRec?.monthlySavings).toBe(100);
  });

  it("does not recommend switch when coding tool is correct for coding team", () => {
    const result = run({
      tools: [{ vendor: "cursor", tier: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      primaryUseCase: "coding",
    });

    const switchRecs = result.recommendations.filter(
      (r) => r.action === "switch_vendor"
    );
    expect(switchRecs).toHaveLength(0);
  });
});
