"use client";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { getCopyShareStyles } from "@/styles/componentStyles";

export function CopyShareBtns({ text }: { text: string }) {
  const { t } = useTheme();
  const [copied, setCopied] = useState(false);
  const s = getCopyShareStyles(t);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ text });
    } else {
      copy();
    }
  };

  return (
    <div style={s.container}>
      <button onClick={copy} style={s.copyBtn}>
        {copied ? "Listo" : "Copiar"}
      </button>
      <button onClick={share} style={s.shareBtn}>
        Compartir
      </button>
    </div>
  );
}