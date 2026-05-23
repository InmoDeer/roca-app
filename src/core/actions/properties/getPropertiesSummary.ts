import { fetchProperties } from "@/core/repositories/properties.repository";
import type { ActionResult } from "@/core/actions/types";

export type PropertiesSummary = {
  total: number;
  disponibles: number;
  reservadas: number;
  cerradas: number;
  descartadas: number;
  porTipo: Record<string, number>;
  porDistrito: Record<string, number>;
};

export async function getPropertiesSummary(): Promise<ActionResult<PropertiesSummary>> {
  try {
    const all = await fetchProperties();
    const byEstado = (estado: string) => all.filter((p) => p.estado === estado).length;

    const porTipo: Record<string, number> = {};
    const porDistrito: Record<string, number> = {};

    for (const p of all) {
      porTipo[p.tipo] = (porTipo[p.tipo] || 0) + 1;
      porDistrito[p.distrito] = (porDistrito[p.distrito] || 0) + 1;
    }

    return {
      ok: true,
      data: {
        total: all.length,
        disponibles: byEstado("Disponible"),
        reservadas: byEstado("Reservado"),
        cerradas: byEstado("Cerrado"),
        descartadas: byEstado("Descartado"),
        porTipo,
        porDistrito,
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener resumen";
    return { ok: false, error: message };
  }
}
