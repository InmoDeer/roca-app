// =====================
// PIPELINES - Leads, Propietarios y Propiedades
// =====================
export const PIPELINE_LEAD = [
  "Descartado",
  "Interesado",
  "Seguimiento",
  "Visita",
  "Seguimiento post-visita",
  "Cerrado",
];

export const PIPELINE_PROPIETARIO = [
  "Descartado",
  "Contactado",
  "Propuesta/Tasación",
  "Seguimiento",
  "Cerrado",
];

export const PIPELINE_PROPERTY = [
  "Descartado",
  "Mantenimiento",
  "Disponible",
  "Reservado",
  "Cerrado",
];

// =====================
// Helper: generar ESTADO_COLORS desde un pipeline
// =====================
function buildEstadoColors(pipeline) {
  return Object.fromEntries(
    pipeline.map(estado => {
      const key = typeof estado === 'string' ? estado : estado.key;
      return [key, { bg: "#1a1a1a", text: "#d4af37", dot: "#d4af37" }];
    })
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
};

// =====================
// Arrays de estados (para selects)
// =====================
export const ESTADOS_LEAD = PIPELINE_LEAD;
export const ESTADOS_PROPIETARIO = PIPELINE_PROPIETARIO;
export const ESTADOS_PROPERTY = PIPELINE_PROPERTY;

// =====================
// Property states (inmuebles)
// =====================
export const ESTADOS = PIPELINE_PROPERTY;

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