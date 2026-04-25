import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Phone, MessageCircle } from "lucide-react";
import {
  fetchContacts,
  fetchContactsByProperty,
  createContact,
  updateContact,
  deleteContact,
} from "../../utils/contactsApi.js";
// Importamos supabase para poder listar las propiedades en el select
import { supabase } from "../../config/supabase.js";

import { getClientsViewStyles } from "../../styles/componentStyles.js";

const ESTADOS_LEAD = ["Nuevo", "Contactado", "Visita agendada", "Negociando", "Cerrado"];

const ESTADO_COLORS = {
  Nuevo: { bg: "#1e3a5f", text: "#60a5fa", dot: "#3b82f6" },
  Contactado: { bg: "#1e3a2e", text: "#4ade80", dot: "#22c55e" },
  "Visita agendada": { bg: "#3a2e1e", text: "#fbbf24", dot: "#f59e0b" },
  Negociando: { bg: "#3a1e2e", text: "#f472b6", dot: "#ec4899" },
  Cerrado: { bg: "#2e1e1e", text: "#f87171", dot: "#ef4444" },
};

export function ContactsView({ onBack, theme, mode, user, propertyId = null, propertyName = null }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterEstado, setFilterEstado] = useState("");

  const load = async () => {
    setLoading(true);
    const data = propertyId
      ? await fetchContactsByProperty(propertyId, user?.id)
      : await fetchContacts(user?.id);
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [propertyId, user?.id]);

  const handleSave = async (payload, id) => {
    const enriched = { ...payload, user_id: user?.id };
    if (id) await updateContact(id, enriched);
    else await createContact(enriched);
    await load();
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este lead?")) return;
    await deleteContact(id);
    setContacts((c) => c.filter((x) => x.id !== id));
  };

  const handleChangeEstado = async (id, estado) => {
    await updateContact(id, { estado });
    setContacts((c) => c.map((x) => x.id === id ? { ...x, estado } : x));
  };

  const filtered = filterEstado
    ? contacts.filter((c) => c.estado === filterEstado)
    : contacts;

  const styles = getClientsViewStyles(theme, mode);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={styles.headerTitle}>
          {propertyName ? `Leads · ${propertyName}` : "CRM · Leads"}
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          style={styles.addBtn}
        >
          + Lead
        </button>
      </div>

      {/* Filtro por estado */}
      <div style={styles.filterContainer}>
        {["", ...ESTADOS_LEAD].map((e) => (
          <button
            key={e}
            onClick={() => setFilterEstado(e)}
            style={styles.filterBtn(filterEstado === e)}
          >
            {e || "Todos"}
          </button>
        ))}
      </div>

      {/* Contador */}
      <div style={styles.counter}>
        {loading ? "Cargando..." : `${filtered.length} lead${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {/* Lista */}
      <div style={styles.list}>
        {!loading && filtered.length === 0 && (
          <div style={styles.empty}>
            Sin leads todavía. Toca + Lead para agregar.
          </div>
        )}
        {filtered.map((c) => {
          const ec = ESTADO_COLORS[c.estado] || ESTADO_COLORS.Nuevo;
          return (
            <div key={c.id} style={styles.leadCard}>
              <div style={styles.leadRow}>
                <div style={styles.leadInfo}>
                  <div style={styles.leadName}>{c.nombre}</div>
                  {c.telefono && (
                    <div style={styles.leadPhone}>{c.telefono}</div>
                  )}
                  {c.propiedades && (
                    <div style={styles.leadProperty}>
                      🏠 {c.propiedades.tipo} · {c.propiedades.distrito}
                    </div>
                  )}
                  {c.nota && (
                    <div style={styles.leadNote}>
                      {c.nota}
                    </div>
                  )}
                  {/* Estado selector */}
                  <select
                    value={c.estado}
                    onChange={(e) => handleChangeEstado(c.id, e.target.value)}
                    style={styles.estadoSelect(ec)}
                  >
                    {ESTADOS_LEAD.map((s) => (
                      <option key={s} value={s} style={{ background: "#1a1a1a", color: "#fff" }}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Acciones */}
                <div style={styles.actions}>
                  {c.telefono && (
                    <>
                      <a
                        href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.waBtn}
                      >
                        <MessageCircle size={16} strokeWidth={1.5} />
                      </a>
                      <a
                        href={`tel:${c.telefono.replace(/\D/g, "")}`}
                        style={styles.telBtn}
                      >
                        <Phone size={16} strokeWidth={1.5} />
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => { setEditTarget(c); setShowForm(true); }}
                    style={styles.actionBtn}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={styles.deleteBtn}
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
        <ContactForm
          initial={editTarget}
          propertyId={propertyId}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          theme={theme}
          mode={mode}
          userId={user?.id}
        />
      )}
    </div>
  );
}


function ContactForm({ initial, propertyId, onSave, onClose, theme, mode, userId }) {
  const [form, setForm] = useState({
    nombre: initial?.nombre || "",
    telefono: initial?.telefono || "",
    propiedad_id: initial?.propiedad_id || propertyId || null,
    estado: initial?.estado || "Nuevo",
    nota: initial?.nota || "",
  });
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState([]);

  // Cargamos las propiedades solo si estamos en el CRM General (!propertyId)
  useEffect(() => {
    if (!propertyId && userId) {
      const loadProps = async () => {
        const { data } = await supabase
          .from("propiedades")
          .select("id, nombre, tipo, distrito")
          .eq("user_id", userId)
          .order("nombre");
        if (data) setProperties(data);
      };
      loadProps();
    }
  }, [propertyId, userId]);

  const handleSave = async () => {
    if (!form.nombre.trim()) { alert("El nombre es obligatorio"); return; }
    setSaving(true);
    
    // Aseguramos que si propiedad_id está vacío, se envíe como null para la base de datos
    const payload = { 
      ...form, 
      propiedad_id: form.propiedad_id || null 
    };
    
    await onSave(payload, initial?.id);
    setSaving(false);
  };

  const bg = theme.colors.bgSecondary;
  const bgSecondary = theme.colors.bgSecondary;
  const border = theme.colors.border;
  const text = theme.colors.text;
  const muted = theme.colors.textMuted;
  const primary = theme.colors.primary;
  const primaryDark = mode === "dark" ? "#0a0a0a" : "#ffffff";

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${border}`, fontSize: 15, boxSizing: "border-box",
    outline: "none", background: bgSecondary, color: text,
  };
  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 600, color: muted,
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px",
  };

  const overlayBg = mode === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)";

  return (
    <div style={{ position: "fixed", inset: 0, background: overlayBg, backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: bg, width: "90%", maxWidth: 400, maxHeight: "85vh", display: "flex", flexDirection: "column", borderRadius: 20 }}>
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
            <input style={inputStyle} value={form.nombre} placeholder="Nombre del contacto" onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono / WhatsApp</label>
            <input style={inputStyle} value={form.telefono} placeholder="+51 999 999 999" onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))} />
          </div>

          {/* Solo mostramos el selector si no venimos de una propiedad específica */}
          {!propertyId && (
            <div>
              <label style={labelStyle}>Asociar a Propiedad</label>
              <select 
                style={inputStyle} 
                value={form.propiedad_id || ""} 
                onChange={(e) => setForm(f => ({ ...f, propiedad_id: e.target.value || null }))}
              >
                <option value="" style={{ background: "#1a1a1a" }}>Ninguna (Lead general)</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id} style={{ background: "#1a1a1a" }}>
                    {p.nombre} · {p.tipo} ({p.distrito})
                  </option>
                ))}
              </select>
            </div>
          )}

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
          <button onClick={onClose} style={{ flex: 1, padding: 14, background: bgSecondary, border: `1px solid ${border}`, borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", color: text }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: 14, background: primary, color: primaryDark, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 15px rgba(212,175,55,0.3)" }}>
            {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
