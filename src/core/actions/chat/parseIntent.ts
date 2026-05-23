/**
 * Parser regex — camino principal del chat (~80%+ de comandos).
 * No llama IA. Ver parseIntentHybrid para fallback opcional.
 */

import type { PropertyIntent } from "@/core/actions/types";
import type { Property } from "@/core/entities/property";
import {
  PIPELINE_PROPERTY,
  PROPERTY_TYPES,
  OPERATIONS,
  type PropertyEstado,
} from "@/core/entities/property";
import type { ParseContext } from "./contextManager";

export type { ParseContext } from "./contextManager";

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

function normalizeTipo(text: string): string | undefined {
  if (/\bdepa\b|\bdepartamento\b|\bdepto\b/.test(text)) return "Departamento";
  if (/\bcasa\b/.test(text)) return "Casa";
  if (/\blocal\b/.test(text)) return "Local";
  if (/\boficina\b/.test(text)) return "Oficina";
  if (/\bterreno\b/.test(text)) return "Terreno";
  return undefined;
}

function normalizeOperacion(text: string): string | undefined {
  if (/\balquiler\b|\balquilar\b|\barriendo\b|\balquileres\b/.test(text)) return "Alquiler";
  if (/\bventa\b|\bvender\b|\bvendo\b/.test(text)) return "Venta";
  return undefined;
}

function normalizeEstado(text: string): PropertyEstado | undefined {
  for (const e of PIPELINE_PROPERTY) {
    if (text.includes(e.toLowerCase())) return e;
  }
  if (/\breservar\b|\breservado\b/.test(text)) return "Reservado";
  if (/\bdisp\b|\bdisponible\b/.test(text)) return "Disponible";
  if (/\bcerrar\b|\bcerrado\b|\bvendido\b|\balquilado\b/.test(text)) return "Cerrado";
  if (/\bdescartar\b|\bdescartado\b/.test(text)) return "Descartado";
  if (/\bmantenimiento\b/.test(text)) return "Mantenimiento";
  return undefined;
}

function extractPrecio(text: string): { min?: number; max?: number } {
  const hasta = text.match(/(?:hasta|max|máximo|menor a)\s*(?:s\/|\$|usd|pen|soles?\s*)?(\d[\d.,]*)/i);
  const desde = text.match(/(?:desde|min|mínimo|mayor a)\s*(?:s\/|\$|usd|pen|soles?\s*)?(\d[\d.,]*)/i);
  const plain = text.match(/(\d[\d.,]{2,})\s*(?:soles|pen|s\/|\$|usd)?/i);

  const parseNum = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

  const out: { min?: number; max?: number } = {};
  if (hasta) out.max = parseNum(hasta[1]);
  if (desde) out.min = parseNum(desde[1]);
  if (!out.max && !out.min && plain && !text.includes("crear")) {
    out.max = parseNum(plain[1]);
  }
  return out;
}

function extractDistrito(text: string, ctx: ParseContext): string | undefined {
  const enMatch = text.match(/(?:en|de)\s+([a-záéíóúñ\s]{3,30})(?:\s|$|,|\.|hasta|por|con)/i);
  if (enMatch) {
    const candidate = enMatch[1].trim();
    const known = ctx.properties.find((p) =>
      p.distrito?.toLowerCase().includes(candidate.toLowerCase()) ||
      p.direccion?.toLowerCase().includes(candidate.toLowerCase()) ||
      p.limita_con?.toLowerCase().includes(candidate.toLowerCase()) ||
      p.nombre?.toLowerCase().includes(candidate.toLowerCase())
    );
    if (known) return known.distrito;
    if (candidate.length > 2) return candidate.replace(/\b(el|la|los|las)\b/g, "").trim();
  }

  for (const p of ctx.properties) {
    if (p.distrito && text.includes(p.distrito.toLowerCase())) return p.distrito;
  }
  return undefined;
}

function resolvePropertyId(text: string, ctx: ParseContext): string | undefined {
  const uuid = text.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  );
  if (uuid) return uuid[0];

  if (matchesAny(text, ["ese", "esa", "este", "esta", "el mismo", "la misma"]) && ctx.lastPropertyId) {
    return ctx.lastPropertyId;
  }

  if (matchesAny(text, ["último", "ultimo", "última", "ultima"]) && ctx.lastResults?.length) {
    return ctx.lastResults[ctx.lastResults.length - 1].id;
  }

  if (matchesAny(text, ["primero", "primera"]) && ctx.lastResults?.length) {
    return ctx.lastResults[0].id;
  }

  const deMatch = text.match(/(?:de|del|la|en)\s+([a-záéíóúñ\s]{3,25})/i);
  if (deMatch) {
    const needle = deMatch[1].trim().toLowerCase();
    const byName = ctx.properties.find(
      (p) =>
        p.nombre?.toLowerCase().includes(needle) ||
        p.distrito?.toLowerCase().includes(needle) ||
        p.direccion?.toLowerCase().includes(needle) ||
        p.limita_con?.toLowerCase().includes(needle)
    );
    if (byName) return byName.id;
  }

  if (ctx.lastPropertyId) return ctx.lastPropertyId;
  if (ctx.properties.length === 1) return ctx.properties[0].id;
  return undefined;
}

function buildSearchIntent(text: string, ctx: ParseContext): PropertyIntent {
  const precio = extractPrecio(text);
  const distrito = extractDistrito(text, ctx);
  const tipo = normalizeTipo(text);
  const operacion = normalizeOperacion(text);
  const estado = normalizeEstado(text);

  const filters: PropertyIntent & { action: "search" } = {
    action: "search",
    filters: {},
  };

  if (distrito) filters.filters.q = distrito;
  if (tipo) filters.filters.tipo = tipo;
  if (operacion) filters.filters.operacion = operacion;
  if (estado) filters.filters.estado = estado;
  if (precio.max) filters.filters.precio_max = precio.max;
  if (precio.min) filters.filters.precio_min = precio.min;

  if (!distrito && !tipo && !operacion && !estado && !precio.max && !precio.min) {
    const words = text.replace(/buscar|busca|mostrar|muestra|ver|listar|lista|filtrar|filtra/gi, "").trim();
    if (words.length > 2) filters.filters.q = words;
  }

  return filters;
}

function buildCreateIntent(text: string): PropertyIntent {
  const tipo = normalizeTipo(text) || "Departamento";
  const operacion = normalizeOperacion(text) || "Alquiler";
  const distrito = text.match(/(?:en|de)\s+([a-záéíóúñ\s]{3,25})/i)?.[1]?.trim() || "";
  const precio = extractPrecio(text);
  const nombre = `${tipo} en ${distrito || "Sin distrito"}`.trim();

  return {
    action: "create",
    data: {
      nombre,
      tipo: tipo as Property["tipo"],
      operacion: operacion as Property["operacion"],
      distrito: distrito || "Por definir",
      precio: precio.max || precio.min || 0,
      moneda: /\busd|\$\b/i.test(text) ? "USD" : "PEN",
      estado: "Disponible",
    },
  };
}

/** Nivel 1: regex/keywords — instantáneo, sin costo API. */
export function parseIntent(raw: string, ctx: ParseContext): PropertyIntent {
  const text = raw.trim().toLowerCase();
  if (!text) return { action: "unknown", raw };

  if (
    matchesAny(text, [
      "resumen",
      "estadísticas",
      "estadisticas",
      "total",
      "cuantos tengo",
      "cuántos tengo",
      "tengo disponibles",
      "tengo reservados",
      "mis propiedades",
      "mis inmuebles",
      "todo lo que tengo",
    ])
  ) {
    return { action: "summary" };
  }

  if (
    matchesAny(text, [
      "buscar",
      "busca",
      "mostrar",
      "muestra",
      "ver",
      "listar",
      "lista",
      "filtrar",
      "filtra",
      "propiedades en",
      "inmuebles en",
      "depas en",
      "casas en",
      "qué tengo en",
      "que tengo en",
      "disponibles en",
      "alquileres",
      "ventas en",
    ])
  ) {
    return buildSearchIntent(text, ctx);
  }

  if (
    matchesAny(text, ["duplicar", "copiar", "clonar"]) ||
    (text.includes("copia") && !text.includes("copiar"))
  ) {
    const id = resolvePropertyId(text, ctx);
    if (id) return { action: "duplicate", id };
    return { action: "unknown", raw };
  }

  if (matchesAny(text, ["eliminar", "borrar", "delete", "quitar"])) {
    const id = resolvePropertyId(text, ctx);
    if (id) return { action: "delete", id };
    return { action: "unknown", raw };
  }

  if (
    matchesAny(text, [
      "reservar",
      "marcar reservado",
      "poner reservado",
      "disponible",
      "cerrar",
      "descartar",
      "mantenimiento",
      "cambiar estado",
      "cambiar a",
      "pasar a",
    ])
  ) {
    const estado = normalizeEstado(text);
    const id = resolvePropertyId(text, ctx);
    if (estado && id) return { action: "changeStatus", id, estado };
  }

  if (matchesAny(text, ["crear", "nuevo inmueble", "agregar", "añadir", "nueva propiedad"])) {
    return buildCreateIntent(text);
  }

  if (
    matchesAny(text, [
      "info",
      "detalle",
      "detalles",
      "ficha",
      "ver ese",
      "ver el",
      "mostrar ese",
      "cuánto cuesta",
      "cuanto cuesta",
      "precio de",
      "cuantos dormitorios",
      "cuantas habitaciones",
      "cuantos cuartos",
      "cuantos ambientes",
      "cuantos baños",
      "cuantos pisos",
      "cuantas areas",
    ])
  ) {
    const id = resolvePropertyId(text, ctx);
    if (id) return { action: "get", id };
  }

  if (matchesAny(text, ["actualizar", "modificar", "cambiar precio", "editar", "bajar precio", "baja precio", "subir precio", "sube precio", "poner precio"])) {
    const id = resolvePropertyId(text, ctx);
    const fields: Partial<Property> = {};
    const precio = extractPrecio(text);
    if (precio.max) fields.precio = precio.max;
    if (precio.min && !precio.max) fields.precio = precio.min;
    const estado = normalizeEstado(text);
    if (estado) fields.estado = estado;
    if (id && Object.keys(fields).length > 0) return { action: "update", id, fields };
  }

  const implicitDistrito = extractDistrito(text, ctx);
  const implicitTipo = normalizeTipo(text);
  const implicitOp = normalizeOperacion(text);
  if (implicitDistrito || implicitTipo || implicitOp) {
    return buildSearchIntent(text, ctx);
  }

  return { action: "unknown", raw };
}
