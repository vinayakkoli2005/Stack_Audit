import { AuditApp } from "@/components/audit/AuditApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">
            Stack<span className="text-emerald-600">Audit</span>
          </span>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Free · No login · Sources cited
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Find out how much you&apos;re{" "}
            <span className="text-emerald-600">overspending on AI tools</span>
            {" "}— in 60 seconds.
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enter your current AI tool stack. We&apos;ll show you where you&apos;re overpaying,
            what to switch to, and the exact dollar savings — with pricing sources cited for every recommendation.
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ Free audit</span>
            <span>✓ No login required</span>
            <span>✓ Deterministic rules, not AI guesses</span>
          </div>
        </div>

        {/* Form / Results */}
        <AuditApp />

        {/* Trust footer */}
        <footer className="text-center text-xs text-muted-foreground space-y-1 pt-8 border-t border-border">
          <p>
            Pricing verified 2026-05-08 from vendor websites.{" "}
            <a href="/methodology" className="underline hover:text-foreground">
              How the audit works →
            </a>
          </p>
          <p>Built by Vinayak · Powered by deterministic rules, not AI hallucinations</p>
        </footer>
      </main>
    </div>
  );
}
