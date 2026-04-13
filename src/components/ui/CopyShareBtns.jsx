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
    gap: 10,
  },
  copyBtn: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)",
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
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
};