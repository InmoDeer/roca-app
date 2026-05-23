import type { Property } from "@/core/entities/property";
import type { PropertyIntent } from "@/core/actions/types";
import { parseIntentHybrid } from "@/core/actions/chat";
import { executePropertyIntent } from "@/core/actions/properties";
import { buildResponse, type ChatResponse } from "./responseBuilder";
import type { ParseContext } from "./chatContext";

export interface EngineResult extends ChatResponse {
  intent: PropertyIntent;
  usedAI: boolean;
}

export async function processMessage(
  text: string,
  context: ParseContext,
  enableAI?: boolean
): Promise<EngineResult> {
  const { intent, usedAI } = await parseIntentHybrid(text, context, enableAI ?? false);

  const result = await executePropertyIntent(intent);

  const response = buildResponse(intent, result, context.properties);

  return { ...response, intent, usedAI };
}
