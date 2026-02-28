import { useState, useRef, useEffect } from "react";
import { Check, Pencil } from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

export function EditableField({ label, value, onChange, multiline = false }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // Place cursor at end instead of selecting all
      const el = inputRef.current;
      if ("setSelectionRange" in el) {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    }
  }, [editing]);

  const handleSave = () => {
    onChange(localValue);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) handleSave();
    if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) handleSave();
    if (e.key === "Escape") {
      setLocalValue(value);
      setEditing(false);
    }
  };

  return (
    <div>
      <label
        className="block text-muted-foreground mb-1"
        style={{ fontSize: "0.6875rem", fontWeight: 400, letterSpacing: "0.03em" }}
      >
        {label}
      </label>
      {editing ? (
        <div className="flex items-start gap-1.5">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              rows={5}
              className="flex-1 px-3 py-2 rounded-[8px] bg-white border border-burgundy/12 focus:border-burgundy/20 focus:ring-1 focus:ring-burgundy/6 outline-none resize-none transition-all text-foreground"
              style={{ fontSize: "0.8125rem", lineHeight: 1.65 }}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="flex-1 px-3 py-1.5 rounded-[8px] bg-white border border-burgundy/12 focus:border-burgundy/20 focus:ring-1 focus:ring-burgundy/6 outline-none transition-all text-foreground"
              style={{ fontSize: "0.8125rem" }}
            />
          )}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSave}
            className="mt-1.5 p-1.5 rounded-[6px] bg-burgundy-950 text-cream hover:bg-burgundy-dark transition-colors cursor-pointer"
          >
            <Check className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
          className="relative cursor-pointer rounded-[8px] px-3 py-1.5 -mx-3 hover:bg-burgundy-950/[0.02] transition-all group"
        >
          <p className="text-foreground/80 whitespace-pre-wrap pr-6" style={{ fontSize: "0.8125rem", lineHeight: 1.65 }}>
            {value || <span className="text-muted-foreground/50 italic">Click to edit</span>}
          </p>
          <Pencil className="absolute right-2 top-2 w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground/40 transition-all" />
        </div>
      )}
    </div>
  );
}