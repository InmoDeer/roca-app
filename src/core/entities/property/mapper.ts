import type { Property } from "./types";

/** Mapea fila Supabase → dominio (hoy 1:1; extensible para normalización). */
export function mapRowToProperty(row: Record<string, unknown>): Property {
  return row as unknown as Property;
}
