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

const TIPO_KEYWORDS: Record<string, string[]> = {
  Departamento: ["depa", "departamento", "depto"],
  Casa:         ["casa"],
  Local:        ["local"],
  Oficina:      ["oficina"],
  Terreno:      ["terreno"],
};

function normalizeTipo(text: string): string | undefined {
  for (const [tipo, keywords] of Object.entries(TIPO_KEYWORDS)) {
    const regex = new RegExp(
      keywords.map(kw => {
        const plural = /[aeiouáéíóú]$/i.test(kw) ? kw + "s" : kw + "es";
        return `\\b(?:${kw}|${plural})\\b`;
      }).join("|")
    );
    if (regex.test(text)) return tipo;
  }
  return undefined;
}

function normalizeOperacion(text: string): string | undefined {
  if (/\balquiler\b|\balquileres\b|\balquilar\b|\barriendo\b|\barriendos?\b/.test(text)) return "Alquiler";
  if (/\bventa\b|\bventas\b|\bvender\b|\bvendo\b/.test(text)) return "Venta";
  return undefined;
}

function normalizeEstado(text: string): PropertyEstado | undefined {
  for (const e of PIPELINE_PROPERTY) {
    if (text.includes(e.toLowerCase())) return e;
  }
  if (/\breservar\b|\breservado\b/.test(text)) return "Reservado";
  if (/\bdisp\b|\bdisponible\b/.test(text)) return "Disponible";
  // FIX: 'cerrado/vendido/alquilado' son estado "Cerrado", no operación
  if (/\bcerrar\b|\bcerrado\b|\bvendido\b|\balquilado\b/.test(text)) return "Cerrado";
  if (/\bdescartar\b|\bdescartado\b/.test(text)) return "Descartado";
  if (/\bmantenimiento\b/.test(text)) return "Mantenimiento";
  return undefined;
}

function extractPrecio(text: string): { min?: number; max?: number } {
  const hasta = text.match(/(?:hasta|max|máximo|menor a)\s*(?:s\/|\$|usd|pen|soles?\s*)?(\d[\d.,]*)/i);
  const desde = text.match(/(?:desde|min|mínimo|mayor a)\s*(?:s\/|\$|usd|pen|soles?\s*)?(\d[\d.,]*)/i);

  // FIX: plain solo captura números de 4+ dígitos (precios reales), evita capturar
  // pisos (5), metros (200), ambientes (3), etc.
  const plain = text.match(/(?:precio|cuesta|valor|a)\s*(?:s\/|\$|usd|pen|soles?\s*)?(\d{4,}[\d.,]*)/i);

  const parseNum = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

  const out: { min?: number; max?: number } = {};
  if (hasta) out.max = parseNum(hasta[1]);
  if (desde) out.min = parseNum(desde[1]);
  if (!out.max && !out.min && plain) out.max = parseNum(plain[1]);
  return out;
}

// Palabras que NUNCA pueden ser un distrito
const DISTRITO_BLACKLIST = new Set([
  // operaciones
  "alquiler", "alquileres", "alquilar", "arrendar", "arriendo",
  "venta", "ventas", "vender", "vendo",
  // tipos de propiedad
  "depa", "departamento", "departamentos", "depto", "deptos",
  "casa", "casas", "local", "locales", "oficina", "oficinas",
  "terreno", "terrenos",
  // acciones / comandos
  "nuevo", "nueva", "crear", "crea", "agregar", "añadir",
  "buscar", "busca", "mostrar", "muestra", "listar", "lista",
  "ver", "filtrar", "filtra", "eliminar", "borrar",
  // artículos / preposiciones / conectores
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "en", "de", "del", "al", "a", "con", "para", "por",
  "distrito", "zona", "barrio",
  // rangos de precio
  "hasta", "desde", "max", "máximo", "mínimo", "menor", "mayor", "entre",
  // estados
  "disponible", "reservado", "vendido", "alquilado", "cerrado",
  "descartado", "mantenimiento",
]);

function extractDistrito(text: string, ctx: ParseContext): string | undefined {
  // 1) Coincidencia directa con distritos conocidos (más confiable)
  for (const p of ctx.properties) {
    if (p.distrito && text.includes(p.distrito.toLowerCase())) return p.distrito;
  }

  // 2) Patrones explícitos: "distrito de X", "en el distrito de X", "zona de X"
  const explicitPatterns = [
    /(?:distrito|zona|barrio)\s+(?:de\s+)?([a-záéíóúñ][a-záéíóúñ\s]{1,30}?)(?:\s|$|,)/i,
    /\ben\s+(?:el\s+distrito\s+de\s+|la\s+zona\s+de\s+)?([a-záéíóúñ][a-záéíóúñ\s]{2,25}?)(?:\s*(?:,|\.|$|en\s|de\s|con\s|para\s))/i,
  ];

  for (const pattern of explicitPatterns) {
    const m = text.match(pattern);
    if (m) {
      const candidate = m[1].trim().toLowerCase().replace(/\b(el|la|los|las)\b\s*/g, "").trim();
      if (candidate && !DISTRITO_BLACKLIST.has(candidate) && !/\d/.test(candidate) && candidate.length > 2) {
        const known = ctx.properties.find(
          (p) => p.distrito?.toLowerCase().includes(candidate)
        );
        if (known) return known.distrito;
        return candidate.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
  }

  // 3) Candidatos: palabras después de "en" / "de", saltando blacklist
  const words = text.split(/\s+/);
  const candidates: string[] = [];

  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] !== "en" && words[i] !== "de") continue;
    const nextWord = words[i + 1];
    if (!nextWord || DISTRITO_BLACKLIST.has(nextWord)) continue;

    const parts: string[] = [];
    for (let j = i + 1; j < words.length; j++) {
      const w = words[j];
      if (w === "en" || w === "de" || w === "con" || w === "para") break;
      if (!/^[a-záéíóúñ]+$/.test(w)) break;
      if (DISTRITO_BLACKLIST.has(w)) break;
      parts.push(w);
    }
    if (parts.length >= 1) candidates.push(parts.join(" "));
  }

  // 4) Evaluar de atrás hacia adelante (el último "en X" suele ser el distrito)
  for (let i = candidates.length - 1; i >= 0; i--) {
    const candidate = candidates[i].trim();
    if (!candidate || DISTRITO_BLACKLIST.has(candidate) || /\d/.test(candidate)) continue;
    if (candidate.length <= 2) continue;

    const known = ctx.properties.find(
      (p) =>
        p.distrito?.toLowerCase().includes(candidate.toLowerCase()) ||
        p.direccion?.toLowerCase().includes(candidate.toLowerCase()) ||
        p.limita_con?.toLowerCase().includes(candidate.toLowerCase()) ||
        p.nombre?.toLowerCase().includes(candidate.toLowerCase())
    );
    if (known) return known.distrito;

    const sub = ctx.properties.find(
      (p) => p.distrito && candidate.toLowerCase().includes(p.distrito.toLowerCase())
    );
    if (sub) return sub.distrito;

    if (candidate.length > 2) {
      return candidate.replace(/\b(el|la|los|las)\b/g, "").trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
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
  // FIX: en search, estado = filtro (no changeStatus)
  // Solo aplicar como filtro si viene con keyword de búsqueda clara, no solo "disponible" suelto
  const hasSearchKeyword = matchesAny(text, [
    "buscar", "busca", "mostrar", "muestra", "ver", "listar", "lista", "filtrar", "filtra",
    "propiedades", "inmuebles", "depas", "departamentos", "casas", "locales", "oficinas",
    "terrenos", "qué tengo", "que tengo", "tengo en", "disponibles", "alquileres", "ventas",
  ]);
  const estado = hasSearchKeyword ? normalizeEstado(text) : undefined;

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

function buildCreateIntent(text: string, ctx: ParseContext): PropertyIntent {
  const tipo = normalizeTipo(text) || "Departamento";
  const operacion = normalizeOperacion(text) || "Alquiler";
  const distrito = extractDistrito(text, ctx) || "";
  const precio = extractPrecio(text);
  const nombre = `${tipo} en ${distrito || "Sin distrito"}`.trim();

  return {
    action: "create",
    data: {
      nombre,
      tipo: tipo as Property["tipo"],
      operacion: operacion as Property["operacion"],
      distrito: distrito || "Por definir",
      precio: precio.max || precio.min,
      moneda: /\busd|\$\b/i.test(text) ? "USD" : "PEN",
      estado: "Disponible",
    },
  };
}

/** Nivel 1: regex/keywords — instantáneo, sin costo API. */
export function parseIntent(raw: string, ctx: ParseContext): PropertyIntent {
  const text = raw.trim().toLowerCase();
  if (!text) return { action: "unknown", raw };

  // ── RESUMEN ──────────────────────────────────────────────────────────────
  if (
    matchesAny(text, [
      "resumen", "estadísticas", "estadisticas", "total",
      "cuantos tengo", "cuántos tengo", "tengo disponibles",
      "tengo reservados", "mis propiedades", "mis inmuebles",
      "todo lo que tengo",
    ])
  ) {
    return { action: "summary" };
  }

  // ── DUPLICAR ─────────────────────────────────────────────────────────────
  if (
    matchesAny(text, ["duplicar", "copiar", "clonar"]) ||
    (text.includes("copia") && !text.includes("copiar"))
  ) {
    const id = resolvePropertyId(text, ctx);
    if (id) return { action: "duplicate", id };
    return { action: "unknown", raw };
  }

  // ── ELIMINAR ─────────────────────────────────────────────────────────────
  if (matchesAny(text, ["eliminar", "borrar", "delete", "quitar"])) {
    const id = resolvePropertyId(text, ctx);
    if (id) return { action: "delete", id };
    return { action: "unknown", raw };
  }

  // ── CAMBIAR ESTADO ───────────────────────────────────────────────────────
  if (
    matchesAny(text, [
      "reservar", "marcar reservado", "poner reservado",
      "cerrar", "descartar", "mantenimiento",
      "cambiar estado", "cambiar a", "pasar a",
      "marcar como", "poner como",
    ])
  ) {
    const estado = normalizeEstado(text);
    const id = resolvePropertyId(text, ctx);
    if (estado && id) return { action: "changeStatus", id, estado };
    // FIX: si hay estado pero no ID, devolver unknown con mensaje claro
    // en lugar de silenciosamente no hacer nada
    if (estado && !id) return { action: "unknown", raw: `¿A cuál inmueble querés cambiar el estado a "${estado}"?` };
  }

  // ── CREAR ────────────────────────────────────────────────────────────────
  if (matchesAny(text, ["crear", "crea", "nuevo", "nueva", "agregar", "añadir", "nueva propiedad", "nuevo inmueble"])) {
    return buildCreateIntent(text, ctx);
  }

  // ── ACTUALIZAR ───────────────────────────────────────────────────────────
  if (
    matchesAny(text, [
      "actualizar", "modificar", "cambiar precio", "editar",
      "bajar precio", "baja precio", "subir precio", "sube precio",
      "poner precio", "cambiar precio",
    ])
  ) {
    const id = resolvePropertyId(text, ctx);
    const fields: Partial<Property> = {};
    const precio = extractPrecio(text);
    if (precio.max) fields.precio = precio.max;
    if (precio.min && !precio.max) fields.precio = precio.min;
    const estado = normalizeEstado(text);
    if (estado) fields.estado = estado;
    if (id && Object.keys(fields).length > 0) return { action: "update", id, fields };
    // FIX: sin ID claro, pedir contexto en lugar de unknown genérico
    if (!id && Object.keys(fields).length > 0) {
      return { action: "unknown", raw: "¿A cuál inmueble querés aplicar ese cambio?" };
    }
  }

  // ── BUSCAR ───────────────────────────────────────────────────────────────
  if (
    matchesAny(text, [
      "buscar", "busca", "mostrar", "muestra", "ver", "listar", "lista",
      "filtrar", "filtra", "propiedades en", "inmuebles en",
      "depas en", "departamentos en", "casas en", "locales en",
      "oficinas en", "terrenos en", "qué tengo en", "que tengo en",
      "disponibles en", "alquileres", "ventas", "ventas en", "arriendos",
      "propiedades alquiladas", "propiedades vendidas",
    ])
  ) {
    // FIX: "ver el X de Y" con referencia específica → get, no search
    if (
      /\bver\s+(el|la|ese|esta|este|esa)\s+/i.test(text) &&
      resolvePropertyId(text, ctx)
    ) {
      const id = resolvePropertyId(text, ctx)!;
      return { action: "get", id };
    }
    return buildSearchIntent(text, ctx);
  }

  // ── GET (info de una propiedad) ──────────────────────────────────────────
  if (
    matchesAny(text, [
      "info", "detalle", "detalles", "ficha", "ver ese", "ver el",
      "mostrar ese", "cuánto cuesta", "cuanto cuesta", "precio de",
      "cuantos dormitorios", "cuantas habitaciones", "cuantos cuartos",
      "cuantos ambientes", "cuantos baños", "cuantos pisos",
    ])
  ) {
    const id = resolvePropertyId(text, ctx);
    if (id) return { action: "get", id };
  }

  // ── IMPLÍCITO: tipo / operación / distrito sin keyword de búsqueda ───────
  // FIX: añadir "precio X en Y" como search implícito
  const implicitDistrito = extractDistrito(text, ctx);
  const implicitTipo = normalizeTipo(text);
  const implicitOp = normalizeOperacion(text);
  const implicitPrecio = extractPrecio(text);
  const hasImplicitPrecio = implicitPrecio.max !== undefined || implicitPrecio.min !== undefined;

  if (implicitDistrito || implicitTipo || implicitOp || hasImplicitPrecio) {
    return buildSearchIntent(text, ctx);
  }

  return { action: "unknown", raw };
}
