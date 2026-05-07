import { describe, it, expect } from "vitest";
import { run } from "../engine";

describe("Rule 4 — redundancy", () => {
  it("flags Cursor + Copilot as redundant for a coding team", () => {
    const result = run({
      tools: [
        { vendor: "cursor",  tier: "pro",      monthlySpend: 100, seats: 5 },
        { vendor: "copilot", tier: "business", monthlySpend: 95,  seats: 5 },
      ],
      teamSize: 5,
      primaryUseCase: "coding",
    });

    const consolidateRecs = result.recommendations.filter(
      (r) => r.action === "consolidate"
    );
    expect(consolidateRecs).toHaveLength(1);
    // Copilot (lower spend) should be flagged, Cursor (higher spend) kept
    expect(consolidateRecs[0].vendor).toBe("copilot");
    expect(consolidateRecs[0].monthlySavings).toBe(95);
  });

  it("flags all three coding tools when all three are active", () => {
    const result = run({
      tools: [
        { vendor: "cursor",   tier: "pro",  monthlySpend: 100, seats: 5 },
        { vendor: "copilot",  tier: "business", monthlySpend: 95, seats: 5 },
        { vendor: "windsurf", tier: "pro",  monthlySpend: 75,  seats: 5 },
      ],
      teamSize: 5,
      primaryUseCase: "coding",
    });

    const consolidateRecs = result.recommendations.filter(
      (r) => r.action === "consolidate"
    );
    expect(consolidateRecs).toHaveLength(2);
  });

  it("does not flag coding tools as redundant for a writing-only team", () => {
    const result = run({
      tools: [
        { vendor: "cursor",  tier: "pro",      monthlySpend: 20, seats: 1 },
        { vendor: "copilot", tier: "individual", monthlySpend: 10, seats: 1 },
      ],
      teamSize: 1,
      primaryUseCase: "writing",
    });

    const consolidateRecs = result.recommendations.filter(
      (r) => r.action === "consolidate"
    );
    expect(consolidateRecs).toHaveLength(0);
  });
});
