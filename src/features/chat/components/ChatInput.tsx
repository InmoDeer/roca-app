import { Sparkles, Mic, MicOff, Send, Loader2 } from "lucide-react";
import { getChatStyles } from "@/styles/componentStyles";

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
  const s = getChatStyles(t, mode);
  const enabled = !!value.trim() && !loading;

  return (
    <div style={s.inputWrap}>
      <button
        onClick={onToggleHelp}
        style={s.helpBtn}
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
        style={s.input}
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
        style={s.voiceBtn(listening)}
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
        disabled={!enabled}
        style={s.sendBtn(enabled)}
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
