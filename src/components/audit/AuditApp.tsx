"use client";

import { useState } from "react";
import { AuditForm } from "./AuditForm";
import { ResultsView } from "./ResultsView";
import type { AuditResult } from "@/lib/audit/types";
import type { AuditFormValues } from "@/lib/audit/schema";

type Stage = "form" | "loading" | "results";

export function AuditApp() {
  const [stage, setStage] = useState<Stage>("form");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  async function handleSubmit(values: AuditFormValues) {
    setStage("loading");

    try {
      // Call server-side API route — runs engine + stores in Supabase
      const auditRes = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!auditRes.ok) throw new Error("Audit API failed");

      const { result: auditResult, shareId: id } = await auditRes.json() as {
        result: AuditResult;
        shareId: string | null;
      };

      setResult(auditResult);
      setShareId(id);

      // Fetch AI summary in parallel — non-blocking, fallback built in
      fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditResult),
      })
        .then((r) => r.json())
        .then(({ summary: s }: { summary: string }) => setSummary(s))
        .catch(() => {/* summary is optional — silent fail is correct */});

    } catch {
      // On any network error, fall back to client-side engine (no Supabase)
      const { run } = await import("@/lib/audit/engine");
      const fallbackResult = run(values);
      setResult(fallbackResult);
      setShareId(null);
    } finally {
      setStage("results");
    }
  }

  function handleStartOver() {
    setResult(null);
    setShareId(null);
    setSummary(null);
    setStage("form");
  }

  return (
    <div className="w-full">
      {(stage === "form" || stage === "loading") && (
        <AuditForm onSubmit={handleSubmit} isLoading={stage === "loading"} />
      )}
      {stage === "results" && result && (
        <ResultsView
          result={result}
          shareId={shareId}
          summary={summary}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}
