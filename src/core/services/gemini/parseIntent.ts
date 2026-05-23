/**
 * Cliente Gemini — opcional. Sin API key, devuelve unknown.
 */

import type { PropertyIntent } from "@/core/actions/types";
import type { ParseContext } from "@/core/actions/chat/contextManager";

export async function parseIntentWithGeminiService(
  raw: string,
  _ctx: ParseContext
): Promise<PropertyIntent> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return { action: "unknown", raw };
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Convierte este mensaje de un agente inmobiliario a JSON de intent.
Acciones: search, get, changeStatus, update, create, delete, duplicate, summary, unknown.
Mensaje: "${raw}"
Responde SOLO JSON válido sin markdown.`,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!res.ok) return { action: "unknown", raw };

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return { action: "unknown", raw };

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as PropertyIntent;
    if (parsed && typeof parsed === "object" && "action" in parsed) {
      return parsed;
    }
  } catch {
    /* fall through */
  }

  return { action: "unknown", raw };
}
