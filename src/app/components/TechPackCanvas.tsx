import { useState, useRef } from "react";
import { Download, ArrowLeft, ChevronDown } from "lucide-react";
import { EditableField } from "./EditableField";
import { MeasurementsTable, type Measurement } from "./MeasurementsTable";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export interface TechPackData {
  garmentType: string;
  category: string;
  silhouette?: string;
  constructionDetails: string;
  materialsTrims: string;
  colorways: string;
  specialInstructions: string;
  gradingNotes?: string;
  measurements: Measurement[];
  bom?: BOMItem[];
  annotations?: Annotation[];
  technicalDrawingSvg?: string;
}

export interface BOMItem {
  id: string;
  component: string;
  material: string;
  supplier: string;
  unitCost: string;
  quantity: string;
  total: string;
}

export interface Annotation {
  id: string;
  x: number; // percentage position on image
  y: number;
  label: string;
  linkedSection: string;
}

interface TechPackCanvasProps {
  image: string;
  brandName: string;
  data: TechPackData;
  onDataChange: (data: TechPackData) => void;
  onBack: () => void;
}

const sections = [
  { key: "identification", label: "Identification" },
  { key: "construction", label: "Construction" },
  { key: "materials", label: "Materials & Trims" },
  { key: "colorways", label: "Colorways" },
  { key: "measurements", label: "Measurements" },
  { key: "instructions", label: "Instructions" },
] as const;

export function TechPackCanvas({
  image,
  brandName,
  data,
  onDataChange,
  onBack,
}: TechPackCanvasProps) {
  const [exporting, setExporting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("identification");
  const printRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const updateField = (field: keyof TechPackData, value: string | Measurement[]) => {
    onDataChange({ ...data, [field]: value });
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setExporting(true);

    try {
      const el = printRef.current;
      const originalOverflow = el.style.overflow;
      const originalHeight = el.style.height;
      const originalMaxHeight = el.style.maxHeight;
      el.style.overflow = "visible";
      el.style.height = "auto";
      el.style.maxHeight = "none";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FDFAF7",
        logging: false,
      });

      el.style.overflow = originalOverflow;
      el.style.height = originalHeight;
      el.style.maxHeight = originalMaxHeight;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = pdfWidth / canvas.width;
      const totalHeight = canvas.height * ratio;

      let heightLeft = totalHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, totalHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = -(totalHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, totalHeight);
        heightLeft -= pdfHeight;
      }

      const filename = brandName
        ? `${brandName.replace(/\s+/g, "_")}_TechPack.pdf`
        : "TechPack.pdf";
      pdf.save(filename);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-5 border-b border-burgundy-950/[0.05] bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-md hover:bg-burgundy-950/[0.04] transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-burgundy-950/[0.08]" />
          <div className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] rounded-md bg-burgundy-950 flex items-center justify-center">
              <span className="text-white" style={{ fontSize: "10px", fontWeight: 600 }}>S</span>
            </div>
            <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {brandName || "Untitled"}
            </span>
            <span className="text-muted-foreground/40" style={{ fontSize: "0.75rem" }}>
              Tech Pack
            </span>
          </div>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-burgundy-950 text-white hover:bg-burgundy-dark transition-colors cursor-pointer disabled:opacity-40"
          style={{ fontSize: "0.8125rem" }}
        >
          <Download className="w-3.5 h-3.5" />
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar nav — desktop only */}
        <nav className="hidden lg:flex flex-col w-48 flex-shrink-0 border-r border-burgundy-950/[0.05] bg-white py-3 px-2">
          <div className="space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => scrollToSection(s.key)}
                className={`
                  w-full text-left px-2.5 py-1.5 rounded-md transition-colors cursor-pointer
                  ${activeSection === s.key
                    ? "bg-burgundy-950/[0.05] text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-burgundy-950/[0.02]"
                  }
                `}
                style={{ fontSize: "0.8125rem" }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Image preview in sidebar */}
          <div className="mt-auto pt-4 px-1">
            <div className="rounded-lg border border-burgundy-950/[0.06] overflow-hidden bg-cream">
              <img
                src={image}
                alt="Garment"
                className="w-full h-32 object-contain p-2"
              />
            </div>
            <p className="text-muted-foreground/50 mt-2 text-center" style={{ fontSize: "0.6875rem" }}>
              Reference image
            </p>
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Mobile image — collapsible */}
          <details className="lg:hidden border-b border-burgundy-950/[0.05] bg-white">
            <summary className="flex items-center justify-between px-5 py-3 cursor-pointer" style={{ fontSize: "0.8125rem" }}>
              <span className="text-muted-foreground">Reference image</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </summary>
            <div className="px-5 pb-4">
              <img src={image} alt="Garment" className="max-h-52 object-contain mx-auto" />
            </div>
          </details>

          {/* Left — Image panel (desktop) */}
          <div className="hidden lg:flex lg:w-[40%] items-center justify-center bg-white border-r border-burgundy-950/[0.05] p-8">
            <img
              src={image}
              alt="Garment"
              className="max-w-full max-h-[75vh] object-contain"
            />
          </div>

          {/* Right — Tech Pack fields */}
          <div className="flex-1 overflow-y-auto" ref={printRef}>
            <div className="max-w-xl px-6 lg:px-10 py-8 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-foreground" style={{ fontSize: "1.125rem", fontWeight: 500, letterSpacing: "-0.01em" }}>
                  Technical Specification
                </h1>
                {brandName && (
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.75rem" }}>
                    {brandName}
                  </p>
                )}
                <p className="text-muted-foreground/50 mt-1" style={{ fontSize: "0.6875rem" }}>
                  Click any value to edit · AI-estimated, verify before production
                </p>
              </div>

              {/* Garment Identification */}
              <section ref={(el) => { sectionRefs.current["identification"] = el; }}>
                <SectionHeader label="Identification" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
                  <EditableField
                    label="Garment type"
                    value={data.garmentType}
                    onChange={(v) => updateField("garmentType", v)}
                  />
                  <EditableField
                    label="Category"
                    value={data.category}
                    onChange={(v) => updateField("category", v)}
                  />
                </div>
              </section>

              {/* Construction */}
              <section ref={(el) => { sectionRefs.current["construction"] = el; }}>
                <SectionHeader label="Construction details" />
                <div className="mt-3">
                  <EditableField
                    label="Seams, closures, collar, sleeves & finishing"
                    value={data.constructionDetails}
                    onChange={(v) => updateField("constructionDetails", v)}
                    multiline
                  />
                </div>
              </section>

              {/* Materials */}
              <section ref={(el) => { sectionRefs.current["materials"] = el; }}>
                <SectionHeader label="Materials & trims" />
                <div className="mt-3">
                  <EditableField
                    label="Fabrics, linings, buttons, zippers & hardware"
                    value={data.materialsTrims}
                    onChange={(v) => updateField("materialsTrims", v)}
                    multiline
                  />
                </div>
              </section>

              {/* Colorways */}
              <section ref={(el) => { sectionRefs.current["colorways"] = el; }}>
                <SectionHeader label="Colorways" />
                <div className="mt-3">
                  <EditableField
                    label="Color specifications"
                    value={data.colorways}
                    onChange={(v) => updateField("colorways", v)}
                    multiline
                  />
                </div>
              </section>

              {/* Measurements */}
              <section ref={(el) => { sectionRefs.current["measurements"] = el; }}>
                <SectionHeader label="Measurements" />
                <p className="text-muted-foreground/40 mt-1 mb-3" style={{ fontSize: "0.6875rem" }}>
                  All values in inches · Click any cell to edit
                </p>
                <MeasurementsTable
                  measurements={data.measurements}
                  onChange={(m) => updateField("measurements", m)}
                />
              </section>

              {/* Special Instructions */}
              <section ref={(el) => { sectionRefs.current["instructions"] = el; }} className="pb-12">
                <SectionHeader label="Special instructions" />
                <div className="mt-3">
                  <EditableField
                    label="Washing, packaging, labeling & other notes"
                    value={data.specialInstructions}
                    onChange={(v) => updateField("specialInstructions", v)}
                    multiline
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <h3
        className="text-foreground"
        style={{ fontSize: "0.8125rem", fontWeight: 500 }}
      >
        {label}
      </h3>
      <div className="flex-1 h-px bg-burgundy-950/[0.04]" />
    </div>
  );
}