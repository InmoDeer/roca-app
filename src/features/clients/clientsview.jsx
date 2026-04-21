import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Phone, MessageCircle } from "lucide-react";
import {
  fetchClients,
  fetchClientsByProperty,
  createClient,
  updateClient,
  deleteClient,
} from "../../utils/clientsApi";

const ESTADOS_LEAD = ["Nuevo", "Contactado", "Visita agendada", "Negociando", "Cerrado"];

const ESTADO_COLORS = {
  Nuevo:            { bg: "#1e3a5f", text: "#60a5fa", dot: "#3b82f6" },
  Contactado:       { bg: "#1e3a2e", text: "#4ade80", dot: "#22c55e" },
  "Visita agendada":{ bg: "#3a2e1e", text: "#fbbf24", dot: "#f59e0b" },
  Negociando:       { bg: "#3a1e2e", text: "#f472b6", dot: "#ec4899" },
  Cerrado:          { bg: "#2e1e1e", text: "#f87171", dot: "#ef4444" },
};

export function ClientsView({ onBack, theme, mode, propertyId = null, propertyName = null }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterEstado, setFilterEstado] = useState("");

  const load = async () => {
    setLoading(true);
    const data = propertyId
      ? await fetchClientsByProperty(propertyId)
      : await fetchClients();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [propertyId]);

  const handleSave = async (payload, id) => {
    if (id) await updateClient(id, payload);
    else await createClient(payload);
    await load();
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este lead?")) return;
    await deleteClient(id);
    setClients((c) => c.filter((x) => x.id !== id));
  };

  const handleChangeEstado = async (id, estado) => {
    await updateClient(id, { estado });
    setClients((c) => c.map((x) => x.id === id ? { ...x, estado } : x));
  };

  const filtered = filterEstado
    ? clients.filter((c) => c.estado === filterEstado)
    : clients;

  const bg = theme.colors.bg;
  const bgCard = theme.colors.bgCard;
  const bgSecondary = theme.colors.bgSecondary;
  const border = theme.colors.border;
  const text = theme.colors.text;
  const muted = theme.colors.textMuted;
  const primary = theme.colors.primary;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Outfit', sans-serif", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px",
        background: mode === "dark" ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10,
        borderBottom: `1px solid ${border}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: primary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700 }}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={{ fontWeight: 800, fontSize: 17, color: text }}>
          {propertyName ? `Leads · ${propertyName}` : "CRM · Leads"}
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          style={{ background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)", color: "#0a0a0a", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          + Lead
        </button>
      </div>

      {/* Filtro por estado */}
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", overflowX: "auto" }}>
        {["", ...ESTADOS_LEAD].map((e) => (
          <button
            key={e}
            onClick={() => setFilterEstado(e)}
            style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "none",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: filterEstado === e ? "linear-gradient(135deg, #d4af37, #b8962e)" : bgSecondary,
              color: filterEstado === e ? "#0a0a0a" : muted,
            }}
          >
            {e || "Todos"}
          </button>
        ))}
      </div>

      {/* Contador */}
      <div style={{ padding: "0 20px 8px", fontSize: 12, color: muted, fontWeight: 600 }}>
        {loading ? "Cargando..." : `${filtered.length} lead${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {/* Lista */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: muted, fontSize: 14 }}>
            Sin leads todavía. Toca + Lead para agregar.
          </div>
        )}
        {filtered.map((c) => {
          const ec = ESTADO_COLORS[c.estado] || ESTADO_COLORS.Nuevo;
          return (
            <div key={c.id} style={{ background: bgCard, borderRadius: 16, border: `1px solid ${border}`, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 2 }}>{c.nombre}</div>
                  {c.telefono && (
                    <div style={{ fontSize: 13, color: muted, marginBottom: 4 }}>{c.telefono}</div>
                  )}
                  {c.propiedades && (
                    <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>
                      🏠 {c.propiedades.tipo} · {c.propiedades.distrito}
                    </div>
                  )}
                  {c.nota && (
                    <div style={{ fontSize: 13, color: muted, background: bgSecondary, borderRadius: 8, padding: "6px 10px", marginBottom: 8 }}>
                      {c.nota}
                    </div>
                  )}
                  {/* Estado selector */}
                  <select
                    value={c.estado}
                    onChange={(e) => handleChangeEstado(c.id, e.target.value)}
                    style={{
                      fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 10px",
                      cursor: "pointer", outline: "none", border: "none",
                      backgroundColor: ec.bg, color: ec.text,
                    }}
                  >
                    {ESTADOS_LEAD.map((s) => (
                      <option key={s} value={s} style={{ background: "#1a1a1a", color: "#fff" }}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Acciones */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 12 }}>
                  {c.telefono && (
                    <>
                      <a
                        href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                      >
                        <MessageCircle size={16} strokeWidth={1.5} />
                      </a>
                      <a
                        href={`tel:${c.telefono.replace(/\D/g, "")}`}
                        style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                      >
                        <Phone size={16} strokeWidth={1.5} />
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => { setEditTarget(c); setShowForm(true); }}
                    style={{ background: bgSecondary, border: `1px solid ${border}`, color: text, borderRadius: 10, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: 10, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <ClientForm
          initial={editTarget}
          propertyId={propertyId}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          theme={theme}
          mode={mode}
        />
      )}
    </div>
  );
}

function ClientForm({ initial, propertyId, onSave, onClose, theme, mode }) {
  const [form, setForm] = useState({
    nombre: initial?.nombre || "",
    telefono: initial?.telefono || "",
    propiedad_id: initial?.propiedad_id || propertyId || "",
    estado: initial?.estado || "Nuevo",
    nota: initial?.nota || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.nombre.trim()) { alert("El nombre es obligatorio"); return; }
    setSaving(true);
    await onSave(form, initial?.id);
    setSaving(false);
  };

  const bg = theme.colors.bgSecondary;
  const border = theme.colors.border;
  const text = theme.colors.text;
  const muted = theme.colors.textMuted;

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${border}`, fontSize: 15, boxSizing: "border-box",
    outline: "none", background: "rgba(255,255,255,0.03)", color: text,
  };
  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 600, color: muted,
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: bg, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "20px 20px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${border}` }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: text }}>
            {initial ? "Editar lead" : "Nuevo lead"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: muted, cursor: "pointer" }}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input style={inputStyle} value={form.nombre} placeholder="Nombre del cliente" onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono / WhatsApp</label>
            <input style={inputStyle} value={form.telefono} placeholder="+51 999 999 999" onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <select style={inputStyle} value={form.estado} onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}>
              {ESTADOS_LEAD.map((s) => <option key={s} value={s} style={{ background: "#1a1a1a" }}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nota</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              value={form.nota}
              placeholder="Presupuesto, preferencias, comentarios..."
              onChange={(e) => setForm(f => ({ ...f, nota: e.target.value }))}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: `1px solid ${border}` }}>
          <button onClick={onClose} style={{ flex: 1, padding: 14, background: "rgba(255,255,255,0.08)", border: `1px solid ${border}`, borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", color: text }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: 14, background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)", color: "#0a0a0a", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
