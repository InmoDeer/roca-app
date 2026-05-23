/**
 * Punto de entrada del chat — regex primero, IA solo si hace falta.
 *
 * 1. parseIntent (regex) — gratis, instantáneo
 * 2. parseIntentWithGemini — solo si regex → unknown Y enableAI === true
 */

import type { PropertyIntent } from "@/core/actions/types";
import type { ParseContext } from "./contextManager";
import { parseIntent } from "./parseIntent";
import { parseIntentWithGemini } from "./parseIntentWithGemini";

export async function parseIntentHybrid(
  raw: string,
  ctx: ParseContext,
  enableAI = false
): Promise<{ intent: PropertyIntent; usedAI: boolean }> {
  const intent = parseIntent(raw, ctx);

  if (intent.action !== "unknown") {
    return { intent, usedAI: false };
  }

  if (!enableAI) {
    return { intent, usedAI: false };
  }

  const aiIntent = await parseIntentWithGemini(raw, ctx);
  if (aiIntent.action !== "unknown") {
    return { intent: aiIntent, usedAI: true };
  }

  return { intent: { action: "unknown", raw }, usedAI: false };
}
