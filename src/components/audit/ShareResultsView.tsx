"use client";

import type { AuditResult, Recommendation } from "@/lib/audit/types";
import { VENDOR_LABELS } from "@/lib/audit/vendors";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, TrendingDown, RefreshCw, Package } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  keep:           "bg-muted text-muted-foreground",
  downgrade:      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  switch_vendor:  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  consolidate:    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  buy_via_credex: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const ACTION_LABELS: Record<string, string> = {
  keep: "Keep", downgrade: "Downgrade", switch_vendor: "Switch",
  consolidate: "Consolidate", buy_via_credex: "Buy via Credex",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function ActionIcon({ action }: { action: string }) {
  if (action === "downgrade")     return <TrendingDown className="h-4 w-4" />;
  if (action === "switch_vendor") return <RefreshCw className="h-4 w-4" />;
  if (action === "consolidate")   return <Package className="h-4 w-4" />;
  return null;
}

function RecCard({ rec }: { rec: Recommendation }) {
  return (
    <Card className="border border-border">
      <CardContent className="pt-4 pb-4 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-sm">{VENDOR_LABELS[rec.vendor]}</span>
          <span className="text-muted-foreground text-sm">· {rec.currentTier}</span>
          <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ACTION_COLORS[rec.action]}`}>
            <ActionIcon action={rec.action} />
            {ACTION_LABELS[rec.action]}
          </span>
        </div>
        {rec.monthlySavings > 0 && (
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {fmt(rec.monthlySavings)}<span className="text-sm font-normal">/mo</span>
            </span>
            <span className="text-sm text-muted-foreground">{fmt(rec.annualSavings)}/yr</span>
          </div>
        )}
        <p className="text-sm text-foreground">{rec.reasonShort}</p>
        <details className="group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground list-none flex items-center gap-1">
            <span className="group-open:hidden">▶ Why?</span>
            <span className="hidden group-open:inline">▼ Hide</span>
          </summary>
          <div className="mt-2 text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
            {rec.reasonDetailed}
            {rec.sourceUrl && (
              <a href={rec.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-0.5 text-primary hover:underline">
                Source <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

export function ShareResultsView({ result }: { result: AuditResult }) {
  const { totalMonthlySavings, totalAnnualSavings, recommendations, isAlreadyOptimal } = result;

  return (
    <div className="space-y-6">
      {isAlreadyOptimal ? (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-8 text-center space-y-2">
          <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">Stack is lean ✓</div>
          <p className="text-muted-foreground">No significant savings found — this team is spending well.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-8 text-center space-y-1">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Potential savings</p>
          <div className="text-5xl font-bold text-emerald-700 dark:text-emerald-400">
            {fmt(totalMonthlySavings)}<span className="text-2xl font-normal">/mo</span>
          </div>
          <div className="text-xl text-emerald-600 dark:text-emerald-500 font-medium">
            {fmt(totalAnnualSavings)} / year
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Findings</h2>
          {recommendations.map((rec, i) => <RecCard key={i} rec={rec} />)}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Pricing verified 2026-05-08 · Sources linked on each finding ·{" "}
        <a href="/methodology" className="underline hover:text-foreground">Methodology →</a>
      </p>
    </div>
  );
}
