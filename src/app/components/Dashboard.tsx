import { useNavigate } from "react-router";
import { PenLine, ArrowRight, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { sampleProjects, stageConfig, stageOrder, type ProjectStage } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Dashboard() {
  const navigate = useNavigate();

  const pipelineCounts = stageOrder.reduce((acc, stage) => {
    acc[stage] = sampleProjects.filter((p) => p.stage === stage).length;
    return acc;
  }, {} as Record<ProjectStage, number>);

  const activeProjects = sampleProjects.filter((p) => p.stage !== "complete");
  const recentProjects = [...sampleProjects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
        {/* Welcome */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-muted-foreground/50 mb-1" style={{ fontSize: "0.75rem" }}>
              Welcome back
            </p>
            <h1 className="text-foreground" style={{ fontSize: "1.375rem", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Production overview
            </h1>
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

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={<Clock className="w-3.5 h-3.5" />}
            label="In progress"
            value={String(activeProjects.length)}
            sub="projects"
          />
          <StatCard
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            label="Tech packs"
            value={String(sampleProjects.length)}
            sub="generated"
          />
          <StatCard
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            label="Avg. to production"
            value="12d"
            sub="turnaround"
          />
        </div>

        {/* Pipeline */}
        <div className="mb-10">
          <p className="text-muted-foreground mb-3" style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Pipeline
          </p>
          <div className="flex items-stretch gap-2">
            {stageOrder.map((stage, i) => {
              const config = stageConfig[stage];
              const count = pipelineCounts[stage];
              const total = sampleProjects.length;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <button
                  key={stage}
                  onClick={() => navigate("/projects")}
                  className="flex-1 p-3.5 rounded-[10px] border border-burgundy-950/[0.05] bg-white hover:border-burgundy-950/[0.10] transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className={`${config.color}`}
                      style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-foreground mb-2" style={{ fontSize: "1.375rem", fontWeight: 500, letterSpacing: "-0.02em" }}>
                    {count}
                  </p>
                  {/* Mini bar */}
                  <div className="h-[3px] w-full rounded-full bg-burgundy-950/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-burgundy/30 transition-all"
                      style={{ width: `${Math.max(pct, count > 0 ? 12 : 0)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted-foreground" style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Recent
            </p>
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              style={{ fontSize: "0.75rem" }}
            >
              All projects
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="rounded-[12px] border border-burgundy-950/[0.05] bg-white overflow-hidden divide-y divide-burgundy-950/[0.04]">
            {recentProjects.map((project) => {
              const config = stageConfig[project.stage];
              return (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-burgundy-950/[0.015] transition-all cursor-pointer text-left group"
                >
                  <div className="w-9 h-9 rounded-[8px] overflow-hidden bg-cream flex-shrink-0 border border-burgundy-950/[0.04]">
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
                    <p className="text-muted-foreground/50 truncate" style={{ fontSize: "0.6875rem" }}>
                      {project.brand} · {project.season}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-[6px] ${config.bgColor} ${config.color} hidden sm:inline-block`}
                      style={{ fontSize: "0.625rem", fontWeight: 500 }}
                    >
                      {config.label}
                    </span>
                    <span className="text-muted-foreground/60 hidden sm:block" style={{ fontSize: "0.6875rem" }}>
                      {project.updatedAt}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="p-4 rounded-[10px] border border-burgundy-950/[0.05] bg-white">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
        {icon}
        <span style={{ fontSize: "0.6875rem" }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-foreground" style={{ fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.02em" }}>
          {value}
        </p>
        <span className="text-muted-foreground/60" style={{ fontSize: "0.6875rem" }}>
          {sub}
        </span>
      </div>
    </div>
  );
}