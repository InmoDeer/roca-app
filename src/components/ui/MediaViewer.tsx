"use client";
import { useState, useEffect, useRef } from "react";
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
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchPrevX = useRef(0);
  const touchPrevY = useRef(0);
  const isTouching = useRef(false);
  const lastTapTime = useRef(0);
  const lastTapX = useRef(0);
  const lastTapY = useRef(0);
  const initialPinchDist = useRef(0);
  const initialZoomScale = useRef(1);

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
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = fotos[idx];
    img.onload = () => setLoading(false);
  }, [idx, fotos]);

  useEffect(() => {
    setZoom({ scale: 1, x: 0, y: 0 });
    setSwipeOffset(0);
  }, [idx]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (tab !== "fotos") return;

    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartX.current = t.clientX;
      touchStartY.current = t.clientY;
      touchPrevX.current = t.clientX;
      touchPrevY.current = t.clientY;
      isTouching.current = true;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDist.current = Math.sqrt(dx * dx + dy * dy);
      initialZoomScale.current = zoom.scale;
      isTouching.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (tab !== "fotos") return;

    if (e.touches.length === 1 && zoom.scale > 1) {
      const t = e.touches[0];
      const deltaX = (t.clientX - touchPrevX.current) / zoom.scale;
      const deltaY = (t.clientY - touchPrevY.current) / zoom.scale;
      setZoom((z) => ({ ...z, x: z.x + deltaX, y: z.y + deltaY }));
      touchPrevX.current = t.clientX;
      touchPrevY.current = t.clientY;
      isTouching.current = false;
    } else if (e.touches.length === 1 && zoom.scale === 1) {
      touchPrevX.current = e.touches[0].clientX;
      setSwipeOffset(e.touches[0].clientX - touchStartX.current);
      isTouching.current = true;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = initialPinchDist.current > 0 ? dist / initialPinchDist.current : 1;
      const newScale = Math.max(1, Math.min(4, initialZoomScale.current * ratio));
      setZoom((z) => ({ ...z, scale: newScale }));
      isTouching.current = false;
    }
  };

  const handleTouchEnd = () => {
    if (tab !== "fotos") {
      isTouching.current = false;
      return;
    }

    if (zoom.scale === 1) {
      const deltaX = touchPrevX.current - touchStartX.current;
      const deltaY = Math.abs(touchPrevY.current - touchStartY.current);

      if (isTouching.current && Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        if (deltaX < -50) {
          setIdx((i: number) => (i + 1) % fotos.length);
        } else {
          setIdx((i: number) => (i - 1 + fotos.length) % fotos.length);
        }
      } else if (isTouching.current && Math.abs(deltaX) < 10 && Math.abs(touchPrevY.current - touchStartY.current) < 10) {
        const now = Date.now();
        const timeSince = now - lastTapTime.current;
        if (timeSince < 300 && timeSince > 0) {
          if (zoom.scale > 1) {
            setZoom({ scale: 1, x: 0, y: 0 });
          } else {
            setZoom({ scale: 2, x: 0, y: 0 });
          }
          lastTapTime.current = 0;
        } else {
          lastTapTime.current = now;
        }
      } else {
        lastTapTime.current = 0;
      }
    }

    setSwipeOffset(0);
    isTouching.current = false;
  };

  const imgTransform = zoom.scale > 1
    ? `scale(${zoom.scale}) translate(${zoom.x}px, ${zoom.y}px)`
    : swipeOffset !== 0
      ? `translateX(${swipeOffset}px)`
      : "none";

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
            <div
              style={{ ...mediaStyles.imgContainer, maxHeight: zoom.scale > 1 ? "none" : "70vh" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {loading && (
                <div style={mediaStyles.loader}>
                  <Loader2 size={32} strokeWidth={1.5} className="spin" />
                </div>
              )}
              <img
                src={fotos[idx]}
                alt=""
                draggable={false}
                style={{
                  ...mediaStyles.img,
                  opacity: loading ? 0 : 1,
                  transform: imgTransform,
                  cursor: zoom.scale > 1 ? "grab" : "default",
                }}
                onLoad={() => setLoading(false)}
              />
            </div>

            {zoom.scale === 1 && (
              <>
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
                      draggable={false}
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
          </>
        )}

        {tab === "video" && videoUrl && (
          <div style={mediaStyles.iframeWrap}>
            <iframe
              src={getYoutubeEmbed(videoUrl)}
              allowFullScreen
              style={mediaStyles.iframe}
              title="Video"
            />
          </div>
        )}

        {tab === "tour" && tour360Url && (
          <div style={mediaStyles.iframeWrap}>
            <iframe
              src={tour360Url}
              allowFullScreen
              style={{ ...mediaStyles.iframe, background: "#000" }}
              title="Tour 360"
            />
          </div>
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
    touchAction: "none",
    overscrollBehavior: "none",
    WebkitOverflowScrolling: "none",
    height: "100dvh",
  },
  box: {
    width: "100%",
    maxWidth: 500,
    padding: 20,
    position: "relative",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    maxHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
    flexShrink: 0,
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
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    background: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    overflow: "hidden",
    flex: 1,
  },
  iframeWrap: {
    width: "100%",
    minHeight: 0,
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  iframe: {
    width: "100%",
    height: "100%",
    minHeight: "60vh",
    border: "none",
    borderRadius: 16,
  },
  loader: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#d4af37",
  },
  closeBtn: {
    position: "fixed",
    top: 16,
    right: 16,
    background: "rgba(0,0,0,0.5)",
    border: "none",
    color: "#ffffff",
    fontSize: 22,
    cursor: "pointer",
    zIndex: 210,
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain",
    borderRadius: 16,
    display: "block",
    transition: "opacity 0.3s ease",
    userSelect: "none",
    WebkitUserSelect: "none",
    willChange: "transform",
  },
  count: {
    textAlign: "center",
    color: "#666666",
    fontSize: 13,
    marginTop: 12,
    fontWeight: 500,
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    flexShrink: 0,
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
    flexShrink: 0,
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
