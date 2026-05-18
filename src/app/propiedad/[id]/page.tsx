"use client";
import { useEffect, useState } from "react";
import { fetchPropertyById } from "@/lib/api";
import { buildOutputs } from "@/lib/messageFormatter";
import { Gallery } from "@/components/ui/Gallery";
import { Camera } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function PublicPropertyPage({ params }: { params: { id: string } }) {
  const { t } = useTheme();
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
        background: t.colors.bg, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: t.colors.text
      }}>
        Cargando...
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: t.colors.bg, 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        color: t.colors.text
      }}>
        <Camera size={48} strokeWidth={1} style={{ marginBottom: 16 }} />
        <p style={{ marginBottom: 16 }}>Propiedad no encontrada</p>
        <a href="/" style={{ color: t.colors.primary, textDecoration: "underline" }}>Volver a la app</a>
      </div>
    );
  }

  const out = buildOutputs(property);
  const fotos = out.fotos;

  if (fotos.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: t.colors.bg, 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        color: t.colors.textMuted
      }}>
        <p>No hay fotos disponibles</p>
        <a href="/" style={{ color: t.colors.primary, marginTop: 20 }}>Volver</a>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: t.colors.bg, 
      position: "relative" 
    }}>
      <Gallery fotos={fotos} onClose={() => window.close()} />
    </div>
  );
}