"use client";
import { useEffect, useState } from "react";
import { fetchPropertyById } from "@/lib/api";
import { buildOutputs } from "@/lib/messageFormatter";
import { Gallery } from "@/components/ui/Gallery";

export default function PublicPropertyPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyById(params.id).then((data) => {
      setProperty(data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#000", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#fff"
      }}>
        Cargando...
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#000", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        color: "#fff"
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
        <p style={{ marginBottom: 16 }}>Propiedad no encontrada</p>
        <a href="/" style={{ color: "#d4af37", textDecoration: "underline" }}>Volver a la app</a>
      </div>
    );
  }

  const out = buildOutputs(property);
  const fotos = out.fotos;

  if (fotos.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#000", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        color: "#666"
      }}>
        <p>No hay fotos disponibles</p>
        <a href="/" style={{ color: "#d4af37", marginTop: 20 }}>Volver</a>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#000", 
      position: "relative" 
    }}>
      <Gallery fotos={fotos} onClose={() => window.close()} />
    </div>
  );
}