import { hexToRgb, blend, hexToRgba } from "./colorUtils";
import { PIPELINE_PROPERTY } from "@/core/entities/property";
import { STAGES_LEAD, STAGES_PROPIETARIO } from "@/core/crm/stages";

export function getStatusColors(status: string, pipeline: readonly string[], t: any, mode: string, variant = "solid") {
  const total = pipeline.length;
  const index = pipeline.indexOf(status);

  if (index === -1) {
    return {
      bg: t.colors.bgCard,
      text: t.colors.textMuted,
      dot: t.colors.textMuted,
      border: t.colors.border,
      progress: 0,
    };
  }

  if (index === 0) {
    const grayDot = mode === "dark" ? "#555555" : "#aaaaaa";
    const grayBg = mode === "dark" ? "#2a2a2a" : "#f0f0f0";
    return {
      bg: variant === "subtle" ? hexToRgba(grayDot, 0.12) : grayBg,
      text: mode === "dark" ? "#888888" : "#666666",
      dot: grayDot,
      border: hexToRgba(grayDot, 0.3),
      progress: 0,
    };
  }

  const progress = total <= 2 ? 1 : (index - 1) / (total - 2);
  const dotColor = blend(t.colors.statusStart, t.colors.statusEnd, progress);

  if (variant === "subtle") {
    return {
      bg: hexToRgba(dotColor, mode === "dark" ? 0.12 : 0.1),
      text: mode === "dark" ? blend("#aaaaaa", t.colors.statusEnd, progress * 0.7) : blend("#555555", t.colors.primaryDark || "#b8962e", progress * 0.7),
      dot: dotColor,
      border: hexToRgba(dotColor, 0.35),
      progress,
    };
  }

  const bgColor = hexToRgba(dotColor, mode === "dark" ? 0.2 : 0.15);
  return {
    bg: bgColor,
    text: mode === "dark" ? blend("#cccccc", t.colors.statusEnd, progress * 0.6) : blend("#333333", t.colors.primaryDark || "#b8962e", progress * 0.6),
    dot: dotColor,
    border: hexToRgba(dotColor, 0.4),
    progress,
  };
}

export function getPipelineForEntity(entityType: string) {
  if (entityType === "lead") return STAGES_LEAD;
  if (entityType === "propietario") return STAGES_PROPIETARIO;
  return PIPELINE_PROPERTY;
}

