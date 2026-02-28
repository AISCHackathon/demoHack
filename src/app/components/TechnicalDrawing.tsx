/**
 * SVG technical flat drawings for garments.
 * These are simplified "fashion flats" used in tech packs to communicate
 * construction, seaming, and proportions to manufacturers.
 */

interface TechnicalDrawingProps {
  garmentType: string;
  className?: string;
}

export function TechnicalDrawing({ garmentType, className = "" }: TechnicalDrawingProps) {
  const type = classifyGarment(garmentType);
  const DrawingComponent = drawingMap[type] || GenericDrawing;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-full max-w-[420px]">
        <div className="flex items-start gap-6 justify-center">
          <div className="flex-1 flex flex-col items-center">
            <DrawingComponent view="front" />
            <span className="text-muted-foreground mt-3 block text-center" style={{ fontSize: "0.625rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Front
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <DrawingComponent view="back" />
            <span className="text-muted-foreground mt-3 block text-center" style={{ fontSize: "0.625rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Garment classification ── */

type GarmentKey = "blazer" | "tshirt" | "dress" | "trousers" | "jacket" | "knitwear" | "generic";

function classifyGarment(garmentType: string): GarmentKey {
  const t = garmentType.toLowerCase();
  if (t.includes("blazer") || t.includes("suit")) return "blazer";
  if (t.includes("t-shirt") || t.includes("tee") || t.includes("crew neck t")) return "tshirt";
  if (t.includes("dress") || t.includes("skirt")) return "dress";
  if (t.includes("trouser") || t.includes("chino") || t.includes("pant") || t.includes("short")) return "trousers";
  if (t.includes("jacket") || t.includes("coat") || t.includes("trucker") || t.includes("hoodie") || t.includes("denim")) return "jacket";
  if (t.includes("knit") || t.includes("sweater") || t.includes("merino") || t.includes("crewneck") || t.includes("pullover")) return "knitwear";
  return "generic";
}

/* ── Shared SVG styles ── */

const S = {
  stroke: "#2A0B11",
  strokeWidth: 0.8,
  fill: "none",
  stitch: {
    strokeDasharray: "2.5 1.5",
    strokeWidth: 0.5,
    stroke: "#6B1D2A",
    opacity: 0.4,
  },
  detail: {
    strokeWidth: 0.5,
    stroke: "#2A0B11",
    opacity: 0.45,
  },
  fold: {
    strokeDasharray: "4 2",
    strokeWidth: 0.4,
    stroke: "#2A0B11",
    opacity: 0.25,
  },
};

/* ── Blazer ── */

function BlazerDrawing({ view }: { view: "front" | "back" }) {
  if (view === "front") {
    return (
      <svg viewBox="0 0 120 180" className="w-full" style={{ maxHeight: 320 }}>
        {/* Body outline — tailored silhouette with slight waist suppression */}
        <path
          d="M40 14 L34 18 Q26 24 22 38 L20 50 L18 68 L16 80 L17 100 L16 130 Q16 148 18 152 L48 152 L50 146 L56 150 L60 152 L64 150 L70 146 L72 152 L102 152 Q104 148 104 130 L103 100 L104 80 L102 68 L100 50 L98 38 Q94 24 86 18 L80 14"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Shoulders */}
        <path d="M40 14 Q50 9 60 9 Q70 9 80 14" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        {/* Neckline */}
        <path d="M40 14 Q44 8 48 5 Q54 3 60 4 Q66 3 72 5 Q76 8 80 14" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        {/* Notched lapel — left (prominent V-notch) */}
        <path d="M48 5 L46 14 L42 24 L38 30 L36 26 L32 22" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        <path d="M38 30 L48 52 L56 40 L60 30" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        {/* Notched lapel — right (prominent V-notch) */}
        <path d="M72 5 L74 14 L78 24 L82 30 L84 26 L88 22" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        <path d="M82 30 L72 52 L64 40 L60 30" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        {/* Lapel roll line */}
        <line x1="46" y1="14" x2="56" y2="40" {...S.fold} />
        <line x1="74" y1="14" x2="64" y2="40" {...S.fold} />
        {/* Center front line */}
        <line x1="60" y1="30" x2="60" y2="152" {...S.fold} />
        {/* Two-button front */}
        <circle cx="60" cy="78" r="2.2" stroke={S.stroke} strokeWidth={0.6} fill={S.fill} />
        <circle cx="60" cy="96" r="2.2" stroke={S.stroke} strokeWidth={0.6} fill={S.fill} />
        {/* Left sleeve — FULL LENGTH set-in sleeve */}
        <path
          d="M22 38 L10 52 L4 80 L2 105 L4 120 Q6 126 10 128 L18 128 L20 126 L22 120"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Left sleeve connects to body at armhole */}
        <line x1="22" y1="120" x2="18" y2="68" {...S.fold} opacity={0} />
        {/* Right sleeve — FULL LENGTH set-in sleeve */}
        <path
          d="M98 38 L110 52 L116 80 L118 105 L116 120 Q114 126 110 128 L102 128 L100 126 L98 120"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Sleeve cuff buttons — left (4 kissing buttons) */}
        <circle cx="10" cy="118" r="1" {...S.detail} fill={S.fill} />
        <circle cx="10" cy="114" r="1" {...S.detail} fill={S.fill} />
        <circle cx="10" cy="110" r="1" {...S.detail} fill={S.fill} />
        <circle cx="10" cy="106" r="1" {...S.detail} fill={S.fill} />
        {/* Sleeve cuff buttons — right */}
        <circle cx="110" cy="118" r="1" {...S.detail} fill={S.fill} />
        <circle cx="110" cy="114" r="1" {...S.detail} fill={S.fill} />
        <circle cx="110" cy="110" r="1" {...S.detail} fill={S.fill} />
        <circle cx="110" cy="106" r="1" {...S.detail} fill={S.fill} />
        {/* Welt chest pocket (left chest) */}
        <line x1="66" y1="50" x2="80" y2="50" stroke={S.stroke} strokeWidth={0.6} />
        <path d="M66 50 L66 52 L80 52 L80 50" {...S.detail} />
        {/* Flap hip pockets */}
        <path d="M24 106 L46 106 L46 108 L24 108 Z" stroke={S.stroke} strokeWidth={0.5} fill={S.fill} />
        <path d="M24 108 L46 108 L46 118 L24 118 Z" {...S.detail} fill={S.fill} />
        <path d="M74 106 L96 106 L96 108 L74 108 Z" stroke={S.stroke} strokeWidth={0.5} fill={S.fill} />
        <path d="M74 108 L96 108 L96 118 L74 118 Z" {...S.detail} fill={S.fill} />
        {/* Shoulder seam stitching */}
        <line x1="40" y1="14" x2="22" y2="38" {...S.stitch} />
        <line x1="80" y1="14" x2="98" y2="38" {...S.stitch} />
        {/* Side seam stitching */}
        <line x1="18" y1="68" x2="16" y2="130" {...S.stitch} />
        <line x1="102" y1="68" x2="104" y2="130" {...S.stitch} />
        {/* Waist suppression darts */}
        <line x1="34" y1="72" x2="36" y2="96" {...S.stitch} />
        <line x1="86" y1="72" x2="84" y2="96" {...S.stitch} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 180" className="w-full" style={{ maxHeight: 320 }}>
      {/* Body outline — back */}
      <path
        d="M40 14 L34 18 Q26 24 22 38 L20 50 L18 68 L16 80 L17 100 L16 130 Q16 148 18 152 L102 152 Q104 148 104 130 L103 100 L104 80 L102 68 L100 50 L98 38 Q94 24 86 18 L80 14"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Shoulders + higher back neckline */}
      <path d="M40 14 Q50 9 60 9 Q70 9 80 14" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
      <path d="M40 14 Q50 11 60 11 Q70 11 80 14" stroke={S.stroke} strokeWidth={0.5} fill={S.fill} />
      {/* Center back seam */}
      <line x1="60" y1="11" x2="60" y2="152" {...S.fold} />
      {/* Back vent */}
      <line x1="60" y1="120" x2="60" y2="152" stroke={S.stroke} strokeWidth={0.6} />
      <line x1="57" y1="120" x2="63" y2="120" {...S.detail} />
      {/* Left sleeve — full length */}
      <path
        d="M22 38 L10 52 L4 80 L2 105 L4 120 Q6 126 10 128 L18 128 L20 126 L22 120"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Right sleeve — full length */}
      <path
        d="M98 38 L110 52 L116 80 L118 105 L116 120 Q114 126 110 128 L102 128 L100 126 L98 120"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Shoulder seams */}
      <line x1="40" y1="14" x2="22" y2="38" {...S.stitch} />
      <line x1="80" y1="14" x2="98" y2="38" {...S.stitch} />
      {/* Side seams */}
      <line x1="18" y1="68" x2="16" y2="130" {...S.stitch} />
      <line x1="102" y1="68" x2="104" y2="130" {...S.stitch} />
      {/* Back yoke seam */}
      <path d="M22 38 Q60 34 98 38" {...S.stitch} />
      {/* Back darts */}
      <line x1="40" y1="40" x2="42" y2="86" {...S.stitch} />
      <line x1="80" y1="40" x2="78" y2="86" {...S.stitch} />
      {/* Back seam label */}
      <rect x="54" y="14" width="12" height="5" rx="0.5" {...S.detail} />
    </svg>
  );
}

/* ── T-Shirt ── */

function TshirtDrawing({ view }: { view: "front" | "back" }) {
  if (view === "front") {
    return (
      <svg viewBox="0 0 120 150" className="w-full" style={{ maxHeight: 280 }}>
        {/* Body */}
        <path
          d="M40 10 L26 16 L10 30 L2 52 L18 56 L22 42 L22 130 Q22 136 26 138 L94 138 Q98 136 98 130 L98 42 L102 56 L118 52 L110 30 L94 16 L80 10"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Collar */}
        <path d="M40 10 Q48 4 60 4 Q72 4 80 10" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        {/* Collar rib */}
        <path d="M40 10 Q48 6 60 6 Q72 6 80 10" {...S.detail} />
        {/* Shoulder seams */}
        <line x1="40" y1="10" x2="26" y2="16" {...S.stitch} />
        <line x1="80" y1="10" x2="94" y2="16" {...S.stitch} />
        {/* Sleeve hem stitching */}
        <path d="M18 56 Q20 49 22 42" {...S.stitch} />
        <path d="M102 56 Q100 49 98 42" {...S.stitch} />
        <line x1="17" y1="54" x2="22" y2="40" {...S.stitch} />
        <line x1="103" y1="54" x2="98" y2="40" {...S.stitch} />
        {/* Bottom hem stitch */}
        <line x1="22" y1="135" x2="98" y2="135" {...S.stitch} />
        {/* Side seams */}
        <line x1="22" y1="42" x2="22" y2="130" {...S.stitch} />
        <line x1="98" y1="42" x2="98" y2="130" {...S.stitch} />
        {/* Center fold */}
        <line x1="60" y1="6" x2="60" y2="138" {...S.fold} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 150" className="w-full" style={{ maxHeight: 280 }}>
      {/* Body */}
      <path
        d="M40 10 L26 16 L10 30 L2 52 L18 56 L22 42 L22 130 Q22 136 26 138 L94 138 Q98 136 98 130 L98 42 L102 56 L118 52 L110 30 L94 16 L80 10"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Back neckline (higher) */}
      <path d="M40 10 Q48 7 60 7 Q72 7 80 10" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
      <path d="M40 10 Q48 8.5 60 8.5 Q72 8.5 80 10" {...S.detail} />
      {/* Center back */}
      <line x1="60" y1="8.5" x2="60" y2="138" {...S.fold} />
      {/* Shoulder seams */}
      <line x1="40" y1="10" x2="26" y2="16" {...S.stitch} />
      <line x1="80" y1="10" x2="94" y2="16" {...S.stitch} />
      {/* Bottom hem */}
      <line x1="22" y1="135" x2="98" y2="135" {...S.stitch} />
      {/* Side seams */}
      <line x1="22" y1="42" x2="22" y2="130" {...S.stitch} />
      <line x1="98" y1="42" x2="98" y2="130" {...S.stitch} />
      {/* Back neck label indicator */}
      <rect x="54" y="12" width="12" height="6" rx="0.5" {...S.detail} />
    </svg>
  );
}

/* ── Dress ── */

function DressDrawing({ view }: { view: "front" | "back" }) {
  if (view === "front") {
    return (
      <svg viewBox="0 0 120 190" className="w-full" style={{ maxHeight: 320 }}>
        {/* Body + skirt */}
        <path
          d="M44 8 L36 12 L30 20 L28 36 L26 54 L24 70 L8 170 Q8 174 12 176 L108 176 Q112 174 112 170 L96 70 L94 54 L92 36 L90 20 L84 12 L76 8"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Boat neckline */}
        <path d="M44 8 Q52 4 60 4 Q68 4 76 8" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        {/* Armhole */}
        <path d="M36 12 L30 20 L28 36" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        <path d="M84 12 L90 20 L92 36" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        {/* Armhole binding */}
        <path d="M36 12 L30 21 L29 35" {...S.stitch} />
        <path d="M84 12 L90 21 L91 35" {...S.stitch} />
        {/* Waist seam */}
        <path d="M24 70 Q40 66 60 66 Q80 66 96 70" {...S.stitch} />
        {/* Princess seams front */}
        <path d="M42 18 Q38 40 36 66" {...S.stitch} />
        <path d="M78 18 Q82 40 84 66" {...S.stitch} />
        {/* Bust darts */}
        <path d="M38 30 L44 42 L38 54" {...S.detail} />
        <path d="M82 30 L76 42 L82 54" {...S.detail} />
        {/* Center front */}
        <line x1="60" y1="4" x2="60" y2="176" {...S.fold} />
        {/* Hem stitch */}
        <path d="M8 170 Q60 168 112 170" {...S.stitch} />
        {/* Side seams */}
        <line x1="26" y1="54" x2="8" y2="170" {...S.stitch} />
        <line x1="94" y1="54" x2="112" y2="170" {...S.stitch} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 190" className="w-full" style={{ maxHeight: 320 }}>
      {/* Body + skirt */}
      <path
        d="M44 8 L36 12 L30 20 L28 36 L26 54 L24 70 L8 170 Q8 174 12 176 L108 176 Q112 174 112 170 L96 70 L94 54 L92 36 L90 20 L84 12 L76 8"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Back neckline (higher) */}
      <path d="M44 8 Q52 6 60 6 Q68 6 76 8" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
      {/* Center back zipper */}
      <line x1="60" y1="6" x2="60" y2="70" stroke={S.stroke} strokeWidth={0.6} />
      {/* Zipper teeth */}
      <line x1="58" y1="10" x2="62" y2="10" {...S.detail} />
      <line x1="58" y1="16" x2="62" y2="16" {...S.detail} />
      <line x1="58" y1="22" x2="62" y2="22" {...S.detail} />
      <line x1="58" y1="28" x2="62" y2="28" {...S.detail} />
      <line x1="58" y1="34" x2="62" y2="34" {...S.detail} />
      <line x1="58" y1="40" x2="62" y2="40" {...S.detail} />
      <line x1="58" y1="46" x2="62" y2="46" {...S.detail} />
      {/* Zipper pull */}
      <circle cx="60" cy="8" r="1.2" {...S.detail} />
      {/* Waist seam */}
      <path d="M24 70 Q40 66 60 66 Q80 66 96 70" {...S.stitch} />
      {/* Back waist darts */}
      <path d="M42 36 L44 55 L46 66" {...S.stitch} />
      <path d="M78 36 L76 55 L74 66" {...S.stitch} />
      {/* Center fold below zip */}
      <line x1="60" y1="70" x2="60" y2="176" {...S.fold} />
      {/* Hem */}
      <path d="M8 170 Q60 168 112 170" {...S.stitch} />
      {/* Side seams */}
      <line x1="26" y1="54" x2="8" y2="170" {...S.stitch} />
      <line x1="94" y1="54" x2="112" y2="170" {...S.stitch} />
      {/* Armhole */}
      <path d="M36 12 L30 21 L29 35" {...S.stitch} />
      <path d="M84 12 L90 21 L91 35" {...S.stitch} />
    </svg>
  );
}

/* ── Trousers ── */

function TrousersDrawing({ view }: { view: "front" | "back" }) {
  if (view === "front") {
    return (
      <svg viewBox="0 0 100 190" className="w-full" style={{ maxHeight: 320 }}>
        {/* Waistband */}
        <path
          d="M18 6 L82 6 Q84 6 84 8 L84 16 Q84 18 82 18 L18 18 Q16 18 16 16 L16 8 Q16 6 18 6 Z"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill}
        />
        {/* Belt loops */}
        {[24, 38, 50, 62, 76].map((x) => (
          <rect key={x} x={x - 1.5} y={4} width={3} height={16} rx={0.5} {...S.detail} />
        ))}
        {/* Left leg */}
        <path
          d="M16 18 L14 50 L12 80 Q10 130 14 180 Q14 184 18 184 L46 184 Q48 184 48 180 L50 80"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Right leg */}
        <path
          d="M84 18 L86 50 L88 80 Q90 130 86 180 Q86 184 82 184 L54 184 Q52 184 52 180 L50 80"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Fly */}
        <path d="M50 18 L50 48" stroke={S.stroke} strokeWidth={0.6} />
        <path d="M44 18 Q44 40 50 48" {...S.stitch} />
        {/* Fly button */}
        <circle cx="50" cy="12" r="2" stroke={S.stroke} strokeWidth={0.6} fill={S.fill} />
        {/* Front pocket openings */}
        <path d="M16 18 Q22 22 30 26" stroke={S.stroke} strokeWidth={0.7} />
        <path d="M84 18 Q78 22 70 26" stroke={S.stroke} strokeWidth={0.7} />
        {/* Front crease */}
        <line x1="32" y1="30" x2="32" y2="180" {...S.fold} />
        <line x1="68" y1="30" x2="68" y2="180" {...S.fold} />
        {/* Inseam */}
        <line x1="48" y1="80" x2="46" y2="184" {...S.stitch} />
        <line x1="52" y1="80" x2="54" y2="184" {...S.stitch} />
        {/* Outseam */}
        <line x1="14" y1="50" x2="14" y2="180" {...S.stitch} />
        <line x1="86" y1="50" x2="86" y2="180" {...S.stitch} />
        {/* Hem stitch */}
        <line x1="14" y1="181" x2="46" y2="181" {...S.stitch} />
        <line x1="54" y1="181" x2="86" y2="181" {...S.stitch} />
        {/* Pocket rivets */}
        <circle cx="22" cy="22" r="1" {...S.detail} fill={S.fill} />
        <circle cx="78" cy="22" r="1" {...S.detail} fill={S.fill} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 190" className="w-full" style={{ maxHeight: 320 }}>
      {/* Waistband */}
      <path
        d="M18 6 L82 6 Q84 6 84 8 L84 16 Q84 18 82 18 L18 18 Q16 18 16 16 L16 8 Q16 6 18 6 Z"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill}
      />
      {/* Belt loops */}
      {[24, 38, 50, 62, 76].map((x) => (
        <rect key={x} x={x - 1.5} y={4} width={3} height={16} rx={0.5} {...S.detail} />
      ))}
      {/* Left leg */}
      <path
        d="M16 18 L14 50 L12 80 Q10 130 14 180 Q14 184 18 184 L46 184 Q48 184 48 180 L50 80"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Right leg */}
      <path
        d="M84 18 L86 50 L88 80 Q90 130 86 180 Q86 184 82 184 L54 184 Q52 184 52 180 L50 80"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Center back seam */}
      <line x1="50" y1="18" x2="50" y2="80" {...S.stitch} />
      {/* Back yoke */}
      <path d="M16 30 Q50 28 84 30" {...S.stitch} />
      {/* Back pockets */}
      <path d="M28 36 L28 52 L44 52 L44 36 Z" {...S.detail} />
      <path d="M56 36 L56 52 L72 52 L72 36 Z" {...S.detail} />
      {/* Pocket flap on left */}
      <path d="M56 36 L72 36" stroke={S.stroke} strokeWidth={0.5} />
      <circle cx="64" cy="38.5" r="1" {...S.detail} fill={S.fill} />
      {/* Back crease */}
      <line x1="32" y1="30" x2="32" y2="180" {...S.fold} />
      <line x1="68" y1="30" x2="68" y2="180" {...S.fold} />
      {/* Inseam */}
      <line x1="48" y1="80" x2="46" y2="184" {...S.stitch} />
      <line x1="52" y1="80" x2="54" y2="184" {...S.stitch} />
      {/* Outseam */}
      <line x1="14" y1="50" x2="14" y2="180" {...S.stitch} />
      <line x1="86" y1="50" x2="86" y2="180" {...S.stitch} />
      {/* Hem stitch */}
      <line x1="14" y1="181" x2="46" y2="181" {...S.stitch} />
      <line x1="54" y1="181" x2="86" y2="181" {...S.stitch} />
    </svg>
  );
}

/* ── Jacket ── */

function JacketDrawing({ view }: { view: "front" | "back" }) {
  if (view === "front") {
    return (
      <svg viewBox="0 0 130 170" className="w-full" style={{ maxHeight: 300 }}>
        {/* Body */}
        <path
          d="M42 10 L32 16 Q22 24 18 38 L14 56 L12 72 L12 140 Q12 146 16 148 L56 148 L56 142 L60 146 L65 146 L70 142 L74 148 L114 148 Q118 146 118 140 L118 72 L116 56 L112 38 Q108 24 98 16 L88 10"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Collar/neckline */}
        <path d="M42 10 Q52 5 65 5 Q78 5 88 10" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        {/* Collar band */}
        <path d="M42 10 Q45 6 50 4 L52 8" stroke={S.stroke} strokeWidth={0.6} fill={S.fill} />
        <path d="M88 10 Q85 6 80 4 L78 8" stroke={S.stroke} strokeWidth={0.6} fill={S.fill} />
        {/* Left sleeve */}
        <path d="M18 38 L2 52 L0 72 L4 76 L12 72" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        {/* Right sleeve */}
        <path d="M112 38 L128 52 L130 72 L126 76 L118 72" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        {/* Front opening */}
        <line x1="65" y1="5" x2="65" y2="148" {...S.fold} />
        {/* Snap/button placket */}
        <circle cx="65" cy="40" r="1.5" {...S.detail} fill={S.fill} />
        <circle cx="65" cy="56" r="1.5" {...S.detail} fill={S.fill} />
        <circle cx="65" cy="72" r="1.5" {...S.detail} fill={S.fill} />
        <circle cx="65" cy="88" r="1.5" {...S.detail} fill={S.fill} />
        <circle cx="65" cy="104" r="1.5" {...S.detail} fill={S.fill} />
        {/* Chest flap pockets */}
        <path d="M22 58 L40 58 L40 60 L22 60 Z" stroke={S.stroke} strokeWidth={0.5} fill={S.fill} />
        <path d="M22 60 L40 60 L40 72 L22 72 Z" {...S.detail} />
        <path d="M90 58 L108 58 L108 60 L90 60 Z" stroke={S.stroke} strokeWidth={0.5} fill={S.fill} />
        <path d="M90 60 L108 60 L108 72 L90 72 Z" {...S.detail} />
        {/* Hip pockets */}
        <path d="M20 94 L42 94 L42 96 L20 96 Z" stroke={S.stroke} strokeWidth={0.5} fill={S.fill} />
        <path d="M88 94 L110 94 L110 96 L88 96 Z" stroke={S.stroke} strokeWidth={0.5} fill={S.fill} />
        {/* Shoulder seams */}
        <line x1="42" y1="10" x2="18" y2="38" {...S.stitch} />
        <line x1="88" y1="10" x2="112" y2="38" {...S.stitch} />
        {/* Yoke seam front */}
        <line x1="18" y1="38" x2="65" y2="30" {...S.stitch} />
        <line x1="112" y1="38" x2="65" y2="30" {...S.stitch} />
        {/* Waistband seam hint */}
        <line x1="12" y1="110" x2="56" y2="110" {...S.stitch} />
        <line x1="74" y1="110" x2="118" y2="110" {...S.stitch} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 130 170" className="w-full" style={{ maxHeight: 300 }}>
      {/* Body */}
      <path
        d="M42 10 L32 16 Q22 24 18 38 L14 56 L12 72 L12 140 Q12 146 16 148 L114 148 Q118 146 118 140 L118 72 L116 56 L112 38 Q108 24 98 16 L88 10"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Neckline */}
      <path d="M42 10 Q52 7 65 7 Q78 7 88 10" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
      {/* Collar band back */}
      <path d="M42 10 Q52 5 65 5 Q78 5 88 10" stroke={S.stroke} strokeWidth={0.6} fill={S.fill} />
      {/* Left sleeve */}
      <path d="M18 38 L2 52 L0 72 L4 76 L12 72" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
      {/* Right sleeve */}
      <path d="M112 38 L128 52 L130 72 L126 76 L118 72" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
      {/* Center back */}
      <line x1="65" y1="7" x2="65" y2="148" {...S.fold} />
      {/* Back yoke seam */}
      <path d="M18 38 Q65 32 112 38" stroke={S.stroke} strokeWidth={0.6} />
      {/* Shoulder seams */}
      <line x1="42" y1="10" x2="18" y2="38" {...S.stitch} />
      <line x1="88" y1="10" x2="112" y2="38" {...S.stitch} />
      {/* Waist seam */}
      <line x1="12" y1="110" x2="118" y2="110" {...S.stitch} />
      {/* Side seams */}
      <line x1="12" y1="72" x2="12" y2="140" {...S.stitch} />
      <line x1="118" y1="72" x2="118" y2="140" {...S.stitch} />
      {/* Back action pleat */}
      <line x1="50" y1="38" x2="50" y2="110" {...S.fold} />
      <line x1="80" y1="38" x2="80" y2="110" {...S.fold} />
    </svg>
  );
}

/* ── Knitwear ── */

function KnitwearDrawing({ view }: { view: "front" | "back" }) {
  if (view === "front") {
    return (
      <svg viewBox="0 0 120 155" className="w-full" style={{ maxHeight: 280 }}>
        {/* Body */}
        <path
          d="M40 12 L28 18 Q18 26 16 40 L10 60 L8 78 L8 126 Q8 132 12 134 L108 134 Q112 132 112 126 L112 78 L110 60 L104 40 Q102 26 92 18 L80 12"
          stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
        />
        {/* Ribbed collar */}
        <path d="M40 12 Q50 6 60 6 Q70 6 80 12" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
        <path d="M40 12 Q50 8 60 8 Q70 8 80 12" {...S.detail} />
        <path d="M41 12 Q50 9 60 9 Q70 9 79 12" {...S.detail} opacity={0.25} />
        {/* Left sleeve */}
        <path d="M16 40 L2 58 L0 82 L4 86 L8 78" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        {/* Ribbed cuff left */}
        <line x1="1" y1="79" x2="5" y2="83" {...S.detail} />
        <line x1="1" y1="81" x2="4.5" y2="85" {...S.detail} opacity={0.25} />
        {/* Right sleeve */}
        <path d="M104 40 L118 58 L120 82 L116 86 L112 78" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
        {/* Ribbed cuff right */}
        <line x1="119" y1="79" x2="115" y2="83" {...S.detail} />
        <line x1="119" y1="81" x2="115.5" y2="85" {...S.detail} opacity={0.25} />
        {/* Ribbed hem */}
        <line x1="8" y1="130" x2="112" y2="130" {...S.detail} />
        <line x1="8" y1="132" x2="112" y2="132" {...S.detail} opacity={0.25} />
        {/* Center fold */}
        <line x1="60" y1="8" x2="60" y2="134" {...S.fold} />
        {/* Shoulder seams */}
        <line x1="40" y1="12" x2="16" y2="40" {...S.stitch} />
        <line x1="80" y1="12" x2="104" y2="40" {...S.stitch} />
        {/* Side seams */}
        <line x1="8" y1="78" x2="8" y2="126" {...S.stitch} />
        <line x1="112" y1="78" x2="112" y2="126" {...S.stitch} />
        {/* Knit texture hints */}
        <line x1="36" y1="50" x2="36" y2="120" {...S.fold} opacity={0.15} />
        <line x1="48" y1="45" x2="48" y2="125" {...S.fold} opacity={0.15} />
        <line x1="72" y1="45" x2="72" y2="125" {...S.fold} opacity={0.15} />
        <line x1="84" y1="50" x2="84" y2="120" {...S.fold} opacity={0.15} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 155" className="w-full" style={{ maxHeight: 280 }}>
      {/* Body */}
      <path
        d="M40 12 L28 18 Q18 26 16 40 L10 60 L8 78 L8 126 Q8 132 12 134 L108 134 Q112 132 112 126 L112 78 L110 60 L104 40 Q102 26 92 18 L80 12"
        stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round"
      />
      {/* Back neckline */}
      <path d="M40 12 Q50 8 60 8 Q70 8 80 12" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} />
      <path d="M41 12 Q50 9.5 60 9.5 Q70 9.5 79 12" {...S.detail} />
      {/* Sleeves */}
      <path d="M16 40 L2 58 L0 82 L4 86 L8 78" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
      <path d="M104 40 L118 58 L120 82 L116 86 L112 78" stroke={S.stroke} strokeWidth={S.strokeWidth} fill={S.fill} strokeLinejoin="round" />
      {/* Center back */}
      <line x1="60" y1="8" x2="60" y2="134" {...S.fold} />
      {/* Shoulder seams */}
      <line x1="40" y1="12" x2="16" y2="40" {...S.stitch} />
      <line x1="80" y1="12" x2="104" y2="40" {...S.stitch} />
      {/* Ribbed hem */}
      <line x1="8" y1="130" x2="112" y2="130" {...S.detail} />
      <line x1="8" y1="132" x2="112" y2="132" {...S.detail} opacity={0.25} />
      {/* Back label */}
      <rect x="54" y="14" width="12" height="6" rx="0.5" {...S.detail} />
      {/* Side seams */}
      <line x1="8" y1="78" x2="8" y2="126" {...S.stitch} />
      <line x1="112" y1="78" x2="112" y2="126" {...S.stitch} />
      {/* Knit texture hints */}
      <line x1="36" y1="50" x2="36" y2="120" {...S.fold} opacity={0.15} />
      <line x1="48" y1="45" x2="48" y2="125" {...S.fold} opacity={0.15} />
      <line x1="72" y1="45" x2="72" y2="125" {...S.fold} opacity={0.15} />
      <line x1="84" y1="50" x2="84" y2="120" {...S.fold} opacity={0.15} />
    </svg>
  );
}

/* ── Generic fallback ── */

function GenericDrawing({ view }: { view: "front" | "back" }) {
  // Simplified t-shirt-like garment
  return <TshirtDrawing view={view} />;
}

/* ── Map ── */

const drawingMap: Record<GarmentKey, React.FC<{ view: "front" | "back" }>> = {
  blazer: BlazerDrawing,
  tshirt: TshirtDrawing,
  dress: DressDrawing,
  trousers: TrousersDrawing,
  jacket: JacketDrawing,
  knitwear: KnitwearDrawing,
  generic: GenericDrawing,
};
