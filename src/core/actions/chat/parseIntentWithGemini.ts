/**
 * Fallback IA — solo se invoca cuando regex devuelve `unknown` y el usuario activó IA.
 * No es el camino principal del chat.
 */

import type { PropertyIntent } from "@/core/actions/types";
import type { ParseContext } from "./contextManager";
import { parseIntentWithGeminiService } from "@/core/services/gemini/parseIntent";

export async function parseIntentWithGemini(
  raw: string,
  ctx: ParseContext
): Promise<PropertyIntent> {
  try {
    return await parseIntentWithGeminiService(raw, ctx);
  } catch {
    return { action: "unknown", raw };
  }
}
