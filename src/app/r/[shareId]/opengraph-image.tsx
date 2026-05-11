import { ImageResponse } from "next/og";
import { getSupabaseClient } from "@/lib/supabase/client";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function OGImage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const supabase = getSupabaseClient();

  let monthlySavings = 0;
  let annualSavings = 0;
  let isOptimal = false;

  if (supabase) {
    const { data } = await supabase
      .from("audits")
      .select("result")
      .eq("id", shareId)
      .single();

    if (data?.result) {
      const r = data.result as { totalMonthlySavings: number; totalAnnualSavings: number; isAlreadyOptimal: boolean };
      monthlySavings = r.totalMonthlySavings ?? 0;
      annualSavings = r.totalAnnualSavings ?? 0;
      isOptimal = r.isAlreadyOptimal ?? false;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #dcfce7 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>Stack</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>Audit</span>
        </div>

        {isOptimal ? (
          <>
            <div style={{ fontSize: 72, fontWeight: 800, color: "#059669", marginBottom: 16 }}>
              Stack is lean ✓
            </div>
            <div style={{ fontSize: 28, color: "#6b7280", textAlign: "center", maxWidth: 700 }}>
              No significant savings found — this team spends well on AI tools
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#059669", marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>
              Potential savings found
            </div>
            <div style={{ fontSize: 100, fontWeight: 800, color: "#059669", lineHeight: 1, marginBottom: 8 }}>
              {fmt(monthlySavings)}
              <span style={{ fontSize: 40, fontWeight: 400, color: "#34d399" }}>/mo</span>
            </div>
            <div style={{ fontSize: 36, color: "#065f46", fontWeight: 600, marginBottom: 40 }}>
              {fmt(annualSavings)} per year
            </div>
          </>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "white",
          borderRadius: 999,
          padding: "12px 28px",
          fontSize: 20,
          color: "#374151",
          border: "1px solid #d1fae5",
        }}>
          Audit your stack free at stackaudit.app
        </div>
      </div>
    ),
    { ...size },
  );
}
