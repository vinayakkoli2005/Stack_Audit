"use client";

import { useState } from "react";
import type { AuditResult, Recommendation } from "@/lib/audit/types";
import { VENDOR_LABELS } from "@/lib/audit/vendors";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, ArrowRight, TrendingDown, RefreshCw, Package } from "lucide-react";

const ACTION_LABELS: Record<string, string> = {
  keep:           "Keep",
  downgrade:      "Downgrade",
  switch_vendor:  "Switch",
  consolidate:    "Consolidate",
  buy_via_credex: "Buy via Credex",
};

const ACTION_COLORS: Record<string, string> = {
  keep:           "bg-muted text-muted-foreground",
  downgrade:      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  switch_vendor:  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  consolidate:    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  buy_via_credex: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  high:   "High confidence",
  medium: "Medium confidence",
  low:    "Low confidence",
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

function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <Card className="border border-border">
      <CardContent className="pt-5 pb-4 space-y-3">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-sm">{VENDOR_LABELS[rec.vendor]}</span>
          <span className="text-muted-foreground text-sm">·</span>
          <span className="text-muted-foreground text-sm capitalize">{rec.currentTier}</span>
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ACTION_COLORS[rec.action]}`}
          >
            <ActionIcon action={rec.action} />
            {ACTION_LABELS[rec.action]}
          </span>
        </div>

        {/* Savings */}
        {rec.monthlySavings > 0 && (
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {fmt(rec.monthlySavings)}<span className="text-sm font-normal">/mo</span>
            </span>
            <span className="text-sm text-muted-foreground">
              {fmt(rec.annualSavings)}/yr
            </span>
          </div>
        )}

        {/* Short reason */}
        <p className="text-sm text-foreground">{rec.reasonShort}</p>

        {/* Expandable detailed reason */}
        <details className="group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1">
            <span className="group-open:hidden">▶ Why?</span>
            <span className="hidden group-open:inline">▼ Hide detail</span>
          </summary>
          <div className="mt-2 text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
            {rec.reasonDetailed}
            {rec.sourceUrl && (
              <a
                href={rec.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-0.5 text-primary hover:underline"
              >
                Source <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </details>

        {/* Confidence badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {CONFIDENCE_LABELS[rec.confidence]}
          </span>
          {rec.toVendor && (
            <span className="text-xs text-muted-foreground">
              → {VENDOR_LABELS[rec.toVendor]}{rec.toTier ? ` ${rec.toTier}` : ""}
            </span>
          )}
          {!rec.toVendor && rec.toTier && (
            <span className="text-xs text-muted-foreground">
              → {rec.toTier}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Email capture ─────────────────────────────────────────────────────────────

function EmailCapture({
  auditId,
  monthlySavings,
  showCredexCta,
}: {
  auditId?: string | null;
  monthlySavings: number;
  showCredexCta: boolean;
}) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, auditId, monthlySavings, showCredexCta, honeypot }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-5 py-4 text-sm text-emerald-700 dark:text-emerald-400">
        Results sent — check your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-muted/30 px-5 py-5 space-y-3">
      <p className="text-sm font-medium">Email me these results</p>
      <p className="text-xs text-muted-foreground">One-time summary — no spam, no newsletter.</p>
      {/* Honeypot — hidden from real users, filled by bots */}
      <input
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          aria-label="Email address"
        />
        <Button type="submit" disabled={state === "loading"} className="shrink-0">
          {state === "loading" ? "Sending…" : "Send"}
        </Button>
      </div>
      {state === "error" && (
        <p className="text-xs text-destructive">Something went wrong — try again.</p>
      )}
    </form>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ResultsViewProps {
  result: AuditResult;
  onStartOver: () => void;
  shareId?: string | null;
  summary?: string | null;
}

export function ResultsView({ result, onStartOver, shareId, summary }: ResultsViewProps) {
  const { totalMonthlySavings, totalAnnualSavings, recommendations, isAlreadyOptimal, showCredexCta } = result;

  return (
    <div className="space-y-8">
      {/* Hero savings number */}
      {isAlreadyOptimal ? (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-8 text-center space-y-2">
          <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
            Your stack is lean ✓
          </div>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find significant savings (&lt;$100/mo). You&apos;re spending well on AI tools.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-8 text-center space-y-1">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Potential savings
          </p>
          <div className="text-5xl font-bold text-emerald-700 dark:text-emerald-400">
            {fmt(totalMonthlySavings)}<span className="text-2xl font-normal">/mo</span>
          </div>
          <div className="text-xl text-emerald-600 dark:text-emerald-500 font-medium">
            {fmt(totalAnnualSavings)} / year
          </div>
        </div>
      )}

      {/* Credex CTA — only above $500/mo savings threshold */}
      {showCredexCta && (
        <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white space-y-3">
          <p className="font-bold text-lg">
            Save an extra 15–30% through Credex
          </p>
          <p className="text-sm text-emerald-100">
            Credex lets you buy AI tool credits at a discount. With {fmt(totalMonthlySavings)}/mo already on the table, layering in Credex purchasing could save you even more.
          </p>
          <Button
            variant="secondary"
            className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
          >
            Get a Credex quote <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* AI narrative summary */}
      {summary && (
        <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Summary</p>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Email capture */}
      <EmailCapture
        auditId={shareId}
        monthlySavings={totalMonthlySavings}
        showCredexCta={showCredexCta}
      />

      {/* Recommendations list */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Findings</h2>
          {recommendations.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} />
          ))}
        </div>
      )}

      <Separator />

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onStartOver} className="flex-1">
          Start over
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            const shareUrl = shareId
              ? `${window.location.origin}/r/${shareId}`
              : window.location.href;
            if (navigator.share) {
              navigator.share({ title: "My AI stack audit", url: shareUrl });
            } else {
              navigator.clipboard.writeText(shareUrl);
            }
          }}
        >
          {shareId ? "Copy share link" : "Share results"}
        </Button>
      </div>

      {/* Methodology note */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Savings are estimates based on public pricing verified 2026-05-08.{" "}
        Actual spend may differ. Every recommendation links to source pricing.{" "}
        <a href="/methodology" className="underline hover:text-foreground">
          Read the methodology →
        </a>
      </p>
    </div>
  );
}
