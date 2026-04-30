import { useTheme } from "../../hooks/useTheme.jsx";

/**
 * Skeleton — shimmer loader con variantes
 * 
 * @param {string} variant - "text" | "title" | "avatar" | "card" | "circle"
 * @param {number} count - cantidad de skeletons (para listas)
 * @param {object} style - estilos adicionales
 */
export function Skeleton({ variant = "text", count = 1, style = {} }) {
  const { mode } = useTheme();

  const baseStyle = {
    background: mode === "dark"
      ? "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
      : "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease infinite",
    borderRadius: 8,
  };

  const variantStyles = {
    text: { height: 14, width: "100%", marginBottom: 8 },
    title: { height: 24, width: "60%", marginBottom: 12 },
    avatar: { width: 48, height: 48, borderRadius: "50%" },
    card: { height: 180, width: "100%", borderRadius: 12 },
    circle: { width: 32, height: 32, borderRadius: "50%" },
  };

  const finalStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...style,
  };

  if (count > 1) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={finalStyle} />
        ))}
      </div>
    );
  }

  return <div style={finalStyle} />;
}

/**
 * SkeletonText — líneas de texto simuladas
 * 
 * @param {number} lines - cantidad de líneas
 * @param {boolean} hasTitle - incluir título
 */
export function SkeletonText({ lines = 3, hasTitle = false }) {
  const { mode } = useTheme();

  const baseStyle = {
    background: mode === "dark"
      ? "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
      : "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease infinite",
    borderRadius: 6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {hasTitle && (
        <div style={{ ...baseStyle, height: 24, width: "50%", marginBottom: 4 }} />
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            ...baseStyle,
            height: 14,
            width: i === lines - 1 ? "70%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard — tarjeta simulada para propiedades
 */
export function SkeletonCard() {
  const { mode } = useTheme();

  const baseStyle = {
    background: mode === "dark"
      ? "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)"
      : "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease infinite",
  };

  return (
    <div style={{
      background: mode === "dark" ? "#1a1a1a" : "#ffffff",
      borderRadius: 16,
      border: `1px solid ${mode === "dark" ? "#333333" : "#e0e0e0"}`,
      overflow: "hidden",
    }}>
      <div style={{ ...baseStyle, height: 180 }} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...baseStyle, height: 20, width: "70%", borderRadius: 6 }} />
        <div style={{ ...baseStyle, height: 14, width: "40%", borderRadius: 6 }} />
        <div style={{ ...baseStyle, height: 18, width: "30%", borderRadius: 6, marginTop: 4 }} />
      </div>
    </div>
  );
}

/**
 * SkeletonList — lista de tarjetas
 * 
 * @param {number} count - cantidad de tarjetas
 */
export function SkeletonList({ count = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}