/**
 * SeamAI API client — talks to the Supabase Edge Function server.
 */
import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-2dcdbb4e`;

const defaultHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
});

/** Wrap fetch with a timeout so requests don't hang forever. */
async function fetchWithTimeout(
  url: string,
  opts: RequestInit,
  timeoutMs = 60000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/** Quick server health check — returns true if the server is reachable. */
export async function isServerHealthy(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(
      `${BASE}/health`,
      { headers: defaultHeaders() },
      5000,
    );
    return res.ok;
  } catch {
    return false;
  }
}

/* ─── Image analysis (Claude Vision) ─── */

export interface AnalyzeContext {
  garmentType?: string;
  brand?: string;
  season?: string;
  pricePoint?: string;
  notes?: string;
}

export interface AnalyzeResult {
  techPack?: Record<string, unknown>;
  error?: string;
  raw?: string;
}

/**
 * Sends a garment image to Claude for tech pack generation.
 * @param imageBase64 Base64-encoded image (no data: prefix)
 * @param mediaType  e.g. "image/png" or "image/jpeg"
 * @param context    Optional project metadata
 */
export async function analyzeImage(
  imageBase64: string,
  mediaType: string,
  context?: AnalyzeContext,
): Promise<AnalyzeResult> {
  const res = await fetchWithTimeout(
    `${BASE}/ai/analyze`,
    {
      method: "POST",
      headers: defaultHeaders(),
      body: JSON.stringify({ imageBase64, mediaType, context }),
    },
    90000, // 90s — image analysis can be slow
  );

  const data = await res.json();
  if (!res.ok) {
    console.error("analyzeImage API error:", data);
    throw new Error(data.error || `API error ${res.status}`);
  }
  return data;
}

/* ─── AI Suggestions ─── */

export interface AISuggestion {
  id: string;
  field: string;
  fieldLabel: string;
  message: string;
  suggestedValue?: string | null;
}

export interface SuggestionsResult {
  suggestions?: AISuggestion[];
  error?: string;
}

/**
 * Sends current tech pack data to Claude for review suggestions.
 */
export async function getSuggestions(
  techPack: Record<string, unknown>,
): Promise<SuggestionsResult> {
  const res = await fetchWithTimeout(
    `${BASE}/ai/suggestions`,
    {
      method: "POST",
      headers: defaultHeaders(),
      body: JSON.stringify({ techPack }),
    },
    60000,
  );

  const data = await res.json();
  if (!res.ok) {
    console.error("getSuggestions API error:", data);
    throw new Error(data.error || `API error ${res.status}`);
  }
  return data;
}
