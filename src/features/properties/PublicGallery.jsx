import { Gallery } from "../../components/ui/Gallery";

export function PublicGallery({ property, onClose }) {
  const fotos = property?.fotos_urls || [];

  return (
    <div style={publicStyles.container}>
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
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#666666",
    fontSize: 16,
  },
};