/**
 * Hidden, off-screen layout rendered during PDF export.
 * Designed at a fixed 794 px width (A4 @96 dpi) so html2canvas
 * produces clean, predictable pages.
 */
import { forwardRef } from "react";
import { TechnicalDrawing } from "./TechnicalDrawing";
import type { TechPackData, BOMItem, Annotation } from "./TechPackCanvas";
import type { Measurement } from "./MeasurementsTable";
import { stageConfig, type ProjectStage } from "./data";

interface PDFExportLayoutProps {
  projectName: string;
  brand: string;
  season: string;
  assignee: string;
  stage: ProjectStage;
  image: string;
  data: TechPackData;
}

/* ── Style tokens (inline for isolation from app CSS) ── */
const C = {
  bg: "#FDFAF7",
  text: "#2A0B11",
  muted: "#6F5F64",
  mutedLight: "#9A8A8E",
  burgundy: "#6B1D2A",
  burgundyDark: "#2A0B11",
  border: "rgba(42,11,17,0.06)",
  borderStrong: "rgba(42,11,17,0.10)",
  cream: "#F5EDE4",
};

const page: React.CSSProperties = {
  width: 794,
  minHeight: 1123,
  padding: "48px 56px",
  background: C.bg,
  fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
  color: C.text,
  boxSizing: "border-box",
  position: "relative",
};

const pageBreak: React.CSSProperties = {
  pageBreakAfter: "always",
  breakAfter: "page",
};

export const PDFExportLayout = forwardRef<HTMLDivElement, PDFExportLayoutProps>(
  ({ projectName, brand, season, assignee, stage, image, data }, ref) => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const annotations = data.annotations || [];
    const bom = data.bom || [];

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: 794,
          background: C.bg,
          zIndex: -1,
        }}
      >
        {/* ═══════════ PAGE 1: COVER ═══════════ */}
        <div style={{ ...page, ...pageBreak, display: "flex", flexDirection: "column" }}>
          {/* Header bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: C.burgundy, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                SeamAI Tech Pack
              </div>
              <div style={{ fontSize: 9, color: C.mutedLight, marginTop: 2 }}>
                Confidential · For production use only
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: C.muted }}>{currentDate}</div>
              <div style={{ fontSize: 9, color: C.mutedLight }}>Rev 1.0</div>
            </div>
          </div>

          <div style={{ borderBottom: `1px solid ${C.border}`, margin: "16px 0 32px" }} />

          {/* Title block */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
              {projectName}
            </h1>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>
              {brand} · {season}
            </div>
          </div>

          {/* Photo + Meta side by side */}
          <div style={{ display: "flex", gap: 32, flex: 1, minHeight: 0 }}>
            {/* Photo */}
            <div style={{ flex: "1 1 55%", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: C.cream,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxHeight: 520,
                }}
              >
                <img
                  src={image}
                  alt={projectName}
                  crossOrigin="anonymous"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ fontSize: 8, color: C.mutedLight, textAlign: "center", marginTop: 6 }}>
                Reference photograph
              </div>
            </div>

            {/* Meta info */}
            <div style={{ flex: "1 1 45%", display: "flex", flexDirection: "column", gap: 0 }}>
              <MetaRow label="Style Name" value={projectName} />
              <MetaRow label="Brand" value={brand} />
              <MetaRow label="Season" value={season} />
              <MetaRow label="Garment Type" value={data.garmentType} />
              <MetaRow label="Category" value={data.category} />
              {data.silhouette && <MetaRow label="Silhouette" value={data.silhouette} />}
              <MetaRow label="Stage" value={stageConfig[stage].label} />
              <MetaRow label="Assigned to" value={assignee} />
              <MetaRow label="Export Date" value={currentDate} />

              {/* Callout summary */}
              {annotations.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.text, marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Callout annotations ({annotations.length})
                  </div>
                  {annotations.map((ann, i) => (
                    <div
                      key={ann.id}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        padding: "4px 0",
                        borderBottom: `1px solid ${C.border}`,
                        fontSize: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: C.burgundy,
                          color: C.cream,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 8,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ color: C.text }}>{ann.label}</span>
                      <span style={{ color: C.mutedLight, marginLeft: "auto", fontSize: 9 }}>
                        → {ann.linkedSection}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <PageFooter brand={brand} projectName={projectName} pageNum={1} />
        </div>

        {/* ═══════════ PAGE 2: TECHNICAL DRAWING ═══════════ */}
        <div style={{ ...page, ...pageBreak }}>
          <PageHeader title="Technical Drawing" subtitle="Front & back flat sketch" />
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
            <TechnicalDrawing garmentType={data.garmentType} className="" />
          </div>
          <div style={{ marginTop: 24, textAlign: "center", fontSize: 9, color: C.mutedLight }}>
            AI-generated flat sketch — verify construction details match specification
          </div>

          {/* Repeat identification summary below the drawing */}
          <div style={{ marginTop: 40, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            <SectionTitle text="Quick Reference" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px", marginTop: 12 }}>
              <FieldBlock label="Garment Type" value={data.garmentType} />
              <FieldBlock label="Category" value={data.category} />
              {data.silhouette && <FieldBlock label="Silhouette" value={data.silhouette} />}
              <FieldBlock label="Brand" value={brand} />
            </div>
          </div>
          <PageFooter brand={brand} projectName={projectName} pageNum={2} />
        </div>

        {/* ═══════════ PAGE 3: CONSTRUCTION + MATERIALS + COLORWAYS ═══════════ */}
        <div style={{ ...page, ...pageBreak }}>
          <PageHeader title="Specifications" subtitle="Construction, materials & colorways" />

          <div style={{ marginTop: 28 }}>
            <SectionTitle text="Construction Details" />
            <TextBlock value={data.constructionDetails} />
          </div>

          <div style={{ marginTop: 28 }}>
            <SectionTitle text="Materials & Trims" />
            <TextBlock value={data.materialsTrims} />
          </div>

          <div style={{ marginTop: 28 }}>
            <SectionTitle text="Colorways" />
            <TextBlock value={data.colorways} />
          </div>

          {data.gradingNotes && (
            <div style={{ marginTop: 28 }}>
              <SectionTitle text="Grading Notes" />
              <TextBlock value={data.gradingNotes} />
            </div>
          )}

          <div style={{ marginTop: 28 }}>
            <SectionTitle text="Special Instructions" />
            <TextBlock value={data.specialInstructions} />
          </div>

          <PageFooter brand={brand} projectName={projectName} pageNum={3} />
        </div>

        {/* ═══════════ PAGE 4: MEASUREMENTS ═══════════ */}
        <div style={{ ...page, ...pageBreak }}>
          <PageHeader title="Measurements" subtitle="All values in inches · Base size M" />
          <div style={{ marginTop: 24 }}>
            <MeasurementsTablePrint measurements={data.measurements} />
          </div>
          <PageFooter brand={brand} projectName={projectName} pageNum={4} />
        </div>

        {/* ═══════════ PAGE 5: BOM ═══════════ */}
        {bom.length > 0 && (
          <div style={{ ...page }}>
            <PageHeader title="Bill of Materials" subtitle="Component-level costing" />
            <div style={{ marginTop: 24 }}>
              <BOMTablePrint items={bom} />
            </div>
            <PageFooter brand={brand} projectName={projectName} pageNum={5} />
          </div>
        )}
      </div>
    );
  }
);

PDFExportLayout.displayName = "PDFExportLayout";

/* ═══════════════════════════════════════════
   Sub-components (inline, not exported)
   ═══════════════════════════════════════════ */

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: "-0.01em", color: C.text }}>{title}</h2>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 9, color: C.burgundy, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          SeamAI
        </div>
      </div>
      <div style={{ borderBottom: `1px solid ${C.border}`, marginTop: 12 }} />
    </>
  );
}

function PageFooter({ brand, projectName, pageNum }: { brand: string; projectName: string; pageNum: number }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 8,
        color: C.mutedLight,
        borderTop: `1px solid ${C.border}`,
        paddingTop: 8,
      }}
    >
      <span>{brand} · {projectName}</span>
      <span>Page {pageNum}</span>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: C.text, whiteSpace: "nowrap" }}>{text}</h3>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function TextBlock({ value }: { value: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        lineHeight: 1.7,
        color: C.text,
        background: "rgba(42,11,17,0.015)",
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "12px 16px",
        whiteSpace: "pre-wrap",
      }}
    >
      {value}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "7px 0",
        borderBottom: `1px solid ${C.border}`,
        gap: 12,
      }}
    >
      <span style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontSize: 11, color: C.text, fontWeight: 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 11, color: C.text }}>{value}</div>
    </div>
  );
}

/* ── Measurements table (print-only, no interactivity) ── */

function MeasurementsTablePrint({ measurements }: { measurements: Measurement[] }) {
  const sizes = ["xs", "s", "m", "l", "xl"] as const;
  const headerStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 600,
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    padding: "8px 10px",
    borderBottom: `1px solid ${C.borderStrong}`,
    textAlign: "center",
  };
  const cellStyle: React.CSSProperties = {
    fontSize: 11,
    color: C.text,
    padding: "7px 10px",
    borderBottom: `1px solid ${C.border}`,
    textAlign: "center",
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ ...headerStyle, textAlign: "left", width: "30%" }}>Measurement Point</th>
          {sizes.map((s) => (
            <th key={s} style={headerStyle}>{s.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {measurements.map((m) => (
          <tr key={m.id}>
            <td style={{ ...cellStyle, textAlign: "left", fontWeight: 500 }}>{m.point}</td>
            {sizes.map((s) => (
              <td key={s} style={cellStyle}>{m[s]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── BOM table (print-only, no interactivity) ── */

function BOMTablePrint({ items }: { items: BOMItem[] }) {
  const headerStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 600,
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    padding: "8px 10px",
    borderBottom: `1px solid ${C.borderStrong}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    fontSize: 10,
    color: C.text,
    padding: "7px 10px",
    borderBottom: `1px solid ${C.border}`,
  };

  const totalCost = items.reduce((sum, item) => {
    const val = parseFloat(item.total.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerStyle}>Component</th>
            <th style={headerStyle}>Material</th>
            <th style={headerStyle}>Supplier</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Unit Cost</th>
            <th style={{ ...headerStyle, textAlign: "center" }}>Qty</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ ...cellStyle, fontWeight: 500 }}>{item.component}</td>
              <td style={cellStyle}>{item.material}</td>
              <td style={cellStyle}>{item.supplier}</td>
              <td style={{ ...cellStyle, textAlign: "right" }}>{item.unitCost}</td>
              <td style={{ ...cellStyle, textAlign: "center" }}>{item.quantity}</td>
              <td style={{ ...cellStyle, textAlign: "right", fontWeight: 500 }}>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 12,
          padding: "10px 10px",
          borderTop: `2px solid ${C.borderStrong}`,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>
          Total Component Cost: ${totalCost.toFixed(2)}
        </span>
      </div>
    </>
  );
}
