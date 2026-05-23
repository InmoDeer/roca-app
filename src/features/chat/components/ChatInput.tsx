import { useRef } from "react";
import { Sparkles, Mic, MicOff, Send, Loader2 } from "lucide-react";
import { primaryGradient } from "@/styles/componentStyles";

export function ChatInput({
  value,
  onChange,
  onSend,
  loading,
  listening,
  onToggleVoice,
  onToggleHelp,
  showHelp,
  inputRef,
  t,
  mode,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  listening: boolean;
  onToggleVoice: () => void;
  onToggleHelp: () => void;
  showHelp: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  t: any;
  mode: string;
}) {
  const isDark = mode === "dark";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderTop: `1px solid ${t.colors.border}`,
        background: isDark ? "#0a0a0a" : "#ececec",
        flexShrink: 0,
      }}
    >
      <button
        onClick={onToggleHelp}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 6,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
        title="Ver comandos"
      >
        <Sparkles
          size={18}
          strokeWidth={1.5}
          color={showHelp ? t.colors.primary : t.colors.textMuted}
        />
      </button>

      <input
        ref={inputRef}
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: 12,
          border: `1px solid ${t.colors.border}`,
          background: isDark ? "#1a1a1a" : "#ffffff",
          color: t.colors.text,
          fontSize: 14,
          outline: "none",
          fontFamily: t.fonts.family,
        }}
        placeholder={listening ? "Escuchando..." : "Escribe un comando..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={loading || listening}
      />

      <button
        onClick={onToggleVoice}
        style={{
          background: listening ? "rgba(239,68,68,0.1)" : "none",
          border: "none",
          cursor: "pointer",
          padding: 6,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transition: "all 0.15s ease",
        }}
        title={listening ? "Detener dictado" : "Dictar por voz"}
      >
        {listening ? (
          <MicOff size={18} strokeWidth={1.5} color={t.colors.danger} />
        ) : (
          <Mic size={18} strokeWidth={1.5} color={t.colors.textMuted} />
        )}
      </button>

      <button
        onClick={onSend}
        disabled={!value.trim() || loading}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          border: "none",
          cursor: value.trim() && !loading ? "pointer" : "default",
          background: value.trim() && !loading ? primaryGradient : t.colors.border,
          color: value.trim() && !loading ? "#0a0a0a" : t.colors.textMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s ease",
        }}
      >
        {loading ? (
          <Loader2
            size={18}
            strokeWidth={1.5}
            style={{ animation: "spin 0.8s linear infinite" }}
          />
        ) : (
          <Send size={18} strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
