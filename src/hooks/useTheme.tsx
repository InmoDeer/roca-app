"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { darkTheme, lightTheme } from "@/styles/theme";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("roca_theme");
      if (stored) setMode(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    localStorage.setItem("roca_theme", mode);
  }, [mode]);

  const toggle = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const t = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ t, mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);