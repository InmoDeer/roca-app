import {
  buildPropertyPayload,
  createPropertyRow,
} from "@/core/repositories/properties.repository";
import type { Property } from "@/core/entities/property";
import type { ActionResult } from "@/core/actions/types";

export async function createProperty(data: Partial<Property>): Promise<ActionResult> {
  if (!data.nombre) return { ok: false, error: "Falta el nombre del inmueble" };
  if (!data.distrito) return { ok: false, error: "Falta el distrito" };
  if (!data.precio) return { ok: false, error: "Falta el precio" };
  if (!data.tipo) return { ok: false, error: "Falta el tipo (Departamento, Casa, etc.)" };
  if (!data.operacion) return { ok: false, error: "Falta la operación (Venta o Alquiler)" };

  try {
    const payload = buildPropertyPayload({
      ...data,
      estado: data.estado || "Disponible",
      moneda: data.moneda || "PEN",
    });
    await createPropertyRow(payload as Partial<Property>);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear propiedad";
    return { ok: false, error: message };
  }
}
