import { useState } from "react";
import { useNavigate } from "react-router";
import { PenLine, Search, LayoutGrid, List, ArrowUpRight } from "lucide-react";
import { sampleProjects, stageConfig, stageOrder, type ProjectStage } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type ViewMode = "grid" | "list";

export function ProjectsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProjectStage | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filtered = sampleProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesStage = activeFilter === "all" || p.stage === activeFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-foreground" style={{ fontSize: "1.375rem", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Projects
            </h1>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.8125rem" }}>
              {sampleProjects.length} total · {sampleProjects.filter((p) => p.stage !== "complete").length} active
            </p>
          </div>
          <button
            onClick={() => navigate("/projects/new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-burgundy-950 text-cream hover:bg-burgundy-dark transition-colors cursor-pointer"
            style={{ fontSize: "0.8125rem" }}
          >
            <PenLine className="w-3.5 h-3.5" />
            New project
          </button>
        </div>

        {/* Search + filters + view toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-2 rounded-[8px] bg-white border border-burgundy-950/[0.06] focus:border-burgundy-950/[0.14] focus:ring-1 focus:ring-burgundy-950/[0.05] outline-none transition-all placeholder:text-muted-foreground/50"
              style={{ fontSize: "0.8125rem" }}
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap flex-1">
            <FilterPill label="All" count={sampleProjects.length} active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
            {stageOrder.map((stage) => (
              <FilterPill
                key={stage}
                label={stageConfig[stage].label}
                count={sampleProjects.filter((p) => p.stage === stage).length}
                active={activeFilter === stage}
                onClick={() => setActiveFilter(activeFilter === stage ? "all" : stage)}
              />
            ))}
          </div>
          <div className="flex items-center border border-burgundy-950/[0.06] rounded-[8px] overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors cursor-pointer ${viewMode === "grid" ? "bg-burgundy-950/[0.05] text-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors cursor-pointer ${viewMode === "list" ? "bg-burgundy-950/[0.05] text-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grid view */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => {
              const config = stageConfig[project.stage];
              return (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-left rounded-[12px] border border-burgundy-950/[0.05] bg-white hover:border-burgundy-950/[0.10] transition-colors cursor-pointer group overflow-hidden"
                >
                  <div className="h-[160px] bg-cream/60 overflow-hidden relative">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-[5px] ${config.bgColor} ${config.color}`}
                        style={{ fontSize: "0.5625rem", fontWeight: 500 }}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-foreground truncate mb-0.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      {project.name}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>
                      {project.brand} · {project.season} · {project.assignee}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* List view */}
        {viewMode === "list" && (
          <div className="rounded-[12px] border border-burgundy-950/[0.05] bg-white overflow-hidden divide-y divide-burgundy-950/[0.04]">
            {filtered.map((project) => {
              const config = stageConfig[project.stage];
              return (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-burgundy-950/[0.015] transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-[8px] overflow-hidden bg-cream flex-shrink-0 border border-burgundy-950/[0.04]">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                      {project.name}
                    </p>
                    <p className="text-muted-foreground truncate" style={{ fontSize: "0.6875rem" }}>
                      {project.brand}
                    </p>
                  </div>
                  <span className="text-muted-foreground/60 hidden md:block flex-shrink-0" style={{ fontSize: "0.6875rem" }}>
                    {project.season}
                  </span>
                  <span className="text-muted-foreground/60 hidden lg:block flex-shrink-0" style={{ fontSize: "0.6875rem" }}>
                    {project.assignee}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-[5px] ${config.bgColor} ${config.color} flex-shrink-0`}
                    style={{ fontSize: "0.5625rem", fontWeight: 500 }}
                  >
                    {config.label}
                  </span>
                  <span className="text-muted-foreground/50 flex-shrink-0 hidden sm:block" style={{ fontSize: "0.6875rem" }}>
                    {project.updatedAt}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-2" style={{ fontSize: "0.875rem" }}>
              No projects match your filters
            </p>
            <button
              onClick={() => { setSearch(""); setActiveFilter("all"); }}
              className="text-burgundy/60 hover:text-burgundy transition-colors cursor-pointer"
              style={{ fontSize: "0.8125rem" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-[6px] transition-all cursor-pointer flex items-center gap-1.5 ${
        active
          ? "bg-burgundy-950/[0.06] text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-burgundy-950/[0.02]"
      }`}
      style={{ fontSize: "0.75rem" }}
    >
      {label}
      <span
        className={`transition-colors ${active ? "text-muted-foreground" : "text-muted-foreground/50"}`}
        style={{ fontSize: "0.625rem" }}
      >
        {count}
      </span>
    </button>
  );
}