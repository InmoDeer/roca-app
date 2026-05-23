import {
  buildPropertyPayload,
  createPropertyRow,
  fetchPropertyById,
} from "@/core/repositories/properties.repository";
import type { Property } from "@/core/entities/property";
import type { ActionResult } from "@/core/actions/types";

export async function duplicateProperty(id: string): Promise<ActionResult> {
  try {
    const original = await fetchPropertyById(id);
    if (!original) return { ok: false, error: "Propiedad no encontrada" };

    const { id: _id, created_at: _c, updated_at: _u, user_id: _uid, ...rest } = original;
    const payload = buildPropertyPayload({
      ...rest,
      nombre: `${original.nombre} (copia)`,
      estado: "Disponible",
      fotos_urls: [],
      direccion: "",
      maps_url: "",
      video_url: "",
      tour360_url: "",
    });
    await createPropertyRow(payload as Partial<Property>);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al duplicar propiedad";
    return { ok: false, error: message };
  }
}
