import { z } from "zod";

export const toolEntrySchema = z.object({
  vendor: z.enum([
    "cursor",
    "copilot",
    "claude",
    "chatgpt",
    "anthropic-api",
    "openai-api",
    "gemini",
    "windsurf",
  ]),
  tier: z.string().min(1, "Select a plan"),
  monthlySpend: z.number({ error: "Enter a number" }).min(0, "Must be ≥ 0"),
  seats: z.number({ error: "Enter a number" }).min(1, "Must be ≥ 1").int("Must be whole number"),
});

export const auditFormSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Add at least one tool"),
  teamSize: z.number({ error: "Enter a number" }).min(1, "Must be ≥ 1").int("Must be whole number"),
  primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
