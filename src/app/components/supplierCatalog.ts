/**
 * Shared supplier pricing catalog.
 * Links BOM material costs to sourcing partners, providing
 * a single source of truth for unit costs across all projects.
 */

export interface CatalogItem {
  id: string;
  component: string;
  material: string;
  supplierId: string; // links to sourcing partner
  supplierName: string;
  unitCost: number;
  unit: string; // "meter", "piece", "yard", "set", "roll"
  moq: string;
  leadDays: number;
  lastUpdated: string;
  currency: "USD";
  verified: boolean; // cost verified with supplier
}

export interface CostBreakdown {
  materialsCost: number;
  laborCost: number;
  overheadPct: number; // percentage
  shippingPerUnit: number;
  dutyPct: number;
  totalPerUnit: number;
  targetRetail: number;
  margin: number; // percentage
}

// The catalog maps supplier IDs from Sourcing to pricing
export const supplierCatalog: CatalogItem[] = [
  // Donghua Textile Group (p-1) — Manufacturer
  { id: "cat-01", component: "CMT Labor", material: "Full CMT service — blazer", supplierId: "p-1", supplierName: "Donghua Textile", unitCost: 18.00, unit: "piece", moq: "500 pcs", leadDays: 35, lastUpdated: "2026-02-15", currency: "USD", verified: true },
  { id: "cat-02", component: "CMT Labor", material: "Full CMT service — trouser", supplierId: "p-1", supplierName: "Donghua Textile", unitCost: 12.00, unit: "piece", moq: "500 pcs", leadDays: 30, lastUpdated: "2026-02-15", currency: "USD", verified: true },
  { id: "cat-03", component: "CMT Labor", material: "Full CMT service — outerwear", supplierId: "p-1", supplierName: "Donghua Textile", unitCost: 22.00, unit: "piece", moq: "500 pcs", leadDays: 42, lastUpdated: "2026-02-15", currency: "USD", verified: true },

  // Tessitura Monti (p-2) — Fabric Supplier
  { id: "cat-04", component: "Shell fabric", material: "98% wool / 2% elastane, 260gsm twill", supplierId: "p-2", supplierName: "Tessitura Monti", unitCost: 28.50, unit: "meter", moq: "50 m", leadDays: 18, lastUpdated: "2026-02-20", currency: "USD", verified: true },
  { id: "cat-05", component: "Shell fabric", material: "100% linen, 180gsm plain weave", supplierId: "p-2", supplierName: "Tessitura Monti", unitCost: 16.80, unit: "meter", moq: "50 m", leadDays: 14, lastUpdated: "2026-02-20", currency: "USD", verified: true },
  { id: "cat-06", component: "Shell fabric", material: "72% viscose / 28% linen, 175gsm", supplierId: "p-2", supplierName: "Tessitura Monti", unitCost: 14.60, unit: "meter", moq: "50 m", leadDays: 14, lastUpdated: "2026-02-20", currency: "USD", verified: true },
  { id: "cat-07", component: "Shell fabric", material: "100% cotton shirting, 120gsm", supplierId: "p-2", supplierName: "Tessitura Monti", unitCost: 11.20, unit: "meter", moq: "50 m", leadDays: 14, lastUpdated: "2026-02-20", currency: "USD", verified: true },

  // Saigon Stitch Co. (p-3) — Manufacturer
  { id: "cat-08", component: "CMT Labor", material: "Full CMT service — jersey tee", supplierId: "p-3", supplierName: "Saigon Stitch Co.", unitCost: 4.50, unit: "piece", moq: "300 pcs", leadDays: 25, lastUpdated: "2026-02-18", currency: "USD", verified: true },
  { id: "cat-09", component: "CMT Labor", material: "Full CMT service — casual knit", supplierId: "p-3", supplierName: "Saigon Stitch Co.", unitCost: 6.80, unit: "piece", moq: "300 pcs", leadDays: 28, lastUpdated: "2026-02-18", currency: "USD", verified: true },
  { id: "cat-10", component: "Body fabric", material: "100% combed cotton, 180gsm jersey", supplierId: "p-3", supplierName: "Saigon Stitch Co.", unitCost: 4.20, unit: "meter", moq: "100 m", leadDays: 14, lastUpdated: "2026-02-18", currency: "USD", verified: true },

  // Nordic Knit Mills (p-4) — Manufacturer
  { id: "cat-11", component: "CMT Labor", material: "Full CMT service — knitwear", supplierId: "p-4", supplierName: "Nordic Knit Mills", unitCost: 14.00, unit: "piece", moq: "200 pcs", leadDays: 25, lastUpdated: "2026-02-22", currency: "USD", verified: true },
  { id: "cat-12", component: "Shell fabric", material: "100% merino wool, 280gsm knit", supplierId: "p-4", supplierName: "Nordic Knit Mills", unitCost: 22.00, unit: "meter", moq: "30 m", leadDays: 21, lastUpdated: "2026-02-22", currency: "USD", verified: true },

  // Isko Denim (p-5) — Fabric Supplier
  { id: "cat-13", component: "Shell fabric", material: "98% cotton / 2% elastane, 340gsm denim", supplierId: "p-5", supplierName: "Isko Denim", unitCost: 9.80, unit: "meter", moq: "100 m", leadDays: 21, lastUpdated: "2026-02-10", currency: "USD", verified: true },
  { id: "cat-14", component: "Shell fabric", material: "100% cotton selvedge, 380gsm", supplierId: "p-5", supplierName: "Isko Denim", unitCost: 14.50, unit: "meter", moq: "100 m", leadDays: 28, lastUpdated: "2026-02-10", currency: "USD", verified: true },

  // Curtidos León (p-6) — Trim Supplier
  { id: "cat-15", component: "Buttons", material: "Genuine horn, 25mm", supplierId: "p-6", supplierName: "Curtidos León", unitCost: 2.80, unit: "piece", moq: "100 pcs", leadDays: 10, lastUpdated: "2026-02-05", currency: "USD", verified: false },
  { id: "cat-16", component: "Buttons", material: "Corozo nut, 20mm", supplierId: "p-6", supplierName: "Curtidos León", unitCost: 1.80, unit: "piece", moq: "100 pcs", leadDays: 10, lastUpdated: "2026-02-05", currency: "USD", verified: false },
  { id: "cat-17", component: "Zipper", material: "YKK #4.5 brass, antique", supplierId: "p-6", supplierName: "Curtidos León", unitCost: 1.60, unit: "piece", moq: "50 pcs", leadDays: 7, lastUpdated: "2026-02-05", currency: "USD", verified: false },
  { id: "cat-18", component: "Leather label", material: "Embossed vegetable-tanned, 40×15mm", supplierId: "p-6", supplierName: "Curtidos León", unitCost: 0.95, unit: "piece", moq: "200 pcs", leadDays: 14, lastUpdated: "2026-02-05", currency: "USD", verified: false },
  { id: "cat-19", component: "Rivets", material: "Antique brass rivets", supplierId: "p-6", supplierName: "Curtidos León", unitCost: 0.20, unit: "piece", moq: "500 pcs", leadDays: 7, lastUpdated: "2026-02-05", currency: "USD", verified: false },

  // Generic / common items (multiple suppliers)
  { id: "cat-20", component: "Thread", material: "Corespun poly/cotton", supplierId: "", supplierName: "Coats", unitCost: 0.30, unit: "cone", moq: "12 cones", leadDays: 5, lastUpdated: "2026-01-20", currency: "USD", verified: true },
  { id: "cat-21", component: "Labels", material: "Woven main + care + size set", supplierId: "", supplierName: "Wunderlabel", unitCost: 0.45, unit: "set", moq: "500 sets", leadDays: 10, lastUpdated: "2026-01-20", currency: "USD", verified: true },
  { id: "cat-22", component: "Interfacing", material: "Fusible hair canvas", supplierId: "", supplierName: "Wendler", unitCost: 4.20, unit: "meter", moq: "20 m", leadDays: 10, lastUpdated: "2026-01-15", currency: "USD", verified: true },
  { id: "cat-23", component: "Lining", material: "100% cupro bemberg, 70gsm", supplierId: "", supplierName: "Asahi Kasei", unitCost: 8.40, unit: "meter", moq: "30 m", leadDays: 14, lastUpdated: "2026-01-15", currency: "USD", verified: true },
  { id: "cat-24", component: "Shoulder pads", material: "Natural, 0.5\" lift", supplierId: "", supplierName: "Libo", unitCost: 1.10, unit: "pair", moq: "200 pairs", leadDays: 7, lastUpdated: "2026-01-10", currency: "USD", verified: true },
];

/**
 * Look up catalog price for a BOM component+material combo.
 * Returns the best match or null if not in catalog.
 */
export function findCatalogMatch(component: string, material: string): CatalogItem | null {
  const cLower = component.toLowerCase();
  const mLower = material.toLowerCase();

  // Exact component + material substring match
  const exact = supplierCatalog.find(
    (item) =>
      item.component.toLowerCase() === cLower &&
      (item.material.toLowerCase().includes(mLower) || mLower.includes(item.material.toLowerCase()))
  );
  if (exact) return exact;

  // Partial component match
  const partial = supplierCatalog.find(
    (item) =>
      cLower.includes(item.component.toLowerCase()) || item.component.toLowerCase().includes(cLower)
  );
  return partial || null;
}

/**
 * Calculate full cost breakdown for a project's BOM
 */
export function calculateCostBreakdown(
  bomTotal: number,
  laborCost: number = 0,
  overheadPct: number = 15,
  shippingPerUnit: number = 2.50,
  dutyPct: number = 8,
  targetRetail: number = 0
): CostBreakdown {
  const overhead = (bomTotal + laborCost) * (overheadPct / 100);
  const subtotalBeforeDuty = bomTotal + laborCost + overhead + shippingPerUnit;
  const duty = subtotalBeforeDuty * (dutyPct / 100);
  const totalPerUnit = subtotalBeforeDuty + duty;
  const margin = targetRetail > 0 ? ((targetRetail - totalPerUnit) / targetRetail) * 100 : 0;

  return {
    materialsCost: bomTotal,
    laborCost,
    overheadPct,
    shippingPerUnit,
    dutyPct,
    totalPerUnit,
    targetRetail,
    margin,
  };
}
