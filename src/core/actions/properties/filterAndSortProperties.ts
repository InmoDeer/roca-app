import type { Property, PropertyFilters } from "@/core/entities/property";

const STATUS_ORDER: Record<string, number> = {
  Disponible: 1,
  Reservado: 2,
  Cerrado: 3,
};

/** Filtrado y orden de lista (UI) — lógica de negocio de presentación del catálogo. */
export function filterAndSortProperties(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
  const q = filters.q.toLowerCase();
  const result = properties.filter((p) => {
    if (q && !p.nombre?.toLowerCase().includes(q) && !p.distrito?.toLowerCase().includes(q)) {
      return false;
    }
    if (filters.operacion && p.operacion !== filters.operacion) return false;
    if (filters.tipo && p.tipo !== filters.tipo) return false;
    if (filters.estado === "Cerrado") {
      if (p.estado !== "Cerrado") return false;
    } else if (filters.estado && p.estado !== filters.estado) {
      return false;
    }
    return true;
  });

  return result.sort((a, b) => {
    const orderA = STATUS_ORDER[a.estado] ?? 99;
    const orderB = STATUS_ORDER[b.estado] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
}
