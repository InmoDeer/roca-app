import type { Property } from "@/core/entities/property";
import { PIPELINE_PROPERTY } from "@/core/entities/property";
import { getStatusColors } from "@/styles/statusColors";
import { formatCardBrief } from "./formatCardBrief";
import { ChevronRight } from "lucide-react";

export function PropertyResultCard({
  property: p,
  t,
  mode,
  onClick,
}: {
  property: Property;
  t: any;
  mode: string;
  onClick: () => void;
}) {
  const dot = getStatusColors(p.estado, PIPELINE_PROPERTY, t, mode, "solid").dot;

  return (
    <button
      onClick={onClick}
      style={{
        background: mode === "dark" ? "#1a1a1a" : "#ffffff",
        border: `1px solid ${t.colors.border}`,
        borderLeft: `3px solid ${dot}`,
        borderRadius: 10,
        padding: "10px 12px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: t.colors.text,
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {p.nombre}
        </div>
        <div style={{ fontSize: 12, color: t.colors.textMuted }}>
          {formatCardBrief(p)}
        </div>
      </div>
      <ChevronRight size={14} strokeWidth={1.5} color={t.colors.textMuted} />
    </button>
  );
}
