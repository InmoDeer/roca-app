import { useState, useMemo } from "react";
import { useAuth } from "./hooks/useAuth";
import { useProperties } from "./hooks/useProperties";
import { PropertyForm } from "./features/properties/PropertyForm.jsx";
import { PropertyDetail } from "./features/properties/PropertyDetail.jsx";
import { PublicGallery } from "./features/properties/PublicGallery.jsx";
import { buildOutputs } from "./utils/messageFormatter";
import { ESTADO_COLORS, ESTADOS, OPERATIONS, PROPERTY_TYPES } from "./utils/constants";

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
    padding: "16px 20px 100px" 
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
    overflow: "hidden", 
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
    flexDirection: "column", 
    alignItems: "flex-end", 
    gap: 8 
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
    margin: "0 16px 16px", 
    padding: 8, 
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)", 
    position: "absolute", 
    right: 0, 
    left: 0, 
    zIndex: 20,
    border: "1px solid rgba(255,255,255,0.08)"
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

export default function ROCAApp() {
  const { isAdmin, loginPassword, setLoginPassword, login, logout } = useAuth();
  const { properties, loading, saveProperty, removeProperty, changeStatus } = useProperties();
  
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [filters, setFilters] = useState({ q: "", operacion: "", tipo: "", estado: "" });

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const q = filters.q.toLowerCase();
      if (q && !p.nombre?.toLowerCase().includes(q) && !p.distrito?.toLowerCase().includes(q)) return false;
      if (filters.operacion && p.operacion !== filters.operacion) return false;
      if (filters.tipo && p.tipo !== filters.tipo) return false;
      if (filters.estado && p.estado !== filters.estado) return false;
      return true;
    });
  }, [properties, filters]);

  const urlParams = new URLSearchParams(window.location.search);
  const galleryId = urlParams.get('id');
  
  if (galleryId) {
    const property = properties.find(p => String(p.id) === String(galleryId));
    
    if (property) {
      return <PublicGallery property={property} onClose={() => window.close()} />;
    }
    
    if (loading) {
      return <div style={S.loadingWrap}>Cargando...</div>;
    }
    
    return (
      <div style={{...S.loadingWrap, background: '#000', color: '#fff'}}>
        <div style={{fontSize: 48, marginBottom: 16}}>📷</div>
        <p style={{marginBottom: 16}}>Propiedad no encontrada</p>
        <a href="/" style={{color: '#d4af37', textDecoration: 'underline'}}>Volver a la app</a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🪨</div>
          <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 6, color: '#ffffff', letterSpacing: '2px' }}>ROCA</div>
          <div style={{ color: "#666666", fontSize: 13, marginBottom: 32 }}>Sistema inmobiliario premium</div>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") login(loginPassword) ? null : alert("Contraseña incorrecta"); }}
            style={S.input}
            placeholder="Contraseña"
          />
          <button
            onClick={() => login(loginPassword) ? null : alert("Contraseña incorrecta")}
            style={{ ...S.newBtn, marginTop: 16, width: "100%", padding: "14px" }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    const current = properties.find((p) => p.id === selected.id) || selected;
    return (
      <div style={S.app}>
        <PropertyDetail
          p={current}
          onBack={() => setSelected(null)}
          onEdit={() => { setEdit(current); setShowForm(true); }}
          onEstado={changeStatus}
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
    <div style={S.app} onClick={() => setOpenMenu(null)}>
      <div style={S.topBar}>
        <div style={S.logo}>ROCA</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={logout} style={S.signOutBtn}>Salir</button>
          <button onClick={() => { setEdit(null); setShowForm(true); }} style={S.newBtn}>+ Nuevo</button>
        </div>
      </div>

      <div style={S.searchWrap}>
        <input
          style={S.searchInput}
          placeholder="🔍 Buscar por nombre o distrito..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
      </div>

      <div style={S.filterRow}>
        {[
          { k: "operacion", opts: ["", ...OPERATIONS], label: "Operación" },
          { k: "tipo", opts: ["", ...PROPERTY_TYPES], label: "Tipo" },
          { k: "estado", opts: ["", ...ESTADOS], label: "Estado" },
        ].map(({ k, opts, label }) => (
          <select
            key={k}
            style={S.filterSelect}
            value={filters[k]}
            onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
          >
            <option value="" style={{ color: "#666666" }}>{label}</option>
            {opts.filter(Boolean).map((o) => (
              <option key={o} value={o} style={{ color: "#fff" }}>{o}</option>
            ))}
          </select>
        ))}
      </div>

      <div style={S.count}>
        {loading ? "Cargando..." : `${filtered.length} inmueble${filtered.length !== 1 ? "s" : ""}`}
      </div>

      <div style={S.list}>
        {!loading && filtered.length === 0 && (
          <div style={S.empty}>Sin resultados. Toca + Nuevo para agregar.</div>
        )}

        {filtered.map((p) => {
          const out = buildOutputs(p);
          const ec = ESTADO_COLORS[p.estado] || ESTADO_COLORS.Disponible;

          return (
            <div
              key={p.id}
              style={{ ...S.card, position: "relative" }}
              onClick={() => setSelected(p)}
            >
              <div style={S.cardMain}>
                <div style={S.cardLeft}>
                  <div style={S.cardName}>{p.nombre}</div>
                  <div style={S.cardSub}>{p.tipo} · {p.distrito}</div>
                  <div style={S.cardPrice}>{out.precio}</div>
                </div>

                <div style={S.cardRight} onClick={(e) => e.stopPropagation()}>
                  <span style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    borderRadius: 20, 
                    padding: "4px 10px", 
                    display: "flex", 
                    alignItems: "center", 
                    whiteSpace: "nowrap", 
                    backgroundColor: ec.bg, 
                    color: ec.text 
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ec.dot, display: "inline-block", marginRight: 4 }} />
                    {p.estado}
                  </span>
                  <button
                    style={S.menuDot}
                    onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === p.id ? null : p.id); }}
                  >⋮</button>
                </div>
              </div>

              {openMenu === p.id && (
                <div style={S.dropdown} onClick={(e) => e.stopPropagation()}>
                  {ESTADOS.map((s) => (
                    <button
                      key={s}
                      style={S.dropItem}
                      onClick={() => { changeStatus(p.id, s); setOpenMenu(null); }}
                    >
                      <span style={{ color: ESTADO_COLORS[s]?.dot, marginRight: 8 }}>●</span> {s}
                    </button>
                  ))}
                  <div style={S.dropDivider} />
                  <button style={S.dropItem} onClick={() => { setEdit(p); setShowForm(true); setOpenMenu(null); }}>
                    ✏️ Editar
                  </button>
                  <button
                    style={{ ...S.dropItem, color: "#ef4444" }}
                    onClick={() => { if (confirm("¿Eliminar este inmueble?")) removeProperty(p.id); }}
                  >
                    🗑 Eliminar
                  </button>
                </div>
              )}
            </div>
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