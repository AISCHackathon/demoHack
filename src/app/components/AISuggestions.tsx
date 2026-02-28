import { useState, useEffect, useRef } from "react";
import { Check, X, Lightbulb, RefreshCw } from "lucide-react";
import type { TechPackData } from "./TechPackCanvas";
import { getSuggestions, isServerHealthy, type AISuggestion } from "./api";

interface AISuggestionsProps {
  data: TechPackData;
  onApply: (field: keyof TechPackData, value: string) => void;
}

interface Suggestion {
  id: string;
  field: keyof TechPackData;
  fieldLabel: string;
  message: string;
  suggestedValue?: string;
}

// Local fallback rules when Claude is unavailable
function generateLocalSuggestions(data: TechPackData): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (data.constructionDetails && !data.constructionDetails.toLowerCase().includes("seam allowance")) {
    suggestions.push({
      id: "sa-1",
      field: "constructionDetails",
      fieldLabel: "Construction",
      message: "Seam allowance not specified. Factories need this to cut patterns accurately.",
      suggestedValue: data.constructionDetails + "\nSeam allowance: 1cm (3/8\") on all seams unless otherwise noted",
    });
  }

  if (data.materialsTrims && data.materialsTrims.toLowerCase().includes("zipper") && !data.materialsTrims.toLowerCase().includes("pull")) {
    suggestions.push({
      id: "zip-1",
      field: "materialsTrims",
      fieldLabel: "Materials",
      message: "Zipper specified but pull type and length are missing. Add pull style to avoid factory interpretation.",
    });
  }

  if (data.materialsTrims && data.constructionDetails) {
    const hasWoven = data.materialsTrims.toLowerCase().includes("woven") || data.materialsTrims.toLowerCase().includes("twill") || data.materialsTrims.toLowerCase().includes("plain weave");
    const hasOverlock = data.constructionDetails.toLowerCase().includes("overlock");
    if (hasWoven && hasOverlock) {
      suggestions.push({
        id: "fab-1",
        field: "constructionDetails",
        fieldLabel: "Construction",
        message: "Overlock stitching specified for a woven fabric. Consider flat-felled or French seams for better finish on wovens.",
      });
    }
  }

  if (data.specialInstructions && !data.specialInstructions.toLowerCase().includes("shrink")) {
    suggestions.push({
      id: "shr-1",
      field: "specialInstructions",
      fieldLabel: "Instructions",
      message: "No shrinkage tolerance specified. Recommend adding max shrinkage % for post-wash QC.",
      suggestedValue: data.specialInstructions + "\n• Shrinkage tolerance: max 3% in either direction after first wash",
    });
  }

  if (!data.gradingNotes || data.gradingNotes.trim() === "") {
    suggestions.push({
      id: "gr-1",
      field: "gradingNotes" as keyof TechPackData,
      fieldLabel: "Grading",
      message: "No grading rules specified. Add size increment rules so the factory can grade the pattern correctly.",
    });
  }

  if (!data.bom || data.bom.length === 0) {
    suggestions.push({
      id: "bom-1",
      field: "materialsTrims",
      fieldLabel: "BOM",
      message: "Bill of Materials is empty. Adding component-level costing helps estimate production costs early.",
    });
  }

  return suggestions;
}

export function AISuggestions({ data, onApply }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const hasFetchedRef = useRef(false);

  // Load local suggestions immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuggestions(generateLocalSuggestions(data));
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  // Fetch AI suggestions
  const fetchAISuggestions = async () => {
    setLoading(true);
    try {
      const result = await getSuggestions(data as unknown as Record<string, unknown>);
      if (result.suggestions && Array.isArray(result.suggestions)) {
        const mapped: Suggestion[] = result.suggestions.map((s: AISuggestion) => ({
          id: s.id || `ai-${Math.random().toString(36).slice(2, 8)}`,
          field: s.field as keyof TechPackData,
          fieldLabel: s.fieldLabel,
          message: s.message,
          suggestedValue: s.suggestedValue || undefined,
        }));
        setSuggestions(mapped);
        setIsAI(true);
        setDismissed(new Set());
      }
    } catch (err) {
      console.error("Failed to fetch AI suggestions:", err);
      // Keep local suggestions
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch AI suggestions once on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      // Check server health first, then fetch if available
      const timer = setTimeout(async () => {
        const healthy = await isServerHealthy();
        if (healthy) {
          fetchAISuggestions();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const visible = suggestions.filter((s) => !dismissed.has(s.id));

  if (visible.length === 0 && !loading) return null;

  return (
    <div className="rounded-lg border border-burgundy/10 bg-cream/50 overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 px-3.5 py-2.5 cursor-pointer hover:bg-burgundy-950/[0.02] transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5 text-burgundy/50" />
        <span className="text-burgundy/70" style={{ fontSize: "0.6875rem", fontWeight: 500 }}>
          {isAI ? "Claude AI suggestions" : "AI suggestions"}
        </span>
        {loading && (
          <RefreshCw className="w-3 h-3 text-burgundy/30 animate-spin ml-1" />
        )}
        {isAI && !loading && (
          <span className="px-1.5 py-0.5 rounded bg-burgundy/[0.08] text-burgundy/50" style={{ fontSize: "0.5rem", fontWeight: 600 }}>
            CLAUDE
          </span>
        )}
        <span className="ml-auto text-burgundy/30" style={{ fontSize: "0.625rem" }}>
          {visible.length}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-burgundy/[0.06]">
          {loading && visible.length === 0 && (
            <div className="px-3.5 py-4 text-center">
              <RefreshCw className="w-4 h-4 text-burgundy/20 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground/40" style={{ fontSize: "0.6875rem" }}>
                Analyzing specifications with Claude...
              </p>
            </div>
          )}
          <div className="divide-y divide-burgundy/[0.04]">
            {visible.map((s) => (
              <div key={s.id} className="px-3.5 py-2.5">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block px-1.5 py-0.5 rounded bg-burgundy/[0.06] text-burgundy/60 mb-1"
                      style={{ fontSize: "0.5625rem", fontWeight: 500 }}
                    >
                      {s.fieldLabel}
                    </span>
                    <p className="text-foreground/70" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                      {s.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
                    {s.suggestedValue && (
                      <button
                        onClick={() => {
                          onApply(s.field, s.suggestedValue!);
                          setDismissed((prev) => new Set(prev).add(s.id));
                        }}
                        className="p-1 rounded-md text-burgundy/40 hover:text-burgundy hover:bg-burgundy/[0.06] transition-colors cursor-pointer"
                        title="Apply suggestion"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => setDismissed((prev) => new Set(prev).add(s.id))}
                      className="p-1 rounded-md text-burgundy-950/20 hover:text-burgundy-950/40 transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Refresh button */}
          {!loading && (
            <div className="border-t border-burgundy/[0.04] px-3.5 py-2">
              <button
                onClick={fetchAISuggestions}
                className="flex items-center gap-1.5 text-muted-foreground/30 hover:text-burgundy/60 transition-colors cursor-pointer"
                style={{ fontSize: "0.625rem" }}
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Refresh with Claude
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}