import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase/client";
import { checkRateLimit } from "@/lib/rate-limit";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const leadsSchema = z.object({
  email: z.string().email("Invalid email"),
  auditId: z.string().uuid().optional(),
  monthlySavings: z.number().min(0).optional(),
  showCredexCta: z.boolean().optional(),
  honeypot: z.string().max(0, "Bot detected"),  // must be empty
});

export async function POST(req: NextRequest) {
  // Rate limit by IP: max 3 lead captures per minute
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitResult = await checkRateLimit(`leads:${ip}`, 3, 60_000);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadsSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot triggered — silent fake success so bots don't adapt
    const isHoneypot = parsed.error.issues.some((i) => i.path[0] === "honeypot");
    if (isHoneypot) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  const { email, auditId, monthlySavings, showCredexCta } = parsed.data;

  const supabase = getSupabaseClient();
  if (supabase) {
    // Insert lead
    await supabase.from("leads").insert({
      email,
      audit_id: auditId ?? null,
      monthly_savings: monthlySavings ?? null,
      show_credex_cta: showCredexCta ?? false,
    });

    // Update audit row with email for future reference
    if (auditId) {
      await supabase.from("audits").update({ email }).eq("id", auditId);
      await supabase.from("events").insert({
        audit_id: auditId,
        event: "email_captured",
        meta: { monthly_savings: monthlySavings, show_credex_cta: showCredexCta },
      });
    }
  }

  // Send transactional email via Resend if configured
  if (resend) {
    await resend.emails.send({
      from: "StackAudit <hello@stackaudit.app>",
      to: email,
      subject: monthlySavings && monthlySavings > 0
        ? `Your audit found $${monthlySavings.toLocaleString()}/mo in savings`
        : "Your AI stack audit results",
      html: buildEmailHtml(email, monthlySavings ?? 0, showCredexCta ?? false),
    }).catch(() => {/* email failure should never break the lead capture */});
  }

  return NextResponse.json({ ok: true });
}

function buildEmailHtml(email: string, monthlySavings: number, showCredexCta: boolean): string {
  const savings = monthlySavings > 0
    ? `<p>Your audit found <strong>$${monthlySavings.toLocaleString()}/month</strong> in potential savings. Implement the top recommendation this week to start capturing value immediately.</p>`
    : `<p>Great news — your AI tool stack looks well-optimized. Keep this audit as a baseline and re-run it quarterly as vendor pricing changes.</p>`;

  const cta = showCredexCta
    ? `<p>With savings this size, you could amplify them further with Credex purchasing — AI tool credits at 15–30% below list price. <a href="https://credex.app">Get a quote →</a></p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
  <h1 style="font-size:20px;font-weight:700;margin-bottom:8px;">Your StackAudit results</h1>
  ${savings}
  ${cta}
  <p style="margin-top:24px;">
    <a href="https://stackaudit.app" style="background:#059669;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
      View full results →
    </a>
  </p>
  <p style="margin-top:32px;font-size:12px;color:#6b7280;">
    You're receiving this because you submitted your AI stack to StackAudit.<br>
    No more emails — this is a one-time results summary.
  </p>
</body>
</html>`;
}

