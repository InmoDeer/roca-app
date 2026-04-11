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
          ✕
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
    background: "rgba(0,0,0,.92)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "100%",
    maxWidth: 480,
    padding: 16,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 16,
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 24,
    cursor: "pointer",
    zIndex: 10,
  },
  img: {
    width: "100%",
    maxHeight: "60vh",
    objectFit: "contain",
    borderRadius: 12,
    display: "block",
  },
  count: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 13,
    marginTop: 8,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
  },
  arrow: {
    background: "#333",
    border: "none",
    color: "#fff",
    borderRadius: "50%",
    width: 44,
    height: 44,
    fontSize: 24,
    cursor: "pointer",
  },
  thumbs: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    marginTop: 12,
    paddingBottom: 4,
  },
  thumb: {
    width: 60,
    height: 60,
    objectFit: "cover",
    borderRadius: 8,
    flexShrink: 0,
    cursor: "pointer",
  },
};
