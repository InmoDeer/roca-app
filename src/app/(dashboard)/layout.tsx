"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getAppStyles, getDashboardStyles } from "@/styles/componentStyles";
import { DashboardNav } from "@/features/dashboard/components/DashboardNav";
import { Mountain } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t, mode } = useTheme();
  const S = getAppStyles(t, mode);
  const ds = getDashboardStyles(t, mode);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
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

  if (!user) {
    return (
      <div style={S.loadingWrap}>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div style={ds.shell}>
      {children}
      <DashboardNav />
    </div>
  );
}
