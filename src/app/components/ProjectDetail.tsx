import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Download, ChevronRight, BookOpen, Check, Image, Ruler } from "lucide-react";
import { toast } from "sonner";
import { sampleProjects, stageConfig, stageOrder, type ProjectStage } from "./data";
import { generateMockTechPack } from "./mockTechPackData";
import { EditableField } from "./EditableField";
import { MeasurementsTable, type Measurement } from "./MeasurementsTable";
import { AnnotationLayer } from "./AnnotationLayer";
import { BOMTable } from "./BOMTable";
import { AISuggestions } from "./AISuggestions";
import { BrandMemory, defaultBrandDefaults, type BrandDefaults } from "./BrandMemory";
import { TechnicalDrawing } from "./TechnicalDrawing";
import { PDFExportLayout } from "./PDFExportLayout";
import type { TechPackData, BOMItem, Annotation } from "./TechPackCanvas";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const sectionKeys = [
  "identification",
  "construction",
  "materials",
  "colorways",
  "measurements",
  "grading",
  "bom",
  "instructions",
] as const;

const sectionLabels: Record<string, string> = {
  identification: "Identification",
  construction: "Construction",
  materials: "Materials & Trims",
  colorways: "Colorways",
  measurements: "Measurements",
  grading: "Grading",
  bom: "Bill of Materials",
  instructions: "Instructions",
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = sampleProjects.find((p) => p.id === id);
  const [data, setData] = useState<TechPackData>(() => {
    // Check for AI-generated tech pack from NewProject flow
    const stored = sessionStorage.getItem("seamai_new_techpack");
    if (stored && id === "proj-4") {
      try {
        sessionStorage.removeItem("seamai_new_techpack");
        const parsed = JSON.parse(stored);
        return parsed as TechPackData;
      } catch {
        // Fall through to default
      }
    }
    return project?.techPack || generateMockTechPack(project?.brand || "");
  });
  const [activeSection, setActiveSection] = useState("identification");
  const [stage, setStage] = useState<ProjectStage>(project?.stage || "tech_pack");
  const [exporting, setExporting] = useState(false);
  const [showBrandMemory, setShowBrandMemory] = useState(false);
  const [brandDefaults, setBrandDefaults] = useState<BrandDefaults>(defaultBrandDefaults);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("saved");
  const [imagePanelView, setImagePanelView] = useState<"photo" | "technical">("photo");
  const printRef = useRef<HTMLDivElement>(null);
  const pdfLayoutRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground/60" style={{ fontSize: "0.875rem" }}>
            Project not found
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-3 text-burgundy/60 hover:text-burgundy cursor-pointer"
            style={{ fontSize: "0.8125rem" }}
          >
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  // Auto-save simulation
  const updateField = (field: keyof TechPackData, value: string | Measurement[] | BOMItem[] | Annotation[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaveStatus("saved"), 800);
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll spy
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const scrollTop = el.scrollTop + 120;
      let current = "identification";
      for (const key of sectionKeys) {
        const ref = sectionRefs.current[key];
        if (ref && ref.offsetTop <= scrollTop) current = key;
      }
      setActiveSection(current);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const advanceStage = () => {
    const idx = stageOrder.indexOf(stage);
    if (idx < stageOrder.length - 1) {
      const next = stageOrder[idx + 1];
      setStage(next);
      toast(`Moved to ${stageConfig[next].label}`);
    }
  };

  const handleExportPDF = async () => {
    if (!pdfLayoutRef.current) return;
    setExporting(true);
    try {
      const el = pdfLayoutRef.current;
      // Temporarily make layout visible for capture
      const origLeft = el.style.left;
      el.style.left = "0px";

      // Find all page-like children (direct divs with min-height)
      const pages = Array.from(el.children) as HTMLElement[];
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#FDFAF7",
          logging: false,
          width: 794,
        });
        const imgData = canvas.toDataURL("image/png");
        const ratio = pdfW / canvas.width;
        const imgH = canvas.height * ratio;

        if (i > 0) pdf.addPage();

        // If page content is taller than one PDF page, tile it
        if (imgH > pdfH) {
          let yOffset = 0;
          let remaining = imgH;
          let first = true;
          while (remaining > 0) {
            if (!first) pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, yOffset, pdfW, imgH);
            yOffset -= pdfH;
            remaining -= pdfH;
            first = false;
          }
        } else {
          pdf.addImage(imgData, "PNG", 0, 0, pdfW, imgH);
        }
      }

      el.style.left = origLeft;

      const filename = `${project.name.replace(/\s+/g, "_")}_TechPack.pdf`;
      pdf.save(filename);
      toast("PDF exported successfully");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast("Export failed — try again");
    } finally {
      setExporting(false);
    }
  };

  const currentStageConfig = stageConfig[stage];
  const nextStageIdx = stageOrder.indexOf(stage) + 1;
  const nextStage = nextStageIdx < stageOrder.length ? stageConfig[stageOrder[nextStageIdx]] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between h-[52px] px-5 border-b border-burgundy-950/[0.04] bg-white flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/projects")}
            className="p-1.5 -ml-1.5 rounded-[6px] hover:bg-burgundy-950/[0.04] transition-colors text-muted-foreground hover:text-foreground cursor-pointer flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-burgundy-950/[0.06] flex-shrink-0" />
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-[6px] overflow-hidden bg-cream flex-shrink-0 border border-burgundy-950/[0.04]">
              <ImageWithFallback src={project.image} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-foreground truncate" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {project.name}
            </span>
            <span className="text-muted-foreground/30 hidden sm:inline flex-shrink-0" style={{ fontSize: "0.75rem" }}>
              {project.brand}
            </span>
          </div>
          {/* Save status */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {saveStatus === "saved" && (
              <div className="flex items-center gap-1 text-muted-foreground/30">
                <Check className="w-2.5 h-2.5" />
                <span style={{ fontSize: "0.5625rem" }}>Saved</span>
              </div>
            )}
            {saveStatus === "saving" && (
              <span className="text-muted-foreground/30" style={{ fontSize: "0.5625rem" }}>Saving...</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Stage */}
          <div className="hidden sm:flex items-center gap-1">
            <span
              className={`px-2 py-0.5 rounded-[5px] ${currentStageConfig.bgColor} ${currentStageConfig.color}`}
              style={{ fontSize: "0.625rem", fontWeight: 500 }}
            >
              {currentStageConfig.label}
            </span>
            {nextStage && (
              <button
                onClick={advanceStage}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[5px] hover:bg-burgundy-950/[0.04] text-muted-foreground/40 hover:text-foreground transition-all cursor-pointer"
                style={{ fontSize: "0.625rem" }}
                title={`Move to ${nextStage.label}`}
              >
                <ChevronRight className="w-2.5 h-2.5" />
                {nextStage.label}
              </button>
            )}
          </div>
          <div className="w-px h-3.5 bg-burgundy-950/[0.06] hidden sm:block" />
          <button
            onClick={() => setShowBrandMemory(!showBrandMemory)}
            className={`p-1.5 rounded-[6px] transition-all cursor-pointer ${
              showBrandMemory ? "bg-burgundy/8 text-burgundy" : "text-muted-foreground/40 hover:text-foreground hover:bg-burgundy-950/[0.04]"
            }`}
            title="Brand defaults"
          >
            <BookOpen className="w-[15px] h-[15px]" />
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-burgundy-950 text-cream hover:bg-burgundy-dark transition-colors cursor-pointer disabled:opacity-40"
            style={{ fontSize: "0.8125rem" }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{exporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex min-h-0">
        {/* Section nav sidebar */}
        <nav className="hidden lg:flex flex-col w-[168px] flex-shrink-0 border-r border-burgundy-950/[0.04] bg-white py-4 px-2">
          <div className="space-y-0.5">
            {sectionKeys.map((key) => (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className={`w-full text-left px-2.5 py-[6px] rounded-[6px] transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === key
                    ? "bg-burgundy-950/[0.05] text-foreground"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-burgundy-950/[0.02]"
                }`}
                style={{ fontSize: "0.8125rem" }}
              >
                <div
                  className={`w-[3px] h-[3px] rounded-full flex-shrink-0 transition-all ${
                    activeSection === key ? "bg-burgundy" : "bg-transparent"
                  }`}
                />
                {sectionLabels[key]}
              </button>
            ))}
          </div>
          {/* Thumbnail */}
          <div className="mt-auto pt-4 px-1">
            <div className="rounded-[8px] border border-burgundy-950/[0.05] overflow-hidden bg-cream">
              <ImageWithFallback src={project.image} alt="" className="w-full h-24 object-cover" />
            </div>
            <p className="text-muted-foreground/50 mt-1.5 text-center" style={{ fontSize: "0.5625rem" }}>
              {project.season} · {project.assignee}
            </p>
          </div>
        </nav>

        {/* Image panel with annotation layer */}
        <div className="hidden lg:flex lg:w-[38%] flex-col bg-white border-r border-burgundy-950/[0.04]">
          {/* View tabs */}
          <div className="flex items-center border-b border-burgundy-950/[0.04] px-3 flex-shrink-0">
            <button
              onClick={() => setImagePanelView("photo")}
              className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors cursor-pointer ${
                imagePanelView === "photo"
                  ? "border-burgundy-950 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              <Image className="w-3 h-3" />
              Photo
            </button>
            <button
              onClick={() => setImagePanelView("technical")}
              className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors cursor-pointer ${
                imagePanelView === "technical"
                  ? "border-burgundy-950 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              <Ruler className="w-3 h-3" />
              Technical Drawing
            </button>
          </div>

          {/* Panel content */}
          {imagePanelView === "photo" ? (
            <AnnotationLayer
              image={project.image}
              annotations={data.annotations || []}
              onChange={(annotations) => updateField("annotations", annotations)}
              onAnnotationClick={scrollToSection}
            />
          ) : (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="flex-1 flex items-center justify-center p-8">
                <TechnicalDrawing garmentType={data.garmentType} className="w-full" />
              </div>
              <div className="px-4 pb-4 flex-shrink-0">
                <div className="rounded-[8px] bg-burgundy-950/[0.015] border border-burgundy-950/[0.04] px-3 py-2.5">
                  <p className="text-muted-foreground" style={{ fontSize: "0.6875rem", fontWeight: 500 }}>
                    {data.garmentType}
                  </p>
                  <p className="text-muted-foreground/60 mt-0.5" style={{ fontSize: "0.625rem" }}>
                    AI-generated flat sketch · Front and back views · Verify construction details match spec
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tech pack fields */}
        <div className="flex-1 overflow-y-auto" ref={(el) => { scrollRef.current = el; printRef.current = el; }}>
          <div className="max-w-[540px] px-6 lg:px-10 py-8 space-y-9">
            {/* Header */}
            <div>
              <h1 className="text-foreground" style={{ fontSize: "1.125rem", fontWeight: 500, letterSpacing: "-0.015em" }}>
                Technical Specification
              </h1>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.75rem" }}>
                {project.brand} · {project.season}
              </p>
              <p className="text-muted-foreground/60 mt-1" style={{ fontSize: "0.6875rem" }}>
                Click any value to edit · AI-estimated, verify before production
              </p>
            </div>

            {/* Pipeline progress */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                {stageOrder.map((s, i) => {
                  const idx = stageOrder.indexOf(stage);
                  const isComplete = i <= idx;
                  return (
                    <div
                      key={s}
                      className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                        isComplete ? "bg-burgundy-950" : "bg-burgundy-950/[0.05]"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground/30" style={{ fontSize: "0.5625rem" }}>Design</span>
                <span className="text-muted-foreground/30" style={{ fontSize: "0.5625rem" }}>Complete</span>
              </div>
            </div>

            {/* AI Suggestions */}
            <AISuggestions data={data} onApply={(field, value) => updateField(field, value)} />

            {/* Brand Memory */}
            {showBrandMemory && (
              <BrandMemory brandName={project.brand} defaults={brandDefaults} onDefaultsChange={setBrandDefaults} />
            )}

            {/* Identification */}
            <section ref={(el) => { sectionRefs.current["identification"] = el; }}>
              <SectionHeader label="Identification" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
                <EditableField label="Garment type" value={data.garmentType} onChange={(v) => updateField("garmentType", v)} />
                <EditableField label="Category" value={data.category} onChange={(v) => updateField("category", v)} />
              </div>
              {data.silhouette && (
                <div className="mt-3">
                  <EditableField label="Silhouette classification" value={data.silhouette} onChange={(v) => updateField("silhouette", v)} />
                </div>
              )}
            </section>

            <section ref={(el) => { sectionRefs.current["construction"] = el; }}>
              <SectionHeader label="Construction details" />
              <div className="mt-3">
                <EditableField label="Seams, closures, collar, sleeves & finishing" value={data.constructionDetails} onChange={(v) => updateField("constructionDetails", v)} multiline />
              </div>
            </section>

            <section ref={(el) => { sectionRefs.current["materials"] = el; }}>
              <SectionHeader label="Materials & trims" />
              <div className="mt-3">
                <EditableField label="Fabrics, linings, buttons, zippers & hardware" value={data.materialsTrims} onChange={(v) => updateField("materialsTrims", v)} multiline />
              </div>
            </section>

            <section ref={(el) => { sectionRefs.current["colorways"] = el; }}>
              <SectionHeader label="Colorways" />
              <div className="mt-3">
                <EditableField label="Color specifications" value={data.colorways} onChange={(v) => updateField("colorways", v)} multiline />
              </div>
            </section>

            <section ref={(el) => { sectionRefs.current["measurements"] = el; }}>
              <SectionHeader label="Measurements" />
              <p className="text-muted-foreground/60 mt-1 mb-3" style={{ fontSize: "0.6875rem" }}>
                All values in inches · Click any cell to edit
              </p>
              <MeasurementsTable measurements={data.measurements} onChange={(m) => updateField("measurements", m)} />
            </section>

            <section ref={(el) => { sectionRefs.current["grading"] = el; }}>
              <SectionHeader label="Grading notes" />
              <div className="mt-3">
                <EditableField label="Size increment rules & base size" value={data.gradingNotes || ""} onChange={(v) => updateField("gradingNotes", v)} multiline />
              </div>
            </section>

            <section ref={(el) => { sectionRefs.current["bom"] = el; }}>
              <SectionHeader label="Bill of Materials" />
              <p className="text-muted-foreground/60 mt-1 mb-3" style={{ fontSize: "0.6875rem" }}>
                Component-level costing · Prices linked to supplier catalog · Click cells to edit
              </p>
              <BOMTable items={data.bom || []} onChange={(items) => updateField("bom", items)} />
            </section>

            <section ref={(el) => { sectionRefs.current["instructions"] = el; }} className="pb-16">
              <SectionHeader label="Special instructions" />
              <div className="mt-3">
                <EditableField label="Washing, packaging, labeling & other notes" value={data.specialInstructions} onChange={(v) => updateField("specialInstructions", v)} multiline />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Hidden PDF export layout */}
      <PDFExportLayout
        ref={pdfLayoutRef}
        projectName={project.name}
        brand={project.brand}
        season={project.season || ""}
        assignee={project.assignee || ""}
        stage={stage}
        image={project.image}
        data={data}
      />
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="text-foreground flex-shrink-0" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
        {label}
      </h3>
      <div className="flex-1 h-px bg-burgundy-950/[0.03]" />
    </div>
  );
}