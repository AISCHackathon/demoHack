import type { TechPackData, BOMItem, Annotation } from "./TechPackCanvas";

// These simulate different AI responses based on simple heuristics
// In production, this would be a Claude Vision API call

const blazerBOM: BOMItem[] = [
  { id: "b1", component: "Shell fabric", material: "98% wool / 2% elastane, 260gsm", supplier: "Albini", unitCost: "28.50", quantity: "2.2", total: "62.70" },
  { id: "b2", component: "Lining", material: "100% cupro bemberg, 70gsm", supplier: "Asahi Kasei", unitCost: "8.40", quantity: "1.8", total: "15.12" },
  { id: "b3", component: "Interfacing", material: "Fusible hair canvas", supplier: "Wendler", unitCost: "4.20", quantity: "0.6", total: "2.52" },
  { id: "b4", component: "Buttons (front)", material: "Genuine horn, 25mm", supplier: "Global Trim", unitCost: "2.80", quantity: "2", total: "5.60" },
  { id: "b5", component: "Buttons (sleeve)", material: "Genuine horn, 15mm", supplier: "Global Trim", unitCost: "1.60", quantity: "8", total: "12.80" },
  { id: "b6", component: "Shoulder pads", material: "Natural, 0.5\" lift", supplier: "Libo", unitCost: "1.10", quantity: "2", total: "2.20" },
  { id: "b7", component: "Labels", material: "Woven main + care + size", supplier: "Wunderlabel", unitCost: "0.45", quantity: "4", total: "1.80" },
  { id: "b8", component: "Thread", material: "Corespun poly/cotton", supplier: "Coats", unitCost: "0.30", quantity: "3", total: "0.90" },
];

const blazerAnnotations: Annotation[] = [
  { id: "a1", x: 42, y: 18, label: "Notched lapel, 3.25\" width", linkedSection: "construction" },
  { id: "a2", x: 48, y: 38, label: "Two-button front closure", linkedSection: "construction" },
  { id: "a3", x: 28, y: 50, label: "Surgeon's cuffs (4 buttons)", linkedSection: "construction" },
  { id: "a4", x: 50, y: 80, label: "Center back vent, 9.5\"", linkedSection: "construction" },
];

const blazerPack: TechPackData = {
  garmentType: "Structured Blazer",
  category: "Outerwear — Tailored Suiting",
  silhouette: "Fitted single-breasted, natural shoulder, slightly suppressed waist, straight hem",
  constructionDetails: `Seams: Single-needle tailored seams with pressed-open finish; reinforced at stress points (underarm, shoulder, vent)
Closures: Two-button front closure with horn-style buttons (25mm); interior single-button on left facing
Collar: Notched lapel, 3.25" width, hand-padstitched for soft roll; AMF stitching on lapel edge
Sleeves: Two-piece set-in sleeve with surgeon's cuffs (4 functional buttons); sleeve vents at 3.5"
Lining: Full-body lining with internal welt pocket (left) and open patch pocket (right)
Vent: Single center back vent, 9.5" length`,
  materialsTrims: `Shell: 98% Italian wool / 2% elastane, 260gsm twill weave
Lining: 100% cupro bemberg, 70gsm satin weave
Interfacing: Fusible hair canvas (front panels), non-fusible collar felt
Shoulder pads: Soft natural shoulder pad, 0.5" lift
Buttons: Genuine horn buttons — 2x front (25mm), 8x sleeve (15mm), 1x interior (15mm)
Thread: Corespun poly/cotton blend, matching body color
Labels: Woven main label, care label, size label, composition label`,
  colorways: `Primary: Midnight Navy (Pantone 19-4024 TCX)
Secondary: Charcoal Heather (Pantone 18-0601 TCX)
Seasonal Option: Deep Bordeaux (Pantone 19-1725 TCX)`,
  gradingNotes: `Base size: M (40)
Chest: +2" per size (XS–XL)
Waist: +2" per size
Shoulder: +0.5" per size
Sleeve length: +0.5" per size
Back length: +0.5" per size
Lapel width: Constant across all sizes`,
  specialInstructions: `• Garment must be dry-clean only — include appropriate care labeling
• Press all seams open with 1cm seam allowances
• Natural shoulder construction — no heavy padding
• All buttonholes to be keyhole-style with gimp thread reinforcement
• Pack flat-folded in tissue paper with collar insert; ship in individual garment bags
• Attach hang tag to second button with waxed cotton cord`,
  measurements: [
    { id: "1", point: "Chest (1\" below armhole)", xs: "36", s: "38", m: "40", l: "42", xl: "44" },
    { id: "2", point: "Waist (at button)", xs: "32", s: "34", m: "36", l: "38", xl: "40" },
    { id: "3", point: "Shoulder (seam to seam)", xs: "16.5", s: "17", m: "17.5", l: "18", xl: "18.5" },
    { id: "4", point: "Sleeve length (shoulder to cuff)", xs: "24", s: "24.5", m: "25", l: "25.5", xl: "26" },
    { id: "5", point: "Back length (CB to hem)", xs: "28", s: "28.5", m: "29", l: "29.5", xl: "30" },
    { id: "6", point: "Lapel width", xs: "3.25", s: "3.25", m: "3.25", l: "3.25", xl: "3.25" },
  ],
  bom: blazerBOM,
  annotations: blazerAnnotations,
};

const tshirtBOM: BOMItem[] = [
  { id: "b1", component: "Body fabric", material: "100% combed cotton, 180gsm jersey", supplier: "Supima", unitCost: "4.20", quantity: "1.4", total: "5.88" },
  { id: "b2", component: "Neck rib", material: "95% cotton / 5% elastane, 280gsm", supplier: "Supima", unitCost: "1.80", quantity: "0.15", total: "0.27" },
  { id: "b3", component: "Thread", material: "100% polyester corespun", supplier: "Coats", unitCost: "0.15", quantity: "2", total: "0.30" },
  { id: "b4", component: "Labels", material: "Heat-transfer main + woven care", supplier: "Wunderlabel", unitCost: "0.20", quantity: "2", total: "0.40" },
  { id: "b5", component: "Hang tag", material: "Tearaway cotton stock", supplier: "In-house", unitCost: "0.10", quantity: "1", total: "0.10" },
];

const tshirtPack: TechPackData = {
  garmentType: "Crew Neck T-Shirt",
  category: "Tops — Casual Knitwear",
  silhouette: "Relaxed fit, slight drop shoulder, straight hem, boxy proportions",
  constructionDetails: `Seams: Overlock-stitched side seams and shoulder seams; coverstitch on all hems
Closures: None (pull-over construction)
Collar: Ribbed crew neckline, 1x1 rib, 0.75" width, self-fabric binding
Sleeves: Set-in short sleeves, coverstitch hem at 1" turn-up
Hem: Straight bottom hem, 1" coverstitch turn-up
Construction: Tubular body, cut-and-sew`,
  materialsTrims: `Shell: 100% combed ring-spun cotton, 180gsm single jersey
Neck rib: 95% cotton / 5% elastane, 1x1 rib, 280gsm
Thread: 100% polyester corespun, matching body
Labels: Printed heat-transfer main label (neck), woven care/size label (left side seam)
Tags: Tearaway hang tag`,
  colorways: `Primary: Off White (Pantone 11-0602 TCX)
Option 1: Washed Black (Pantone 19-3911 TCX)
Option 2: Sage Green (Pantone 16-0220 TCX)
Option 3: Clay Rose (Pantone 16-1518 TCX)`,
  gradingNotes: `Base size: M (20" chest)
Chest: +1" per size (XS–XL)
Body length: +1" per size
Shoulder width: +0.75" per size
Sleeve length: +0.5" per size
Neck opening: +0.25" per size`,
  specialInstructions: `• Fabric must be pre-shrunk and garment-washed for lived-in hand feel
• Size label printed inside neck (no sewn-in labels for comfort)
• Slight drop shoulder — 0.5" off natural shoulder point
• Fold and poly-bag individually; pack 12 units per carton, assorted sizes
• Include branded tissue paper wrap inside fold`,
  measurements: [
    { id: "1", point: "Chest (1\" below armhole)", xs: "18", s: "19", m: "20", l: "21.5", xl: "23" },
    { id: "2", point: "Body length (HPS to hem)", xs: "26", s: "27", m: "28", l: "29", xl: "30" },
    { id: "3", point: "Shoulder width", xs: "17", s: "17.75", m: "18.5", l: "19.5", xl: "20.5" },
    { id: "4", point: "Sleeve length", xs: "7.5", s: "8", m: "8.5", l: "9", xl: "9.5" },
    { id: "5", point: "Sleeve opening", xs: "6.5", s: "7", m: "7.5", l: "8", xl: "8.5" },
    { id: "6", point: "Neck opening width", xs: "6.5", s: "6.75", m: "7", l: "7.25", xl: "7.5" },
  ],
  bom: tshirtBOM,
  annotations: [
    { id: "a1", x: 50, y: 15, label: "Ribbed crew neckline, 0.75\"", linkedSection: "construction" },
    { id: "a2", x: 25, y: 42, label: "Coverstitch sleeve hem, 1\" turn-up", linkedSection: "construction" },
    { id: "a3", x: 50, y: 90, label: "Straight bottom hem, coverstitch", linkedSection: "construction" },
  ],
};

const dressBOM: BOMItem[] = [
  { id: "b1", component: "Shell fabric", material: "72% viscose / 28% linen, 175gsm", supplier: "Albini", unitCost: "14.60", quantity: "2.8", total: "40.88" },
  { id: "b2", component: "Bodice lining", material: "100% cotton lawn, 90gsm", supplier: "Liberty", unitCost: "6.20", quantity: "0.8", total: "4.96" },
  { id: "b3", component: "Invisible zipper", material: "YKK #3, 22\", color-matched", supplier: "YKK", unitCost: "1.40", quantity: "1", total: "1.40" },
  { id: "b4", component: "Hook & eye", material: "#2 brass, nickel finish", supplier: "Global Trim", unitCost: "0.25", quantity: "1", total: "0.25" },
  { id: "b5", component: "Labels", material: "Woven jacquard main + care + size", supplier: "Wunderlabel", unitCost: "0.50", quantity: "3", total: "1.50" },
  { id: "b6", component: "Hang tag", material: "350gsm cotton stock, embossed", supplier: "In-house", unitCost: "0.60", quantity: "1", total: "0.60" },
];

const dressPack: TechPackData = {
  garmentType: "A-Line Midi Dress",
  category: "Dresses — Contemporary Womenswear",
  silhouette: "Fitted bodice, A-line skirt, midi length, boat neckline, sleeveless",
  constructionDetails: `Seams: French seams throughout for clean interior finish; princess seams at front bodice
Closures: Invisible zipper at center back, 22" length; hook-and-eye at top
Collar: Boat neckline, self-faced, 0.5" width clean finish
Sleeves: Sleeveless — armhole finished with self-binding, 0.5" width
Hem: Machine-blind hem, 1.5" turn-up
Darts: Two front bust darts, two back waist darts
Lining: Bodice-lined to waist with self-fabric`,
  materialsTrims: `Shell: 72% viscose / 28% linen blend, 175gsm plain weave
Lining (bodice): 100% cotton lawn, 90gsm
Zipper: YKK invisible zipper, #3 weight, color-matched
Hook & Eye: #2 brass, nickel finish
Thread: 100% polyester corespun, matching body
Labels: Woven jacquard main label, printed care label, woven size tab
Hangtag: 350gsm cotton stock with embossed branding`,
  colorways: `Primary: Ivory Linen (Pantone 11-0107 TCX)
Option 1: Terracotta (Pantone 18-1340 TCX)
Option 2: Ocean Blue (Pantone 17-4427 TCX)`,
  gradingNotes: `Base size: M (36" bust)
Bust: +2" per size
Waist: +2" per size
Hip: +2" per size
Total length: +1" per size
Armhole depth: +0.5" per size`,
  specialInstructions: `• All interior seams must be French seams — no exposed raw edges
• Press all seams toward center before shipping
• Garment to be steamed and placed on branded hanger with size ring
• Individual non-woven garment bag for each unit
• Attach swing tag at CB neckline with satin ribbon
• Shrinkage tolerance: max 3% in either direction after first wash`,
  measurements: [
    { id: "1", point: "Bust (underarm)", xs: "32", s: "34", m: "36", l: "38", xl: "40" },
    { id: "2", point: "Waist (natural)", xs: "26", s: "28", m: "30", l: "32", xl: "34" },
    { id: "3", point: "Hip (7\" below waist)", xs: "36", s: "38", m: "40", l: "42", xl: "44" },
    { id: "4", point: "Total length (HPS to hem)", xs: "42", s: "43", m: "44", l: "45", xl: "46" },
    { id: "5", point: "Skirt length (waist to hem)", xs: "26", s: "26.5", m: "27", l: "27.5", xl: "28" },
    { id: "6", point: "Armhole depth", xs: "8", s: "8.5", m: "9", l: "9.5", xl: "10" },
  ],
  bom: dressBOM,
  annotations: [
    { id: "a1", x: 50, y: 12, label: "Boat neckline, self-faced", linkedSection: "construction" },
    { id: "a2", x: 30, y: 30, label: "Princess seams, front bodice", linkedSection: "construction" },
    { id: "a3", x: 50, y: 50, label: "Natural waist seam", linkedSection: "measurements" },
    { id: "a4", x: 50, y: 85, label: "Blind hem, 1.5\" turn-up", linkedSection: "construction" },
  ],
};

const pantsBOM: BOMItem[] = [
  { id: "b1", component: "Shell fabric", material: "98% organic cotton / 2% elastane, 265gsm twill", supplier: "Cone Mills", unitCost: "9.80", quantity: "1.6", total: "15.68" },
  { id: "b2", component: "Pocket lining", material: "100% cotton, 110gsm", supplier: "Cone Mills", unitCost: "2.40", quantity: "0.4", total: "0.96" },
  { id: "b3", component: "Waistband interfacing", material: "Fusible woven", supplier: "Wendler", unitCost: "1.20", quantity: "0.2", total: "0.24" },
  { id: "b4", component: "Button", material: "Corozo nut, 20mm", supplier: "Global Trim", unitCost: "1.80", quantity: "2", total: "3.60" },
  { id: "b5", component: "Zipper", material: "YKK #4.5 brass, antique", supplier: "YKK", unitCost: "1.60", quantity: "1", total: "1.60" },
  { id: "b6", component: "Rivets", material: "Antique brass", supplier: "Global Trim", unitCost: "0.20", quantity: "6", total: "1.20" },
  { id: "b7", component: "Labels", material: "Woven main + heat-transfer care", supplier: "Wunderlabel", unitCost: "0.30", quantity: "2", total: "0.60" },
];

const pantsPack: TechPackData = {
  garmentType: "Tapered Chino Trouser",
  category: "Bottoms — Casual Tailoring",
  silhouette: "Mid-rise, relaxed thigh, tapered leg, cropped above ankle",
  constructionDetails: `Seams: Flat-felled inseam and outseam for durability; single-needle topstitch on all visible seams
Closures: YKK brass zipper fly; single button closure at waistband with bartack reinforcement
Waistband: 1.5" wide contoured waistband with interior grip tape; belt loops (7x)
Pockets: Slant front pockets with cotton pocket bag; double-welt back pockets with button closure (left)
Hem: 1.25" turn-up, blind hem stitch
Fly: Left-over-right with J-stitch reinforcement`,
  materialsTrims: `Shell: 98% organic cotton / 2% elastane, 265gsm twill weave
Pocket lining: 100% cotton, 110gsm
Waistband interlining: Fusible woven interfacing
Button: Corozo nut button, 20mm, natural finish
Zipper: YKK #4.5 brass, antique finish
Rivets: Antique brass rivets at pocket stress points
Thread: Cotton-wrapped polyester core, contrast topstitch option
Labels: Woven main label (waistband interior), heat-transfer care label`,
  colorways: `Primary: Khaki Sand (Pantone 15-1225 TCX)
Option 1: Washed Navy (Pantone 19-3832 TCX)
Option 2: Olive Drab (Pantone 18-0420 TCX)
Option 3: Stone Grey (Pantone 15-4502 TCX)`,
  gradingNotes: `Base size: M (32" waist)
Waist: +2" per size
Front/back rise: +0.5" per size
Thigh: +0.75" per size
Knee: +0.5" per size
Leg opening: +0.25" per size
Inseam: Constant 32" for L and XL; scales down for S and XS`,
  specialInstructions: `• Fabric must be enzyme-washed for soft hand feel before cut
• All bartacks must be color-matched to body
• Left back pocket to have button closure; right back pocket open
• Crease line pressed from front dart to hem
• Pack folded with cardboard waistband form; individual poly bag
• Tolerance: ±0.5" on all measurements`,
  measurements: [
    { id: "1", point: "Waist (relaxed)", xs: "28", s: "30", m: "32", l: "34", xl: "36" },
    { id: "2", point: "Front rise", xs: "10", s: "10.5", m: "11", l: "11.5", xl: "12" },
    { id: "3", point: "Back rise", xs: "14", s: "14.5", m: "15", l: "15.5", xl: "16" },
    { id: "4", point: "Thigh (1\" below crotch)", xs: "11", s: "11.75", m: "12.5", l: "13.25", xl: "14" },
    { id: "5", point: "Knee", xs: "8", s: "8.5", m: "9", l: "9.5", xl: "10" },
    { id: "6", point: "Leg opening", xs: "6", s: "6.25", m: "6.5", l: "6.75", xl: "7" },
    { id: "7", point: "Inseam", xs: "30", s: "31", m: "32", l: "32", xl: "32" },
  ],
  bom: pantsBOM,
  annotations: [
    { id: "a1", x: 50, y: 8, label: "Contoured waistband, 1.5\"", linkedSection: "construction" },
    { id: "a2", x: 35, y: 20, label: "Slant front pocket", linkedSection: "construction" },
    { id: "a3", x: 65, y: 25, label: "YKK brass zipper fly", linkedSection: "materials" },
    { id: "a4", x: 50, y: 92, label: "Blind hem, 1.25\" turn-up", linkedSection: "construction" },
  ],
};

const genericPack: TechPackData = {
  garmentType: "Casual Garment",
  category: "Ready-to-Wear",
  silhouette: "As identified from reference image",
  constructionDetails: `Seams: Overlock-finished interior seams; single-needle topstitching on all visible edges
Closures: As identified by garment style — refer to image
Collar/Neckline: Standard finish with self-binding or facing
Sleeves: Standard set-in construction with finished hem
Hem: Clean-finished bottom hem, coverstitch or blind hem`,
  materialsTrims: `Shell: Cotton or cotton-blend fabric, medium weight
Thread: Polyester corespun, color-matched
Labels: Main brand label, care label, size label
Trims: As required per garment style`,
  colorways: `Primary: As shown in reference image
Option 1: TBD
Option 2: TBD`,
  gradingNotes: `Base size: M
Standard 1" increments on circumference measurements
Standard 0.5" increments on length measurements
Verify grading with fit model before production`,
  specialInstructions: `• Reference garment image for all style details not covered above
• Verify all measurements with physical sample before bulk production
• Standard QC inspection required before shipment
• Individual poly-bag packing`,
  measurements: [
    { id: "1", point: "Chest/Bust", xs: "34", s: "36", m: "38", l: "40", xl: "42" },
    { id: "2", point: "Waist", xs: "28", s: "30", m: "32", l: "34", xl: "36" },
    { id: "3", point: "Hip", xs: "36", s: "38", m: "40", l: "42", xl: "44" },
    { id: "4", point: "Total Length", xs: "26", s: "27", m: "28", l: "29", xl: "30" },
    { id: "5", point: "Shoulder Width", xs: "15", s: "16", m: "17", l: "18", xl: "19" },
    { id: "6", point: "Sleeve Length", xs: "23", s: "24", m: "25", l: "26", xl: "27" },
  ],
  bom: [],
  annotations: [],
};

// Rotate through packs to simulate AI variety
const packs = [blazerPack, tshirtPack, dressPack, pantsPack, genericPack];
let packIndex = 0;

export function generateMockTechPack(_brandName: string): TechPackData {
  const pack = packs[packIndex % packs.length];
  packIndex++;
  return JSON.parse(JSON.stringify(pack));
}