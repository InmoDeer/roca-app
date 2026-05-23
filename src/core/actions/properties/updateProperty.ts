import {
  fetchPropertyById,
  updatePropertyRow,
} from "@/core/repositories/properties.repository";
import type { Property } from "@/core/entities/property";
import type { ActionResult } from "@/core/actions/types";

const PROTECTED = ["id", "user_id", "created_at", "updated_at"] as const;

export async function updateProperty(
  id: string,
  fields: Partial<Property>
): Promise<ActionResult<Property>> {
  for (const key of PROTECTED) {
    if (key in fields) {
      return { ok: false, error: `El campo "${key}" no puede modificarse` };
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
