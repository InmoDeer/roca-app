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
    background: "#000000",
    position: "relative",
  },
  closeBtn: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 201,
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.3s ease",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#666666",
    fontSize: 16,
  },
};