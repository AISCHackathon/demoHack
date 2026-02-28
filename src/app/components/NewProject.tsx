import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { analyzeImage, type AnalyzeContext } from "./api";
import { createNewProject, addProject } from "./projectStore";
import type { TechPackData } from "./TechPackCanvas";
import { toast } from "sonner";
import {
  Check,
  X,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Tag,
  Layers,
  Calendar,
  DollarSign,
  User,
  Factory,
} from "lucide-react";

type FlowStep = 1 | 2 | 3;
type FlowState = "form" | "processing";

const steps = [
  "Analyzing garment structure",
  "Identifying construction details",
  "Estimating materials & trims",
  "Generating measurements",
  "Compiling tech pack",
];

const garmentTypes = [
  "Blazer",
  "T-Shirt",
  "Dress",
  "Trousers",
  "Jacket",
  "Skirt",
  "Coat",
  "Hoodie",
  "Shirt",
  "Shorts",
  "Knitwear",
  "Other",
];

const pricePoints = [
  { label: "Economy", range: "$15–40", value: "economy" },
  { label: "Contemporary", range: "$40–120", value: "contemporary" },
  { label: "Premium", range: "$120–300", value: "premium" },
  { label: "Luxury", range: "$300+", value: "luxury" },
];

const assignees = ["Elena V.", "Marcus T.", "Sana K."];

const brands = ["Maison Lumière", "Atelier Rosé"];

const partners = [
  { id: "p-1", name: "Donghua Textile", type: "Manufacturer", region: "China" },
  { id: "p-3", name: "Saigon Stitch Co.", type: "Manufacturer", region: "Vietnam" },
  { id: "p-4", name: "Nordic Knit Mills", type: "Manufacturer", region: "Portugal" },
];

export function NewProject() {
  const navigate = useNavigate();
  const [flowState, setFlowState] = useState<FlowState>("form");
  const [step, setStep] = useState<FlowStep>(1);

  // Step 1 — Upload
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — Details
  const [projectName, setProjectName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [season, setSeason] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [pricePoint, setPricePoint] = useState("");
  const [assignee, setAssignee] = useState("");
  const [notes, setNotes] = useState("");

  // Step 3 — Sourcing
  const [selectedPartner, setSelectedPartner] = useState("");
  const [targetQuantity, setTargetQuantity] = useState("");
  const [targetDate, setTargetDate] = useState("");

  // Processing
  const [processingStep, setProcessingStep] = useState(0);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const canAdvance = (s: FlowStep) => {
    if (s === 1) return !!preview;
    if (s === 2) return true; // all optional
    if (s === 3) return true;
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as FlowStep);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as FlowStep);
  };

  const handleSubmit = () => {
    if (!preview) return;
    setFlowState("processing");
    setProcessingStep(0);
  };

  // Auto-advance to step 2 when image uploaded
  useEffect(() => {
    if (preview && step === 1) {
      const t = setTimeout(() => setStep(2), 400);
      return () => clearTimeout(t);
    }
  }, [preview, step]);

  // Processing simulation
  useEffect(() => {
    if (flowState !== "processing") return;

    let cancelled = false;

    async function runAnalysis() {
      // Step-through animation timers for visual feedback
      const stepTimers: ReturnType<typeof setTimeout>[] = [];
      for (let i = 1; i <= 2; i++) {
        stepTimers.push(setTimeout(() => { if (!cancelled) setProcessingStep(i); }, i * 800));
      }

      try {
        // Extract base64 data from the data URL
        const dataUrl = preview!;
        const [header, base64Data] = dataUrl.split(",");
        const mediaType = header.match(/data:(.*?);/)?.[1] || "image/jpeg";

        const context: AnalyzeContext = {};
        if (garmentType) context.garmentType = garmentType;
        if (brandName) context.brand = brandName;
        if (season) context.season = season;
        if (pricePoint) context.pricePoint = pricePoint;
        if (notes) context.notes = notes;

        const result = await analyzeImage(base64Data, mediaType, context);

        if (cancelled) return;

        // Advance remaining steps quickly after API returns
        setProcessingStep(3);
        await new Promise((r) => setTimeout(r, 400));
        if (cancelled) return;
        setProcessingStep(4);
        await new Promise((r) => setTimeout(r, 400));
        if (cancelled) return;

        // Create a real project in the store with the AI-analyzed tech pack
        const techPack = (result.techPack || {}) as unknown as TechPackData;
        // Include the AI-generated SVG drawing if available
        if (result.technicalDrawingSvg) {
          techPack.technicalDrawingSvg = result.technicalDrawingSvg;
        }
        const newProject = createNewProject({
          name: projectName || techPack.garmentType || "Untitled Project",
          brand: brandName || "Unknown",
          season: season || "",
          assignee: assignee || "",
          image: preview!,
          techPack,
        });
        addProject(newProject);

        toast("Tech pack generated successfully");
        navigate(`/projects/${newProject.id}`);
      } catch (err) {
        if (cancelled) return;
        console.error("AI analysis failed:", err);
        toast("AI analysis unavailable — using default template");
        // Still advance steps for UX
        for (let i = 3; i <= 4; i++) {
          setProcessingStep(i);
          await new Promise((r) => setTimeout(r, 300));
        }
        await new Promise((r) => setTimeout(r, 500));

        // Create project with empty/default tech pack so user can still edit
        const fallbackPack: TechPackData = {
          garmentType: garmentType || "Garment",
          category: "Ready-to-Wear",
          constructionDetails: "",
          materialsTrims: "",
          colorways: "",
          specialInstructions: "",
          measurements: [],
        };
        const newProject = createNewProject({
          name: projectName || "Untitled Project",
          brand: brandName || "Unknown",
          season: season || "",
          assignee: assignee || "",
          image: preview!,
          techPack: fallbackPack,
        });
        addProject(newProject);
        navigate(`/projects/${newProject.id}`);
      }

      stepTimers.forEach(clearTimeout);
    }

    runAnalysis();
    return () => { cancelled = true; };
  }, [flowState, navigate]);

  /* ── Processing screen ── */
  if (flowState === "processing") {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="w-full max-w-[320px]">
          {preview && (
            <div className="w-14 h-14 rounded-[10px] overflow-hidden bg-cream border border-burgundy-950/[0.06] mx-auto mb-6">
              <img src={preview} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          {projectName && (
            <p className="text-center text-foreground mb-1" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
              {projectName}
            </p>
          )}
          {brandName && (
            <p className="text-center text-muted-foreground/40 mb-6" style={{ fontSize: "0.6875rem" }}>
              {brandName} · {season || "No season"}
            </p>
          )}
          <div className="h-[3px] w-full bg-burgundy-950/[0.05] rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-burgundy-950 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((processingStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-400 ${i < processingStep
                    ? "bg-burgundy-950 scale-100"
                    : i === processingStep
                      ? "bg-burgundy scale-110"
                      : "bg-burgundy-950/8"
                    }`}
                />
                <span
                  className={`transition-all duration-400 ${i <= processingStep ? "text-foreground" : "text-muted-foreground/25"
                    }`}
                  style={{ fontSize: "0.8125rem" }}
                >
                  {s}
                  {i === processingStep && (
                    <motion.span
                      animate={{ opacity: [0.15, 0.8, 0.15] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="ml-0.5 text-burgundy/60"
                    >
                      ...
                    </motion.span>
                  )}
                  {i < processingStep && (
                    <span className="text-burgundy/30 ml-1.5" style={{ fontSize: "0.6875rem" }}>done</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[520px] mx-auto px-6 py-10 lg:py-14">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-foreground mb-1.5"
            style={{ fontSize: "1.25rem", fontWeight: 500, letterSpacing: "-0.02em" }}
          >
            New project
          </h1>
          <p className="text-muted-foreground/60" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
            {step === 1 && "Upload a garment image — sketch, render, or photo."}
            {step === 2 && "Add project details to help generate an accurate tech pack."}
            {step === 3 && "Set sourcing preferences and review before generating."}
          </p>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => s < step && canAdvance(s as FlowStep) ? setStep(s as FlowStep) : undefined}
                className={`flex items-center gap-1.5 ${s <= step ? "cursor-pointer" : "cursor-default"
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${s < step
                    ? "bg-burgundy-950 text-cream"
                    : s === step
                      ? "bg-burgundy-950 text-cream"
                      : "bg-burgundy-950/[0.06] text-muted-foreground/30"
                    }`}
                >
                  {s < step ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    <span style={{ fontSize: "0.5625rem", fontWeight: 600 }}>{s}</span>
                  )}
                </div>
                <span
                  className={`hidden sm:inline transition-colors ${s <= step ? "text-foreground" : "text-muted-foreground/30"
                    }`}
                  style={{ fontSize: "0.6875rem", fontWeight: s === step ? 500 : 400 }}
                >
                  {s === 1 ? "Upload" : s === 2 ? "Details" : "Sourcing"}
                </span>
              </button>
              {s < 3 && (
                <div
                  className={`flex-1 h-px transition-colors ${s < step ? "bg-burgundy-950/20" : "bg-burgundy-950/[0.06]"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Upload ── */}
        {step === 1 && (
          <div>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => !preview && fileInputRef.current?.click()}
              className={`
                relative rounded-[12px] border-2 transition-all duration-200 overflow-hidden
                ${dragOver
                  ? "border-burgundy/25 bg-burgundy/[0.02]"
                  : preview
                    ? "border-burgundy-950/[0.06] bg-white cursor-default"
                    : "border-dashed border-burgundy-950/[0.07] bg-white hover:border-burgundy-950/[0.14] cursor-pointer"
                }
              `}
            >
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Garment preview"
                    className="w-full h-[240px] object-contain p-8 bg-cream/30"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-2.5 py-1 rounded-[6px] bg-white/90 border border-burgundy-950/[0.08] text-foreground hover:bg-white transition-colors cursor-pointer backdrop-blur-sm"
                      style={{ fontSize: "0.6875rem" }}
                    >
                      Replace
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreview(null); setStep(1); }}
                      className="p-1 rounded-[6px] bg-white/90 border border-burgundy-950/[0.08] text-muted-foreground hover:text-foreground transition-colors cursor-pointer backdrop-blur-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <div
                    className={`w-11 h-11 rounded-[10px] flex items-center justify-center mb-3.5 transition-all ${dragOver ? "bg-burgundy/8 scale-105" : "bg-burgundy-950/[0.025]"
                      }`}
                  >
                    {dragOver ? (
                      <ImageIcon className="w-5 h-5 text-burgundy/60" />
                    ) : (
                      <Upload className="w-5 h-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <p className="text-foreground mb-0.5" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                    {dragOver ? "Drop to upload" : "Drop your garment image"}
                  </p>
                  <p className="text-muted-foreground/40" style={{ fontSize: "0.75rem" }}>
                    or click to browse · PNG, JPG up to 10MB
                  </p>
                  <div className="flex items-center gap-1.5 mt-5 flex-wrap justify-center">
                    {["Sketch", "Tech drawing", "Flat lay", "Photo"].map((hint) => (
                      <span
                        key={hint}
                        className="px-2 py-0.5 rounded-full bg-burgundy-950/[0.03] text-muted-foreground/40"
                        style={{ fontSize: "0.625rem" }}
                      >
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Image thumbnail reminder */}
            {preview && (
              <div className="flex items-center gap-3 p-3 rounded-[10px] bg-burgundy-950/[0.015] border border-burgundy-950/[0.04]">
                <div className="w-10 h-10 rounded-[7px] overflow-hidden bg-cream flex-shrink-0">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    Image uploaded
                  </p>
                  <p className="text-muted-foreground/40" style={{ fontSize: "0.625rem" }}>
                    Ready for AI analysis
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-pointer"
                  style={{ fontSize: "0.6875rem" }}
                >
                  Change
                </button>
              </div>
            )}

            {/* Project name */}
            <FieldGroup icon={Tag} label="Project name" optional>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Structured Blazer FW26"
                className="field-input"
              />
            </FieldGroup>

            {/* Brand + Season row */}
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3">
                <FieldGroup icon={Layers} label="Brand">
                  <div className="relative">
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Maison Lumière"
                      list="brands-list"
                      className="field-input"
                    />
                    <datalist id="brands-list">
                      {brands.map((b) => <option key={b} value={b} />)}
                    </datalist>
                  </div>
                </FieldGroup>
              </div>
              <div className="col-span-2">
                <FieldGroup icon={Calendar} label="Season">
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="field-input"
                  >
                    <option value="">Select…</option>
                    <option value="SS26">SS26</option>
                    <option value="FW26">FW26</option>
                    <option value="SS27">SS27</option>
                    <option value="FW27">FW27</option>
                  </select>
                </FieldGroup>
              </div>
            </div>

            {/* Garment type */}
            <FieldGroup icon={Tag} label="Garment type" hint="Helps AI focus analysis">
              <div className="flex flex-wrap gap-1.5">
                {garmentTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setGarmentType(garmentType === t ? "" : t)}
                    className={`px-2.5 py-[5px] rounded-[6px] border transition-colors cursor-pointer ${garmentType === t
                      ? "border-burgundy/20 bg-burgundy-950 text-cream"
                      : "border-burgundy-950/[0.06] bg-white text-muted-foreground hover:text-foreground hover:border-burgundy-950/[0.10]"
                      }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </FieldGroup>

            {/* Price point */}
            <FieldGroup icon={DollarSign} label="Target price point" hint="For BOM costing estimates">
              <div className="grid grid-cols-4 gap-2">
                {pricePoints.map((pp) => (
                  <button
                    key={pp.value}
                    onClick={() => setPricePoint(pricePoint === pp.value ? "" : pp.value)}
                    className={`px-2 py-2 rounded-[8px] border text-center transition-colors cursor-pointer ${pricePoint === pp.value
                      ? "border-burgundy/15 bg-burgundy-950/[0.03]"
                      : "border-burgundy-950/[0.05] bg-white hover:border-burgundy-950/[0.10]"
                      }`}
                  >
                    <span className="block text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                      {pp.label}
                    </span>
                    <span className="block text-muted-foreground/40 mt-0.5" style={{ fontSize: "0.5625rem" }}>
                      {pp.range}
                    </span>
                  </button>
                ))}
              </div>
            </FieldGroup>

            {/* Assignee */}
            <FieldGroup icon={User} label="Assignee" optional>
              <div className="flex items-center gap-2">
                {assignees.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAssignee(assignee === a ? "" : a)}
                    className={`flex items-center gap-1.5 px-2.5 py-[5px] rounded-[6px] border transition-colors cursor-pointer ${assignee === a
                      ? "border-burgundy/15 bg-burgundy-950/[0.04] text-foreground"
                      : "border-burgundy-950/[0.06] bg-white text-muted-foreground hover:text-foreground"
                      }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <div className="w-4 h-4 rounded-full bg-burgundy/8 flex items-center justify-center flex-shrink-0">
                      <span className="text-burgundy" style={{ fontSize: "0.4375rem", fontWeight: 600 }}>
                        {a.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    {a}
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>
        )}

        {/* ── Step 3: Sourcing & Review ── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Review card */}
            <div className="rounded-[10px] border border-burgundy-950/[0.04] overflow-hidden">
              <div className="px-4 py-3 bg-burgundy-950/[0.015] border-b border-burgundy-950/[0.04]">
                <span className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                  Project Summary
                </span>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-start gap-3">
                  {preview && (
                    <div className="w-14 h-14 rounded-[8px] overflow-hidden bg-cream flex-shrink-0">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <SummaryLine label="Name" value={projectName || "Untitled"} />
                    <SummaryLine label="Brand" value={brandName || "—"} />
                    <SummaryLine label="Season" value={season || "—"} />
                    <SummaryLine label="Type" value={garmentType || "Auto-detect"} />
                    <SummaryLine label="Price point" value={pricePoint ? pricePoints.find((p) => p.value === pricePoint)?.label || "—" : "—"} />
                    <SummaryLine label="Assignee" value={assignee || "Unassigned"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sourcing preferences */}
            <FieldGroup icon={Factory} label="Preferred manufacturer" optional hint="Pre-assign a sourcing partner">
              <div className="space-y-1.5">
                {partners.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPartner(selectedPartner === p.id ? "" : p.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] border transition-colors cursor-pointer ${selectedPartner === p.id
                      ? "border-burgundy/15 bg-burgundy-950/[0.03]"
                      : "border-burgundy-950/[0.05] bg-white hover:border-burgundy-950/[0.10]"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[6px] bg-burgundy-950/[0.04] flex items-center justify-center">
                        <Factory className="w-3 h-3 text-burgundy/50" />
                      </div>
                      <div className="text-left">
                        <p className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                          {p.name}
                        </p>
                        <p className="text-muted-foreground/40" style={{ fontSize: "0.5625rem" }}>
                          {p.type} · {p.region}
                        </p>
                      </div>
                    </div>
                    {selectedPartner === p.id && (
                      <div className="w-4 h-4 rounded-full bg-burgundy-950 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-cream" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </FieldGroup>

            {/* Target quantity + date */}
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup icon={Layers} label="Target quantity" optional>
                <input
                  type="text"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  placeholder="e.g. 500 pcs"
                  className="field-input"
                />
              </FieldGroup>
              <FieldGroup icon={Calendar} label="Target delivery" optional>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="field-input"
                />
              </FieldGroup>
            </div>

            {/* Notes */}
            <FieldGroup icon={Tag} label="Additional notes" optional>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements, fabric preferences, or reference links…"
                rows={3}
                className="field-input resize-none"
              />
            </FieldGroup>
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div className="flex items-center gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] border border-burgundy-950/[0.06] text-foreground hover:bg-burgundy-950/[0.02] transition-colors cursor-pointer"
              style={{ fontSize: "0.8125rem" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canAdvance(step)}
            className={`
              flex-1 py-3 rounded-[10px] transition-all duration-200 flex items-center justify-center gap-2
              ${canAdvance(step)
                ? "bg-burgundy-950 text-cream hover:bg-burgundy-dark cursor-pointer"
                : "bg-burgundy-950/6 text-burgundy-950/18 cursor-not-allowed"
              }
            `}
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            {step === 3 ? "Generate tech pack" : "Continue"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {step === 2 && (
          <p className="text-center text-muted-foreground/25 mt-3" style={{ fontSize: "0.6875rem" }}>
            All fields are optional — AI will estimate from the image
          </p>
        )}
      </div>

      {/* Field input styles */}
      <style>{`
        .field-input {
          width: 100%;
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid rgba(42, 11, 17, 0.06);
          background: white;
          color: var(--foreground);
          font-size: 0.8125rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .field-input:focus {
          border-color: rgba(107, 29, 42, 0.15);
        }
        .field-input::placeholder {
          color: rgba(154, 138, 142, 0.35);
        }
        .field-input option {
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function FieldGroup({
  icon: Icon,
  label,
  optional,
  hint,
  children,
}: {
  icon: React.ElementType;
  label: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3 h-3 text-muted-foreground/30" />
        <span className="text-muted-foreground/70" style={{ fontSize: "0.6875rem" }}>
          {label}
        </span>
        {optional && (
          <span className="text-muted-foreground/25" style={{ fontSize: "0.5625rem" }}>
            optional
          </span>
        )}
        {hint && (
          <span className="text-muted-foreground/20 ml-auto" style={{ fontSize: "0.5625rem" }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground/40 w-[70px] flex-shrink-0" style={{ fontSize: "0.6875rem" }}>
        {label}
      </span>
      <span className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}