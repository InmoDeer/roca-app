"use client";
import { useState, useEffect } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Gallery({ fotos, onClose, initialIndex = 0 }: any) {
  const { t, mode } = useTheme();
  const [idx, setIdx] = useState(initialIndex);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = fotos[idx];
    img.onload = () => setLoading(false);
  }, [idx, fotos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i: number) => (i - 1 + fotos.length) % fotos.length);
      if (e.key === "ArrowRight") setIdx((i: number) => (i + 1) % fotos.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fotos.length, onClose]);

  if (!fotos.length) return null;

  return (
    <div 
      style={{
        ...galleryStyles.overlay,
        opacity: visible ? 1 : 0,
      }} 
      onClick={onClose}
    >
      <VisuallyHidden.Root>
        <button autoFocus onClick={onClose}>Cerrar galería</button>
      </VisuallyHidden.Root>
      <button 
        onClick={onClose} 
        style={galleryStyles.closeBtn}
        aria-label="Cerrar galería"
      >
        <X size={20} strokeWidth={1.5} />
      </button>
      
      <div 
        style={{
          ...galleryStyles.box,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        <div style={galleryStyles.imgContainer}>
          {loading && (
            <div style={galleryStyles.loader}>
              <Loader2 size={32} strokeWidth={1.5} className="spin" />
            </div>
          )}
          <img
            src={fotos[idx]}
            alt=""
            style={{
              ...galleryStyles.img,
              opacity: loading ? 0 : 1,
            }}
            onLoad={() => setLoading(false)}
          />
        </div>

        <div style={galleryStyles.count}>
          {idx + 1} / {fotos.length}
        </div>

        {fotos.length > 1 && (
          <div style={galleryStyles.nav}>
            <button
              onClick={() => setIdx((i: number) => (i - 1 + fotos.length) % fotos.length)}
              style={galleryStyles.arrow}
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setIdx((i: number) => (i + 1) % fotos.length)}
              style={galleryStyles.arrow}
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        )}

        <div style={galleryStyles.thumbs}>
          {fotos.map((f: string, i: number) => (
            <img
              key={i}
              src={f}
              alt=""
              loading="lazy"
              onClick={() => setIdx(i)}
              style={{
                ...galleryStyles.thumb,
                outline:
                  i === idx ? `2px solid ${t.colors.primary}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const galleryStyles: any = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    backdropFilter: "blur(20px)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.3s ease",
  },
  box: {
    width: "100%",
    maxWidth: 500,
    padding: 20,
    position: "relative",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  },
  imgContainer: {
    width: "100%",
    maxHeight: "65vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    background: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    overflow: "hidden",
  },
  loader: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#d4af37",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#ffffff",
    fontSize: 22,
    cursor: "pointer",
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "65vh",
    objectFit: "contain",
    borderRadius: 16,
    display: "block",
    transition: "opacity 0.3s ease",
  },
  count: {
    textAlign: "center",
    color: "#666666",
    fontSize: 13,
    marginTop: 12,
    fontWeight: 500,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
  },
  arrow: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#ffffff",
    borderRadius: "50%",
    width: 48,
    height: 48,
    fontSize: 24,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  thumbs: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    marginTop: 16,
    paddingBottom: 8,
    justifyContent: "center",
  },
  thumb: {
    width: 60,
    height: 60,
    objectFit: "cover",
    borderRadius: 10,
    flexShrink: 0,
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
};