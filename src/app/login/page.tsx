"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginView } from "@/features/auth/views/LoginView";
import { getAppStyles } from "@/styles/componentStyles";
import { useTheme } from "@/hooks/useTheme";
import { Mountain } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t, mode } = useTheme();
  const S = getAppStyles(t, mode);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/propiedades");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div style={S.loadingWrap}>
        <Mountain size={32} strokeWidth={1.5} />
        <p>Cargando...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div style={S.loadingWrap}>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return <LoginView />;
}
