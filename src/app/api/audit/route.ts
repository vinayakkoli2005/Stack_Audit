import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/audit/engine";
import { auditFormSchema } from "@/lib/audit/schema";
import { getSupabaseClient } from "@/lib/supabase/client";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = await checkRateLimit(`audit:${ip}`, 10, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = auditFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 422 });
  }

  const result = run(parsed.data);
  const shareId = crypto.randomUUID();

  // Store in Supabase if configured — graceful no-op otherwise
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("audits").insert({
      id: shareId,
      input: parsed.data,
      result,
      created_at: result.createdAt,
    });

    // Track audit_completed event
    await supabase.from("events").insert({
      audit_id: shareId,
      event: "audit_completed",
      meta: {
        total_monthly_savings: result.totalMonthlySavings,
        tools_count: parsed.data.tools.length,
        show_credex_cta: result.showCredexCta,
      },
    });
  }

  return NextResponse.json({ result, shareId: supabase ? shareId : null });
}
