import { useState } from "react";
import { useTheme } from "../../hooks/useTheme.jsx";

/**
 * Button component for copying/sharing text (for WhatsApp messages)
 */
export function CopyShareBtns({ text }) {
  const { t, mode } = useTheme();
  const [copied, setCopied] = useState(false);

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

  const copyShareStyles = {
    container: {
      display: "flex",
      gap: 10,
    },
    copyBtn: {
      flex: 1,
      padding: "12px",
      background: t.colors.primary,
      color: "#0a0a0a",
      border: "none",
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
    },
    shareBtn: {
      flex: 1,
      padding: "12px",
      background: t.colors.bgSecondary,
      color: t.colors.text,
      border: `1px solid ${t.colors.border}`,
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
    },
    landingBtn: {
      padding: "12px",
      background: "transparent",
      color: t.colors.primary,
      border: `1px solid ${t.colors.primary}`,
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
    },
  };

  return (
    <div style={copyShareStyles.container}>
      <button onClick={copy} style={copyShareStyles.copyBtn}>
        {copied ? "Listo" : "Copiar"}
      </button>
      <button onClick={share} style={copyShareStyles.shareBtn}>
        Compartir
      </button>
    </div>
  );
}

