import { useState, useEffect } from "react";
import { X, Phone, MessageCircle } from "lucide-react";
import { supabase } from "../../config/supabase";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { getPropietarioModalStyles } from "../../styles/componentStyles.js";
import { ContactForm } from "./contactForm.jsx";
import { assignPropietarioToPropiedad, unassignPropietario, createContactAndReturn, updateContact } from "../../utils/contactsApi";

export function PropietarioModal({ propertyId, onClose, onCrearPropiedad, onRefresh }) {
  const { user } = useAuth();
  const { t } = useTheme();
  const userId = user?.id;
  const [contactos, setContactos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const styles = getPropietarioModalStyles(t);

  useEffect(() => {
    const load = async () => {
      const userId = user?.id;
      
      const { data: prop } = await supabase
        .from("propiedades")
        .select("propietario_id")
        .eq("id", propertyId)
        .single();
      setSelectedId(prop?.propietario_id || null);

      let query = supabase
        .from("contactos")
        .select("id, nombre, telefono, estado")
        .eq("tipo", "propietario");
      
      if (userId) {
        query = query.eq("user_id", userId);
      }
      
      const { data: contacts } = await query.order("nombre");
      setContactos(contacts || []);
      setLoading(false);
    };
    load();
  }, [propertyId, user]);

  const handleAsignar = async () => {
    await assignPropietarioToPropiedad(propertyId, selectedId);
    onClose();
  };

  const handleDesasignar = async () => {
    await unassignPropietario(propertyId, selectedId);
    onClose();
  };

  const refreshContactos = async () => {
    let query = supabase
      .from("contactos")
      .select("id, nombre, telefono, estado")
      .eq("tipo", "propietario");
    
    if (userId) {
      query = query.eq("user_id", userId);
    }
    
    const { data: contacts } = await query.order("nombre");
    setContactos(contacts || []);
  };

  const handleEdit = (contacto) => {
    setEditData(contacto);
    setEditMode(true);
  };

  const handleNew = () => {
    setEditData({ nombre: "", telefono: "", estado: "Contactado" });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    await refreshContactos();
    setEditMode(false);
    setEditData(null);
  };

  const handleCloseEdit = () => {
    setEditMode(false);
    setEditData(null);
  };

  const handleCrearPropiedadFromForm = (propietarioId) => {
    if (onCrearPropiedad) {
      onClose();
      onCrearPropiedad(propietarioId);
    }
  };

  const contactoSeleccionado = contactos.find(c => c.id === selectedId);

  if (loading) return <div style={styles.modal}>Cargando...</div>;

  if (editMode && editData) {
    return (
<ContactForm
          initial={editData}
          propertyId={propertyId}
          tipoFiltro="propietario"
          tipoLabel="Propietario"
          userId={userId}
          defaultEstadoProp="Cerrado"
          hideEstado={true}
        onSave={async (payload) => {
          const payloadCompleto = { ...payload, estado: "Cerrado", propiedad_id: propertyId };
          if (editData?.id) {
            await updateContact(editData.id, payloadCompleto);
          } else {
            const nuevoId = await createContactAndReturn({ ...payloadCompleto, tipo: "propietario", user_id: userId });
            await assignPropietarioToPropiedad(propertyId, nuevoId);
            setSelectedId(nuevoId);
            onRefresh?.();
          }
          await handleSaveEdit();
        }}
        onClose={handleCloseEdit}
      />
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>Propietario</span>
          <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        </div>

        <div style={styles.body}>
          {!editMode && contactoSeleccionado && (
            <div style={styles.infoCard}>
              <div style={styles.infoName}>{contactoSeleccionado.nombre}</div>
              {contactoSeleccionado.telefono && (
                <div style={styles.infoPhone}>{contactoSeleccionado.telefono}</div>
              )}
              <div style={styles.actionRow}>
                {contactoSeleccionado.telefono && (
                  <>
                    <a
                      href={`https://wa.me/${contactoSeleccionado.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.waBtn}
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                    <a
                      href={`tel:${contactoSeleccionado.telefono.replace(/\D/g, '')}`}
                      style={styles.telBtn}
                    >
                      <Phone size={18} /> Llamar
                    </a>
                  </>
                )}
                <button onClick={() => handleEdit(contactoSeleccionado)} style={styles.editBtn}>
                  ✏️ Editar
                </button>
              </div>
            </div>
          )}

          {!editMode && (
            <>
              <div style={styles.sectionTitle}>Asignar propietario</div>
              <select
                style={styles.select}
                value={selectedId || ""}
                onChange={(e) => setSelectedId(e.target.value || null)}
              >
                <option value="">-- Seleccionar --</option>
                {contactos.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.estado ? `· ${c.estado}` : ""}</option>
                ))}
              </select>
              <div style={styles.asignarActions}>
                <button
                  onClick={handleAsignar}
                  style={styles.asignarBtn}
                  disabled={!selectedId}
                >
                  Asignar
                </button>
                {selectedId && (
                  <button onClick={handleDesasignar} style={styles.desasignarBtn}>
                    Desasignar
                  </button>
                )}
              </div>
              <button
                onClick={handleNew}
                style={styles.newBtn}
              >
                + Crear nuevo propietario
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}