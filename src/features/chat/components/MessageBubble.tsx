import type { Property } from "@/core/entities/property";
import type { ChatMessage } from "@/hooks/useChat";
import { FormattedText } from "./FormattedText";
import { PropertyResultCard } from "./PropertyResultCard";
import { primaryGradient } from "@/styles/componentStyles";
import { Sparkles } from "lucide-react";

export function MessageBubble({
  msg,
  t,
  mode,
  onSelectProperty,
}: {
  msg: ChatMessage;
  t: any;
  mode: string;
  onSelectProperty: (p: Property) => void;
}) {
  const isUser = msg.role === "user";
  const isLoading = msg.status === "loading";
  const isError = msg.status === "error";

  const bubbleStyle: React.CSSProperties = {
    maxWidth: "82%",
    padding: "10px 14px",
    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    fontSize: 14,
    lineHeight: 1.55,
    wordBreak: "break-word",
    alignSelf: isUser ? "flex-end" : "flex-start",
    background: isUser
      ? primaryGradient
      : isError
        ? mode === "dark" ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)"
        : mode === "dark" ? "#1a1a1a" : "#ffffff",
    color: isUser ? "#0a0a0a" : isError ? t.colors.danger : t.colors.text,
    border: isUser ? "none" : `1px solid ${isError ? t.colors.danger + "44" : t.colors.border}`,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div style={bubbleStyle}>
        {isLoading ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: t.colors.textMuted,
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        ) : (
          <FormattedText text={msg.text} color={isUser ? "#0a0a0a" : t.colors.text} />
        )}
      </div>

      {msg.results && msg.results.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            width: "100%",
            maxWidth: 320,
          }}
        >
          {msg.results.slice(0, 5).map((p) => (
            <PropertyResultCard
              key={p.id}
              property={p}
              t={t}
              mode={mode}
              onClick={() => onSelectProperty(p)}
            />
          ))}
          {msg.results.length > 5 && (
            <div style={{ fontSize: 12, color: t.colors.textMuted, paddingLeft: 4 }}>
              +{msg.results.length - 5} más
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: t.colors.textMuted }}>
          {msg.timestamp.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {msg.usedAI && (
          <span
            style={{
              fontSize: 10,
              color: t.colors.primary,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Sparkles size={9} strokeWidth={2} /> IA
          </span>
        )}
      </div>
    </div>
  );
}
