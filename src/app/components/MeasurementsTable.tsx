import { useState } from "react";

export interface Measurement {
  id: string;
  point: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
}

interface MeasurementsTableProps {
  measurements: Measurement[];
  onChange: (measurements: Measurement[]) => void;
}

export function MeasurementsTable({ measurements, onChange }: MeasurementsTableProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);

  const sizes = ["xs", "s", "m", "l", "xl"] as const;

  const handleCellChange = (rowIndex: number, col: string, value: string) => {
    const updated = [...measurements];
    updated[rowIndex] = { ...updated[rowIndex], [col]: value };
    onChange(updated);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-burgundy-950/[0.06]">
      <table className="w-full" style={{ fontSize: "0.8125rem" }}>
        <thead>
          <tr className="bg-burgundy-950/[0.02]">
            <th
              className="text-left px-3 py-2 text-muted-foreground"
              style={{ fontSize: "0.6875rem", fontWeight: 400, letterSpacing: "0.03em" }}
            >
              Point of measure
            </th>
            {sizes.map((size) => (
              <th
                key={size}
                className="text-center px-3 py-2 text-muted-foreground"
                style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.05em" }}
              >
                {size.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measurements.map((row, rowIndex) => (
            <tr
              key={row.id}
              className="border-t border-burgundy-950/[0.04] hover:bg-burgundy-950/[0.01] transition-colors"
            >
              <td className="px-3 py-2 text-foreground/80" style={{ fontSize: "0.8125rem" }}>
                {row.point}
              </td>
              {sizes.map((size) => {
                const isEditing = editingCell?.row === rowIndex && editingCell?.col === size;
                return (
                  <td key={size} className="text-center px-1 py-1">
                    {isEditing ? (
                      <input
                        autoFocus
                        value={row[size]}
                        onChange={(e) => handleCellChange(rowIndex, size, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") setEditingCell(null);
                        }}
                        className="w-full text-center px-1 py-0.5 rounded-md bg-white border border-burgundy/15 focus:border-burgundy/30 outline-none text-foreground"
                        style={{ fontSize: "0.8125rem" }}
                      />
                    ) : (
                      <span
                        onClick={() => setEditingCell({ row: rowIndex, col: size })}
                        className="inline-block w-full px-2 py-0.5 rounded-md cursor-pointer hover:bg-burgundy-950/[0.03] transition-colors text-foreground/70"
                      >
                        {row[size]}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
