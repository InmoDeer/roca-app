import { fetchProperties } from "@/core/repositories/properties.repository";
import type { Property } from "@/core/entities/property";
import type { ActionResult, PropertyIntent } from "@/core/actions/types";

export async function searchProperties(
  filters: PropertyIntent & { action: "search" }
): Promise<ActionResult<Property[]>> {
  try {
    const all = await fetchProperties();
    const f = filters.filters;

    const result = all.filter((p) => {
      if (f.q) {
        const q = f.q.toLowerCase();
        if (
          !p.nombre?.toLowerCase().includes(q) &&
          !p.distrito?.toLowerCase().includes(q) &&
          !p.direccion?.toLowerCase().includes(q) &&
          !p.limita_con?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (f.operacion && p.operacion !== f.operacion) return false;
      if (f.tipo && p.tipo !== f.tipo) return false;
      if (f.estado && p.estado !== f.estado) return false;
      if (f.precio_max && p.precio > f.precio_max) return false;
      if (f.precio_min && p.precio < f.precio_min) return false;
      return true;
    });

    return { ok: true, data: result };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al buscar propiedades";
    return { ok: false, error: message };
  }
}
