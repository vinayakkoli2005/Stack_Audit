import type { Vendor, UseCase } from "./types";

// All prices: USD/seat/month, retail, monthly billing
// Sources: PRICING_DATA.md — verified 2026-05-08
export type PlanDef = {
  vendor: Vendor;
  tier: string;
  pricePerSeat: number; // 0 = free
  minSeats: number;
  maxSeats?: number; // undefined = no limit
  // use cases this tool is well-suited for
  goodFor: UseCase[];
  sourceUrl: string;
};

export const PLANS: PlanDef[] = [
  // ── Cursor ──────────────────────────────────────────────────────────────
  { vendor: "cursor", tier: "hobby",    pricePerSeat: 0,  minSeats: 1, goodFor: ["coding"], sourceUrl: "https://www.cursor.com/pricing" },
  { vendor: "cursor", tier: "pro",      pricePerSeat: 20, minSeats: 1, goodFor: ["coding"], sourceUrl: "https://www.cursor.com/pricing" },
  { vendor: "cursor", tier: "business", pricePerSeat: 40, minSeats: 1, goodFor: ["coding"], sourceUrl: "https://www.cursor.com/pricing" },

  // ── GitHub Copilot ───────────────────────────────────────────────────────
  { vendor: "copilot", tier: "individual", pricePerSeat: 10, minSeats: 1, goodFor: ["coding"], sourceUrl: "https://github.com/features/copilot/plans" },
  { vendor: "copilot", tier: "business",   pricePerSeat: 19, minSeats: 1, goodFor: ["coding"], sourceUrl: "https://github.com/features/copilot/plans" },
  { vendor: "copilot", tier: "enterprise", pricePerSeat: 39, minSeats: 1, goodFor: ["coding"], sourceUrl: "https://github.com/features/copilot/plans" },

  // ── Claude ───────────────────────────────────────────────────────────────
  { vendor: "claude", tier: "free",       pricePerSeat: 0,   minSeats: 1, goodFor: ["writing", "research", "mixed", "coding"], sourceUrl: "https://claude.ai/upgrade" },
  { vendor: "claude", tier: "pro",        pricePerSeat: 20,  minSeats: 1, goodFor: ["writing", "research", "mixed", "coding"], sourceUrl: "https://claude.ai/upgrade" },
  { vendor: "claude", tier: "max_5x",     pricePerSeat: 100, minSeats: 1, goodFor: ["writing", "research", "mixed", "coding"], sourceUrl: "https://claude.ai/upgrade" },
  { vendor: "claude", tier: "max_20x",    pricePerSeat: 200, minSeats: 1, goodFor: ["writing", "research", "mixed", "coding"], sourceUrl: "https://claude.ai/upgrade" },
  { vendor: "claude", tier: "team",       pricePerSeat: 30,  minSeats: 5, goodFor: ["writing", "research", "mixed", "coding"], sourceUrl: "https://claude.ai/upgrade" },

  // ── ChatGPT ──────────────────────────────────────────────────────────────
  { vendor: "chatgpt", tier: "plus",       pricePerSeat: 20, minSeats: 1, goodFor: ["writing", "research", "mixed"], sourceUrl: "https://openai.com/chatgpt/pricing" },
  { vendor: "chatgpt", tier: "team",       pricePerSeat: 30, minSeats: 2, goodFor: ["writing", "research", "mixed"], sourceUrl: "https://openai.com/chatgpt/pricing" },

  // ── Anthropic API ────────────────────────────────────────────────────────
  // Effective monthly cost per developer at typical coding workload
  // (1M input + 200K output tokens/month at Sonnet 4.6 rates)
  // Assumption documented in PRICING_DATA.md
  { vendor: "anthropic-api", tier: "api", pricePerSeat: 6, minSeats: 1, goodFor: ["coding", "data", "research", "mixed"], sourceUrl: "https://www.anthropic.com/pricing" },

  // ── OpenAI API ───────────────────────────────────────────────────────────
  // Effective monthly cost per developer at typical coding workload (GPT-4o)
  { vendor: "openai-api", tier: "api", pricePerSeat: 5, minSeats: 1, goodFor: ["coding", "data", "research", "mixed"], sourceUrl: "https://openai.com/api/pricing" },

  // ── Gemini ───────────────────────────────────────────────────────────────
  { vendor: "gemini", tier: "advanced",  pricePerSeat: 20, minSeats: 1, goodFor: ["writing", "research", "mixed"], sourceUrl: "https://one.google.com/about/plans" },
  { vendor: "gemini", tier: "workspace", pricePerSeat: 30, minSeats: 1, goodFor: ["writing", "research", "mixed"], sourceUrl: "https://workspace.google.com/intl/en/pricing.html" },
  { vendor: "gemini", tier: "api",       pricePerSeat: 2,  minSeats: 1, goodFor: ["coding", "data", "research", "mixed"], sourceUrl: "https://ai.google.dev/pricing" },

  // ── Windsurf ─────────────────────────────────────────────────────────────
  { vendor: "windsurf", tier: "free",   pricePerSeat: 0,  minSeats: 1, goodFor: ["coding"], sourceUrl: "https://windsurf.com/pricing" },
  { vendor: "windsurf", tier: "pro",    pricePerSeat: 15, minSeats: 1, goodFor: ["coding"], sourceUrl: "https://windsurf.com/pricing" },
  { vendor: "windsurf", tier: "teams",  pricePerSeat: 35, minSeats: 1, goodFor: ["coding"], sourceUrl: "https://windsurf.com/pricing" },
];

export function getPlan(vendor: Vendor, tier: string): PlanDef | undefined {
  return PLANS.find((p) => p.vendor === vendor && p.tier === tier.toLowerCase());
}

export function getCheaperPlans(vendor: Vendor, currentTier: string): PlanDef[] {
  const current = getPlan(vendor, currentTier);
  if (!current) return [];
  return PLANS.filter(
    (p) => p.vendor === vendor && p.pricePerSeat < current.pricePerSeat
  ).sort((a, b) => b.pricePerSeat - a.pricePerSeat); // best cheaper option first
}

// Coding-specialist tools — for redundancy detection
export const CODING_TOOLS: Vendor[] = ["cursor", "copilot", "windsurf"];

// Tools Credex can supply via discounted credits
export const CREDEX_ELIGIBLE: Vendor[] = ["cursor", "claude", "chatgpt", "copilot"];

// Threshold above which Credex CTA is shown prominently
export const CREDEX_CTA_THRESHOLD = 500; // USD/month savings
