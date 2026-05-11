import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Generic OG image for landing page and any non-share page social shares
// Usage: /api/og?savings=640&annual=7680
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const savings = Number(searchParams.get("savings") ?? 0);
  const annual = Number(searchParams.get("annual") ?? 0);

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
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
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#111" }}>Stack</span>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#059669" }}>Audit</span>
        </div>

        {savings > 0 ? (
          <>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#059669", marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>
              Potential savings found
            </div>
            <div style={{ fontSize: 100, fontWeight: 800, color: "#059669", lineHeight: 1, marginBottom: 8 }}>
              {fmt(savings)}
              <span style={{ fontSize: 40, fontWeight: 400, color: "#34d399" }}>/mo</span>
            </div>
            {annual > 0 && (
              <div style={{ fontSize: 36, color: "#065f46", fontWeight: 600, marginBottom: 40 }}>
                {fmt(annual)} per year
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 56, fontWeight: 800, color: "#059669", marginBottom: 16, textAlign: "center" }}>
              Audit your AI tool spend
            </div>
            <div style={{ fontSize: 28, color: "#6b7280", textAlign: "center", maxWidth: 700 }}>
              Find out how much your team is overpaying — free, in 90 seconds
            </div>
          </>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          background: "white",
          borderRadius: 999,
          padding: "12px 28px",
          marginTop: 40,
          fontSize: 20,
          color: "#374151",
          border: "1px solid #d1fae5",
        }}>
          stackaudit.app — Free · No login · Sources cited
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
