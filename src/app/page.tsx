"use client";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { useTheme } from "@/hooks/useTheme";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyDetail } from "@/components/PropertyDetail";
import { getAppStyles, getProfileMenuStyles } from "@/styles/componentStyles";
import { buildOutputs } from "@/lib/messageFormatter";
import { fetchPropertyById } from "@/lib/api";
import { Sun, Moon, LogOut, Mountain } from "lucide-react";

export default function Home() {
  const { user, loading: authLoading, email, setEmail, password, setPassword, login, logout } = useAuth();
  const { properties, loading, saveProperty, removeProperty, changeStatus } = useProperties(user?.id);
  const { t: theme, mode, toggle: cycleTheme } = useTheme();
  
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<any>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ q: "", operacion: "", tipo: "", estado: "" });
  const [publicProperty, setPublicProperty] = useState<any>(null);
  const [publicLoading, setPublicLoading] = useState(false);

  const S = getAppStyles(theme, mode);

  const handleDuplicate = (original: any) => {
    const { id: _id, created_at: _created, updated_at: _updated, ...rest } = original;
    const duplicate = { ...rest, nombre: `${original.nombre} (copia)`, estado: "Disponible", fotos_urls: [], direccion: "", maps_url: "", video_url: "", tour360_url: "" };
    setEdit(duplicate);
    setShowForm(true);
  };

  const handleRefreshProperty = async () => {
    if (!selected?.id) return;
    const refreshed = await fetchPropertyById(selected.id);
    if (refreshed) setSelected(refreshed);
  };

  const filtered = useMemo(() => {
    const result = properties.filter((p: any) => {
      const q = filters.q.toLowerCase();
      if (q && !p.nombre?.toLowerCase().includes(q) && !p.distrito?.toLowerCase().includes(q)) return false;
      if (filters.operacion && p.operacion !== filters.operacion) return false;
      if (filters.tipo && p.tipo !== filters.tipo) return false;
      if (filters.estado === "Cerrado") { if (p.estado !== "Cerrado") return false; }
      else if (filters.estado && p.estado !== filters.estado) return false;
      return true;
    });
    const order: any = { "Disponible": 1, "Reservado": 2, "Cerrado": 3 };
    return result.sort((a: any, b: any) => {
      const orderA = order[a.estado] || 99;
      const orderB = order[b.estado] || 99;
      if (orderA !== orderB) return orderA - orderB;
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [properties, filters]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const galleryId = params.get("id");
    if (!galleryId) return;
    setPublicLoading(true);
    fetchPropertyById(galleryId).then((data: any) => { setPublicProperty(data); setPublicLoading(false); });
  }, []);

  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("id")) {
    if (publicLoading) return <div style={S.loadingWrap}>Cargando...</div>;
    if (publicProperty) {
      const out = buildOutputs(publicProperty);
      return (
        <div style={{ background: theme.colors.bg, minHeight: "100vh", padding: 20 }}>
          <h1 style={{ color: theme.colors.text, marginBottom: 20 }}>{publicProperty.nombre}</h1>
          {out.fotos.length > 0 && <img src={out.fotos[0]} alt="" style={{ width: "100%", maxWidth: 500, borderRadius: 16 }} />}
          <p style={{ color: theme.colors.primary, fontSize: 24, marginTop: 20 }}>{out.precio}</p>
          <a href="/" style={{ color: theme.colors.primary, display: "block", marginTop: 20 }}>← Volver</a>
        </div>
      );
    }
    return <div style={{...S.loadingWrap, background: theme.colors.bg, color: theme.colors.text}}>Propiedad no encontrada</div>;
  }

  if (authLoading) return <div style={S.loadingWrap}><Mountain size={32} strokeWidth={1.5} /><p>Cargando...</p></div>;

  if (!user) {
    return (
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <Mountain size={48} strokeWidth={1} style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 6, color: theme.colors.text, letterSpacing: '2px' }}>ROCA</div>
          <div style={{ color: theme.colors.textMuted, fontSize: 13, marginBottom: 32 }}>Sistema inmobiliario premium</div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{...S.input, marginBottom: 12} as React.CSSProperties} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login().catch(() => alert("Credenciales incorrectas")); }} style={S.input as React.CSSProperties} placeholder="Contraseña" />
        <button onClick={() => login().catch(() => alert("Credenciales incorrectas"))} style={{ ...S.newBtn, marginTop: 16, width: "100%", padding: "14px" } as React.CSSProperties}>Entrar</button>
        </div>
      </div>
    );
  }

  if (selected) {
    const current = properties.find((p: any) => p.id === selected.id) || selected;
    return (
      <>
        <div style={S.app}>
          <PropertyDetail p={current} onBack={() => setSelected(null)} onEdit={() => { setEdit(current); setShowForm(true); }} onEstado={changeStatus} onDelete={(id: string) => { removeProperty(id); setSelected(null); }} onRefresh={handleRefreshProperty} />
        </div>
        {showForm && <PropertyForm initial={editTarget} onSave={saveProperty} onClose={() => { setShowForm(false); setEdit(null); }} />}
      </>
    );
  }

  return (
        <div style={S.app as React.CSSProperties} onClick={(e: any) => { if (e.target === e.currentTarget) { setOpenMenu(null); setProfileMenuOpen(false); } }}>
      {profileMenuOpen && (
        <>
          <div style={getProfileMenuStyles(theme).overlay as React.CSSProperties} onClick={() => setProfileMenuOpen(false)} />
          <div style={getProfileMenuStyles(theme).drawer as React.CSSProperties}>
            <div style={getProfileMenuStyles(theme).header}>
              <div style={getProfileMenuStyles(theme).userInfo}>{user.email?.split('@')[0]}</div>
              <div style={getProfileMenuStyles(theme).userEmail}>{user.email}</div>
            </div>
            <button style={getProfileMenuStyles(theme).item as React.CSSProperties} onClick={cycleTheme}>{mode === "light" ? <><Sun size={16} /> Claro</> : <><Moon size={16} /> Oscuro</>}</button>
            <div style={getProfileMenuStyles(theme).divider as React.CSSProperties} />
            <button style={getProfileMenuStyles(theme).item as React.CSSProperties} onClick={logout}><LogOut size={16} /> Cerrar sesión</button>
          </div>
        </>
      )}
      
      <div style={S.topBar}>
        <button onClick={() => setProfileMenuOpen(true)} style={{ ...S.logo, background: 'none', border: 'none', cursor: 'pointer' }}>ROCA</button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={S.userTag}>{user.email?.split('@')[0]}</span>
          <button onClick={() => { setEdit(null); setShowForm(true); }} style={S.newBtn}>+ Nuevo</button>
        </div>
      </div>

      <PropertyFilters filters={filters} setFilters={setFilters} loading={loading} filteredCount={filtered.length} />

      <div style={S.list as React.CSSProperties}>
        {!loading && filtered.length === 0 && <div style={S.empty}>Sin resultados. Toca + Nuevo para agregar.</div>}
        {filtered.map((p: any) => {
          const out = buildOutputs(p);
          return (
            <PropertyCard key={p.id} property={p} out={out} onClick={() => setSelected(p)} onEdit={() => { setEdit(p); setShowForm(true); }} onDelete={() => removeProperty(p.id)} onDuplicate={() => handleDuplicate(p)} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          );
        })}
      </div>

      {showForm && <PropertyForm initial={editTarget} onSave={saveProperty} onClose={() => { setShowForm(false); setEdit(null); }} />}
    </div>
  );
}
