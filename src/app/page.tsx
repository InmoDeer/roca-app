"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Property } from "@/core/entities/property";
import { getProperty } from "@/core/actions/properties";
import { useTheme } from "@/hooks/useTheme";
import { getAppStyles } from "@/styles/componentStyles";
import { MediaViewer } from "@/components/ui/MediaViewer";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const galleryId = searchParams.get("id");
  const { t: theme, mode } = useTheme();
  const S = getAppStyles(theme, mode);

  const [publicProperty, setPublicProperty] = useState<Property | null>(null);
  const [publicLoading, setPublicLoading] = useState(!!galleryId);

  useEffect(() => {
    if (!galleryId) {
      router.replace("/propiedades");
      return;
    }
    setPublicLoading(true);
    getProperty(galleryId).then((result) => {
      if (result.ok) setPublicProperty(result.data);
      setPublicLoading(false);
    });
  }, [galleryId, router]);

  if (!galleryId) {
    return (
      <div style={S.loadingWrap}>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  if (publicLoading) {
    return <div style={S.loadingWrap}>Cargando...</div>;
  }

  if (publicProperty) {
    return (
      <div style={{ background: theme.colors.bg, minHeight: "100vh", position: "relative" }}>
        <MediaViewer
          fotos={Array.isArray(publicProperty.fotos_urls) ? publicProperty.fotos_urls : []}
          videoUrl={publicProperty.video_url}
          tour360Url={publicProperty.tour360_url}
          onClose={() => {
            router.push("/propiedades");
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...S.loadingWrap,
        background: theme.colors.bg,
        color: theme.colors.text,
      }}
    >
      Propiedad no encontrada
    </div>
  );
}

export default function HomePage() {
  const { t, mode } = useTheme();
  const S = getAppStyles(t, mode);

  return (
    <Suspense
      fallback={
        <div style={S.loadingWrap}>
          <p>Cargando...</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
