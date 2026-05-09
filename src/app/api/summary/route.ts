import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult } from "@/lib/audit/types";
import { VENDOR_LABELS } from "@/lib/audit/vendors";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Deterministic fallback — used when API key is not configured
function templateSummary(result: AuditResult): string {
  const { totalMonthlySavings, totalAnnualSavings, recommendations, isAlreadyOptimal } = result;

  if (isAlreadyOptimal) {
    return `Your AI tool stack is well-optimized. Based on your current spend and team size, we didn't find savings above $100/month — which means you're already making good purchasing decisions. Keep an eye on pricing changes as vendors update their plans.`;
  }

  const topRec = recommendations[0];
  const vendorName = topRec ? VENDOR_LABELS[topRec.vendor] : "your tools";
  const actionCount = recommendations.length;

  return `Your AI tool stack has ${actionCount} optimization opportunit${actionCount === 1 ? "y" : "ies"} totaling $${totalMonthlySavings.toLocaleString()}/month ($${totalAnnualSavings.toLocaleString()}/year). The biggest win is with ${vendorName} — ${topRec?.reasonShort ?? "see findings below"}. These are based on verified public pricing, not estimates. Implementing all recommendations could meaningfully reduce your tooling overhead without sacrificing capability.`;
}

const SYSTEM_PROMPT = `You are a concise financial analyst specializing in AI tool spend optimization.
Write a 80-100 word personalized summary of an audit result.
Be specific about the numbers. Mention the top recommendation.
Sound like a CFO giving a one-paragraph briefing — direct, numeric, no fluff.
Do not use bullet points. Plain prose only.`;

export async function POST(req: NextRequest) {
  let result: AuditResult;
  try {
    result = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Use templated fallback if no API key
  if (!client) {
    return NextResponse.json({ summary: templateSummary(result) });
  }

  const topRecs = result.recommendations.slice(0, 3).map((r) => ({
    vendor: VENDOR_LABELS[r.vendor],
    action: r.action,
    monthlySavings: r.monthlySavings,
    reason: r.reasonShort,
  }));

  const userPrompt = `Audit result:
- Total monthly savings: $${result.totalMonthlySavings}
- Total annual savings: $${result.totalAnnualSavings}
- Is already optimal: ${result.isAlreadyOptimal}
- Top recommendations: ${JSON.stringify(topRecs, null, 2)}
- Team size: ${result.input.teamSize}
- Primary use case: ${result.input.primaryUseCase}

Write the 80-100 word summary now.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : templateSummary(result);
    return NextResponse.json({ summary: text });
  } catch {
    // Always return something — never fail the user experience
    return NextResponse.json({ summary: templateSummary(result) });
  }
}
