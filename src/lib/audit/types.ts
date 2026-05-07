export type Vendor =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ActionType =
  | "keep"
  | "downgrade"
  | "switch_vendor"
  | "consolidate"
  | "buy_via_credex";

export type Confidence = "high" | "medium" | "low";

// One tool entry from the user's form
export type ToolEntry = {
  vendor: Vendor;
  tier: string;
  monthlySpend: number; // USD, what they actually pay
  seats: number;
};

export type AuditInput = {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: UseCase;
};

// A single recommendation for one tool
export type Recommendation = {
  vendor: Vendor;
  currentTier: string;
  currentMonthlySpend: number;
  action: ActionType;
  toTier?: string; // if action is downgrade or switch_vendor
  toVendor?: Vendor; // if action is switch_vendor
  monthlySavings: number;
  annualSavings: number;
  reasonShort: string; // 1 sentence shown in results table
  reasonDetailed: string; // shown in "Why?" expander
  confidence: Confidence;
  sourceUrl?: string; // pricing source for this recommendation
};

export type AuditResult = {
  input: AuditInput;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  // true when savings < $100/mo or all actions are "keep"
  isAlreadyOptimal: boolean;
  // true when totalMonthlySavings > 500 — triggers Credex CTA
  showCredexCta: boolean;
  createdAt: string; // ISO timestamp
};
