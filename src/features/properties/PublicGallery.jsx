import { useState } from "react";
import { Gallery } from "../../components/ui/Gallery";

export function PublicGallery({ property, onClose }) {
  const fotos = property?.fotos_urls || [];

  return (
    <div style={publicStyles.container}>
      <button onClick={onClose} style={publicStyles.closeBtn}>
        ✕ Cerrar
      </button>
      
      {fotos.length > 0 ? (
        <Gallery 
          fotos={fotos} 
          onClose={onClose}
        />
      ) : (
        <div style={publicStyles.empty}>
          No hay fotos disponibles
        </div>
      )}
    </div>
  );
}

const publicStyles = {
  container: {
    minHeight: "100vh",
    background: "#000",
    position: "relative",
  },
  closeBtn: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 201,
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#fff",
    fontSize: 16,
  },
};