import { useState, useMemo, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useProperties } from "./hooks/useProperties";
import { ThemeProvider, useTheme } from "./hooks/useTheme.jsx";
import { PropertyForm } from "./features/properties/PropertyForm.jsx";
import { PropertyDetail } from "./features/properties/PropertyDetail.jsx";
import { PublicGallery } from "./features/properties/PublicGallery.jsx";
import { ClientsView } from "./features/clients/clientsview.jsx";
import { buildOutputs } from "./utils/messageFormatter";
import { ESTADO_COLORS, ESTADOS } from "./utils/constants";
import { fetchPropertyById } from "./utils/api";
import { PropertyCard } from "./components/PropertyCard.jsx";
import { PropertyFilters } from "./components/PropertyFilters.jsx";
const S = {
  app: { 
    minHeight: "100vh", 
    background: "#0a0a0a", 
    fontFamily: "'Outfit', sans-serif", 
    paddingBottom: 80,
    color: "#ffffff"
  },
  authWrap: { 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)" 
  },
  authCard: { 
    background: "rgba(255,255,255,0.03)", 
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 40, 
    borderRadius: 24, 
    width: "90%", 
    maxWidth: 360, 
    textAlign: "center", 
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(212,175,55,0.08)" 
  },
  input: { 
    width: "100%", 
    padding: "14px 16px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    borderRadius: 12, 
    fontSize: 15, 
    outline: "none", 
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    transition: "all 0.3s ease"
  },
  signOutBtn: { 
    background: "rgba(255,255,255,0.08)", 
    border: "1px solid rgba(255,255,255,0.1)", 
    borderRadius: 10, 
    padding: "8px 16px", 
    fontSize: 13, 
    fontWeight: 600, 
    cursor: "pointer",
    color: "#ffffff"
  },
  newBtn: { 
    background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)", 
    color: "#0a0a0a", 
    border: "none", 
    borderRadius: 10, 
    padding: "8px 16px", 
    fontSize: 13, 
    fontWeight: 700, 
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(212,175,55,0.3)"
  },
  topBar: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "16px 20px", 
    background: "rgba(10,10,10,0.85)", 
    backdropFilter: "blur(10px)",
    position: "sticky", 
    top: 0, 
    zIndex: 10,
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },
  logo: { 
    fontWeight: 800, 
    fontSize: 20, 
    color: "#d4af37",
    letterSpacing: "1px"
  },
  userTag: {
    color: "#666666",
    fontSize: 12,
    marginRight: 10,
    fontWeight: 500
  },
  searchWrap: { 
    padding: "16px 20px 0", 
    background: "#0a0a0a", 
    position: "sticky", 
    top: 60, 
    zIndex: 5 
  },
  searchInput: { 
    width: "100%", 
    padding: "12px 16px", 
    border: "1px solid rgba(255,255,255,0.08)", 
    borderRadius: 12, 
    fontSize: 14, 
    outline: "none", 
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff"
  },
  filterRow: { 
    display: "flex", 
    gap: 8, 
    padding: "10px 20px", 
    background: "#0a0a0a"
  },
  filterSelect: { 
    flex: 1, 
    padding: "8px 8px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    borderRadius: 10, 
    fontSize: 11, 
    background: "rgba(255,255,255,0.05)", 
    cursor: "pointer", 
    whiteSpace: "nowrap", 
    color: "#ffffff",
    minWidth: 0
  },
  count: { 
    padding: "8px 20px", 
    fontSize: 12, 
    color: "#666666", 
    fontWeight: 600,
    background: "#0a0a0a"
  },
  list: { 
    background: "#0a0a0a", 
    padding: "16px 20px 100px",
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  empty: { 
    textAlign: "center", 
    padding: "60px 0", 
    color: "#666666", 
    fontSize: 14 
  },
  card: { 
    background: "rgba(255,255,255,0.03)", 
    borderRadius: 16, 
    marginBottom: 12, 
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)", 
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.3s ease"
  },
  cardMain: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    padding: 16 
  },
  cardLeft: { flex: 1 },
  cardName: { 
    fontWeight: 700, 
    fontSize: 16, 
    color: "#ffffff", 
    marginBottom: 4 
  },
  cardSub: { 
    fontSize: 13, 
    color: "#666666", 
    marginBottom: 8 
  },
  cardPrice: { 
    fontSize: 14, 
    fontWeight: 700, 
    color: "#d4af37" 
  },
  cardRight: { 
    display: "flex", 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8,
    position: "relative"
  },
  menuDot: { 
    background: "none", 
    border: "none", 
    fontSize: 22, 
    cursor: "pointer", 
    color: "#888888", 
    padding: "8px",
    zIndex: 10,
    position: "relative"
  },
  dropdown: { 
    background: "#1a1a1a", 
    borderRadius: 12, 
    padding: 8, 
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)", 
    position: "absolute", 
    right: "100%",
    marginRight: 8,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 50,
    border: "1px solid rgba(255,255,255,0.08)",
    minWidth: 140,
  },
  dropItem: { 
    display: "block", 
    width: "100%", 
    padding: "12px 14px", 
    background: "none", 
    border: "none", 
    textAlign: "left", 
    fontSize: 14, 
    cursor: "pointer", 
    borderRadius: 8,
    color: "#ffffff"
  },
  dropDivider: { 
    height: 1, 
    background: "rgba(255,255,255,0.08)", 
    margin: "8px 0" 
  },
  loadingWrap: { 
    minHeight: "100vh", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    background: "#0a0a0a",
    color: "#666666"
  },
};

const getProfileMenuStyles = (theme) => ({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 99,
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 280,
    height: "100%",
    background: theme.colors.bgSecondary,
    boxShadow: "4px 0 20px rgba(0,0,0,0.5)",
    zIndex: 100,
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "0 20px 20px",
    borderBottom: `1px solid ${theme.colors.border}`,
    marginBottom: 20,
  },
  userInfo: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 4,
  },
  userEmail: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "none",
    border: "none",
    color: theme.colors.text,
    fontSize: 24,
    cursor: "pointer",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "14px 20px",
    background: "none",
    border: "none",
    color: theme.colors.text,
    fontSize: 15,
    cursor: "pointer",
    textAlign: "left",
  },
  divider: {
    height: 1,
    background: theme.colors.border,
    margin: "12px 0",
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <ROCAApp />
    </ThemeProvider>
  );
}

function ROCAApp() {
  const { user, loading: authLoading, email, setEmail, password, setPassword, login, logout } = useAuth();
  const { properties, loading, saveProperty, removeProperty, changeStatus } = useProperties(user?.id);
  const { t: theme, mode, toggle: cycleTheme } = useTheme();
  
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ q: "", operacion: "", tipo: "", estado: "" });
  const [showCRM, setShowCRM] = useState(false);
  const [crmPropertyFilter, setCrmPropertyFilter] = useState(null);
  const [publicProperty, setPublicProperty] = useState(null);
  const [publicLoading, setPublicLoading] = useState(false);

  const S = {
    app: { 
      minHeight: "100vh", 
      background: theme.colors.bg, 
      fontFamily: "'Outfit', sans-serif", 
      paddingBottom: 80,
      color: theme.colors.text
    },
    authWrap: { 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: mode === "dark" ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)" : "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #f5f5f5 100%)" 
    },
    authCard: { 
      background: theme.colors.bgSecondary, 
      backdropFilter: "blur(20px)",
      border: `1px solid ${theme.colors.border}`,
      padding: 40, 
      borderRadius: 24, 
      width: "90%", 
      maxWidth: 360, 
      textAlign: "center", 
      boxShadow: mode === "dark" ? "0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(212,175,55,0.08)" : "0 8px 32px rgba(0,0,0,0.1)" 
    },
    input: { 
      width: "100%", 
      padding: "14px 16px", 
      border: `1px solid ${theme.colors.border}`, 
      borderRadius: 12, 
      fontSize: 15, 
      outline: "none", 
      boxSizing: "border-box",
      background: theme.colors.bgSecondary,
      color: theme.colors.text,
      transition: "all 0.3s ease"
    },
    signOutBtn: { 
      background: theme.colors.bgSecondary, 
      border: `1px solid ${theme.colors.border}`, 
      borderRadius: 10, 
      padding: "8px 16px", 
      fontSize: 13, 
      fontWeight: 600, 
      cursor: "pointer",
      color: theme.colors.text
    },
    newBtn: { 
      background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)", 
      color: "#0a0a0a", 
      border: "none", 
      borderRadius: 10, 
      padding: "8px 16px", 
      fontSize: 13, 
      fontWeight: 700, 
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(212,175,55,0.3)"
    },
    topBar: { 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "16px 20px", 
      background: mode === "dark" ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)", 
      backdropFilter: "blur(10px)",
      position: "sticky", 
      top: 0, 
      zIndex: 10,
      borderBottom: `1px solid ${theme.colors.border}`
    },
    logo: { 
      fontWeight: 800, 
      fontSize: 20, 
      color: "#d4af37",
      letterSpacing: "1px"
    },
    userTag: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginRight: 10,
      fontWeight: 500
    },
    searchWrap: { 
      padding: "16px 20px 0", 
      background: theme.colors.bg, 
      position: "sticky", 
      top: 60, 
      zIndex: 5 
    },
    searchInput: { 
      width: "100%", 
      padding: "12px 16px", 
      border: `1px solid ${theme.colors.border}`, 
      borderRadius: 12, 
      fontSize: 14, 
      outline: "none", 
      boxSizing: "border-box",
      background: theme.colors.bgSecondary,
      color: theme.colors.text
    },
    filterRow: { 
      display: "flex", 
      gap: 8, 
      padding: "10px 20px", 
      background: theme.colors.bg
    },
    filterSelect: { 
      flex: 1, 
      padding: "8px 8px", 
      border: `1px solid ${theme.colors.border}`, 
      borderRadius: 10, 
      fontSize: 11, 
      background: theme.colors.bgSecondary, 
      cursor: "pointer", 
      whiteSpace: "nowrap", 
      color: theme.colors.text,
      minWidth: 0
    },
    count: { 
      padding: "8px 20px", 
      fontSize: 12, 
      color: theme.colors.textMuted, 
      fontWeight: 600,
      background: theme.colors.bg
    },
    list: { 
      background: theme.colors.bg, 
      padding: "16px 20px 100px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    },
    empty: { 
      textAlign: "center", 
      padding: "60px 0", 
      color: theme.colors.textMuted, 
      fontSize: 14 
    },
    card: { 
      background: theme.colors.bgCard, 
      borderRadius: 16, 
      marginBottom: 12, 
      boxShadow: mode === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)", 
      border: `1px solid ${theme.colors.border}`,
      transition: "all 0.3s ease"
    },
    cardMain: { 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "flex-start", 
      padding: 16 
    },
    cardLeft: { flex: 1 },
    cardName: { 
      fontWeight: 700, 
      fontSize: 16, 
      color: theme.colors.text, 
      marginBottom: 4 
    },
    cardSub: { 
      fontSize: 13, 
      color: theme.colors.textMuted, 
      marginBottom: 8 
    },
    cardPrice: { 
      fontSize: 14, 
      fontWeight: 700, 
      color: theme.colors.primary 
    },
    cardRight: { 
      display: "flex", 
      flexDirection: "row", 
      alignItems: "center", 
      gap: 8,
      position: "relative"
    },
    menuDot: { 
      background: "none", 
      border: "none", 
      fontSize: 22, 
      cursor: "pointer", 
      color: theme.colors.textMuted, 
      padding: "8px",
      zIndex: 10,
      position: "relative"
    },
    dropdown: { 
      background: theme.colors.bgCard, 
      borderRadius: 12, 
      padding: 8, 
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", 
      position: "absolute", 
      right: "100%",
      marginRight: 8,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 50,
      border: `1px solid ${theme.colors.border}`,
      minWidth: 140,
    },
    dropItem: { 
      display: "block", 
      width: "100%", 
      padding: "12px 14px", 
      background: "none", 
      border: "none", 
      textAlign: "left", 
      fontSize: 14, 
      cursor: "pointer", 
      borderRadius: 8,
      color: theme.colors.text
    },
    dropDivider: { 
      height: 1, 
      background: theme.colors.border, 
      margin: "8px 0" 
    },
    loadingWrap: { 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      background: theme.colors.bg,
      color: theme.colors.textMuted
    },
  };

  const handleDuplicate = (original) => {
    const { id, created_at, updated_at, ...rest } = original;
    const duplicate = {
      ...rest,
      nombre: `${original.nombre} (copia)`,
      estado: "Disponible",
      fotos_urls: [],
      direccion: "",
      maps_url: "",
      video_url: "",
      tour360_url: "",
    };
    setEdit(duplicate);
    setShowForm(true);
  };

  const filtered = useMemo(() => {
    const result = properties.filter((p) => {
      const q = filters.q.toLowerCase();
      if (q && !p.nombre?.toLowerCase().includes(q) && !p.distrito?.toLowerCase().includes(q)) return false;
      if (filters.operacion && p.operacion !== filters.operacion) return false;
      if (filters.tipo && p.tipo !== filters.tipo) return false;
      if (filters.estado === "Cerrado") {
        if (p.estado !== "Cerrado") return false;
      } else if (filters.estado && p.estado !== filters.estado) {
        return false;
      }
      return true;
    });

    const order = { "Disponible": 1, "Reservado": 2, "Cerrado": 3 };
    
    return result.sort((a, b) => {
      const orderA = order[a.estado] || 99;
      const orderB = order[b.estado] || 99;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Si tienen el mismo estado, ordenar por fecha más reciente
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });
  }, [properties, filters]);

  const urlParams = new URLSearchParams(window.location.search);
  const galleryId = urlParams.get('id');

  // Galería pública - llamada directa a Supabase
  useEffect(() => {
    if (!galleryId) return;
    setPublicLoading(true);
    fetchPropertyById(galleryId).then((data) => {
      setPublicProperty(data);
      setPublicLoading(false);
    });
  }, [galleryId]);

  if (galleryId) {
    if (publicLoading) return <div style={S.loadingWrap}>Cargando...</div>;
    if (publicProperty) return <PublicGallery property={publicProperty} onClose={() => window.close()} />;
    return (
      <div style={{...S.loadingWrap, background: '#000', color: '#fff'}}>
        <div style={{fontSize: 48, marginBottom: 16}}>📷</div>
        <p style={{marginBottom: 16}}>Propiedad no encontrada</p>
        <a href="/" style={{color: '#d4af37', textDecoration: 'underline'}}>Volver a la app</a>
      </div>
    );
  }

  // Loading inicial
  if (authLoading) {
    return (
      <div style={S.loadingWrap}>
        <div style={{fontSize: 32, marginBottom: 16}}>🪨</div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Login
  if (!user) {
    return (
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🪨</div>
          <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 6, color: '#ffffff', letterSpacing: '2px' }}>ROCA</div>
          <div style={{ color: "#666666", fontSize: 13, marginBottom: 32 }}>Sistema inmobiliario premium</div>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{...S.input, marginBottom: 12}}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === "Enter") {
                login().catch(() => alert("Credenciales incorrectas"));
              }
            }}
            style={S.input}
            placeholder="Contraseña"
          />
          
          <button
            onClick={() => login().catch(() => alert("Credenciales incorrectas"))}
            style={{ ...S.newBtn, marginTop: 16, width: "100%", padding: "14px" }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // CRM View
  if (showCRM) {
    return (
      <div style={S.app}>
        <ClientsView
          onBack={() => { setShowCRM(false); setCrmPropertyFilter(null); }}
          theme={theme}
          mode={mode}
          propertyId={crmPropertyFilter?.id || null}
          propertyName={crmPropertyFilter?.nombre || null}
        />
      </div>
    );
  }

  // App principal
  if (selected) {
    const current = properties.find((p) => p.id === selected.id) || selected;
    return (
      <div style={S.app}>
        <PropertyDetail
          p={current}
          onBack={() => setSelected(null)}
          onEdit={() => { setEdit(current); setShowForm(true); }}
          onEstado={changeStatus}
          onDelete={(id) => { removeProperty(id); setSelected(null); }}
          onLeads={() => {
            setCrmPropertyFilter(current);
            setShowCRM(true);
          }}
        />
        {showForm && (
          <PropertyForm
            initial={editTarget}
            onSave={saveProperty}
            onClose={() => { setShowForm(false); setEdit(null); }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={S.app} onClick={(e) => { if (e.target === e.currentTarget) { setOpenMenu(null); setProfileMenuOpen(false); } }}>
      {profileMenuOpen && (
        <>
          <div style={getProfileMenuStyles(theme).overlay} onClick={() => setProfileMenuOpen(false)} />
          <div style={getProfileMenuStyles(theme).drawer}>
            
            <div style={getProfileMenuStyles(theme).header}>
              <div style={getProfileMenuStyles(theme).userInfo}>{user.email?.split('@')[0]}</div>
              <div style={getProfileMenuStyles(theme).userEmail}>{user.email}</div>
            </div>
            <button style={getProfileMenuStyles(theme).item} onClick={cycleTheme}>
              {mode === "light" ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
            <button style={getProfileMenuStyles(theme).item} onClick={() => { setShowCRM(true); setProfileMenuOpen(false); }}>
              👥 CRM · Leads
            </button>
            <div style={getProfileMenuStyles(theme).divider} />
            <button style={getProfileMenuStyles(theme).item} onClick={logout}>
              🚪 Cerrar sesión
            </button>
          </div>
        </>
      )}
      
      <div style={S.topBar}>
        <button 
          onClick={() => setProfileMenuOpen(true)}
          style={{ ...S.logo, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ROCA
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={S.userTag}>{user.email?.split('@')[0]}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setEdit(null); setShowForm(true); }} style={S.newBtn}>+ Nuevo</button>
          </div>
        </div>
      </div>

      <PropertyFilters 
          filters={filters} 
          setFilters={setFilters} 
          loading={loading} 
          filteredCount={filtered.length} 
        />

      <div style={S.list}>
        {!loading && filtered.length === 0 && (
          <div style={S.empty}>Sin resultados. Toca + Nuevo para agregar.</div>
        )}

        {filtered.map((p) => {
          const out = buildOutputs(p);
          const ec = ESTADO_COLORS[p.estado] || ESTADO_COLORS.Disponible;

          return (
            <PropertyCard
              key={p.id}
              property={p}
              out={out}
              ec={ec}
              onClick={() => setSelected(p)}
              onEdit={() => { setEdit(p); setShowForm(true); }}
              onDelete={() => removeProperty(p.id)}
              onDuplicate={() => handleDuplicate(p)}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          );
        })}
      </div>

      {showForm && (
        <PropertyForm
          initial={editTarget}
          onSave={saveProperty}
          onClose={() => { setShowForm(false); setEdit(null); }}
        />
      )}
    </div>
  );
}
