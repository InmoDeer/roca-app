import { useState, useMemo } from "react";
import { useAuth } from "./hooks/useAuth";
import { useProperties } from "./hooks/useProperties";
import { PropertyForm } from "./features/properties/PropertyForm.jsx";
import { PropertyDetail } from "./features/properties/PropertyDetail.jsx";
import { buildOutputs } from "./utils/messageFormatter";
import { ESTADO_COLORS, ESTADOS, OPERATIONS, PROPERTY_TYPES } from "./utils/constants";

const S = {
  app: { minHeight: "100vh", background: "#f4f4f0", fontFamily: "'DM Sans',sans-serif", paddingBottom: 80 },
  authWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f4" },
  authCard: { background: "#fff", padding: 32, borderRadius: 20, width: "90%", maxWidth: 340, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,.08)" },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" },
  signOutBtn: { background: "#f0f0ec", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  newBtn: { background: "#e8ff4f", color: "#1a1a1a", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#1a1a1a", position: "sticky", top: 0, zIndex: 10 },
  logo: { fontWeight: 900, fontSize: 18, color: "#e8ff4f" },
  searchWrap: { padding: "12px 16px 0", background: "#f4f4f0", position: "sticky", top: 52, zIndex: 5 },
  searchInput: { width: "100%", padding: "11px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" },
  filterRow: { display: "flex", gap: 8, padding: "10px 16px 0", overflowX: "auto", flexWrap: "wrap" },
  filterSelect: { minWidth: 85, padding: "7px 8px", border: "1.5px solid #e0e0d8", borderRadius: 8, fontSize: 12, background: "#fff", cursor: "pointer", whiteSpace: "nowrap" },
  count: { padding: "10px 16px 0", fontSize: 12, color: "#888", fontWeight: 600, background: "#f4f4f0" },
  list: { background: "#f4f4f0", padding: "16px 16px 80px", minHeight: "100vh" },
  empty: { textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 },
  card: { background: "#fff", borderRadius: 14, marginBottom: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)", border: "1.5px solid #eee" },
  cardMain: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: 14 },
  cardLeft: { flex: 1 },
  cardName: { fontWeight: 800, fontSize: 15, color: "#1a1a1a", marginBottom: 3 },
  cardSub: { fontSize: 12, color: "#888", marginBottom: 6 },
  cardPrice: { fontSize: 13, fontWeight: 700, color: "#1a1a1a" },
  cardRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 },
  menuDot: { background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#aaa", padding: 0 },
  dropdown: { background: "#fff", borderRadius: 10, margin: "0 14px 14px", padding: 6, boxShadow: "0 4px 16px rgba(0,0,0,.12)", position: "absolute", right: 0, left: 0, zIndex: 20 },
  dropItem: { display: "block", width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", fontSize: 14, cursor: "pointer", borderRadius: 6 },
  dropDivider: { height: 1, background: "#eee", margin: "6px 0" },
  loadingWrap: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f4f4f4" },
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

  if (!isAdmin) {
    return (
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🪨</div>
          <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>ROCA</div>
          <div style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>Sistema inmobiliario</div>
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
            style={{ ...S.signOutBtn, marginTop: 12, width: "100%", background: "#1a1a1a", color: "#e8ff4f", border: "none" }}
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
        <div style={S.logo}>🪨 ROCA</div>
        <div style={{ display: "flex", gap: 8 }}>
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
            <option value="">{label}</option>
            {opts.filter(Boolean).map((o) => (
              <option key={o} value={o}>{o}</option>
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
                  <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 9px", display: "flex", alignItems: "center", whiteSpace: "nowrap", backgroundColor: ec.bg, color: ec.text }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: ec.dot, display: "inline-block", marginRight: 5 }} />
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
                      <span style={{ color: ESTADO_COLORS[s]?.dot }}>●</span> {s}
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
