import { getSupabaseClient } from "@/lib/supabase/client";

// Server component — fetches aggregate stats at request time, revalidates every 60s
export const revalidate = 60;

async function getStats(): Promise<{ totalSavings: number; totalAudits: number }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { totalSavings: 0, totalAudits: 0 };

  try {
    const { data, error } = await supabase
      .from("audits")
      .select("result");

    if (error || !data) return { totalSavings: 0, totalAudits: 0 };

    const totalAudits = data.length;
    const totalSavings = data.reduce((sum, row) => {
      const savings = (row.result as { totalMonthlySavings?: number })?.totalMonthlySavings ?? 0;
      return sum + savings;
    }, 0);

    return { totalSavings, totalAudits };
  } catch {
    return { totalSavings: 0, totalAudits: 0 };
  }
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}

export async function SavingsCounter() {
  const { totalSavings, totalAudits } = await getStats();

  // Don't render if no real data yet
  if (totalAudits === 0) return null;

  return (
    <div className="flex justify-center gap-8 py-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {fmt(totalSavings * 12)}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">found in annual savings</div>
      </div>
      <div className="w-px bg-border" />
      <div className="text-center">
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {totalAudits.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">teams audited</div>
      </div>
    </div>
  );
}
