// Theme centralizado para ROCA App
// Colores, espaciados y radios usados en toda la app

export const darkTheme = {
  colors: {
    primary: "#d4af37",
    bg: "#0a0a0a",
    bgSecondary: "#1a1a1a",
    bgCard: "#1a1a1a",
    text: "#ffffff",
    textSecondary: "#cccccc",
    textMuted: "#888888",
    border: "#333333",
    danger: "#ef4444",
    success: "#22c55e",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  fonts: { family: "'Outfit', sans-serif" },
};

export const lightTheme = {
  colors: {
    primary: "#d4af37",
    bg: "#ffffff",
    bgSecondary: "#f5f5f5",
    bgCard: "#ffffff",
    text: "#1a1a1a",
    textSecondary: "#666666",
    textMuted: "#888888",
    border: "#e0e0e0",
    danger: "#dc2626",
    success: "#16a34a",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  fonts: { family: "'Outfit', sans-serif" },
};

export const theme = darkTheme;
export default theme;