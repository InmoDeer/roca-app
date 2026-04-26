import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Phone, MessageCircle } from "lucide-react";
import { supabase } from "../../config/supabase.js";
import { ContactForm } from "./contactForm.jsx";
import {
  fetchContacts,
  fetchContactsByProperty,
  createContact,
  updateContact,
  deleteContact,
} from "../../utils/contactsApi.js";
import { getClientsViewStyles } from "../../styles/componentStyles.js";

const ESTADOS_LEAD = ["Interesado", "Seguimiento", "Visita", "Vendido/Alquilado", "Cerrado"];
const ESTADOS_PROPIETARIO = ["Captación", "Propuesta/Tasación", "Negociación", "Firmado / Cerrado"];

const ESTADO_COLORS = {
  // LEADS
  Interesado: { bg: "#1a1a1a", text: "#9e8a4b", dot: "#9e8a4b" },
  Seguimiento: { bg: "#1a1a1a", text: "#c4a44a", dot: "#c4a44a" },
  Visita: { bg: "#1a1a1a", text: "#d4af37", dot: "#d4af37" },
  "Vendido/Alquilado": { bg: "#1a1a1a", text: "#00ff88", dot: "#00ff88" },
  Cerrado: { bg: "#1a1a1a", text: "#666666", dot: "#666666" },
  // PROPIETARIOS
  Captación: { bg: "#1a1a1a", text: "#9e8a4b", dot: "#9e8a4b" },
  "Propuesta/Tasación": { bg: "#1a1a1a", text: "#c4a44a", dot: "#c4a44a" },
  Negociación: { bg: "#1a1a1a", text: "#e5c04a", dot: "#e5c04a" },
  "Firmado / Cerrado": { bg: "#1a1a1a", text: "#00ff88", dot: "#00ff88" },
  // ESTADO GENERAL
  Descartado: { bg: "#1a1a1a", text: "#555555", dot: "#555555" },
};

export function ContactsView({ onBack, theme, mode, user, propertyId = null, propertyName = null, tipoInicial = 'lead', defaultEstadoLead = 'Interesado', defaultEstadoProp = 'Captación' }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterEstado, setFilterEstado] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState(tipoInicial);
  const tipoLabel = tipoFiltro === 'lead' ? 'Lead' : 'Propietario';
  const tipoLabelPlural = tipoFiltro === 'lead' ? 'Leads' : 'Propietarios';

  const load = async () => {
    setLoading(true);
    const data = propertyId
      ? await fetchContactsByProperty(propertyId, user?.id, tipoFiltro)
      : await fetchContacts(user?.id, tipoFiltro);
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [propertyId, user?.id, tipoFiltro]);

  const handleSave = async (payload, id) => {
    const enriched = { ...payload, user_id: user?.id, tipo: tipoFiltro };
    
    if (id) {
      const oldContact = contacts.find(c => c.id === id);
      const oldPropiedadId = oldContact?.propiedad_id;
      const newPropiedadId = payload.propiedad_id;
      
      await updateContact(id, enriched);
      
      if (tipoFiltro === 'propietario') {
        if (oldPropiedadId && oldPropiedadId !== newPropiedadId) {
          await supabase.from("propiedades").update({ propietario_id: null }).eq("id", oldPropiedadId);
        }
        if (newPropiedadId && oldPropiedadId !== newPropiedadId) {
          await supabase.from("propiedades").update({ propietario_id: id }).eq("id", newPropiedadId);
        }
      }
    } else {
      await createContact(enriched);
      if (tipoFiltro === 'propietario' && payload.propiedad_id) {
        const newId = (await supabase.from("contactos").select("id").eq("user_id", user?.id).eq("tipo", "propietario").eq("propiedad_id", payload.propiedad_id).single()).data?.id;
        if (newId) {
          await supabase.from("propiedades").update({ propietario_id: newId }).eq("id", payload.propiedad_id);
        }
      }
    }
    
    await load();
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = async (id) => {
    if (!confirm(`¿Eliminar este ${tipoLabel}?`)) return;
    await deleteContact(id);
    setContacts((c) => c.filter((x) => x.id !== id));
  };

  const handleChangeEstado = async (id, estado) => {
    const contacto = contacts.find(c => c.id === id);
    const oldEstado = contacto?.estado;
    
    await updateContact(id, { estado });
    setContacts((c) => c.map((x) => x.id === id ? { ...x, estado } : x));
    
    if (tipoFiltro === 'propietario' && estado === "Firmado / Cerrado" && contacto?.propiedad_id) {
      await supabase.from("propiedades").update({ propietario_id: id }).eq("id", contacto.propiedad_id);
    }
    if (tipoFiltro === 'propietario' && oldEstado === "Firmado / Cerrado" && estado !== "Firmado / Cerrado" && contacto?.propiedad_id) {
      await supabase.from("propiedades").update({ propietario_id: null }).eq("id", contacto.propiedad_id);
    }
  };

const filtered = filterEstado
    ? contacts.filter((c) => c.estado === filterEstado)
    : contacts;

  const dynamicEstados = tipoFiltro === 'lead' ? ESTADOS_LEAD : ESTADOS_PROPIETARIO;

  const styles = getClientsViewStyles(theme, mode);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={styles.headerTitle}>
          {propertyName ? `${tipoLabelPlural} · ${propertyName}` : `CRM · ${tipoLabelPlural}`}
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          style={styles.addBtn}
        >
+ {tipoLabel}
        </button>
      </div>

      {/* Filtro por estado */}
      <div style={styles.filterContainer}>
        {["", ...dynamicEstados].map((e) => (
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
        {loading ? "Cargando..." : `${filtered.length} ${tipoLabelPlural.toLowerCase()}`}
      </div>

      {/* Lista */}
      <div style={styles.list}>
        {!loading && filtered.length === 0 && (
          <div style={styles.empty}>
            Sin {tipoLabelPlural.toLowerCase()} todavía. Toca + {tipoLabel} para agregar.
          </div>
        )}
        {filtered.map((c) => {
          const ec = ESTADO_COLORS[c.estado] || ESTADO_COLORS.Interesado;
          const text = theme.colors.text;
          const muted = theme.colors.textMuted;
          return (
            <div
              key={c.id}
              style={{
                ...styles.leadCard,
                borderLeftWidth: 4,
                borderLeftStyle: 'solid',
                borderLeftColor: ec.dot,
                padding: "10px 12px",
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: text, marginBottom: 2 }}>{c.nombre}</div>
                  
                  {!propertyId && c.propiedades && (
                    <div style={{ fontSize: 11, color: muted, marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      🏠 {c.propiedades.nombre || c.propiedades.tipo} · {c.propiedades.distrito}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {c.telefono && (
                    <>
                      <a
                        href={`https://wa.me/${c.telefono.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ ...styles.waBtn, padding: '6px 8px' }}
                      >
                        <MessageCircle size={14} strokeWidth={1.5} />
                      </a>
                      <a
                        href={`tel:${c.telefono.replace(/\D/g, '')}`}
                        style={{ ...styles.telBtn, padding: '6px 8px' }}
                      >
                        <Phone size={14} strokeWidth={1.5} />
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => { setEditTarget(c); setShowForm(true); }}
                    style={{ ...styles.actionBtn, padding: '6px 8px' }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ ...styles.deleteBtn, padding: '6px 8px' }}
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {c.nota && (
                <div style={{ fontSize: 12, color: muted, marginTop: 0, whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                  {c.nota}
                </div>
              )}
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
          userId={user?.id}
          tipoLabel={tipoLabel}
          tipoFiltro={tipoFiltro}
          defaultEstadoLead={defaultEstadoLead}
          defaultEstadoProp={defaultEstadoProp}
        />
      )}
    </div>
  );
}
