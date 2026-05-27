import type { Property } from "@/core/entities/property";
import { PIPELINE_PROPERTY } from "@/core/entities/property";
import { getStatusColors } from "@/styles/statusColors";
import { getPropertyResultCardStyles } from "@/styles/componentStyles";
import { formatCardBrief } from "./formatCardBrief";
import { ChevronRight } from "lucide-react";

export function PropertyResultCard({
  property: p,
  t,
  onClick,
}: {
  property: Property;
  t: any;
  onClick: () => void;
}) {
  const dot = getStatusColors(p.estado, PIPELINE_PROPERTY, t, "dark", "solid").dot;
  const s = getPropertyResultCardStyles(t, dot);

  return (
    <button
      onClick={onClick}
      style={s.card}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={s.name}>
          {p.nombre}
        </div>
        <div style={s.subtitle}>
          {formatCardBrief(p)}
        </div>
      </div>
      <ChevronRight size={14} strokeWidth={1.5} color={t.colors.textMuted} />
    </button>
  );
}
