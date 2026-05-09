import type { Vendor } from "./types";

export const VENDOR_LABELS: Record<Vendor, string> = {
  cursor: "Cursor",
  copilot: "GitHub Copilot",
  claude: "Claude (Anthropic)",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export const VENDOR_TIERS: Record<Vendor, { value: string; label: string; defaultPrice: number }[]> = {
  cursor: [
    { value: "hobby",    label: "Hobby (Free)",    defaultPrice: 0  },
    { value: "pro",      label: "Pro",              defaultPrice: 20 },
    { value: "business", label: "Business",         defaultPrice: 40 },
  ],
  copilot: [
    { value: "individual", label: "Individual", defaultPrice: 10 },
    { value: "business",   label: "Business",   defaultPrice: 19 },
    { value: "enterprise", label: "Enterprise", defaultPrice: 39 },
  ],
  claude: [
    { value: "free",     label: "Free",        defaultPrice: 0   },
    { value: "pro",      label: "Pro",         defaultPrice: 20  },
    { value: "max_5x",   label: "Max (5×)",    defaultPrice: 100 },
    { value: "max_20x",  label: "Max (20×)",   defaultPrice: 200 },
    { value: "team",     label: "Team",        defaultPrice: 30  },
  ],
  chatgpt: [
    { value: "plus", label: "Plus", defaultPrice: 20 },
    { value: "team", label: "Team", defaultPrice: 30 },
  ],
  "anthropic-api": [
    { value: "api", label: "API (pay-as-you-go)", defaultPrice: 6 },
  ],
  "openai-api": [
    { value: "api", label: "API (pay-as-you-go)", defaultPrice: 5 },
  ],
  gemini: [
    { value: "advanced",  label: "Advanced",        defaultPrice: 20 },
    { value: "workspace", label: "Workspace Add-on", defaultPrice: 30 },
    { value: "api",       label: "API (pay-as-you-go)", defaultPrice: 2 },
  ],
  windsurf: [
    { value: "free",  label: "Free",  defaultPrice: 0  },
    { value: "pro",   label: "Pro",   defaultPrice: 15 },
    { value: "teams", label: "Teams", defaultPrice: 35 },
  ],
};

export const ALL_VENDORS = Object.keys(VENDOR_LABELS) as Vendor[];
