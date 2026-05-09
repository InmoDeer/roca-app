function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return "#" + [r, g, b]
    .map(v => Math.round(Math.min(255, Math.max(0, v)))
      .toString(16).padStart(2, "0"))
    .join("");
}

function blend(hex1: string, hex2: string, factor: number) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex({
    r: c1.r + (c2.r - c1.r) * factor,
    g: c1.g + (c2.g - c1.g) * factor,
    b: c1.b + (c2.b - c1.b) * factor,
  });
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastText(bgHex: string) {
  return getLuminance(bgHex) > 0.35 ? "#1a1a1a" : "#ffffff";
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getStatusColors(status: string, pipeline: string[], t: any, mode: string, variant = "solid") {
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
  return ["Descartado", "Mantenimiento", "Disponible", "Reservado", "Cerrado"];
}

export function generateStatusPalette(pipeline: string[], t: any, mode: string) {
  return pipeline.map((status, i) => ({
    status,
    index: i,
    solid: getStatusColors(status, pipeline, t, mode, "solid"),
    subtle: getStatusColors(status, pipeline, t, mode, "subtle"),
  }));
}