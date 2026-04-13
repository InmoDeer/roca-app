import { useState } from "react";

/**
 * Gallery component for viewing property photos with navigation
 */
export function Gallery({ fotos, onClose }) {
  const [idx, setIdx] = useState(0);

  if (!fotos.length) return null;

  return (
    <div style={galleryStyles.overlay} onClick={onClose}>
      <div style={galleryStyles.box} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={galleryStyles.closeBtn}>
          ✕ Cerrar
        </button>
        <img
          src={fotos[idx]}
          alt=""
          style={galleryStyles.img}
        />
        <div style={galleryStyles.count}>
          {idx + 1} / {fotos.length}
        </div>

        {fotos.length > 1 && (
          <div style={galleryStyles.nav}>
            <button
              onClick={() => setIdx((i) => (i - 1 + fotos.length) % fotos.length)}
              style={galleryStyles.arrow}
            >
              ‹
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % fotos.length)}
              style={galleryStyles.arrow}
            >
              ›
            </button>
          </div>
        )}

        <div style={galleryStyles.thumbs}>
          {fotos.map((f, i) => (
            <img
              key={i}
              src={f}
              alt=""
              onClick={() => setIdx(i)}
              style={{
                ...galleryStyles.thumb,
                outline:
                  i === idx ? "2px solid #e8ff4f" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const galleryStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    backdropFilter: "blur(20px)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "100%",
    maxWidth: 500,
    padding: 20,
    position: "relative",
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
    width: "100%",
    maxHeight: "65vh",
    objectFit: "contain",
    borderRadius: 16,
    display: "block",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
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
