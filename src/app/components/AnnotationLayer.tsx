import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { Annotation } from "./TechPackCanvas";

interface AnnotationLayerProps {
  image: string;
  annotations: Annotation[];
  onChange: (annotations: Annotation[]) => void;
  onAnnotationClick?: (linkedSection: string) => void;
}

const sectionOptions = [
  { value: "identification", label: "Identification" },
  { value: "construction", label: "Construction" },
  { value: "materials", label: "Materials" },
  { value: "colorways", label: "Colorways" },
  { value: "measurements", label: "Measurements" },
  { value: "grading", label: "Grading" },
  { value: "bom", label: "BOM" },
  { value: "instructions", label: "Instructions" },
];

export function AnnotationLayer({ image, annotations, onChange, onAnnotationClick }: AnnotationLayerProps) {
  const [isPlacing, setIsPlacing] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [pendingLabel, setPendingLabel] = useState("");
  const [pendingSection, setPendingSection] = useState("construction");

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPos({ x, y });
    setPendingLabel("");
    setPendingSection("construction");
  };

  const confirmAnnotation = () => {
    if (!pendingPos || !pendingLabel.trim()) return;
    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      x: pendingPos.x,
      y: pendingPos.y,
      label: pendingLabel.trim(),
      linkedSection: pendingSection,
    };
    onChange([...annotations, newAnnotation]);
    setPendingPos(null);
    setPendingLabel("");
    setIsPlacing(false);
  };

  const removeAnnotation = (id: string) => {
    onChange(annotations.filter((a) => a.id !== id));
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-burgundy-950/[0.05]">
        <span className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>
          {annotations.length} callout{annotations.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={() => { setIsPlacing(!isPlacing); setPendingPos(null); }}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
            isPlacing
              ? "bg-burgundy/10 text-burgundy"
              : "text-muted-foreground hover:text-foreground hover:bg-burgundy-950/[0.03]"
          }`}
          style={{ fontSize: "0.6875rem" }}
        >
          <Plus className="w-3 h-3" />
          {isPlacing ? "Click image to place" : "Add callout"}
        </button>
      </div>

      {/* Image with annotations */}
      <div
        className={`relative flex-1 flex items-center justify-center p-6 ${
          isPlacing ? "cursor-crosshair" : ""
        }`}
        onClick={handleImageClick}
      >
        <img
          src={image}
          alt="Garment"
          className="max-w-full max-h-[70vh] object-contain"
          draggable={false}
        />

        {/* Placed annotations */}
        {annotations.map((ann, i) => (
          <div
            key={ann.id}
            className="absolute group"
            style={{ left: `${ann.x}%`, top: `${ann.y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHoveredId(ann.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Marker dot */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnnotationClick?.(ann.linkedSection);
              }}
              className="w-5 h-5 rounded-full bg-burgundy border-2 border-cream flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              title={ann.label}
            >
              <span className="text-cream" style={{ fontSize: "0.5rem", fontWeight: 600 }}>{i + 1}</span>
            </button>

            {/* Tooltip on hover */}
            {hoveredId === ann.id && (
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-burgundy-950 text-cream px-2.5 py-1.5 rounded-md whitespace-nowrap"
                style={{ fontSize: "0.6875rem" }}
              >
                <div className="flex items-center gap-2">
                  <span>{ann.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAnnotation(ann.id);
                    }}
                    className="text-cream/50 hover:text-cream cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
                <span className="text-cream/40" style={{ fontSize: "0.5625rem" }}>
                  → {sectionOptions.find((s) => s.value === ann.linkedSection)?.label}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Pending annotation form */}
        {pendingPos && (
          <div
            className="absolute z-20"
            style={{ left: `${pendingPos.x}%`, top: `${pendingPos.y}%`, transform: "translate(-50%, -100%) translateY(-12px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border border-burgundy-950/[0.08] rounded-lg p-3 min-w-[200px]">
              <input
                autoFocus
                value={pendingLabel}
                onChange={(e) => setPendingLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmAnnotation(); if (e.key === "Escape") setPendingPos(null); }}
                placeholder="Callout label…"
                className="w-full px-2 py-1.5 rounded-md border border-burgundy-950/[0.08] bg-cream outline-none text-foreground placeholder:text-muted-foreground/30 mb-2"
                style={{ fontSize: "0.75rem" }}
              />
              <select
                value={pendingSection}
                onChange={(e) => setPendingSection(e.target.value)}
                className="w-full px-2 py-1.5 rounded-md border border-burgundy-950/[0.08] bg-cream outline-none text-foreground mb-2"
                style={{ fontSize: "0.75rem" }}
              >
                {sectionOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={confirmAnnotation}
                  disabled={!pendingLabel.trim()}
                  className="flex-1 py-1 rounded-md bg-burgundy-950 text-cream text-center transition-colors cursor-pointer disabled:opacity-30"
                  style={{ fontSize: "0.6875rem" }}
                >
                  Place
                </button>
                <button
                  onClick={() => setPendingPos(null)}
                  className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  style={{ fontSize: "0.6875rem" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}