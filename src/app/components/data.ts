import type { TechPackData } from "./TechPackCanvas";

export type ProjectStage = "design" | "tech_pack" | "sampling" | "production" | "shipping" | "complete";

export interface Project {
  id: string;
  name: string;
  brand: string;
  image: string;
  stage: ProjectStage;
  createdAt: string;
  updatedAt: string;
  techPack?: TechPackData;
  season?: string;
  assignee?: string;
}

export const stageConfig: Record<ProjectStage, { label: string; color: string; bgColor: string }> = {
  design: { label: "Design", color: "text-burgundy/70", bgColor: "bg-burgundy/[0.06]" },
  tech_pack: { label: "Tech Pack", color: "text-burgundy", bgColor: "bg-burgundy/[0.08]" },
  sampling: { label: "Sampling", color: "text-burgundy-dark", bgColor: "bg-burgundy/[0.10]" },
  production: { label: "Production", color: "text-burgundy-950", bgColor: "bg-burgundy/[0.12]" },
  shipping: { label: "Shipping", color: "text-burgundy-950", bgColor: "bg-cream-darker" },
  complete: { label: "Complete", color: "text-burgundy-950", bgColor: "bg-cream-dark" },
};

export const stageOrder: ProjectStage[] = ["design", "tech_pack", "sampling", "production", "shipping", "complete"];

export const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "Structured Blazer",
    brand: "Maison Lumière",
    image: "https://images.unsplash.com/photo-1755483503929-a2eb08de1c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZ2FybWVudCUyMGJsYXplciUyMGZsYXRsYXl8ZW58MXx8fHwxNzcyMzEzMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    stage: "production",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-26",
    season: "FW26",
    assignee: "Elena V.",
  },
  {
    id: "proj-2",
    name: "Crew Neck Tee",
    brand: "Maison Lumière",
    image: "https://images.unsplash.com/photo-1634393653736-98a63fb73742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNvdHRvbiUyMHRzaGlydCUyMG1pbmltYWx8ZW58MXx8fHwxNzcyMzEzMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    stage: "sampling",
    createdAt: "2026-02-12",
    updatedAt: "2026-02-25",
    season: "SS26",
    assignee: "Marcus T.",
  },
  {
    id: "proj-3",
    name: "A-Line Midi Dress",
    brand: "Atelier Rosé",
    image: "https://images.unsplash.com/photo-1704775983177-8ae543524081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWlkaSUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzIzMTMxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    stage: "tech_pack",
    createdAt: "2026-02-18",
    updatedAt: "2026-02-27",
    season: "SS26",
    assignee: "Elena V.",
  },
  {
    id: "proj-4",
    name: "Tapered Chino",
    brand: "Atelier Rosé",
    image: "https://images.unsplash.com/photo-1768696081520-76c372aa0d00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlubyUyMHBhbnRzJTIwZmFzaGlvbiUyMGZsYXRsYXl8ZW58MXx8fHwxNzcyMzEzMTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    stage: "design",
    createdAt: "2026-02-22",
    updatedAt: "2026-02-28",
    season: "FW26",
    assignee: "Sana K.",
  },
  {
    id: "proj-5",
    name: "Denim Trucker Jacket",
    brand: "Maison Lumière",
    image: "https://images.unsplash.com/photo-1577660002965-04865592fc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMGZhc2hpb24lMjBwcm9kdWN0fGVufDF8fHx8MTc3MjIzMjYyNHww&ixlib=rb-4.1.0&q=80&w=1080",
    stage: "complete",
    createdAt: "2026-01-15",
    updatedAt: "2026-02-20",
    season: "SS26",
    assignee: "Marcus T.",
  },
  {
    id: "proj-6",
    name: "Merino Crewneck",
    brand: "Atelier Rosé",
    image: "https://images.unsplash.com/photo-1601762267916-6668efcbc741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0JTIwc3dlYXRlciUyMGZhc2hpb24lMjBtaW5pbWFsfGVufDF8fHx8MTc3MjMxMzExN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    stage: "shipping",
    createdAt: "2026-01-28",
    updatedAt: "2026-02-24",
    season: "FW26",
    assignee: "Sana K.",
  },
];