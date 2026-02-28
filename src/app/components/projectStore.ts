/**
 * Client-side project store — persists new projects to localStorage.
 * Sample projects are always included; user-created projects are saved alongside them.
 */

import { sampleProjects, type Project } from "./data";
import type { TechPackData } from "./TechPackCanvas";
import { generateMockTechPack } from "./mockTechPackData";

const STORAGE_KEY = "seamai_projects";

/* ── helpers ── */

function loadUserProjects(): Project[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as Project[];
    } catch {
        return [];
    }
}

function saveUserProjects(projects: Project[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// Seed sample projects with their mock tech packs so they behave like real projects
function getSeedProjects(): Project[] {
    return sampleProjects.map((p) => ({
        ...p,
        techPack: p.techPack || generateMockTechPack(p.brand),
    }));
}

/* ── public API ── */

/** Get all projects: sample + user-created */
export function getAllProjects(): Project[] {
    const seed = getSeedProjects();
    const user = loadUserProjects();
    // User projects show first (newest first), then samples
    return [...user, ...seed];
}

/** Get a single project by ID */
export function getProject(id: string): Project | undefined {
    return getAllProjects().find((p) => p.id === id);
}

/** Generate a unique project ID */
export function generateProjectId(): string {
    return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Add a new project to the store */
export function addProject(project: Project): void {
    const existing = loadUserProjects();
    // Newest first
    existing.unshift(project);
    saveUserProjects(existing);
}

/** Update an existing user-created project (e.g. tech pack edits) */
export function updateProject(id: string, updates: Partial<Project>): void {
    const userProjects = loadUserProjects();
    const idx = userProjects.findIndex((p) => p.id === id);
    if (idx !== -1) {
        userProjects[idx] = { ...userProjects[idx], ...updates };
        saveUserProjects(userProjects);
    }
    // For sample projects we don't persist edits to localStorage —
    // they reset on page refresh (acceptable for hackathon scope)
}

/** Create a new Project object from NewProject flow data */
export function createNewProject({
    name,
    brand,
    season,
    assignee,
    image,
    techPack,
}: {
    name: string;
    brand: string;
    season: string;
    assignee: string;
    image: string;
    techPack: TechPackData;
}): Project {
    const today = new Date().toISOString().slice(0, 10);
    const id = generateProjectId();
    return {
        id,
        name: name || "Untitled Project",
        brand: brand || "Unknown Brand",
        image,
        stage: "tech_pack",
        createdAt: today,
        updatedAt: today,
        techPack,
        season: season || undefined,
        assignee: assignee || undefined,
    };
}
