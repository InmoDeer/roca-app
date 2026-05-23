import {
  fetchPropertyById,
  updatePropertyRow,
} from "@/core/repositories/properties.repository";
import type { Property } from "@/core/entities/property";
import type { ActionResult } from "@/core/actions/types";

const PROTECTED = ["id", "user_id", "created_at", "updated_at", "fotos_urls"] as const;

/** Actualización desde chat — campos extra protegidos. */
export async function updatePropertyFields(
  id: string,
  fields: Partial<Property>
): Promise<ActionResult<Property>> {
  for (const key of PROTECTED) {
    if (key in fields) {
      return { ok: false, error: `El campo "${key}" no puede modificarse desde el chat` };
    }
  }
  try {
    await updatePropertyRow(id, fields);
    const updated = await fetchPropertyById(id);
    if (!updated) return { ok: false, error: "No se pudo verificar la actualización" };
    return { ok: true, data: updated };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al actualizar propiedad";
    return { ok: false, error: message };
  }
}
