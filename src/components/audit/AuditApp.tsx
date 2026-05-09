"use client";

import { useState } from "react";
import { AuditForm } from "./AuditForm";
import { ResultsView } from "./ResultsView";
import { run } from "@/lib/audit/engine";
import type { AuditResult } from "@/lib/audit/types";
import type { AuditFormValues } from "@/lib/audit/schema";

type Stage = "form" | "loading" | "results";

export function AuditApp() {
  const [stage, setStage] = useState<Stage>("form");
  const [result, setResult] = useState<AuditResult | null>(null);

  function handleSubmit(values: AuditFormValues) {
    setStage("loading");
    // Engine is synchronous — setTimeout gives the browser one frame to render "loading" state
    setTimeout(() => {
      const auditResult = run(values);
      setResult(auditResult);
      setStage("results");
    }, 400);
  }

  function handleStartOver() {
    setResult(null);
    setStage("form");
  }

  return (
    <div className="w-full">
      {(stage === "form" || stage === "loading") && (
        <AuditForm onSubmit={handleSubmit} isLoading={stage === "loading"} />
      )}
      {stage === "results" && result && (
        <ResultsView result={result} onStartOver={handleStartOver} />
      )}
    </div>
  );
}
