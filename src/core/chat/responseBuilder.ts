import type { Property } from "@/core/entities/property";
import type { PropertyIntent } from "@/core/actions/types";
import {
  formatPropertyBrief,
} from "@/core/presenters/propertyText";
import { buildSummaryText } from "@/core/presenters/summaryText";

export interface ChatResponse {
  text: string;
  results?: Property[];
  refreshNeeded: boolean;
  toast?: { type: "success" | "error"; message: string };
}

export function buildResponse(
  intent: PropertyIntent,
  result: { ok: boolean; data?: unknown; error?: string },
  properties: Property[]
): ChatResponse {
  if (!result.ok) {
    return {
      text: `Error: ${result.error}`,
      refreshNeeded: false,
    };
  }

  switch (intent.action) {
    case "summary": {
      const d = result.data as {
        total: number;
        disponibles: number;
        reservadas: number;
        cerradas: number;
        descartadas: number;
        porDistrito: Record<string, number>;
      };
      return { text: buildSummaryText(d), refreshNeeded: false };
    }

    case "search": {
      const found = result.data as Property[];
      if (found.length === 0) {
        return { text: "No encontré inmuebles con esos criterios.", refreshNeeded: false };
      }
      return {
        text: found.length === 1 ? "Encontré 1 inmueble:" : `Encontré ${found.length} inmuebles:`,
        results: found,
        refreshNeeded: false,
      };
    }

    case "get": {
      const p = result.data as Property;
      return {
        text: formatPropertyBrief(p),
        results: [p],
        refreshNeeded: false,
      };
    }

    case "changeStatus": {
      const name = properties.find((x) => x.id === intent.id)?.nombre || "Inmueble";
      return {
        text: `**${name}** → **${intent.estado}**`,
        refreshNeeded: true,
        toast: { type: "success", message: `Estado actualizado: ${intent.estado}` },
      };
    }

    case "update": {
      const updated = result.data as Property;
      const fieldNames = Object.keys(intent.fields).join(", ");
      return {
        text: `**${updated.nombre}** actualizado (${fieldNames})`,
        refreshNeeded: true,
        toast: { type: "success", message: "Propiedad actualizada" },
      };
    }

    case "create": {
      return {
        text: "Inmueble creado. Completá los datos restantes desde el formulario.",
        refreshNeeded: true,
        toast: { type: "success", message: "Inmueble creado" },
      };
    }

    case "duplicate": {
      const original = properties.find((x) => x.id === intent.id);
      return {
        text: `**${original?.nombre}** duplicado. Podés editarlo desde la lista.`,
        refreshNeeded: true,
        toast: { type: "success", message: "Inmueble duplicado" },
      };
    }

    case "delete": {
      const deleted = properties.find((x) => x.id === intent.id);
      return {
        text: `**${deleted?.nombre}** eliminado.`,
        refreshNeeded: true,
        toast: { type: "success", message: "Inmueble eliminado" },
      };
    }

    case "unknown": {
      return {
        text: buildUnknownText(intent.raw),
        refreshNeeded: false,
      };
    }

    default:
      return { text: "Acción no reconocida.", refreshNeeded: false };
  }
}

function buildUnknownText(raw: string): string {
  return `No reconocí ese comando (regex). Tocá el botón de ayuda para ver ejemplos, o activá **IA fallback** solo si necesitás lenguaje libre.`;
}
