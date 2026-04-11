import { useState } from "react";

/**
 * Button component for copying/sharing text (for WhatsApp messages)
 */
export function CopyShareBtns({ text }) {
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

  return (
    <div style={copyShareStyles.container}>
      <button onClick={copy} style={copyShareStyles.copyBtn}>
        {copied ? "✅ Copiado" : "📋 Copiar"}
      </button>
      <button onClick={share} style={copyShareStyles.shareBtn}>
        📤 Compartir
      </button>
    </div>
  );
}

const copyShareStyles = {
  container: {
    display: "flex",
    gap: 8,
  },
  copyBtn: {
    flex: 1,
    padding: "10px",
    background: "#e8ff4f",
    color: "#1a1a1a",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  shareBtn: {
    flex: 1,
    padding: "10px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
};
