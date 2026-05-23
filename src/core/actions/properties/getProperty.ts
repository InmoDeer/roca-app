import { fetchPropertyById } from "@/core/repositories/properties.repository";
import type { Property } from "@/core/entities/property";
import type { ActionResult } from "@/core/actions/types";

export async function getProperty(id: string): Promise<ActionResult<Property>> {
  try {
    const p = await fetchPropertyById(id);
    if (!p) return { ok: false, error: "Propiedad no encontrada" };
    return { ok: true, data: p };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener propiedad";
    return { ok: false, error: message };
  }
}
