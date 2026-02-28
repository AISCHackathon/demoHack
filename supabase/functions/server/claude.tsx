/**
 * Claude AI integration helpers for SeamAI.
 * Handles garment image analysis and tech pack suggestion generation.
 */

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

function getApiKey(): string {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) throw new Error("ANTHROPIC_API_KEY not configured — add it via Supabase secrets");
  return key;
}

async function callClaude(
  messages: Array<{ role: string; content: unknown }>,
  systemPrompt: string,
  maxTokens = 4096,
): Promise<string> {
  const apiKey = getApiKey();

  const res = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.log(`Claude API error (${res.status}): ${errBody}`);
    throw new Error(`Claude API returned ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
  if (!textBlock?.text) {
    console.log("Claude response had no text block:", JSON.stringify(data).substring(0, 300));
    throw new Error("Claude returned empty response");
  }
  return textBlock.text;
}

/* ─── Analyze garment image → tech pack JSON ─── */

const ANALYZE_SYSTEM = `You are SeamAI, an expert fashion technical specification engine. You analyze garment images and produce detailed tech pack data.

You MUST respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact schema:

{
  "garmentType": "string",
  "category": "string",
  "silhouette": "string",
  "constructionDetails": "string multiline",
  "materialsTrims": "string multiline",
  "colorways": "string multiline",
  "gradingNotes": "string multiline",
  "specialInstructions": "string multiline",
  "measurements": [
    { "id": "1", "point": "string", "xs": "string", "s": "string", "m": "string", "l": "string", "xl": "string" }
  ],
  "bom": [
    { "id": "b1", "component": "string", "material": "string", "supplier": "string", "unitCost": "string", "quantity": "string", "total": "string" }
  ],
  "annotations": [
    { "id": "a1", "x": 50, "y": 20, "label": "string", "linkedSection": "construction" }
  ]
}

Rules:
- Provide at least 5-7 measurement points appropriate for the garment type
- Provide at least 4-8 BOM items with realistic supplier names and cost estimates
- Provide 3-5 annotations at percentage positions (x,y 0-100) marking key construction details
- linkedSection must be one of: identification, construction, materials, colorways, measurements, grading, bom, instructions
- Use professional fashion/apparel industry terminology
- Estimate realistic prices in USD
- Measurements should be in inches`;

export async function analyzeGarmentImage(
  imageBase64: string,
  mediaType: string,
  context?: {
    garmentType?: string;
    brand?: string;
    season?: string;
    pricePoint?: string;
    notes?: string;
  },
): Promise<string> {
  let userText =
    "Analyze this garment image and generate a complete technical specification (tech pack).";
  if (context) {
    const parts: string[] = [];
    if (context.garmentType) parts.push(`Garment type: ${context.garmentType}`);
    if (context.brand) parts.push(`Brand: ${context.brand}`);
    if (context.season) parts.push(`Season: ${context.season}`);
    if (context.pricePoint) parts.push(`Price point: ${context.pricePoint}`);
    if (context.notes) parts.push(`Additional notes: ${context.notes}`);
    if (parts.length) userText += "\n\nContext:\n" + parts.join("\n");
  }

  const messages = [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: imageBase64,
          },
        },
        { type: "text", text: userText },
      ],
    },
  ];

  return callClaude(messages, ANALYZE_SYSTEM, 4096);
}

/* ─── Review existing tech pack → suggestions ─── */

const SUGGESTIONS_SYSTEM = `You are SeamAI, an expert fashion production advisor. You review tech pack specifications and identify issues, missing information, and improvements.

You MUST respond with ONLY valid JSON (no markdown fences) matching this schema:

[
  {
    "id": "string unique",
    "field": "string — one of: garmentType, category, constructionDetails, materialsTrims, colorways, gradingNotes, specialInstructions",
    "fieldLabel": "string — human label",
    "message": "string — clear actionable suggestion",
    "suggestedValue": "string or null"
  }
]

Rules:
- Return 2-5 suggestions maximum
- Focus on production-critical issues: missing tolerances, ambiguous specs, material conflicts, QC gaps
- Use professional fashion manufacturing terminology
- suggestedValue should contain the COMPLETE new field value or null if advisory only`;

export async function generateSuggestions(techPackJson: string): Promise<string> {
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Review this tech pack specification and provide production-focused suggestions for improvement:\n\n${techPackJson}`,
        },
      ],
    },
  ];

  return callClaude(messages, SUGGESTIONS_SYSTEM, 2048);
}
