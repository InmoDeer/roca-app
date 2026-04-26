import { useState, useMemo, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useProperties } from "./hooks/useProperties";
import { ThemeProvider, useTheme } from "./hooks/useTheme.jsx";
import { PropertyForm } from "./features/properties/PropertyForm.jsx";
import { PropertyDetail } from "./features/properties/PropertyDetail.jsx";
import { PublicGallery } from "./features/properties/PublicGallery.jsx";
import { ContactsView } from "./features/contacts/contactsview.jsx";
import { buildOutputs } from "./utils/messageFormatter";
import { ESTADO_COLORS, ESTADOS } from "./utils/constants";
import { fetchPropertyById } from "./utils/api";
import { PropertyCard } from "./components/PropertyCard.jsx";
import { PropertyFilters } from "./components/PropertyFilters.jsx";
import { getAppStyles, getProfileMenuStyles } from "./styles/componentStyles.js";

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
  const [crmTipoFiltro, setCrmTipoFiltro] = useState('lead');
  const [publicProperty, setPublicProperty] = useState(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [propietarioParaPropiedad, setPropietarioParaPropiedad] = useState(null);

  const S = getAppStyles(theme, mode);

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

  const handleCrearPropiedad = (propietarioId) => {
    setPropietarioParaPropiedad(propietarioId);
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
        <ContactsView
          onBack={() => { setShowCRM(false); setCrmPropertyFilter(null); }}
          theme={theme}
          mode={mode}
          user={user}
          propertyId={crmPropertyFilter?.id || null}
          propertyName={crmPropertyFilter?.nombre || null}
          tipoInicial={crmPropertyFilter ? 'propietario' : crmTipoFiltro}
          defaultEstadoLead={crmPropertyFilter ? "Cerrado" : "Interesado"}
          defaultEstadoProp={crmPropertyFilter ? "Cerrado" : "Captación"}
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
          onCrearPropiedad={handleCrearPropiedad}
        />
        {showForm && (
          <PropertyForm
            initial={editTarget}
            onSave={saveProperty}
            onClose={() => { setShowForm(false); setEdit(null); setPropietarioParaPropiedad(null); }}
            propietarioId={propietarioParaPropiedad}
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
            <button style={getProfileMenuStyles(theme).item} onClick={() => { 
              setCrmPropertyFilter(null);
              setCrmTipoFiltro('lead');
              setShowCRM(true); 
              setProfileMenuOpen(false); 
            }}>
              👥 Leads
            </button>
            <button style={getProfileMenuStyles(theme).item} onClick={() => { 
              setCrmPropertyFilter(null);
              setCrmTipoFiltro('propietario');
              setShowCRM(true); 
              setProfileMenuOpen(false); 
            }}>
              🏢 Propietarios
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
            onClose={() => { setShowForm(false); setEdit(null); setPropietarioParaPropiedad(null); }}
            propietarioId={propietarioParaPropiedad}
          />
        )}
    </div>
  );
}
