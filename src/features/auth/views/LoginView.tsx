"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getAppStyles } from "@/styles/componentStyles";
import { Mountain } from "lucide-react";

export function LoginView() {
  const { email, setEmail, password, setPassword, login } = useAuth();
  const { t: theme, mode } = useTheme();
  const S = getAppStyles(theme, mode);

  const handleLogin = () => {
    login().catch(() => alert("Credenciales incorrectas"));
  };

  return (
    <div style={S.authWrap}>
      <div style={S.authCard}>
        <Mountain size={48} strokeWidth={1} style={{ marginBottom: 12 }} />
        <div
          style={{
            fontWeight: 800,
            fontSize: 28,
            marginBottom: 6,
            color: theme.colors.text,
            letterSpacing: "2px",
          }}
        >
          ROCA
        </div>
        <div style={{ color: theme.colors.textMuted, fontSize: 13, marginBottom: 32 }}>
          Sistema inmobiliario premium
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...S.input, marginBottom: 12 } as React.CSSProperties}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          style={S.input as React.CSSProperties}
          placeholder="Contraseña"
        />
        <button
          onClick={handleLogin}
          style={
            {
              ...S.newBtn,
              marginTop: 16,
              width: "100%",
              padding: "14px",
            } as React.CSSProperties
          }
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
