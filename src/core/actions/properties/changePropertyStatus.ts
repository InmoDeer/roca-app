import { updatePropertyStatusRow } from "@/core/repositories/properties.repository";
import { PIPELINE_PROPERTY, type PropertyEstado } from "@/core/entities/property";
import type { ActionResult } from "@/core/actions/types";

export async function changePropertyStatus(
  id: string,
  estado: PropertyEstado
): Promise<ActionResult> {
  if (!PIPELINE_PROPERTY.includes(estado)) {
    return {
      ok: false,
      error: `Estado inválido: ${estado}. Opciones: ${PIPELINE_PROPERTY.join(", ")}`,
    };
  }
  try {
    await updatePropertyStatusRow(id, estado);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al cambiar estado";
    return { ok: false, error: message };
  }
}
