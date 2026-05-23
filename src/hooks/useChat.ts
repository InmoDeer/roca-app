"use client";

import { useState, useRef, useCallback } from "react";
import type { Property } from "@/core/entities/property";
import type { PropertyIntent } from "@/core/actions/types";
import { processMessage } from "@/core/chat/chatEngine";
import { createParseContext } from "@/core/chat/chatContext";

export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "ok" | "error" | "loading";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  status?: MessageStatus;
  intent?: PropertyIntent;
  results?: Property[];
  timestamp: Date;
  usedAI?: boolean;
}

export interface UseChatOptions {
  properties: Property[];
  enableAI?: boolean;
  onRefresh?: () => void;
  toast?: { success: (msg: string) => void; error: (msg: string) => void };
}

export function useChat(options: UseChatOptions) {
  const { properties, enableAI, onRefresh, toast } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hola. Puedo ayudarte a buscar, actualizar y gestionar tus ${properties.length} inmuebles. Escribe lo que necesitás o dictá por voz.`,
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const lastPropertyId = useRef<string | undefined>(undefined);
  const lastResults = useRef<Property[]>([]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };

      const loadingId = `assistant-${Date.now()}`;
      const loadingMsg: ChatMessage = {
        id: loadingId,
        role: "assistant",
        text: "",
        status: "loading",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setLoading(true);

      try {
        const context = createParseContext(properties, lastPropertyId.current, lastResults.current);
        const engineResult = await processMessage(trimmed, context, enableAI);

        if (engineResult.results) {
          lastResults.current = engineResult.results;
          if (engineResult.results.length === 1) {
            lastPropertyId.current = engineResult.results[0].id;
          }
        }

        if (engineResult.refreshNeeded) {
          onRefresh?.();
        }

        if (engineResult.toast) {
          if (engineResult.toast.type === "success") {
            toast?.success(engineResult.toast.message);
          } else {
            toast?.error(engineResult.toast.message);
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? {
                  ...m,
                  text: engineResult.text,
                  status: engineResult.text.startsWith("❌") ? "error" : "ok",
                  intent: engineResult.intent,
                  results: engineResult.results,
                  usedAI: engineResult.usedAI,
                }
              : m
          )
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, text: "Ocurrió un error inesperado.", status: "error" }
              : m
          )
        );
        toast?.error("Error al procesar el comando");
      } finally {
        setLoading(false);
      }
    },
    [loading, properties, enableAI, onRefresh, toast]
  );

  return { messages, loading, sendMessage };
}
