import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase/client";
import { checkRateLimit } from "@/lib/rate-limit";
import { Resend } from "resend";
import { generateAuditPdf } from "@/lib/pdf/auditReport";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const leadsSchema = z.object({
  email: z.string().email("Invalid email"),
  auditId: z.string().uuid().optional(),
  monthlySavings: z.number().min(0).optional(),
  showCredexCta: z.boolean().optional(),
  honeypot: z.string().max(0, "Bot detected"),
  result: z.unknown().optional(),
  summary: z.string().optional(),
});

export async function POST(req: NextRequest) {
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
    const isHoneypot = parsed.error.issues.some((i) => i.path[0] === "honeypot");
    if (isHoneypot) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  const { email, auditId, monthlySavings, showCredexCta, result, summary } = parsed.data;

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("leads").insert({
      email,
      audit_id: auditId ?? null,
      monthly_savings: monthlySavings ?? null,
      show_credex_cta: showCredexCta ?? false,
    });

    if (auditId) {
      await supabase.from("audits").update({ email }).eq("id", auditId);
      await supabase.from("events").insert({
        audit_id: auditId,
        event: "email_captured",
        meta: { monthly_savings: monthlySavings, show_credex_cta: showCredexCta },
      });
    }
  }

  if (resend) {
    // Generate PDF if result data was provided, otherwise send plain email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = result ? await generateAuditPdf(result as any, summary).catch(() => null) : null;

    const subject = monthlySavings && monthlySavings > 0
      ? `Your audit found $${monthlySavings.toLocaleString()}/mo in savings`
      : "Your AI stack audit results";

    await resend.emails.send({
      from: "StackAudit <onboarding@resend.dev>",
      to: email,
      subject,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
  <h1 style="font-size:20px;font-weight:700;margin-bottom:8px;">Your StackAudit results</h1>
  <p>Your full audit report is attached as a PDF.</p>
  <p style="margin-top:32px;font-size:12px;color:#6b7280;">
    You're receiving this because you submitted your AI stack to StackAudit.<br>
    No more emails — this is a one-time results summary.
  </p>
</body>
</html>`,
      ...(pdfBuffer && {
        attachments: [{
          filename: "stackaudit-report.pdf",
          content: pdfBuffer.toString("base64"),
        }],
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
