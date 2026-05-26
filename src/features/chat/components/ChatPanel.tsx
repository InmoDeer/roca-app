"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Property } from "@/core/entities/property";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/components/ui/ToastProvider";
import { getChatStyles } from "@/styles/componentStyles";
import { useChat, type UseChatOptions } from "@/hooks/useChat";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { MessageBubble } from "./MessageBubble";
import { HelpCommands } from "./HelpCommands";
import { ChatInput } from "./ChatInput";
import { Bot, X, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

interface ChatPanelProps {
  properties: Property[];
  onSelectProperty: (p: Property) => void;
  onRefresh: UseChatOptions["onRefresh"];
  onClose: () => void;
}

export function ChatPanel({ properties, onSelectProperty, onRefresh, onClose }: ChatPanelProps) {
  const { t, mode } = useTheme();
  const toast = useToast();
  const s = getChatStyles(t, mode);

  const [input, setInput] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { messages, loading, sendMessage } = useChat({
    properties,
    enableAI: useAI,
    onRefresh,
    toast,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => {
    sendMessage(input);
    setInput("");
    setShowHelp(false);
  }, [input, sendMessage]);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInput(transcript);
  }, []);

  const voice = useVoiceRecognition(handleVoiceResult);

  const toggleVoice = useCallback(() => {
    if (!voice.supported) {
      toast.error("Tu navegador no soporta dictado por voz");
      return;
    }
    if (voice.listening) voice.stopListening();
    else voice.startListening();
  }, [voice.supported, voice.listening, voice.startListening, voice.stopListening, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!showHelp) return;
    const handler = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setShowHelp(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHelp]);

  return (
    <div style={s.overlay}>
      <div style={s.panel}>
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.headerIcon}>
              <Bot size={18} strokeWidth={1.5} color={t.colors.primary} />
            </div>
            <div>
              <div style={s.headerTitle}>Asistente ROCA</div>
              <div style={s.headerSub}>{properties.length} inmuebles cargados</div>
            </div>
          </div>
          <div style={s.headerActions}>
            <button
              style={s.aiToggle}
              onClick={() => setUseAI((v) => !v)}
              title={
                useAI
                  ? "IA activa — solo si el comando no se entiende por regex"
                  : "Solo regex — comandos estructurados (recomendado)"
              }
            >
              {useAI ? (
                <>
                  <ToggleRight size={16} color={t.colors.primary} />
                  <span style={{ color: t.colors.primary }}>IA fallback</span>
                </>
              ) : (
                <>
                  <ToggleLeft size={16} color={t.colors.textMuted} />
                  <span style={{ color: t.colors.textMuted }}>Regex</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              style={s.closeBtn}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div style={s.messages}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              t={t}
              mode={mode}
              onSelectProperty={onSelectProperty}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showHelp && (
          <div ref={helpRef}>
            <HelpCommands t={t} mode={mode} onSelectExample={(ex) => setInput(ex)} />
          </div>
        )}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          loading={loading}
          listening={voice.listening}
          onToggleVoice={toggleVoice}
          onToggleHelp={() => setShowHelp((v) => !v)}
          showHelp={showHelp}
          inputRef={inputRef}
          t={t}
          mode={mode}
        />

        {useAI && (
          <div style={s.aiNote}>
            <Sparkles size={11} strokeWidth={1.5} /> IA activa — comandos no reconocidos se
            envían a Claude
          </div>
        )}
      </div>
    </div>
  );
}
