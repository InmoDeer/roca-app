import { fetchProperties } from "@/core/repositories/properties.repository";
import type { Property } from "@/core/entities/property";
import type { ActionResult } from "@/core/actions/types";

export async function loadAllProperties(): Promise<ActionResult<Property[]>> {
  try {
    const all = await fetchProperties();
    return { ok: true, data: all };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al cargar propiedades";
    return { ok: false, error: message };
  }
}
