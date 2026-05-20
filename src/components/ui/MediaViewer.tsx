"use client";
import { useState, useEffect } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const getYoutubeEmbed = (url: string) => {
  if (!url) return "";
  const id =
    url.includes("youtu.be/")
      ? url.split("youtu.be/")[1]
      : url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${id}`;
};

export function MediaViewer({
  fotos = [],
  videoUrl,
  tour360Url,
  initialTab = "fotos",
  onClose,
  initialIndex = 0,
}: any) {
  const { t, mode } = useTheme();
  const [idx, setIdx] = useState(initialIndex);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const availableTabs = [
    fotos.length > 0 ? "fotos" : null,
    videoUrl ? "video" : null,
    tour360Url ? "tour" : null,
  ].filter(Boolean);

  const [tab, setTab] = useState(
    availableTabs.includes(initialTab)
      ? initialTab
      : availableTabs[0]
  );

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
      if (tab !== "fotos") return;
      if (e.key === "ArrowLeft") setIdx((i: number) => (i - 1 + fotos.length) % fotos.length);
      if (e.key === "ArrowRight") setIdx((i: number) => (i + 1) % fotos.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fotos.length, onClose, tab]);

  return (
    <div
      style={{
        ...mediaStyles.overlay,
        opacity: visible ? 1 : 0,
      }}
      onClick={onClose}
    >
      <VisuallyHidden.Root>
        <button autoFocus onClick={onClose}>Cerrar visor multimedia</button>
      </VisuallyHidden.Root>
      <button
        onClick={onClose}
        style={mediaStyles.closeBtn}
        aria-label="Cerrar"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      <div
        style={{
          ...mediaStyles.box,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {availableTabs.length > 1 && (
          <div style={mediaStyles.tabs}>
            {availableTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  ...mediaStyles.tab,
                  ...(tab === t ? mediaStyles.tabActive : {}),
                }}
              >
                {t === "fotos" && "Fotos"}
                {t === "video" && "Video"}
                {t === "tour" && "Tour 360"}
              </button>
            ))}
          </div>
        )}

        {tab === "fotos" && (
          <>
            <div style={mediaStyles.imgContainer}>
              {loading && (
                <div style={mediaStyles.loader}>
                  <Loader2 size={32} strokeWidth={1.5} className="spin" />
                </div>
              )}
              <img
                src={fotos[idx]}
                alt=""
                style={{
                  ...mediaStyles.img,
                  opacity: loading ? 0 : 1,
                }}
                onLoad={() => setLoading(false)}
              />
            </div>

            <div style={mediaStyles.count}>
              {idx + 1} / {fotos.length}
            </div>

            {fotos.length > 1 && (
              <div style={mediaStyles.nav}>
                <button
                  onClick={() => setIdx((i: number) => (i - 1 + fotos.length) % fotos.length)}
                  style={mediaStyles.arrow}
                >
                  <ChevronLeft size={24} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setIdx((i: number) => (i + 1) % fotos.length)}
                  style={mediaStyles.arrow}
                >
                  <ChevronRight size={24} strokeWidth={1.5} />
                </button>
              </div>
            )}

            <div style={mediaStyles.thumbs}>
              {fotos.map((f: string, i: number) => (
                <img
                  key={i}
                  src={f}
                  alt=""
                  loading="lazy"
                  onClick={() => setIdx(i)}
                  style={{
                    ...mediaStyles.thumb,
                    outline:
                      i === idx ? `2px solid ${t.colors.primary}` : "none",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {tab === "video" && videoUrl && (
          <iframe
            src={getYoutubeEmbed(videoUrl)}
            allowFullScreen
            style={{
              width: "100%",
              height: "65vh",
              border: "none",
              borderRadius: 16,
            }}
          />
        )}

        {tab === "tour" && tour360Url && (
          <iframe
            src={tour360Url}
            allowFullScreen
            style={{
              width: "100%",
              height: "65vh",
              border: "none",
              borderRadius: 16,
              background: "#000",
            }}
          />
        )}
      </div>
    </div>
  );
}

const mediaStyles: any = {
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
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  tab: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
  },
  tabActive: {
    background: "#d4af37",
    color: "#000",
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
