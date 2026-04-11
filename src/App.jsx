import { useState, useMemo } from "react";
import { useAuth } from "./hooks/useAuth";
import { useProperties } from "./hooks/useProperties";
import { useSwipeBack } from "./hooks/useSwipeBack";
import { PropertyForm } from "./features/properties/PropertyForm.jsx";
import { PropertyDetail } from "./features/properties/PropertyDetail.jsx";
import { buildOutputs } from "./utils/messageFormatter";
import { ESTADO_COLORS, ESTADOS, OPERATIONS, PROPERTY_TYPES } from "./utils/constants";
import { S } from "./styles/styles";

/**
 * Main ROCA App Component
 * Real estate management system for Lima properties
 * Admin interface for CRUD operations, filtering, messaging, and photo management
 */
export default function ROCAApp() {
  // Authentication
  const { isAdmin, loginPassword, setLoginPassword, login, logout } = useAuth();

  // Properties management
  const { properties, loading, saveProperty, removeProperty, changeStatus } =
    useProperties();

  // UI State
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    operacion: "",
    tipo: "",
    estado: "",
  });

  // Swipe back navigation (only for admin when viewing property)
  useSwipeBack(
    () => {
      if (selected) setSelected(null);
    },
    isAdmin && !!selected
  );

  // Filter properties based on search & filters
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const q = filters.q.toLowerCase();
      if (
        q &&
        !p.nombre?.toLowerCase().includes(q) &&
        !p.distrito?.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filters.operacion && p.operacion !== filters.operacion) return false;
      if (filters.tipo && p.tipo !== filters.tipo) return false;
      if (filters.estado && p.estado !== filters.estado) return false;
      return true;
    });
  }, [properties, filters]);

  // ─── LOGIN SCREEN ───────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🪨</div>
          <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
            ROCA
          </div>
          <div style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>
            Sistema inmobiliario
          </div>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (login(loginPassword)) {
                  // Success - component will re-render
                } else {
                  alert("Contraseña incorrecta");
                }
              }
            }}
            style={S.input}
            placeholder="Contraseña"
          />
          <button
            onClick={() => {
              if (login(loginPassword)) {
                // Success
              } else {
                alert("Contraseña incorrecta");
              }
            }}
            style={{ ...S.signOutBtn, marginTop: 12, width: "100%", background: "#1a1a1a", color: "#e8ff4f", border: "none" }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ─── PROPERTY DETAIL VIEW ───────────────────────────────────
  if (selected) {
    const current = properties.find((p) => p.id === selected.id) || selected;
    return (
      <div style={S.app}>
        <PropertyDetail
          p={current}
          onBack={() => setSelected(null)}
          onEdit={() => {
            setEdit(current);
            setShowForm(true);
          }}
          onEstado={changeStatus}
        />
        {showForm && (
          <PropertyForm
            initial={editTarget}
            onSave={saveProperty}
            onClose={() => {
              setShowForm(false);
              setEdit(null);
            }}
          />
        )}
      </div>
    );
  }

  // ─── MAIN LIST VIEW ─────────────────────────────────────────
  return (
    <div style={S.app} onClick={() => setOpenMenu(null)}>
      {/* Top Bar */}
      <div style={S.topBar}>
        <div style={S.logo}>🪨 ROCA</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={logout} style={S.signOutBtn}>
            Salir
          </button>
          <button
            onClick={() => {
              setEdit(null);
              setShowForm(true);
            }}
            style={S.newBtn}
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={S.searchWrap}>
        <input
          style={S.searchInput}
          placeholder="🔍 Buscar por nombre o distrito..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
      </div>

      {/* Filters */}
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
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Count */}
      <div style={S.count}>
        {loading
          ? "Cargando..."
          : `${filtered.length} inmueble${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {/* List */}
      <div style={S.list}>
        {!loading && filtered.length === 0 && (
          <div style={S.empty}>
            Sin resultados. Toca + Nuevo para agregar.
          </div>
        )}

        {filtered.map((p) => {
          const out = buildOutputs(p);
          const ec = ESTADO_COLORS[p.estado] || ESTADO_COLORS.Disponible;

          return (
            <div
              key={p.id}
              style={S.card}
              onClick={() => setSelected(p)}
            >
              <div style={S.cardMain}>
                <div style={S.cardLeft}>
                  <div style={S.cardName}>{p.nombre}</div>
                  <div style={S.cardSub}>
                    {p.tipo} · {p.distrito} · {p.operacion}
                  </div>
                  <div style={S.cardPrice}>{out.precio}</div>
                </div>

                <div style={S.cardRight} onClick={(e) => e.stopPropagation()}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 20,
                      padding: "3px 9px",
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      backgroundColor: ec.bg,
                      color: ec.text,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: ec.dot,
                        display: "inline-block",
                        marginRight: 5,
                      }}
                    />
                    {p.estado}
                  </span>
                  <button
                    style={S.menuDot}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === p.id ? null : p.id);
                    }}
                  >
                    ⋮
                  </button>
                </div>
              </div>

              {/* Dropdown Menu */}
              {openMenu === p.id && (
                <div style={S.dropdown} onClick={(e) => e.stopPropagation()}>
                  {ESTADOS.map((s) => (
                    <button
                      key={s}
                      style={S.dropItem}
                      onClick={() => {
                        changeStatus(p.id, s);
                        setOpenMenu(null);
                      }}
                    >
                      <span style={{ color: ESTADO_COLORS[s]?.dot }}>●</span>{" "}
                      {s}
                    </button>
                  ))}
                  <div style={S.dropDivider} />
                  <button
                    style={S.dropItem}
                    onClick={() => {
                      setEdit(p);
                      setShowForm(true);
                      setOpenMenu(null);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={{ ...S.dropItem, color: "#ef4444" }}
                    onClick={() => {
                      if (confirm("¿Eliminar este inmueble?")) {
                        removeProperty(p.id);
                      }
                    }}
                  >
                    🗑 Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      {showForm && (
        <PropertyForm
          initial={editTarget}
          onSave={saveProperty}
          onClose={() => {
            setShowForm(false);
            setEdit(null);
          }}
        />
      )}
    </div>
  );
}

