import { useState, useRef, useCallback } from "react";
import { Upload, ArrowRight, ImageIcon } from "lucide-react";

interface UploadScreenProps {
  onSubmit: (image: string, brandName: string) => void;
}

export function UploadScreen({ onSubmit }: UploadScreenProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal top bar */}
      <header className="flex items-center h-14 px-6 border-b border-burgundy/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-[22px] h-[22px] rounded-md bg-burgundy-950 flex items-center justify-center">
            <span className="text-white" style={{ fontSize: "10px", fontWeight: 600 }}>T</span>
          </div>
          <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            TechPack AI
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-[480px]">
          <div className="mb-8">
            <h1 className="text-foreground mb-2" style={{ fontSize: "1.375rem", fontWeight: 500, letterSpacing: "-0.01em" }}>
              New tech pack
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              Upload a garment image and we'll generate a complete specification.
            </p>
          </div>

          {/* Upload zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden
              ${dragOver
                ? "border-burgundy/30 bg-burgundy/[0.02]"
                : preview
                ? "border-burgundy/8 bg-white"
                : "border-dashed border-burgundy/10 bg-white hover:border-burgundy/20"
              }
            `}
          >
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Garment preview"
                  className="w-full h-56 object-contain p-6"
                />
                <div className="absolute inset-0 bg-burgundy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white/90" style={{ fontSize: "0.813rem" }}>
                    Replace image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 px-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${dragOver ? "bg-burgundy/10" : "bg-burgundy/[0.04]"}`}>
                  {dragOver ? (
                    <ImageIcon className="w-[18px] h-[18px] text-burgundy" />
                  ) : (
                    <Upload className="w-[18px] h-[18px] text-burgundy/40" />
                  )}
                </div>
                <p className="text-foreground mb-0.5" style={{ fontSize: "0.875rem" }}>
                  {dragOver ? "Drop here" : "Drop your garment image"}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                  or click to browse · PNG, JPG up to 10MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          {/* Brand name */}
          <div className="mt-4">
            <label className="block text-muted-foreground mb-1.5" style={{ fontSize: "0.75rem", fontWeight: 400 }}>
              Brand name <span className="text-muted-foreground/40">· optional</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Maison Lumière"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-burgundy/8 focus:border-burgundy/20 focus:ring-1 focus:ring-burgundy/8 outline-none transition-all placeholder:text-muted-foreground/30"
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          {/* Generate */}
          <button
            onClick={() => preview && onSubmit(preview, brandName)}
            disabled={!preview}
            className={`
              mt-5 w-full py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
              ${preview
                ? "bg-burgundy-950 text-white hover:bg-burgundy-dark cursor-pointer"
                : "bg-burgundy-950/10 text-burgundy-950/25 cursor-not-allowed"
              }
            `}
            style={{ fontSize: "0.875rem" }}
          >
            Generate tech pack
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
