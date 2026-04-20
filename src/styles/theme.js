// Theme centralizado para ROCA App
// Colores, espaciados y radios usados en toda la app

export const darkTheme = {
  colors: {
    primary: "#d4af37",
    primaryDark: "#b8962e",
    bg: "#0a0a0a",
    bgSecondary: "#121212",
    bgCard: "#1a1a1a",
    text: "#ffffff",
    textSecondary: "#cccccc",
    textMuted: "#666666",
    border: "rgba(255,255,255,0.08)",
    borderLight: "rgba(255,255,255,0.1)",
    danger: "#ef4444",
    success: "#22c55e",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  fonts: { family: "'Outfit', sans-serif" },
};

export const lightTheme = {
  colors: {
    primary: "#b8962e",
    primaryDark: "#a68520",
    bg: "#ffffff",
    bgSecondary: "#f5f5f5",
    bgCard: "#f4f4f0",
    text: "#1a1a1a",
    textSecondary: "#555555",
    textMuted: "#888888",
    border: "rgba(0,0,0,0.08)",
    borderLight: "rgba(0,0,0,0.12)",
    danger: "#dc2626",
    success: "#16a34a",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  fonts: { family: "'Outfit', sans-serif" },
};

export const theme = darkTheme;
export default theme;