import { useTheme } from "../../hooks/useTheme";
import { Gallery } from "../../components/ui/Gallery";

export function PublicGallery({ property, onClose }) {
  const { t } = useTheme();
  const fotos = property?.fotos_urls ?? []; // <-- Acceso seguro (optional chaining + nullish coalescing)

  return (
    <div style={{
      minHeight: "100vh",
      background: t.colors.bg,
      position: "relative",
    }}>
      {fotos.length > 0 ? (
        <Gallery 
          fotos={fotos} 
          onClose={onClose}
        />
      ) : (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: t.colors.textMuted,
          fontSize: 16,
        }}>
          No hay fotos disponibles
        </div>
      )}
    </div>
  );
}