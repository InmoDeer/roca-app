// =====================
// PIPELINES - Leads y Propietarios
// =====================
export const PIPELINE_LEAD = [
  { key: "Interesado", color: "#9e8a4b" },
  { key: "Seguimiento", color: "#c4a44a" },
  { key: "Visita", color: "#d4af37" },
  { key: "Vendido/Alquilado", color: "#00ff88" },
  { key: "Cerrado", color: "#666666" },
];

export const PIPELINE_PROPIETARIO = [
  { key: "Captación", color: "#9e8a4b" },
  { key: "Propuesta/Tasación", color: "#c4a44a" },
  { key: "Negociación", color: "#e5c04a" },
  { key: "Firmado / Cerrado", color: "#00ff88" },
];

// =====================
// Helper: generar ESTADO_COLORS desde un pipeline
// =====================
function buildEstadoColors(pipeline) {
  return Object.fromEntries(
    pipeline.map(({ key, color }) => [
      key,
      { bg: "#1a1a1a", text: color, dot: color },
    ])
  );
}

// Estado colors para Leads
export const ESTADO_COLORS_LEAD = buildEstadoColors(PIPELINE_LEAD);

// Estado colors para Propietarios
export const ESTADO_COLORS_PROPIETARIO = buildEstadoColors(PIPELINE_PROPIETARIO);

// Estado colors unificado (para quien necesite ambos)
export const ESTADO_COLORS = {
  ...ESTADO_COLORS_LEAD,
  ...ESTADO_COLORS_PROPIETARIO,
  Descartado: { bg: "#1a1a1a", text: "#444444", dot: "#444444" },
  // Estados de propiedades
  Disponible: {
    bg: "#d1fae5",
    text: "#065f46",
    dot: "#10b981",
    border: "#a7f3d0",
  },
  Reservado: {
    bg: "#fef3c7",
    text: "#92400e",
    dot: "#f59e0b",
    border: "#fde68a",
  },
  Cerrado: {
    bg: "#fee2e2",
    text: "#991b1b",
    dot: "#ef4444",
    border: "#fecaca",
  },
};

// =====================
// Arrays de estados (para selects)
// =====================
export const ESTADOS_LEAD = PIPELINE_LEAD.map(p => p.key);
export const ESTADOS_PROPIETARIO = PIPELINE_PROPIETARIO.map(p => p.key);

// =====================
// Property states (inmuebles)
// =====================
export const ESTADOS = ["Disponible", "Reservado", "Cerrado"];

// Property types
export const PROPERTY_TYPES = [
  "Departamento",
  "Casa",
  "Local",
  "Oficina",
  "Terreno",
];

// Operations (Venta/Alquiler)
export const OPERATIONS = ["Venta", "Alquiler"];

// Currencies
export const CURRENCIES = ["PEN", "USD"];

// Antiguedad (age) options
export const ANTIGUEDAD_OPTIONS = [
  "",
  "A estrenar",
  "1-5 años",
  "5-10 años",
  "10-20 años",
  "20+ años",
];

// Pet options
export const MASCOTAS_OPTIONS = ["Sí", "No", "A tratar"];

// Helper to get display label for cerrado
export function getEstadoDisplay(estado, operacion) {
  if (estado !== "Cerrado") return estado;
  return operacion === "Alquiler" ? "Alquilado" : "Vendido";
}