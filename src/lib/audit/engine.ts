import type { AuditInput, AuditResult, Recommendation, ToolEntry } from "./types";
import {
  CODING_TOOLS,
  CREDEX_CTA_THRESHOLD,
  CREDEX_ELIGIBLE,
  getCheaperPlans,
  getPlan,
} from "./pricing";

// Minimum savings to surface a recommendation (avoids noise for trivial amounts)
const MIN_SAVINGS_THRESHOLD = 5; // USD/month

export function run(input: AuditInput): AuditResult {
  const recommendations: Recommendation[] = [];

  for (const tool of input.tools) {
    const rec = evaluateTool(tool, input);
    if (rec) recommendations.push(rec);
  }

  // Rule 5 — redundancy: multiple coding tools in use simultaneously
  const redundancyRecs = evaluateRedundancy(input.tools, input.primaryUseCase);
  recommendations.push(...redundancyRecs);

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    input,
    recommendations,
    totalMonthlySavings: round2(totalMonthlySavings),
    totalAnnualSavings: round2(totalAnnualSavings),
    isAlreadyOptimal:
      recommendations.length === 0 || totalMonthlySavings < 100,
    showCredexCta: totalMonthlySavings > CREDEX_CTA_THRESHOLD,
    createdAt: new Date().toISOString(),
  };
}

// ─── Per-tool evaluation ─────────────────────────────────────────────────────

function evaluateTool(
  tool: ToolEntry,
  input: AuditInput
): Recommendation | null {
  // Rule 2 runs first — a cross-vendor switch is a bigger win than a same-vendor downgrade.
  // If we recommended switching vendors AND downgrading within the old vendor, we'd surface
  // two recs for the same tool, which is confusing. Use-case fit takes priority.
  const useCaseRec = checkUseCaseFit(tool, input.primaryUseCase, input.teamSize);
  if (useCaseRec) return useCaseRec;

  // Rule 3 — specific subscription misuse (e.g. Claude Team below min seats)
  const apiRec = checkApiVsSubscription(tool, input.teamSize);
  if (apiRec) return apiRec;

  // Rule 1 — generic plan-fit: cheaper plan from same vendor
  const planFitRec = checkPlanFit(tool);
  if (planFitRec) return planFitRec;

  return null;
}

// Rule 1: Plan-fit — cheaper plan from same vendor fits the seat count
function checkPlanFit(tool: ToolEntry): Recommendation | null {
  const cheaperPlans = getCheaperPlans(tool.vendor, tool.tier);
  if (cheaperPlans.length === 0) return null;

  for (const cheaper of cheaperPlans) {
    // Only recommend if seat count satisfies min seats for the cheaper plan
    if (tool.seats >= cheaper.minSeats) {
      const expectedCurrentCost = tool.monthlySpend;
      const recommendedCost = cheaper.pricePerSeat * tool.seats;
      const savings = expectedCurrentCost - recommendedCost;

      if (savings < MIN_SAVINGS_THRESHOLD) continue;

      return {
        vendor: tool.vendor,
        currentTier: tool.tier,
        currentMonthlySpend: tool.monthlySpend,
        action: "downgrade",
        toTier: cheaper.tier,
        monthlySavings: round2(savings),
        annualSavings: round2(savings * 12),
        reasonShort: `Downgrade from ${tool.tier} to ${cheaper.tier} — saves $${round2(savings)}/mo for ${tool.seats} seat${tool.seats > 1 ? "s" : ""}.`,
        reasonDetailed: `${tool.vendor} ${tool.tier} costs $${tool.monthlySpend}/mo for ${tool.seats} seat${tool.seats > 1 ? "s" : ""}. ${tool.vendor} ${cheaper.tier} at $${cheaper.pricePerSeat}/seat/mo covers the same use case for teams of this size at $${recommendedCost}/mo — a saving of $${round2(savings)}/mo ($${round2(savings * 12)}/yr). Source: ${cheaper.sourceUrl}`,
        confidence: "high",
        sourceUrl: cheaper.sourceUrl,
      };
    }
  }

  return null;
}

// Rule 2: Use-case fit — wrong tool for the job
function checkUseCaseFit(
  tool: ToolEntry,
  useCase: AuditInput["primaryUseCase"],
  teamSize: number
): Recommendation | null {
  // ChatGPT Team used by a coding-focused team → Cursor is better fit and cheaper
  if (
    tool.vendor === "chatgpt" &&
    tool.tier === "team" &&
    useCase === "coding"
  ) {
    const cursorPro = getPlan("cursor", "pro");
    if (!cursorPro) return null;
    const recommendedCost = cursorPro.pricePerSeat * tool.seats;
    const savings = tool.monthlySpend - recommendedCost;
    if (savings < MIN_SAVINGS_THRESHOLD) return null;

    return {
      vendor: tool.vendor,
      currentTier: tool.tier,
      currentMonthlySpend: tool.monthlySpend,
      action: "switch_vendor",
      toVendor: "cursor",
      toTier: "pro",
      monthlySavings: round2(savings),
      annualSavings: round2(savings * 12),
      reasonShort: `Switch to Cursor Pro for coding teams — saves $${round2(savings)}/mo with better code-focused features.`,
      reasonDetailed: `ChatGPT Team ($${tool.monthlySpend}/mo for ${tool.seats} seats) is a general-purpose tool. For a coding-primary team, Cursor Pro ($${cursorPro.pricePerSeat}/seat/mo) provides deeper IDE integration, codebase-aware completions, and multi-file edits — at $${recommendedCost}/mo total, saving $${round2(savings)}/mo. Source: ${cursorPro.sourceUrl}`,
      confidence: "medium",
      sourceUrl: cursorPro.sourceUrl,
    };
  }

  // Cursor/Copilot/Windsurf used by a writing/research-only team → Claude Pro is better fit
  if (
    CODING_TOOLS.includes(tool.vendor) &&
    (useCase === "writing" || useCase === "research") &&
    tool.monthlySpend > 0
  ) {
    const claudePro = getPlan("claude", "pro");
    if (!claudePro) return null;
    const recommendedCost = claudePro.pricePerSeat * tool.seats;
    const savings = tool.monthlySpend - recommendedCost;
    if (savings < MIN_SAVINGS_THRESHOLD) return null;

    return {
      vendor: tool.vendor,
      currentTier: tool.tier,
      currentMonthlySpend: tool.monthlySpend,
      action: "switch_vendor",
      toVendor: "claude",
      toTier: "pro",
      monthlySavings: round2(savings),
      annualSavings: round2(savings * 12),
      reasonShort: `${tool.vendor} is a coding tool — for ${useCase}, Claude Pro is a better fit at $${round2(savings)}/mo less.`,
      reasonDetailed: `${tool.vendor} ${tool.tier} is optimized for software development tasks. For a ${useCase}-primary team, Claude Pro ($${claudePro.pricePerSeat}/seat/mo) offers superior long-form writing, document analysis, and research capabilities. At $${recommendedCost}/mo vs your current $${tool.monthlySpend}/mo, this saves $${round2(savings)}/mo. Source: ${claudePro.sourceUrl}`,
      confidence: "medium",
      sourceUrl: claudePro.sourceUrl,
    };
  }

  return null;
}

// Rule 3: API vs subscription — paying for a seat when API usage is cheaper
function checkApiVsSubscription(
  tool: ToolEntry,
  teamSize: number
): Recommendation | null {
  // If team is on Claude Team but has fewer than min seats (5), flag overspend
  if (tool.vendor === "claude" && tool.tier === "team" && tool.seats < 5) {
    const claudePro = getPlan("claude", "pro");
    if (!claudePro) return null;
    const recommendedCost = claudePro.pricePerSeat * tool.seats;
    const savings = tool.monthlySpend - recommendedCost;
    if (savings < MIN_SAVINGS_THRESHOLD) return null;

    return {
      vendor: tool.vendor,
      currentTier: tool.tier,
      currentMonthlySpend: tool.monthlySpend,
      action: "downgrade",
      toTier: "pro",
      monthlySavings: round2(savings),
      annualSavings: round2(savings * 12),
      reasonShort: `Claude Team requires min 5 seats — with ${tool.seats} users, Pro × ${tool.seats} saves $${round2(savings)}/mo.`,
      reasonDetailed: `Claude Team is priced at $30/seat/mo with a 5-seat minimum, designed for collaboration features. With only ${tool.seats} user${tool.seats > 1 ? "s" : ""}, you're paying for ${5 - tool.seats} unused seat${5 - tool.seats > 1 ? "s" : ""}. Claude Pro at $${claudePro.pricePerSeat}/seat/mo × ${tool.seats} = $${recommendedCost}/mo, saving $${round2(savings)}/mo. Source: ${claudePro.sourceUrl}`,
      confidence: "high",
      sourceUrl: claudePro.sourceUrl,
    };
  }

  return null;
}

// Rule 4 (Rule 5 in plan): Redundancy — multiple coding tools for same team
function evaluateRedundancy(
  tools: ToolEntry[],
  useCase: AuditInput["primaryUseCase"]
): Recommendation[] {
  if (useCase !== "coding" && useCase !== "mixed") return [];

  const codingTools = tools.filter(
    (t) => CODING_TOOLS.includes(t.vendor) && t.monthlySpend > 0
  );

  if (codingTools.length < 2) return [];

  // Keep the highest-spend coding tool, flag the rest as redundant
  const sorted = [...codingTools].sort((a, b) => b.monthlySpend - a.monthlySpend);
  const keeper = sorted[0];
  const redundant = sorted.slice(1);

  return redundant.map((t) => ({
    vendor: t.vendor,
    currentTier: t.tier,
    currentMonthlySpend: t.monthlySpend,
    action: "consolidate" as const,
    monthlySavings: round2(t.monthlySpend),
    annualSavings: round2(t.monthlySpend * 12),
    reasonShort: `Redundant with ${keeper.vendor} — both are AI coding assistants. Consolidating saves $${t.monthlySpend}/mo.`,
    reasonDetailed: `Your team is paying for both ${keeper.vendor} (${keeper.tier}, $${keeper.monthlySpend}/mo) and ${t.vendor} (${t.tier}, $${t.monthlySpend}/mo). Both tools serve the same primary function: AI-assisted coding in the IDE. Consolidating to ${keeper.vendor} eliminates $${t.monthlySpend}/mo in duplicate spend. Most teams find one coding AI is sufficient; the marginal productivity gain from two rarely justifies the cost.`,
    confidence: "high",
  }));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
