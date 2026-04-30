import { useState } from "react";
import { ArrowLeft, X, Phone, MessageCircle, Building2, PencilLine } from "lucide-react";
import { ContactForm } from "./contactForm.jsx";
import { useContacts } from "../../hooks/useContacts";
import { useTheme } from "../../hooks/useTheme.jsx";
import { getClientsViewStyles, getContactCardStyles } from "../../styles/componentStyles.js";
import { getStatusColors, getPipelineForEntity } from "../../styles/statusColors.js";
import { ESTADOS_LEAD, ESTADOS_PROPIETARIO } from "../../utils/constants";

export function ContactsView({
  onBack,
  user,
  propertyId = null,
  propertyName = null,
  tipoInicial = "lead",
  defaultEstadoLead = "Interesado",
  defaultEstadoProp = "Contactado",
}) {
  const { t, mode } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterEstado, setFilterEstado] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState(tipoInicial);

  const { contacts, loading, saveContact, removeContact, changeEstado } =
    useContacts(user?.id, tipoFiltro, propertyId);

  const tipoLabel = tipoFiltro === "lead" ? "Lead" : "Propietario";
  const tipoLabelPlural = tipoFiltro === "lead" ? "Leads" : "Propietarios";
  const dynamicEstados = tipoFiltro === "lead" ? ESTADOS_LEAD : ESTADOS_PROPIETARIO;

  const styles = getClientsViewStyles(t, mode);

  const handleSave = async (payload, id) => {
    await saveContact(payload, id, tipoFiltro);
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = async (id) => {
    if (!confirm(`¿Eliminar este ${tipoLabel}?`)) return;
    await removeContact(id);
  };

  const handleChangeEstado = async (id, estado) => {
    await changeEstado(id, estado, tipoFiltro);
  };

  const filtered = filterEstado
    ? contacts.filter((c) => c.estado === filterEstado)
    : contacts;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={styles.headerTitle}>
          {propertyName
            ? `${tipoLabelPlural} · ${propertyName}`
            : `CRM · ${tipoLabelPlural}`}
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          style={styles.addBtn}
        >
          + {tipoLabel}
        </button>
      </div>

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

      <div style={styles.counter}>
        {loading
          ? "Cargando..."
          : `${filtered.length} ${tipoLabelPlural.toLowerCase()}`}
      </div>

      <div style={styles.list}>
        {!loading && filtered.length === 0 && (
          <div style={styles.empty}>
            Sin {tipoLabelPlural.toLowerCase()} todavía. Toca + {tipoLabel} para agregar.
          </div>
        )}
        {filtered.map((c) => {
          const pipelineType = tipoFiltro === "lead" ? "lead" : "propietario";
          const pipeline = getPipelineForEntity(pipelineType);
          const ec = getStatusColors(c.estado, pipeline, t, mode, "solid");
          const cardStyles = getContactCardStyles(t, ec);
          return (
            <div key={c.id} style={cardStyles.card}>
              <div style={cardStyles.cardContent}>
                <div style={cardStyles.name}>{c.nombre}</div>
                {!propertyId && c.propiedades && (
                  <div style={cardStyles.property}>
                    <Building2 size={12} style={{ marginRight: 4 }} />
                    {c.propiedades.nombre || c.propiedades.tipo} · {c.propiedades.distrito}
                  </div>
                )}
                {c.nota && (
                  <div style={cardStyles.note}>{c.nota}</div>
                )}
              </div>

              <div style={cardStyles.actions}>
                {c.telefono && (
                  <>
                    <a
                      href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.waBtn}
                    >
                      <MessageCircle size={14} strokeWidth={1.5} />
                    </a>
                    <a
                      href={`tel:${c.telefono.replace(/\D/g, "")}`}
                      style={styles.telBtn}
                    >
                      <Phone size={14} strokeWidth={1.5} />
                    </a>
                  </>
                )}
                <button
                  onClick={() => { setEditTarget(c); setShowForm(true); }}
                  style={styles.actionBtn}
                >
                  <PencilLine size={16} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={styles.deleteBtn}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

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