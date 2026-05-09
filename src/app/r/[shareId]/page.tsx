import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { AuditResult } from "@/lib/audit/types";
import { ShareResultsView } from "@/components/audit/ShareResultsView";

interface Props {
  params: Promise<{ shareId: string }>;
}

async function getAudit(shareId: string): Promise<AuditResult | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("audits")
    .select("result")
    .eq("id", shareId)
    .single();

  if (error || !data) return null;
  return data.result as AuditResult;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  const result = await getAudit(shareId);

  if (!result) {
    return { title: "Audit not found — StackAudit" };
  }

  const savings = result.totalMonthlySavings;
  const title = result.isAlreadyOptimal
    ? "My AI stack is already optimized — StackAudit"
    : `I found $${savings.toLocaleString()}/mo in AI tool savings — StackAudit`;

  const description = result.isAlreadyOptimal
    ? "My AI tool stack is well-optimized. Check yours free at StackAudit."
    : `Potential savings of $${savings.toLocaleString()}/month ($${result.totalAnnualSavings.toLocaleString()}/yr) identified across ${result.recommendations.length} finding${result.recommendations.length === 1 ? "" : "s"}. Audit yours free.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { shareId } = await params;
  const result = await getAudit(shareId);

  if (!result) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-bold text-lg tracking-tight">
            Stack<span className="text-emerald-600">Audit</span>
          </a>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Audit your stack →
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
            Shared audit result
          </p>
          <h1 className="text-2xl font-bold">AI Tool Stack Audit</h1>
        </div>

        <ShareResultsView result={result} />

        <div className="text-center pt-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Audit your own stack — free →
          </a>
        </div>
      </main>
    </div>
  );
}
