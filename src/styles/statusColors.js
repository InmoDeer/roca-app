/**
 * statusColors.js
 * Motor de gradiente automático entre statusStart → statusEnd
 * Genera colores interpolados según la posición del estado en el pipeline
 */

// ─── Interpolación hex ───────────────────────────────────────
function hexToRgb(hex) {
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

function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b]
    .map(v => Math.round(Math.clamp ? Math.clamp(v, 0, 255) : Math.min(255, Math.max(0, v)))
      .toString(16).padStart(2, "0"))
    .join("");
}

function blend(hex1, hex2, factor) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex({
    r: c1.r + (c2.r - c1.r) * factor,
    g: c1.g + (c2.g - c1.g) * factor,
    b: c1.b + (c2.b - c1.b) * factor,
  });
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastText(bgHex) {
  return getLuminance(bgHex) > 0.35 ? "#1a1a1a" : "#ffffff";
}

// ─── Helpers para alpha ──────────────────────────────────────
function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Motor principal ─────────────────────────────────────────
/**
 * getStatusColors(status, pipeline, t, mode, variant)
 * 
 * @param {string} status - Estado actual ("Disponible", "Interesado", etc.)
 * @param {string[]} pipeline - Array de estados del pipeline
 * @param {object} t - Tema activo (darkTheme o lightTheme)
 * @param {string} mode - "dark" | "light"
 * @param {string} variant - "solid" (badges) | "subtle" (cards, selects)
 * @returns {{ bg, text, dot, border, progress }}
 */
export function getStatusColors(status, pipeline, t, mode, variant = "solid") {
  const total = pipeline.length;
  const index = pipeline.indexOf(status);

  // Estado no encontrado → neutro
  if (index === -1) {
    return {
      bg: t.colors.bgCard,
      text: t.colors.textMuted,
      dot: t.colors.textMuted,
      border: t.colors.border,
      progress: 0,
    };
  }

  // Descartado → siempre gris apagado
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

  // Progreso: 0 (segundo estado) → 1 (último estado)
  const progress = total <= 2 ? 1 : (index - 1) / (total - 2);
  const dotColor = blend(t.colors.statusStart, t.colors.statusEnd, progress);

  if (variant === "subtle") {
    // Fondo muy tenue, borde del color interpolado
    return {
      bg: hexToRgba(dotColor, mode === "dark" ? 0.12 : 0.1),
      text: mode === "dark" ? blend("#aaaaaa", t.colors.statusEnd, progress * 0.7) : blend("#555555", t.colors.primaryDark || "#b8962e", progress * 0.7),
      dot: dotColor,
      border: hexToRgba(dotColor, 0.35),
      progress,
    };
  }

  // solid — badge compacto
  const bgColor = hexToRgba(dotColor, mode === "dark" ? 0.2 : 0.15);
  return {
    bg: bgColor,
    text: mode === "dark" ? blend("#cccccc", t.colors.statusEnd, progress * 0.6) : blend("#333333", t.colors.primaryDark || "#b8962e", progress * 0.6),
    dot: dotColor,
    border: hexToRgba(dotColor, 0.4),
    progress,
  };
}

/**
 * getPipelineForEntity — helper para no importar todos los pipelines
 */
export function getPipelineForEntity(entityType) {
  const pipelines = {
    property: ["Descartado", "Mantenimiento", "Disponible", "Reservado", "Cerrado"],
    lead: ["Descartado", "Interesado", "Seguimiento", "Visita", "Seguimiento post-visita", "Cerrado"],
    propietario: ["Descartado", "Contactado", "Propuesta/Tasación", "Seguimiento", "Cerrado"],
  };
  return pipelines[entityType] || pipelines.property;
}

/**
 * generateStatusPalette — para debug / previsualización
 */
export function generateStatusPalette(pipeline, t, mode) {
  return pipeline.map((status, i) => ({
    status,
    index: i,
    solid: getStatusColors(status, pipeline, t, mode, "solid"),
    subtle: getStatusColors(status, pipeline, t, mode, "subtle"),
  }));
}
