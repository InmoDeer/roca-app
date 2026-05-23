import type { Property } from "@/core/entities/property";

/** Contexto de conversación para resolver referencias ("el de Lince", "ese", "el último"). */
export interface ParseContext {
  properties: Property[];
  lastPropertyId?: string;
  lastResults?: Property[];
}

export function createParseContext(
  properties: Property[],
  lastPropertyId?: string,
  lastResults?: Property[]
): ParseContext {
  return { properties, lastPropertyId, lastResults };
}
