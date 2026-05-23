export const PIPELINE_PROPERTY = [
  "Descartado",
  "Mantenimiento",
  "Disponible",
  "Reservado",
  "Cerrado",
] as const;
export type PropertyEstado = (typeof PIPELINE_PROPERTY)[number];

export const PROPERTY_TYPES = [
  "Departamento",
  "Casa",
  "Local",
  "Oficina",
  "Terreno",
] as const;
export type PropertyTipo = (typeof PROPERTY_TYPES)[number];

export const OPERATIONS = ["Venta", "Alquiler"] as const;
export type PropertyOperacion = (typeof OPERATIONS)[number];

export const CURRENCIES = ["PEN", "USD"] as const;
export type PropertyMoneda = (typeof CURRENCIES)[number];

export const ANTIGUEDAD_OPTIONS = [
  "",
  "A estrenar",
  "1-5 años",
  "5-10 años",
  "10-20 años",
  "20+ años",
] as const;
export type PropertyAntiguedad = (typeof ANTIGUEDAD_OPTIONS)[number];

export const MASCOTAS_OPTIONS = ["Sí", "No", "A tratar"] as const;
export type PropertyMascotas = (typeof MASCOTAS_OPTIONS)[number];

export const ZONA_OPTIONS = [
  "",
  "Residencial tranquila",
  "Residencial con comercio",
  "Zona financiera / empresarial",
  "Corredor comercial",
  "Zona universitaria",
  "Cerca a clínicas / salud",
  "Zona gastronómica / turística",
  "Industrial / almacenes",
] as const;
export type PropertyZona = (typeof ZONA_OPTIONS)[number];

export const PERFIL_IDEAL_OPTIONS = [
  "",
  "Familias con hijos",
  "Ejecutivos / profesionales",
  "Estudiantes / roommates",
  "Adultos mayores",
  "Inversión / renta",
] as const;
export type PropertyPerfilIdeal = (typeof PERFIL_IDEAL_OPTIONS)[number];

export const VISTA_OPTIONS = [
  "",
  "Calle",
  "Avenida",
  "Parque",
  "Jardín interior",
  "Panorámica",
  "Mar",
] as const;
export type PropertyVista = (typeof VISTA_OPTIONS)[number];

export function getEstadoDisplay(estado: string, operacion: string) {
  if (estado !== "Cerrado") return estado;
  return operacion === "Alquiler" ? "Alquilado" : "Vendido";
}
