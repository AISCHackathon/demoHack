import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Database, Pencil, ChevronDown, ChevronUp, Info } from "lucide-react";
import type { BOMItem } from "./TechPackCanvas";
import { supplierCatalog, findCatalogMatch, calculateCostBreakdown, type CatalogItem } from "./supplierCatalog";

interface BOMTableProps {
  items: BOMItem[];
  onChange: (items: BOMItem[]) => void;
}

/* ── Supplier Picker dropdown ── */
function SupplierPicker({
  value,
  onSelect,
  onClose,
  component,
}: {
  value: string;
  onSelect: (item: CatalogItem) => void;
  onClose: () => void;
  component: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Filter catalog: prefer matching component, then any matching query
  const results = supplierCatalog.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.supplierName.toLowerCase().includes(q) ||
      item.component.toLowerCase().includes(q) ||
      item.material.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  // Also show component-relevant items at top
  const compLower = component.toLowerCase();
  const relevantFirst = [
    ...results.filter((r) => r.component.toLowerCase().includes(compLower)),
    ...results.filter((r) => !r.component.toLowerCase().includes(compLower)),
  ].filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);

  return (
    <div ref={ref} className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-burgundy-950/[0.08] rounded-[8px] overflow-hidden" style={{ minWidth: 280 }}>
      <div className="p-2 border-b border-burgundy-950/[0.04]">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog…"
          className="w-full px-2 py-1 rounded-[5px] bg-burgundy-950/[0.02] text-foreground outline-none placeholder:text-muted-foreground/30"
          style={{ fontSize: "0.75rem" }}
        />
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        {relevantFirst.length === 0 ? (
          <p className="px-3 py-3 text-muted-foreground/40 text-center" style={{ fontSize: "0.6875rem" }}>
            No catalog matches
          </p>
        ) : (
          relevantFirst.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left px-3 py-2 hover:bg-burgundy-950/[0.02] transition-colors cursor-pointer border-b border-burgundy-950/[0.02] last:border-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-foreground truncate" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    {item.supplierName}
                  </p>
                  <p className="text-muted-foreground/50 truncate" style={{ fontSize: "0.625rem" }}>
                    {item.material}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    ${item.unitCost.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground/30" style={{ fontSize: "0.5625rem" }}>
                    /{item.unit}
                  </span>
                  {item.verified && (
                    <span className="w-1.5 h-1.5 rounded-full bg-burgundy/40 flex-shrink-0" title="Verified price" />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="px-3 py-1.5 bg-burgundy-950/[0.015] border-t border-burgundy-950/[0.04]">
        <p className="text-muted-foreground/30" style={{ fontSize: "0.5625rem" }}>
          Prices from supplier catalog · Click to apply
        </p>
      </div>
    </div>
  );
}

/* ── Cost source badge ── */
function CostSourceBadge({ item }: { item: BOMItem }) {
  const match = findCatalogMatch(item.component, item.material);
  if (!match) return null;

  const catalogCost = match.unitCost;
  const currentCost = parseFloat(item.unitCost) || 0;
  const isFromCatalog = Math.abs(catalogCost - currentCost) < 0.01;

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1 py-[1px] rounded-[3px] ${
        isFromCatalog
          ? "bg-burgundy/[0.06] text-burgundy/60"
          : "bg-burgundy-950/[0.03] text-muted-foreground/40"
      }`}
      style={{ fontSize: "0.5rem" }}
      title={isFromCatalog ? `Catalog price from ${match.supplierName}` : `Manual — catalog: $${catalogCost.toFixed(2)}`}
    >
      <Database className="w-2 h-2" />
      {isFromCatalog ? "Catalog" : "Manual"}
    </span>
  );
}

/* ── Main BOM Table ── */
export function BOMTable({ items, onChange }: BOMTableProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [supplierPickerRow, setSupplierPickerRow] = useState<number | null>(null);
  const [showCostBreakdown, setShowCostBreakdown] = useState(true);
  const [laborCost, setLaborCost] = useState(18.0);
  const [targetRetail, setTargetRetail] = useState(185.0);
  const [overheadPct, setOverheadPct] = useState(15);
  const [shippingPerUnit, setShippingPerUnit] = useState(2.5);
  const [dutyPct, setDutyPct] = useState(8);

  const cols = ["component", "material", "supplier", "unitCost", "quantity", "total"] as const;
  const colLabels: Record<string, string> = {
    component: "Component",
    material: "Material",
    supplier: "Supplier",
    unitCost: "Unit $",
    quantity: "Qty",
    total: "Total $",
  };

  const handleCellChange = (rowIndex: number, col: string, value: string) => {
    const updated = [...items];
    updated[rowIndex] = { ...updated[rowIndex], [col]: value };
    if (col === "unitCost" || col === "quantity") {
      const cost = parseFloat(updated[rowIndex].unitCost) || 0;
      const qty = parseFloat(updated[rowIndex].quantity) || 0;
      updated[rowIndex].total = (cost * qty).toFixed(2);
    }
    onChange(updated);
  };

  const handleCatalogSelect = (rowIndex: number, catalogItem: CatalogItem) => {
    const updated = [...items];
    updated[rowIndex] = {
      ...updated[rowIndex],
      supplier: catalogItem.supplierName,
      unitCost: catalogItem.unitCost.toFixed(2),
      material: catalogItem.material,
    };
    // Recalc total
    const qty = parseFloat(updated[rowIndex].quantity) || 0;
    updated[rowIndex].total = (catalogItem.unitCost * qty).toFixed(2);
    onChange(updated);
    setSupplierPickerRow(null);
  };

  const addRow = () => {
    onChange([
      ...items,
      { id: `bom-${Date.now()}`, component: "", material: "", supplier: "", unitCost: "", quantity: "", total: "" },
    ]);
  };

  const removeRow = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const materialsTotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  const breakdown = calculateCostBreakdown(materialsTotal, laborCost, overheadPct, shippingPerUnit, dutyPct, targetRetail);

  // Count how many items have catalog-matched prices
  const catalogMatchCount = items.filter((item) => {
    const match = findCatalogMatch(item.component, item.material);
    return match && Math.abs(match.unitCost - (parseFloat(item.unitCost) || 0)) < 0.01;
  }).length;

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto rounded-[8px] border border-burgundy-950/[0.06]">
        <table className="w-full" style={{ fontSize: "0.8125rem" }}>
          <thead>
            <tr className="bg-burgundy-950/[0.02]">
              {cols.map((col) => (
                <th
                  key={col}
                  className={`px-3 py-2 text-muted-foreground ${col === "unitCost" || col === "quantity" || col === "total" ? "text-right" : "text-left"}`}
                  style={{ fontSize: "0.6875rem", fontWeight: 400, letterSpacing: "0.03em" }}
                >
                  {colLabels[col]}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {items.map((row, rowIndex) => (
              <tr key={row.id} className="border-t border-burgundy-950/[0.04] hover:bg-burgundy-950/[0.01] transition-colors group">
                {cols.map((col) => {
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === col;
                  const isNumeric = col === "unitCost" || col === "quantity" || col === "total";
                  const isSupplier = col === "supplier";

                  return (
                    <td key={col} className={`px-1 py-1 ${isNumeric ? "text-right" : ""} ${isSupplier ? "relative" : ""}`}>
                      {isSupplier ? (
                        /* Supplier cell with catalog picker */
                        <div className="relative">
                          <span
                            onClick={() => setSupplierPickerRow(supplierPickerRow === rowIndex ? null : rowIndex)}
                            className="inline-flex items-center gap-1 w-full px-2 py-0.5 rounded-md transition-colors text-foreground/70 cursor-pointer hover:bg-burgundy-950/[0.03]"
                          >
                            <span className="flex-1 truncate">{row[col] || "—"}</span>
                            <Database className="w-2.5 h-2.5 text-muted-foreground/20 flex-shrink-0" />
                          </span>
                          {supplierPickerRow === rowIndex && (
                            <SupplierPicker
                              value={row[col]}
                              component={row.component}
                              onSelect={(item) => handleCatalogSelect(rowIndex, item)}
                              onClose={() => setSupplierPickerRow(null)}
                            />
                          )}
                        </div>
                      ) : isEditing ? (
                        <input
                          autoFocus
                          value={row[col]}
                          onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Escape") setEditingCell(null);
                          }}
                          className={`w-full px-2 py-0.5 rounded-md bg-white border border-burgundy/15 focus:border-burgundy/30 outline-none text-foreground ${isNumeric ? "text-right" : ""}`}
                          style={{ fontSize: "0.8125rem" }}
                        />
                      ) : (
                        <span
                          onClick={() => col !== "total" ? setEditingCell({ row: rowIndex, col }) : undefined}
                          className={`inline-block w-full px-2 py-0.5 rounded-md transition-colors text-foreground/70 ${
                            col !== "total" ? "cursor-pointer hover:bg-burgundy-950/[0.03]" : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <span className={`${isNumeric ? "flex-1 text-right" : ""}`}>
                              {col === "unitCost" && row[col] ? `$${row[col]}` : col === "total" && row[col] ? `$${row[col]}` : row[col] || "—"}
                            </span>
                            {col === "unitCost" && row[col] && <CostSourceBadge item={row} />}
                          </span>
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="px-1 py-1">
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="p-1 rounded-md text-burgundy-950/0 group-hover:text-burgundy-950/20 hover:!text-burgundy transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={addRow}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-burgundy-950/[0.03] transition-colors cursor-pointer"
            style={{ fontSize: "0.6875rem" }}
          >
            <Plus className="w-3 h-3" />
            Add line item
          </button>
          {items.length > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground/30" style={{ fontSize: "0.5625rem" }}>
              <Database className="w-2.5 h-2.5" />
              {catalogMatchCount}/{items.length} from catalog
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>Materials subtotal </span>
          <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            ${materialsTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ── Cost Breakdown Panel ── */}
      {items.length > 0 && (
        <div className="mt-5 border border-burgundy-950/[0.04] rounded-[10px] overflow-hidden">
          <button
            onClick={() => setShowCostBreakdown(!showCostBreakdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-burgundy-950/[0.015] hover:bg-burgundy-950/[0.025] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
              Cost Breakdown
              <span className="text-muted-foreground/30" style={{ fontSize: "0.625rem", fontWeight: 400 }}>per unit</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                ${breakdown.totalPerUnit.toFixed(2)}
              </span>
              {showCostBreakdown ? (
                <ChevronUp className="w-3 h-3 text-muted-foreground/30" />
              ) : (
                <ChevronDown className="w-3 h-3 text-muted-foreground/30" />
              )}
            </div>
          </button>

          {showCostBreakdown && (
            <div className="px-4 py-4 space-y-4">
              {/* Cost lines */}
              <div className="space-y-2">
                <CostLine label="Materials" value={materialsTotal} />
                <CostLineEditable
                  label="Labor (CMT)"
                  value={laborCost}
                  onChange={setLaborCost}
                  hint="Per-unit manufacturing cost"
                />
                <CostLineEditable
                  label={`Overhead (${overheadPct}%)`}
                  value={(materialsTotal + laborCost) * (overheadPct / 100)}
                  onChange={(v) => setOverheadPct(Math.round((v / (materialsTotal + laborCost)) * 100) || 0)}
                  hint="Factory overhead"
                />
                <CostLineEditable
                  label="Shipping"
                  value={shippingPerUnit}
                  onChange={setShippingPerUnit}
                  hint="Per-unit freight"
                />
                <CostLine
                  label={`Import duty (${dutyPct}%)`}
                  value={(materialsTotal + laborCost + (materialsTotal + laborCost) * (overheadPct / 100) + shippingPerUnit) * (dutyPct / 100)}
                />
                <div className="h-px bg-burgundy-950/[0.05] my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                    Landed cost / unit
                  </span>
                  <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    ${breakdown.totalPerUnit.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Margin calculator */}
              <div className="pt-3 border-t border-burgundy-950/[0.04]">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-muted-foreground/50" style={{ fontSize: "0.6875rem" }}>Margin Calculator</span>
                  <Info className="w-2.5 h-2.5 text-muted-foreground/20" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-muted-foreground/40 mb-1" style={{ fontSize: "0.5625rem" }}>
                      Target retail
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/30" style={{ fontSize: "0.75rem" }}>$</span>
                      <input
                        type="number"
                        value={targetRetail || ""}
                        onChange={(e) => setTargetRetail(parseFloat(e.target.value) || 0)}
                        className="w-full pl-5 pr-2 py-1.5 rounded-[6px] border border-burgundy-950/[0.06] bg-white text-foreground text-right outline-none focus:border-burgundy/15"
                        style={{ fontSize: "0.75rem" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-muted-foreground/40 mb-1" style={{ fontSize: "0.5625rem" }}>
                      Landed cost
                    </label>
                    <div className="px-2 py-1.5 rounded-[6px] bg-burgundy-950/[0.02] text-right">
                      <span className="text-foreground" style={{ fontSize: "0.75rem" }}>${breakdown.totalPerUnit.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-muted-foreground/40 mb-1" style={{ fontSize: "0.5625rem" }}>
                      Gross margin
                    </label>
                    <div className={`px-2 py-1.5 rounded-[6px] text-right ${
                      breakdown.margin >= 60 ? "bg-burgundy/[0.04]" : breakdown.margin >= 40 ? "bg-burgundy-950/[0.03]" : "bg-burgundy-950/[0.02]"
                    }`}>
                      <span
                        className={`${breakdown.margin >= 60 ? "text-burgundy" : breakdown.margin >= 40 ? "text-foreground" : "text-muted-foreground"}`}
                        style={{ fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        {targetRetail > 0 ? `${breakdown.margin.toFixed(1)}%` : "—"}
                      </span>
                    </div>
                  </div>
                </div>
                {targetRetail > 0 && (
                  <div className="mt-3">
                    <div className="h-[4px] rounded-full bg-burgundy-950/[0.04] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          breakdown.margin >= 60 ? "bg-burgundy/40" : breakdown.margin >= 40 ? "bg-burgundy-950/20" : "bg-burgundy-950/10"
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, breakdown.margin))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted-foreground/25" style={{ fontSize: "0.5rem" }}>0%</span>
                      <span className="text-muted-foreground/25" style={{ fontSize: "0.5rem" }}>100%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Helper sub-components ── */

function CostLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{label}</span>
      <span className="text-foreground/70" style={{ fontSize: "0.75rem" }}>${value.toFixed(2)}</span>
    </div>
  );
}

function CostLineEditable({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint: string;
}) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value.toFixed(2));

  useEffect(() => {
    setLocalVal(value.toFixed(2));
  }, [value]);

  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: "0.75rem" }} title={hint}>
        {label}
      </span>
      {editing ? (
        <input
          autoFocus
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={() => {
            onChange(parseFloat(localVal) || 0);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange(parseFloat(localVal) || 0);
              setEditing(false);
            }
          }}
          className="w-[72px] px-1.5 py-0.5 rounded-[5px] border border-burgundy/15 text-right text-foreground outline-none"
          style={{ fontSize: "0.75rem" }}
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className="flex items-center gap-1 text-foreground/70 cursor-pointer hover:text-foreground group"
          style={{ fontSize: "0.75rem" }}
        >
          ${value.toFixed(2)}
          <Pencil className="w-2 h-2 text-transparent group-hover:text-muted-foreground/30 transition-colors" />
        </span>
      )}
    </div>
  );
}
