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
                text: `Convierte este mensaje de un agente inmobiliario a JSON.

FORMATOS:
- search: {"action":"search","filters":{"tipo?":"Departamento|Casa|Local|Oficina|Terreno","operacion?":"Venta|Alquiler","estado?":"Disponible|Reservado|Cerrado|Descartado|Mantenimiento","q?":"texto libre","precio_max?":numero,"precio_min?":numero}}
- get: {"action":"get","id":"uuid"}
- changeStatus: {"action":"changeStatus","id":"uuid","estado":"Disponible|Reservado|Cerrado|Descartado|Mantenimiento"}
- update: {"action":"update","id":"uuid","fields":{"precio?":numero,"estado?":"...","operacion?":"..."}}
- create: {"action":"create","data":{"nombre":"...","tipo":"Departamento|Casa|Local|Oficina|Terreno","operacion":"Venta|Alquiler","distrito":"...","precio":numero,"moneda":"PEN|USD","estado":"Disponible"}}
- delete: {"action":"delete","id":"uuid"}
- duplicate: {"action":"duplicate","id":"uuid"}
- summary: {"action":"summary"}
- unknown: {"action":"unknown"}

EJEMPLOS:
- "depas en venta en Miraflores" → {"action":"search","filters":{"tipo":"Departamento","operacion":"Venta","q":"Miraflores"}}
- "alquileres hasta 2000" → {"action":"search","filters":{"operacion":"Alquiler","precio_max":2000}}
- "info de ese" → {"action":"get","id":"<last>"}
- "ventas" → {"action":"search","filters":{"operacion":"Venta"}}
- "mostrar todo" → {"action":"search","filters":{}}

Mensaje: "${raw}"
Responde SOLO el JSON, sin markdown ni texto extra.`,
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
