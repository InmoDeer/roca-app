export const PIPELINE_PROPERTY = [
  "Descartado",
  "Mantenimiento",
  "Disponible",
  "Reservado",
  "Cerrado",
];

export const PROPERTY_TYPES = [
  "Departamento",
  "Casa",
  "Local",
  "Oficina",
  "Terreno",
];

export const OPERATIONS = ["Venta", "Alquiler"];
export const CURRENCIES = ["PEN", "USD"];

export const ANTIGUEDAD_OPTIONS = [
  "",
  "A estrenar",
  "1-5 años",
  "5-10 años",
  "10-20 años",
  "20+ años",
];

export const MASCOTAS_OPTIONS = ["Sí", "No", "A tratar"];

export function getEstadoDisplay(estado: string, operacion: string) {
  if (estado !== "Cerrado") return estado;
  return operacion === "Alquiler" ? "Alquilado" : "Vendido";
}