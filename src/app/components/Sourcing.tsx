import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Package,
  ExternalLink,
  Mail,
  ShieldCheck,
  Leaf,
  Award,
  X,
  LayoutGrid,
  List,
  Heart,
  Globe,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import {
  type PartnerType,
  type Region,
  type Partner,
  typeLabels,
  regionLabels,
  mockPartners,
} from "../data/partners";



/* ── tiny sub-components ── */

function MiniBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-muted-foreground" style={{ fontSize: "0.625rem" }}>{label}</span>
        <span className="text-foreground" style={{ fontSize: "0.625rem", fontWeight: 600 }}>{value}%</span>
      </div>
      <div className="h-[3px] rounded-full bg-burgundy-950/[0.05] overflow-hidden">
        <div
          className="h-full rounded-full bg-burgundy/40 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RatingBadge({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3 h-3 text-burgundy fill-burgundy/20" />
      <span className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{rating}</span>
      <span className="text-muted-foreground/70" style={{ fontSize: "0.6875rem" }}>({reviews})</span>
    </div>
  );
}

/* ── main component ── */

export function Sourcing() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PartnerType>("all");
  const [regionFilter, setRegionFilter] = useState<Region>("all");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showSustainableOnly, setShowSustainableOnly] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["p-2", "p-4"]));

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = mockPartners.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.specialties.some((s) => s.toLowerCase().includes(q)) &&
        !p.country.toLowerCase().includes(q) &&
        !p.city.toLowerCase().includes(q)
      )
        return false;
    }
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (regionFilter !== "all" && p.region !== regionFilter) return false;
    if (showVerifiedOnly && !p.verified) return false;
    if (showSustainableOnly && !p.sustainable) return false;
    return true;
  });

  const verifiedCount = mockPartners.filter((p) => p.verified).length;
  const sustainableCount = mockPartners.filter((p) => p.sustainable).length;
  const countryCount = new Set(mockPartners.map((p) => p.country)).size;
  const avgRating = (mockPartners.reduce((s, p) => s + p.rating, 0) / mockPartners.length).toFixed(1);

  const typeOptions: PartnerType[] = ["all", "manufacturer", "fabric_supplier", "trim_supplier", "dye_house"];
  const regionOptions: Region[] = ["all", "asia", "europe", "americas"];

  const typeCounts: Record<PartnerType, number> = {
    all: mockPartners.length,
    manufacturer: mockPartners.filter((p) => p.type === "manufacturer").length,
    fabric_supplier: mockPartners.filter((p) => p.type === "fabric_supplier").length,
    trim_supplier: mockPartners.filter((p) => p.type === "trim_supplier").length,
    dye_house: mockPartners.filter((p) => p.type === "dye_house").length,
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
        {/* Title row */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-foreground" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
              Sourcing Partners
            </h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "0.8125rem" }}>
              Manage and discover manufacturing partners
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${viewMode === "grid" ? "bg-burgundy-950/[0.06] text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              title="Grid view"
            >
              <LayoutGrid className="w-[15px] h-[15px]" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${viewMode === "list" ? "bg-burgundy-950/[0.06] text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              title="List view"
            >
              <List className="w-[15px] h-[15px]" />
            </button>
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Partners", value: mockPartners.length.toString(), icon: Users, sub: `${countryCount} countries` },
            { label: "Avg. Rating", value: avgRating, icon: Star, sub: "across all partners" },
            { label: "Verified", value: verifiedCount.toString(), icon: ShieldCheck, sub: `of ${mockPartners.length} partners` },
            { label: "Sustainable", value: sustainableCount.toString(), icon: Leaf, sub: "certified green" },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-3.5 rounded-[10px] bg-white border border-burgundy-950/[0.04]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[26px] h-[26px] rounded-[7px] bg-burgundy-950/[0.04] flex items-center justify-center">
                  <stat.icon className="w-3 h-3 text-burgundy/60" />
                </div>
                <span className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>{stat.label}</span>
              </div>
              <p className="text-foreground" style={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1 }}>{stat.value}</p>
              <p className="text-muted-foreground/70 mt-1" style={{ fontSize: "0.625rem" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Type pills ── */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-0.5 -mx-1 px-1">
          {typeOptions.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-[6px] rounded-full border transition-colors cursor-pointer ${typeFilter === t
                ? "border-burgundy/20 bg-burgundy-950 text-cream"
                : "border-burgundy-950/[0.06] bg-white text-muted-foreground hover:text-foreground hover:border-burgundy-950/[0.10]"
                }`}
              style={{ fontSize: "0.75rem" }}
            >
              {typeLabels[t]}
              {typeCounts[t] > 0 && (
                <span
                  className={`min-w-[16px] h-[16px] rounded-full flex items-center justify-center ${typeFilter === t ? "bg-cream/20 text-cream" : "bg-burgundy-950/[0.05] text-muted-foreground"
                    }`}
                  style={{ fontSize: "0.5625rem", fontWeight: 600, padding: "0 4px" }}
                >
                  {typeCounts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Search + secondary filters ── */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Search partners, specialties, locations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-[7px] rounded-[8px] border border-burgundy-950/[0.06] bg-white text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-burgundy/15 transition-colors"
              style={{ fontSize: "0.8125rem" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground/30 hover:text-muted-foreground cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Region pills */}
          <div className="flex items-center gap-1">
            {regionOptions.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`flex items-center gap-1 px-2.5 py-[6px] rounded-[7px] border transition-colors cursor-pointer ${regionFilter === r
                  ? "border-burgundy/15 bg-burgundy/[0.04] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-burgundy-950/[0.02]"
                  }`}
                style={{ fontSize: "0.75rem" }}
              >
                {r !== "all" && <Globe className="w-3 h-3" />}
                {regionLabels[r]}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-burgundy-950/[0.06] mx-0.5 hidden sm:block" />

          {/* Toggle badges */}
          <button
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={`flex items-center gap-1 px-2.5 py-[6px] rounded-[7px] border transition-colors cursor-pointer ${showVerifiedOnly
              ? "border-burgundy/15 bg-burgundy/[0.04] text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            style={{ fontSize: "0.75rem" }}
          >
            <ShieldCheck className="w-3 h-3" />
            Verified
          </button>
          <button
            onClick={() => setShowSustainableOnly(!showSustainableOnly)}
            className={`flex items-center gap-1 px-2.5 py-[6px] rounded-[7px] border transition-colors cursor-pointer ${showSustainableOnly
              ? "border-burgundy/15 bg-burgundy/[0.04] text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            style={{ fontSize: "0.75rem" }}
          >
            <Leaf className="w-3 h-3" />
            Sustainable
          </button>
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="flex-shrink-0 px-6 sm:px-8 py-3">
        <span className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>
          Showing {filtered.length} of {mockPartners.length} partners
        </span>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 sm:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-full bg-burgundy-950/[0.03] flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-foreground mb-1" style={{ fontSize: "0.875rem", fontWeight: 500 }}>No partners found</p>
            <p className="text-muted-foreground/50 mb-4 max-w-[260px]" style={{ fontSize: "0.8125rem" }}>
              Try adjusting your filters or search term
            </p>
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setRegionFilter("all");
                setShowVerifiedOnly(false);
                setShowSustainableOnly(false);
              }}
              className="px-4 py-2 rounded-[8px] bg-burgundy-950/[0.04] text-foreground hover:bg-burgundy-950/[0.07] transition-colors cursor-pointer"
              style={{ fontSize: "0.8125rem" }}
            >
              Reset all filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* ── GRID VIEW ── */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((partner) => (
              <div
                key={partner.id}
                className="group bg-white rounded-[10px] border border-burgundy-950/[0.04] overflow-hidden hover:border-burgundy/8 transition-colors"
              >
                {/* Image */}
                <div className="relative h-[130px] overflow-hidden bg-cream-dark">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Favorite */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(partner.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-[26px] h-[26px] rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-3 h-3 transition-colors ${favorites.has(partner.id) ? "text-burgundy fill-burgundy/30" : "text-burgundy-950/20"
                        }`}
                    />
                  </button>
                  {/* Badges */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                    {partner.verified && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-white/90 text-burgundy-950" style={{ fontSize: "0.5625rem", fontWeight: 600 }}>
                        <ShieldCheck className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                    {partner.sustainable && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-white/90 text-burgundy" style={{ fontSize: "0.5625rem", fontWeight: 600 }}>
                        <Leaf className="w-2.5 h-2.5" /> Eco
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Name + rating */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-foreground truncate" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {partner.name}
                    </h3>
                    <RatingBadge rating={partner.rating} reviews={partner.reviews} />
                  </div>

                  {/* Location + type */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "0.6875rem" }}>
                      <MapPin className="w-2.5 h-2.5" />
                      {partner.city}, {partner.country}
                    </span>
                    <span className="text-burgundy-950/[0.08]">·</span>
                    <span className="text-muted-foreground/70" style={{ fontSize: "0.6875rem" }}>{typeLabels[partner.type].replace(/s$/, "")}</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-3.5">
                    {partner.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-[3px] rounded-[5px] bg-burgundy-950/[0.025] text-muted-foreground"
                        style={{ fontSize: "0.6875rem" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Capacity + reliability bars */}
                  <div className="flex items-center gap-3 mb-3.5">
                    <MiniBar value={partner.capacity} label="Capacity" />
                    <MiniBar value={partner.reliability} label="Reliability" />
                  </div>

                  {/* Footer meta */}
                  <div className="flex items-center justify-between pt-3 border-t border-burgundy-950/[0.03]">
                    <div className="flex items-center gap-3 text-muted-foreground/50" style={{ fontSize: "0.6875rem" }}>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {partner.moq}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {partner.leadTime}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="flex items-center gap-1 text-burgundy/60 hover:text-burgundy transition-colors cursor-pointer"
                      style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                    >
                      View
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── LIST VIEW ── */
          <div className="space-y-2">
            {filtered.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className="w-full text-left bg-white rounded-[10px] border border-burgundy-950/[0.04] hover:border-burgundy/8 transition-colors cursor-pointer flex items-center gap-4 p-3 sm:p-4"
              >
                {/* Thumbnail */}
                <div className="w-[72px] h-[72px] rounded-[8px] overflow-hidden bg-cream-dark flex-shrink-0">
                  <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-foreground truncate" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                      {partner.name}
                    </h3>
                    {partner.verified && <ShieldCheck className="w-3 h-3 text-burgundy-950/40 flex-shrink-0" />}
                    {partner.sustainable && <Leaf className="w-3 h-3 text-burgundy/40 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "0.6875rem" }}>
                      <MapPin className="w-2.5 h-2.5" /> {partner.city}, {partner.country}
                    </span>
                    <span className="text-burgundy-950/[0.08]">·</span>
                    <span className="text-muted-foreground/70" style={{ fontSize: "0.6875rem" }}>
                      {typeLabels[partner.type].replace(/s$/, "")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {partner.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="px-1.5 py-[2px] rounded-[4px] bg-burgundy-950/[0.025] text-muted-foreground"
                        style={{ fontSize: "0.625rem" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right stats */}
                <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                  <div className="text-right">
                    <RatingBadge rating={partner.rating} reviews={partner.reviews} />
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground/70" style={{ fontSize: "0.5625rem" }}>MOQ</p>
                    <p className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>{partner.moq}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground/70" style={{ fontSize: "0.5625rem" }}>Lead</p>
                    <p className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 500 }}>{partner.leadTime}</p>
                  </div>
                  {partner.activeProjects > 0 && (
                    <span className="px-2 py-1 rounded-[6px] bg-burgundy/[0.05] text-burgundy" style={{ fontSize: "0.6875rem", fontWeight: 500 }}>
                      {partner.activeProjects} active
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail drawer ── */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-burgundy-950/8"
            onClick={() => setSelectedPartner(null)}
          />
          <div className="relative w-full max-w-[480px] bg-white flex flex-col overflow-hidden">
            {/* Close */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-4 right-4 z-10 w-[28px] h-[28px] rounded-full bg-burgundy-950/[0.04] flex items-center justify-center hover:bg-burgundy-950/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-foreground" />
            </button>

            {/* Drawer header — no gradient */}
            <div className="flex-shrink-0 px-6 pt-6 pb-5 border-b border-burgundy-950/[0.04]">
              <div className="flex items-start gap-4">
                <div className="w-[64px] h-[64px] rounded-[10px] overflow-hidden bg-cream-dark flex-shrink-0">
                  <img src={selectedPartner.image} alt={selectedPartner.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-[2px] rounded-[5px] bg-burgundy-950/[0.05] text-burgundy-950" style={{ fontSize: "0.625rem", fontWeight: 600 }}>
                      {typeLabels[selectedPartner.type].replace(/s$/, "")}
                    </span>
                    {selectedPartner.verified && (
                      <span className="flex items-center gap-0.5 text-burgundy-950/50" style={{ fontSize: "0.625rem" }}>
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {selectedPartner.sustainable && (
                      <span className="flex items-center gap-0.5 text-burgundy/50" style={{ fontSize: "0.625rem" }}>
                        <Leaf className="w-3 h-3" /> Sustainable
                      </span>
                    )}
                  </div>
                  <h2 className="text-foreground truncate" style={{ fontSize: "1.0625rem", fontWeight: 600 }}>
                    {selectedPartner.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                      <MapPin className="w-3 h-3" /> {selectedPartner.city}, {selectedPartner.country}
                    </span>
                    <span className="text-burgundy-950/[0.06]">·</span>
                    <RatingBadge rating={selectedPartner.rating} reviews={selectedPartner.reviews} />
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Description */}
              <p className="text-muted-foreground" style={{ fontSize: "0.8125rem", lineHeight: 1.7 }}>
                {selectedPartner.description}
              </p>

              {/* Key metrics */}
              <div>
                <p className="text-foreground mb-3" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.02em" }}>
                  Key Metrics
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Min. Order Qty", value: selectedPartner.moq },
                    { label: "Lead Time", value: selectedPartner.leadTime },
                    { label: "Active Projects", value: selectedPartner.activeProjects.toString() },
                    { label: "Region", value: regionLabels[selectedPartner.region] },
                  ].map((m) => (
                    <div key={m.label} className="px-3.5 py-3 rounded-[8px] bg-burgundy-950/[0.02]">
                      <p className="text-muted-foreground/70 mb-1" style={{ fontSize: "0.625rem" }}>{m.label}</p>
                      <p className="text-foreground" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div>
                <p className="text-foreground mb-3" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.02em" }}>
                  Performance
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Current Capacity", value: selectedPartner.capacity },
                    { label: "Reliability Score", value: selectedPartner.reliability },
                  ].map((perf) => (
                    <div key={perf.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{perf.label}</span>
                        <span className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{perf.value}%</span>
                      </div>
                      <div className="h-[4px] rounded-full bg-burgundy-950/[0.04] overflow-hidden">
                        <div className="h-full rounded-full bg-burgundy/30" style={{ width: `${perf.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-foreground mb-2.5" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.02em" }}>
                  Specialties
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPartner.specialties.map((s) => (
                    <span key={s} className="px-2.5 py-[5px] rounded-[6px] bg-burgundy-950/[0.025] text-foreground" style={{ fontSize: "0.75rem" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="text-foreground mb-2.5" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.02em" }}>
                  Certifications
                </p>
                <div className="space-y-1.5">
                  {selectedPartner.certifications.map((c) => (
                    <div key={c} className="flex items-center gap-2.5 px-3 py-2 rounded-[7px] border border-burgundy-950/[0.04]">
                      <CheckCircle className="w-3.5 h-3.5 text-burgundy/40 flex-shrink-0" />
                      <span className="text-foreground" style={{ fontSize: "0.8125rem" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-burgundy-950/[0.04] flex items-center gap-2.5">
              <button
                onClick={() => toggleFavorite(selectedPartner.id)}
                className={`w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${favorites.has(selectedPartner.id)
                  ? "border-burgundy/15 bg-burgundy/[0.04]"
                  : "border-burgundy-950/[0.06] hover:bg-burgundy-950/[0.02]"
                  }`}
              >
                <Heart
                  className={`w-4 h-4 ${favorites.has(selectedPartner.id) ? "text-burgundy fill-burgundy/20" : "text-muted-foreground/50"
                    }`}
                />
              </button>
              <a
                href={`mailto:${selectedPartner.contactEmail}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-burgundy-950 text-cream hover:bg-burgundy-dark transition-colors cursor-pointer"
                style={{ fontSize: "0.8125rem" }}
              >
                <Mail className="w-3.5 h-3.5" />
                Contact Partner
              </a>
              <button
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] border border-burgundy-950/[0.06] text-foreground hover:bg-burgundy-950/[0.02] transition-colors cursor-pointer"
                style={{ fontSize: "0.8125rem" }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}