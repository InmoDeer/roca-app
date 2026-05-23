"use client";
import { useEffect, useState } from "react";
import { getProperty } from "@/core/actions/properties";
import { buildOutputs } from "@/lib/messageFormatter";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { Camera } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function PublicPropertyPage({ params }: { params: { id: string } }) {
  const { t } = useTheme();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperty(params.id).then((result) => {
      if (result.ok) setProperty(result.data);
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

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: t.colors.bg, 
      position: "relative" 
    }}>
      <MediaViewer
        fotos={fotos}
        videoUrl={property.video_url}
        tour360Url={property.tour360_url}
        onClose={() => window.close()}
      />
    </div>
  );
}