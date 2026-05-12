import React from "react";
import { Document, Page, View, Text, StyleSheet, pdf } from "@react-pdf/renderer";
import type { AuditResult, Recommendation } from "@/lib/audit/types";
import { VENDOR_LABELS } from "@/lib/audit/vendors";

const ACTION_LABELS: Record<string, string> = {
  keep:           "Keep",
  downgrade:      "Downgrade",
  switch_vendor:  "Switch Vendor",
  consolidate:    "Consolidate",
  buy_via_credex: "Buy via Credex",
};

const USE_CASE_LABELS: Record<string, string> = {
  coding:   "Software development / coding",
  writing:  "Writing & content creation",
  data:     "Data analysis & BI",
  research: "Research & information gathering",
  mixed:    "Mixed / multiple use cases",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  high:   "High confidence",
  medium: "Medium confidence",
  low:    "Low confidence",
};

const GREEN  = "#059669";
const GREEN2 = "#065f46";
const GREEN3 = "#d1fae5";
const GRAY   = "#6b7280";
const LGRAY  = "#9ca3af";
const BORDER = "#e5e7eb";
const DARK   = "#111827";
const BLUE   = "#1e40af";
const BLUE2  = "#dbeafe";
const AMBER  = "#92400e";
const AMBER2 = "#fef3c7";
const ORANGE  = "#9a3412";
const ORANGE2 = "#ffedd5";

const s = StyleSheet.create({
  page:           { padding: 48, fontFamily: "Helvetica", fontSize: 10, color: DARK, backgroundColor: "#fff" },

  // ── Cover header ─────────────────────────────────────────────────────────
  coverBand:      { backgroundColor: GREEN, marginHorizontal: -48, marginTop: -48, padding: 40, paddingBottom: 32, marginBottom: 28 },
  coverLogo:      { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 6 },
  coverLogoSub:   { color: "#6ee7b7" },
  coverTitle:     { fontSize: 13, color: "#a7f3d0", marginBottom: 2 },
  coverDate:      { fontSize: 9, color: "#6ee7b7" },

  // ── Section titles ────────────────────────────────────────────────────────
  sectionTitle:   { fontSize: 12, fontWeight: "bold", color: DARK, marginBottom: 10, marginTop: 20, borderBottom: `1px solid ${BORDER}`, paddingBottom: 5 },

  // ── Hero savings box ──────────────────────────────────────────────────────
  heroBox:        { backgroundColor: "#f0fdf4", borderRadius: 8, padding: 20, marginBottom: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center", border: `1px solid ${GREEN3}` },
  heroLeft:       { flex: 1 },
  heroLabel:      { fontSize: 9, color: GREEN, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 },
  heroAmount:     { fontSize: 40, fontWeight: "bold", color: GREEN, lineHeight: 1 },
  heroAmountSub:  { fontSize: 16, fontWeight: "normal", color: "#34d399" },
  heroAnnual:     { fontSize: 14, color: GREEN2, fontWeight: "bold", marginTop: 4 },
  heroRight:      { alignItems: "flex-end" },
  heroStatLabel:  { fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 1 },
  heroStatValue:  { fontSize: 13, fontWeight: "bold", color: DARK, marginBottom: 6 },

  // ── Optimal box ───────────────────────────────────────────────────────────
  optimalBox:     { backgroundColor: "#f0fdf4", borderRadius: 8, padding: 20, marginBottom: 16, alignItems: "center", border: `1px solid ${GREEN3}` },
  optimalTitle:   { fontSize: 20, fontWeight: "bold", color: GREEN, marginBottom: 6 },
  optimalSub:     { fontSize: 10, color: GRAY, textAlign: "center" },

  // ── Summary box ───────────────────────────────────────────────────────────
  summaryBox:     { backgroundColor: "#f9fafb", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 14, marginBottom: 4 },
  summaryText:    { fontSize: 10, color: "#374151", lineHeight: 1.7 },

  // ── Input summary table ───────────────────────────────────────────────────
  tableRow:       { flexDirection: "row", borderBottom: `1px solid ${BORDER}`, paddingVertical: 6 },
  tableRowFirst:  { flexDirection: "row", borderBottom: `1px solid ${BORDER}`, paddingVertical: 6, backgroundColor: "#f9fafb" },
  tableCell:      { flex: 1, fontSize: 9, color: DARK },
  tableCellGray:  { flex: 1, fontSize: 9, color: GRAY },
  tableCellBold:  { flex: 1, fontSize: 9, fontWeight: "bold", color: DARK },
  tableCellGreen: { flex: 1, fontSize: 9, fontWeight: "bold", color: GREEN },
  tableHeader:    { flexDirection: "row", backgroundColor: "#f3f4f6", paddingVertical: 7, paddingHorizontal: 4, borderRadius: 4, marginBottom: 2 },
  tableHeaderCell:{ flex: 1, fontSize: 8, fontWeight: "bold", color: GRAY, textTransform: "uppercase", letterSpacing: 0.8 },

  // ── Recommendation card ───────────────────────────────────────────────────
  recCard:        { border: `1px solid ${BORDER}`, borderRadius: 6, marginBottom: 12, overflow: "hidden" },
  recCardTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 14, paddingBottom: 10 },
  recCardBody:    { padding: 14, paddingTop: 0 },
  recVendor:      { fontSize: 12, fontWeight: "bold", color: DARK, marginBottom: 2 },
  recTier:        { fontSize: 9, color: GRAY },
  recSavingsRow:  { flexDirection: "row", alignItems: "baseline", marginBottom: 6, marginTop: 8 },
  recMonthly:     { fontSize: 20, fontWeight: "bold", color: GREEN, marginRight: 8 },
  recAnnual:      { fontSize: 11, color: GREEN2 },
  recReasonShort: { fontSize: 10, color: DARK, marginBottom: 6, lineHeight: 1.5 },
  recDivider:     { borderTop: `1px solid ${BORDER}`, marginVertical: 8 },
  recDetailLabel: { fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  recDetailText:  { fontSize: 9, color: "#374151", lineHeight: 1.6 },
  recMeta:        { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  recConfidence:  { fontSize: 8, color: LGRAY },
  recTarget:      { fontSize: 8, color: GRAY },
  recSourceRow:   { marginTop: 4 },
  recSource:      { fontSize: 8, color: BLUE },
  recAccentLeft:  { width: 4, backgroundColor: GREEN, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 },

  // ── Badges ────────────────────────────────────────────────────────────────
  badge:          { fontSize: 8, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  badgeBlue:      { fontSize: 8, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: BLUE2, color: BLUE },
  badgeAmber:     { fontSize: 8, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: AMBER2, color: AMBER },
  badgeOrange:    { fontSize: 8, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: ORANGE2, color: ORANGE },
  badgeGreen:     { fontSize: 8, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: GREEN3, color: GREEN2 },

  // ── Savings breakdown table ────────────────────────────────────────────────
  totalRow:       { flexDirection: "row", backgroundColor: "#f0fdf4", paddingVertical: 8, paddingHorizontal: 4, borderRadius: 4, marginTop: 4, border: `1px solid ${GREEN3}` },
  totalLabel:     { flex: 3, fontSize: 10, fontWeight: "bold", color: DARK },
  totalValue:     { flex: 1, fontSize: 10, fontWeight: "bold", color: GREEN, textAlign: "right" },

  // ── Credex CTA box ─────────────────────────────────────────────────────────
  credexBox:      { backgroundColor: "#ecfdf5", border: `1px solid #6ee7b7`, borderRadius: 8, padding: 16, marginTop: 4 },
  credexTitle:    { fontSize: 12, fontWeight: "bold", color: GREEN2, marginBottom: 6 },
  credexBody:     { fontSize: 10, color: "#374151", lineHeight: 1.6, marginBottom: 8 },
  credexNote:     { fontSize: 9, color: GRAY, fontStyle: "italic" },

  // ── Next steps ─────────────────────────────────────────────────────────────
  stepRow:        { flexDirection: "row", marginBottom: 8, alignItems: "flex-start" },
  stepNum:        { width: 20, height: 20, backgroundColor: GREEN, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 10 },
  stepNumText:    { fontSize: 9, color: "#fff", fontWeight: "bold" },
  stepText:       { flex: 1, fontSize: 10, color: DARK, lineHeight: 1.5 },

  // ── Methodology ────────────────────────────────────────────────────────────
  methBox:        { backgroundColor: "#f9fafb", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 14, marginTop: 4 },
  methText:       { fontSize: 9, color: GRAY, lineHeight: 1.6 },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer:         { position: "absolute", bottom: 28, left: 48, right: 48, borderTop: `1px solid ${BORDER}`, paddingTop: 8, flexDirection: "row", justifyContent: "space-between" },
  footerLeft:     { fontSize: 8, color: LGRAY },
  footerRight:    { fontSize: 8, color: LGRAY },
});

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function badgeForAction(action: string) {
  if (action === "switch_vendor") return s.badgeBlue;
  if (action === "downgrade")     return s.badgeAmber;
  if (action === "consolidate")   return s.badgeOrange;
  return s.badgeGreen;
}

function RecCard({ rec, index }: { rec: Recommendation; index: number }) {
  const accentColor = rec.monthlySavings > 0 ? GREEN : BORDER;
  return (
    <View style={s.recCard}>
      <View style={{ flexDirection: "row" }}>
        {/* Left accent bar */}
        <View style={{ width: 4, backgroundColor: accentColor, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }} />
        <View style={{ flex: 1 }}>
          <View style={s.recCardTop}>
            <View>
              <Text style={s.recVendor}>
                {index + 1}. {VENDOR_LABELS[rec.vendor]}
              </Text>
              <Text style={s.recTier}>Current plan: {rec.currentTier}  ·  Paying: {fmt(rec.currentMonthlySpend)}/mo</Text>
            </View>
            <Text style={badgeForAction(rec.action)}>{ACTION_LABELS[rec.action] ?? rec.action}</Text>
          </View>

          <View style={s.recCardBody}>
            {/* Savings */}
            {rec.monthlySavings > 0 && (
              <View style={s.recSavingsRow}>
                <Text style={s.recMonthly}>{fmt(rec.monthlySavings)}<Text style={{ fontSize: 11, fontWeight: "normal" }}>/mo</Text></Text>
                <Text style={s.recAnnual}>{fmt(rec.annualSavings)}/yr potential savings</Text>
              </View>
            )}

            {/* Short reason */}
            <Text style={s.recReasonShort}>{rec.reasonShort}</Text>

            {/* Detailed reason */}
            <View style={s.recDivider} />
            <Text style={s.recDetailLabel}>Why this recommendation</Text>
            <Text style={s.recDetailText}>{rec.reasonDetailed}</Text>

            {/* Source URL */}
            {rec.sourceUrl && (
              <View style={s.recSourceRow}>
                <Text style={s.recSource}>Source: {rec.sourceUrl}</Text>
              </View>
            )}

            {/* Meta row */}
            <View style={s.recMeta}>
              <Text style={s.recConfidence}>{CONFIDENCE_LABELS[rec.confidence] ?? rec.confidence}</Text>
              {rec.toVendor && (
                <Text style={s.recTarget}>
                  Recommended: {VENDOR_LABELS[rec.toVendor]}{rec.toTier ? ` — ${rec.toTier}` : ""}
                </Text>
              )}
              {!rec.toVendor && rec.toTier && (
                <Text style={s.recTarget}>Recommended tier: {rec.toTier}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function AuditReportDoc({ result, summary }: { result: AuditResult; summary?: string }) {
  const { totalMonthlySavings, totalAnnualSavings, recommendations, isAlreadyOptimal, showCredexCta, input } = result;
  const reportDate = new Date(result.createdAt ?? Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const savingsRecs = recommendations.filter(r => r.monthlySavings > 0);
  const keepRecs    = recommendations.filter(r => r.action === "keep");

  return (
    <Document title="StackAudit Report" author="StackAudit" subject="AI Tool Spend Audit">

      {/* ── PAGE 1: Header + Hero + Input Summary ── */}
      <Page size="A4" style={s.page}>
        {/* Green cover band */}
        <View style={s.coverBand}>
          <Text style={s.coverLogo}>Stack<Text style={s.coverLogoSub}>Audit</Text></Text>
          <Text style={s.coverTitle}>AI Tool Spend Report</Text>
          <Text style={s.coverDate}>Generated {reportDate}  ·  stackaudit.app</Text>
        </View>

        {/* Hero savings / optimal */}
        {isAlreadyOptimal ? (
          <View style={s.optimalBox}>
            <Text style={s.optimalTitle}>Your stack is lean ✓</Text>
            <Text style={s.optimalSub}>No significant savings found (&lt;$100/mo). You're spending well on AI tools.</Text>
          </View>
        ) : (
          <View style={s.heroBox}>
            <View style={s.heroLeft}>
              <Text style={s.heroLabel}>Total potential savings</Text>
              <Text style={s.heroAmount}>{fmt(totalMonthlySavings)}<Text style={s.heroAmountSub}>/mo</Text></Text>
              <Text style={s.heroAnnual}>{fmt(totalAnnualSavings)} per year</Text>
            </View>
            <View style={s.heroRight}>
              <Text style={s.heroStatLabel}>Findings</Text>
              <Text style={s.heroStatValue}>{savingsRecs.length} actionable</Text>
              <Text style={s.heroStatLabel}>Tools reviewed</Text>
              <Text style={s.heroStatValue}>{input.tools.length} tools</Text>
              <Text style={s.heroStatLabel}>Team size</Text>
              <Text style={s.heroStatValue}>{input.teamSize} people</Text>
            </View>
          </View>
        )}

        {/* AI Summary */}
        {summary && (
          <>
            <Text style={s.sectionTitle}>Executive Summary</Text>
            <View style={s.summaryBox}>
              <Text style={s.summaryText}>{summary}</Text>
            </View>
          </>
        )}

        {/* Input: tools audited */}
        <Text style={s.sectionTitle}>Tools Audited</Text>
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, { flex: 2 }]}>Tool</Text>
          <Text style={s.tableHeaderCell}>Plan</Text>
          <Text style={s.tableHeaderCell}>Monthly spend</Text>
          <Text style={s.tableHeaderCell}>Seats</Text>
          <Text style={s.tableHeaderCell}>Cost/seat</Text>
        </View>
        {input.tools.map((tool, i) => (
          <View key={i} style={i % 2 === 0 ? s.tableRow : { ...s.tableRow, backgroundColor: "#f9fafb" }}>
            <Text style={[s.tableCellBold, { flex: 2 }]}>{VENDOR_LABELS[tool.vendor]}</Text>
            <Text style={s.tableCell}>{tool.tier}</Text>
            <Text style={s.tableCellGreen}>{fmt(tool.monthlySpend)}</Text>
            <Text style={s.tableCell}>{tool.seats}</Text>
            <Text style={s.tableCellGray}>{fmt(tool.seats > 0 ? tool.monthlySpend / tool.seats : 0)}</Text>
          </View>
        ))}
        {/* Total row */}
        <View style={s.totalRow}>
          <Text style={[s.totalLabel, { flex: 3 }]}>Total monthly spend</Text>
          <Text style={s.totalValue}>{fmt(input.tools.reduce((s, t) => s + t.monthlySpend, 0))}</Text>
        </View>

        {/* Team context */}
        <Text style={s.sectionTitle}>Audit Context</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>Team size</Text>
            <Text style={{ fontSize: 13, fontWeight: "bold", color: DARK }}>{input.teamSize} people</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={{ fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>Primary use case</Text>
            <Text style={{ fontSize: 13, fontWeight: "bold", color: DARK }}>{USE_CASE_LABELS[input.primaryUseCase] ?? input.primaryUseCase}</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerLeft}>StackAudit · stackaudit.app</Text>
          <Text style={s.footerRight}>Page 1</Text>
        </View>
      </Page>

      {/* ── PAGE 2: Full Recommendation Cards ── */}
      {recommendations.length > 0 && (
        <Page size="A4" style={s.page}>
          <Text style={[s.sectionTitle, { marginTop: 0 }]}>Findings & Recommendations</Text>
          <Text style={{ fontSize: 9, color: GRAY, marginBottom: 14 }}>
            {savingsRecs.length} recommendation{savingsRecs.length !== 1 ? "s" : ""} with potential savings  ·  {keepRecs.length} tool{keepRecs.length !== 1 ? "s" : ""} already optimal
          </Text>
          {recommendations.map((rec, i) => <RecCard key={i} rec={rec} index={i} />)}

          <View style={s.footer}>
            <Text style={s.footerLeft}>StackAudit · stackaudit.app</Text>
            <Text style={s.footerRight}>Page 2</Text>
          </View>
        </Page>
      )}

      {/* ── PAGE 3: Savings Breakdown + Next Steps + Methodology ── */}
      <Page size="A4" style={s.page}>

        {/* Savings breakdown table */}
        {savingsRecs.length > 0 && (
          <>
            <Text style={[s.sectionTitle, { marginTop: 0 }]}>Savings Breakdown</Text>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, { flex: 3 }]}>Tool</Text>
              <Text style={s.tableHeaderCell}>Action</Text>
              <Text style={s.tableHeaderCell}>Monthly</Text>
              <Text style={s.tableHeaderCell}>Annual</Text>
            </View>
            {savingsRecs.map((rec, i) => (
              <View key={i} style={i % 2 === 0 ? s.tableRow : { ...s.tableRow, backgroundColor: "#f9fafb" }}>
                <Text style={[s.tableCellBold, { flex: 3 }]}>{VENDOR_LABELS[rec.vendor]} ({rec.currentTier})</Text>
                <Text style={s.tableCell}>{ACTION_LABELS[rec.action]}</Text>
                <Text style={s.tableCellGreen}>{fmt(rec.monthlySavings)}</Text>
                <Text style={s.tableCellGreen}>{fmt(rec.annualSavings)}</Text>
              </View>
            ))}
            <View style={s.totalRow}>
              <Text style={[s.totalLabel, { flex: 4 }]}>Total potential savings</Text>
              <Text style={s.totalValue}>{fmt(totalMonthlySavings)}/mo</Text>
              <Text style={[s.totalValue, { flex: 1 }]}>{fmt(totalAnnualSavings)}/yr</Text>
            </View>
          </>
        )}

        {/* Credex CTA */}
        {showCredexCta && (
          <>
            <Text style={s.sectionTitle}>Additional Savings via Credex</Text>
            <View style={s.credexBox}>
              <Text style={s.credexTitle}>Save an extra 15–30% through Credex purchasing</Text>
              <Text style={s.credexBody}>
                With {fmt(totalMonthlySavings)}/month already on the table from plan optimizations, Credex can layer in additional savings through discounted AI tool credits. Credex negotiates volume pricing with providers like Anthropic and OpenAI and passes the discount directly to your team.
              </Text>
              <Text style={s.credexNote}>Visit credex.app to get a quote based on your usage.</Text>
            </View>
          </>
        )}

        {/* Next steps */}
        <Text style={s.sectionTitle}>Recommended Next Steps</Text>
        {savingsRecs.slice(0, 3).map((rec, i) => (
          <View key={i} style={s.stepRow}>
            <View style={s.stepNum}><Text style={s.stepNumText}>{i + 1}</Text></View>
            <Text style={s.stepText}>
              <Text style={{ fontWeight: "bold" }}>{VENDOR_LABELS[rec.vendor]}: </Text>
              {rec.reasonShort} Saves {fmt(rec.monthlySavings)}/mo.
            </Text>
          </View>
        ))}

        {/* Methodology */}
        <Text style={s.sectionTitle}>Methodology & Disclaimer</Text>
        <View style={s.methBox}>
          <Text style={s.methText}>
            All pricing data was verified directly from vendor websites on 2026-05-08. Savings figures are estimates based on public list prices and may differ from your actual contracted rates, annual commitments, or enterprise discounts.{"\n\n"}
            The audit engine uses a deterministic rules system — not AI-generated recommendations. Each recommendation links to the source pricing page used to calculate the saving. Rules run in priority order: use-case fit → API vs. subscription → plan tier → redundancy.{"\n\n"}
            Confidence levels reflect how certain the recommendation is given available information: High = clear optimization with verified pricing; Medium = depends on usage patterns not captured in this audit; Low = directional only, verify before acting.{"\n\n"}
            This report is for informational purposes only and does not constitute financial advice. Re-run the audit quarterly as vendor pricing changes frequently.
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerLeft}>StackAudit · stackaudit.app · Pricing verified 2026-05-08</Text>
          <Text style={s.footerRight}>Page 3</Text>
        </View>
      </Page>

    </Document>
  );
}

export async function generateAuditPdf(result: AuditResult, summary?: string): Promise<Buffer> {
  const doc = <AuditReportDoc result={result} summary={summary} />;
  const instance = pdf(doc);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
