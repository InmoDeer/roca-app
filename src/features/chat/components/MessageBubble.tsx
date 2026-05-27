import type { Property } from "@/core/entities/property";
import type { ChatMessage } from "@/hooks/useChat";
import { FormattedText } from "./FormattedText";
import { PropertyResultCard } from "./PropertyResultCard";
import { getMessageBubbleStyles } from "@/styles/componentStyles";
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
  const s = getMessageBubbleStyles(t, mode, isUser, isError);
  const align = isUser ? "flex-end" : "flex-start";
  const br = isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px";

  return (
    <div style={s.container(align)}>
      <div style={s.bubble(align, br)}>
        {isLoading ? (
          <div style={s.loadingDots}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...s.dot,
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
        <div style={s.resultsContainer}>
          {msg.results.slice(0, 5).map((p) => (
            <PropertyResultCard
              key={p.id}
              property={p}
              t={t}
              onClick={() => onSelectProperty(p)}
            />
          ))}
          {msg.results.length > 5 && (
            <div style={s.moreResults}>
              +{msg.results.length - 5} más
            </div>
          )}
        </div>
      )}

      <div style={s.meta}>
        <span style={s.timestamp}>
          {msg.timestamp.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {msg.usedAI && (
          <span style={s.aiBadge}>
            <Sparkles size={9} strokeWidth={2} /> IA
          </span>
        )}
      </div>
    </div>
  );
}
