import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://vevhdlemterygkpqusfq.supabase.co",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2dcdbb4e/health", (c) => {
  return c.json({ status: "ok" });
});

/* ─── Claude AI routes ─── */

// POST /ai/analyze — Analyze garment image with Claude Vision
app.post("/make-server-2dcdbb4e/ai/analyze", async (c) => {
  try {
    const body = await c.req.json();
    const { imageBase64, mediaType, context } = body;

    if (!imageBase64 || !mediaType) {
      return c.json(
        { error: "Missing imageBase64 or mediaType in request body" },
        400,
      );
    }

    console.log(
      `AI analyze request: mediaType=${mediaType}, contextKeys=${context ? Object.keys(context).join(",") : "none"}`,
    );

    // Dynamic import to avoid crashing server on boot if there's an issue
    const { analyzeGarmentImage } = await import("./claude.tsx");
    const result = await analyzeGarmentImage(imageBase64, mediaType, context);

    // Try to parse as JSON to validate
    let parsed;
    try {
      const cleaned = result
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.log(
        `Claude response was not valid JSON: ${parseErr}. Raw: ${result.substring(0, 500)}`,
      );
      return c.json(
        { error: "Claude returned invalid JSON", raw: result },
        502,
      );
    }

    // Generate SVG technical drawing based on the analyzed tech pack
    let technicalDrawingSvg: string | undefined;
    try {
      const { generateTechnicalDrawingSvg } = await import("./claude.tsx");
      const svgResult = await generateTechnicalDrawingSvg(
        JSON.stringify(parsed),
        imageBase64,
        mediaType,
      );
      // Clean up the SVG — strip any markdown fences
      const cleanedSvg = svgResult
        .replace(/```svg\n?/g, "")
        .replace(/```xml\n?/g, "")
        .replace(/```html\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/<\?xml[^?]*\?>/g, "")
        .trim();
      // Validate it starts with <svg
      if (cleanedSvg.startsWith("<svg") || cleanedSvg.startsWith("<SVG")) {
        technicalDrawingSvg = cleanedSvg;
        console.log(`SVG drawing generated: ${cleanedSvg.length} chars`);
      } else {
        console.log(`SVG drawing invalid — doesn't start with <svg>: ${cleanedSvg.substring(0, 100)}`);
      }
    } catch (drawErr) {
      console.log(`SVG drawing generation failed (non-fatal): ${drawErr}`);
      // Non-fatal — we still return the tech pack without the drawing
    }

    return c.json({ techPack: parsed, technicalDrawingSvg });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`AI analyze error: ${msg}`);
    return c.json({ error: `AI analysis failed: ${msg}` }, 500);
  }
});

// POST /ai/suggestions — Get AI suggestions for existing tech pack
app.post("/make-server-2dcdbb4e/ai/suggestions", async (c) => {
  try {
    const body = await c.req.json();
    const { techPack } = body;

    if (!techPack) {
      return c.json({ error: "Missing techPack in request body" }, 400);
    }

    console.log("AI suggestions request received");

    // Dynamic import to avoid crashing server on boot
    const { generateSuggestions } = await import("./claude.tsx");
    const result = await generateSuggestions(JSON.stringify(techPack));

    let parsed;
    try {
      const cleaned = result
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.log(
        `Claude suggestions response not valid JSON: ${parseErr}. Raw: ${result.substring(0, 500)}`,
      );
      return c.json(
        { error: "Claude returned invalid JSON for suggestions", raw: result },
        502,
      );
    }

    return c.json({ suggestions: parsed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`AI suggestions error: ${msg}`);
    return c.json({ error: `AI suggestions failed: ${msg}` }, 500);
  }
});

Deno.serve(app.fetch);
