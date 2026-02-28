import { useState } from "react";
import { Check, Pencil, RotateCcw } from "lucide-react";

export interface BrandDefaults {
  seamAllowance: string;
  standardThread: string;
  labelPlacement: string;
  sizeGradeIncrement: string;
  preferredSuppliers: string;
  packagingSpec: string;
}

const defaultBrandDefaults: BrandDefaults = {
  seamAllowance: "1cm (3/8\") on all seams",
  standardThread: "Corespun poly/cotton, color-matched",
  labelPlacement: "Woven main label at CB neck; care label at left side seam",
  sizeGradeIncrement: "1\" chest, 1\" waist, 0.5\" shoulder per size",
  preferredSuppliers: "YKK (zippers), Margraf (buttons), Albini (shirting fabrics)",
  packagingSpec: "Individual poly bag, branded tissue paper, hang tag",
};

interface BrandMemoryProps {
  brandName: string;
  defaults: BrandDefaults;
  onDefaultsChange: (defaults: BrandDefaults) => void;
}

const fieldLabels: Record<keyof BrandDefaults, string> = {
  seamAllowance: "Standard seam allowance",
  standardThread: "Thread specification",
  labelPlacement: "Label placement",
  sizeGradeIncrement: "Size grade increment",
  preferredSuppliers: "Preferred suppliers",
  packagingSpec: "Packaging specification",
};

export function BrandMemory({ brandName, defaults, onDefaultsChange }: BrandMemoryProps) {
  const [editingField, setEditingField] = useState<keyof BrandDefaults | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (field: keyof BrandDefaults) => {
    setEditingField(field);
    setEditValue(defaults[field]);
  };

  const saveEdit = () => {
    if (editingField) {
      onDefaultsChange({ ...defaults, [editingField]: editValue });
      setEditingField(null);
    }
  };

  const resetDefaults = () => {
    onDefaultsChange(defaultBrandDefaults);
  };

  const fields = Object.keys(fieldLabels) as (keyof BrandDefaults)[];

  return (
    <div className="rounded-lg border border-burgundy-950/[0.06] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-burgundy-950/[0.04]">
        <div>
          <p className="text-foreground" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
            Brand defaults
          </p>
          <p className="text-muted-foreground/50" style={{ fontSize: "0.625rem" }}>
            {brandName || "Your brand"} — these pre-fill every new tech pack
          </p>
        </div>
        <button
          onClick={resetDefaults}
          className="p-1.5 rounded-md text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-pointer"
          title="Reset to defaults"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="divide-y divide-burgundy-950/[0.03]">
        {fields.map((field) => (
          <div key={field} className="px-4 py-2.5 group">
            <label className="block text-muted-foreground mb-0.5" style={{ fontSize: "0.625rem", letterSpacing: "0.03em" }}>
              {fieldLabels[field]}
            </label>
            {editingField === field ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingField(null); }}
                  onBlur={saveEdit}
                  className="flex-1 px-2 py-1 rounded-md bg-cream border border-burgundy/10 focus:border-burgundy/20 outline-none text-foreground"
                  style={{ fontSize: "0.75rem" }}
                />
                <button onClick={saveEdit} className="p-1 rounded-md bg-burgundy-950 text-cream cursor-pointer">
                  <Check className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => startEdit(field)}
                className="flex items-center justify-between cursor-pointer rounded-md px-2 py-1 -mx-2 hover:bg-burgundy-950/[0.02] transition-colors"
              >
                <span className="text-foreground/75" style={{ fontSize: "0.75rem" }}>{defaults[field]}</span>
                <Pencil className="w-2.5 h-2.5 text-burgundy-950/0 group-hover:text-burgundy-950/20 transition-colors" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { defaultBrandDefaults };
