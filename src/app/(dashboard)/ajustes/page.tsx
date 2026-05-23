"use client";

import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardStyles, getProfileMenuStyles } from "@/styles/componentStyles";
import { Sun, Moon, LogOut } from "lucide-react";

export default function AjustesPage() {
  const { t, mode, toggle: cycleTheme } = useTheme();
  const { user, logout } = useAuth();
  const ds = getDashboardStyles(t, mode);
  const ps = getProfileMenuStyles(t);

  return (
    <div style={{ padding: "24px 20px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: t.colors.text, marginBottom: 8 }}>
        Ajustes
      </h1>
      <p style={{ fontSize: 13, color: t.colors.textMuted, marginBottom: 24 }}>
        {user?.email}
      </p>
      <div
        style={{
          background: t.colors.bgCard,
          borderRadius: 16,
          border: `1px solid ${t.colors.border}`,
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          style={{ ...ps.item, width: "100%", border: "none", borderRadius: 0 } as React.CSSProperties}
          onClick={cycleTheme}
        >
          {mode === "light" ? (
            <>
              <Sun size={16} /> Modo claro activo — cambiar a oscuro
            </>
          ) : (
            <>
              <Moon size={16} /> Modo oscuro activo — cambiar a claro
            </>
          )}
        </button>
        <div style={ps.divider} />
        <button
          type="button"
          style={{ ...ps.item, width: "100%", border: "none", borderRadius: 0 } as React.CSSProperties}
          onClick={logout}
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
      <p style={{ ...ds.stubWrap, minHeight: "auto", marginTop: 24, padding: 0 } as React.CSSProperties}>
        Más opciones de cuenta y notificaciones en una próxima versión.
      </p>
    </div>
  );
}
