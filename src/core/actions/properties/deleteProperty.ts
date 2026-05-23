import {
  deletePropertyRow,
  fetchPropertyById,
} from "@/core/repositories/properties.repository";
import type { ActionResult } from "@/core/actions/types";

export async function deletePropertyById(id: string): Promise<ActionResult> {
  try {
    const p = await fetchPropertyById(id);
    if (!p) return { ok: false, error: "Propiedad no encontrada" };
    await deletePropertyRow(id);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar propiedad";
    return { ok: false, error: message };
  }
}
