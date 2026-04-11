// Property states
export const ESTADOS = ["Disponible", "Reservado", "Vendido/Alquilado"];

// Estado color configuration
export const ESTADO_COLORS = {
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
  "Vendido/Alquilado": {
    bg: "#fee2e2",
    text: "#991b1b",
    dot: "#ef4444",
    border: "#fecaca",
  },
};

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
