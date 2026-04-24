import { useState, useEffect } from "react";
import { X, Phone, MessageCircle } from "lucide-react";
import { supabase } from "../../config/supabase";
import { useTheme } from "../../hooks/useTheme";
import { getPropietarioModalStyles } from "../../styles/componentStyles.js";

export function PropietarioModal({ propertyId, onClose }) {
  const { t } = useTheme();
  const [contactos, setContactos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "" });

  const styles = getPropietarioModalStyles(t);

  useEffect(() => {
    const load = async () => {
      const { data: prop } = await supabase
        .from("propiedades")
        .select("propietario_id")
        .eq("id", propertyId)
        .single();
      setSelectedId(prop?.propietario_id || null);

      const { data: contacts } = await supabase
        .from("contactos")
        .select("id, nombre, telefono")
        .eq("tipo", "propietario")
        .order("nombre");
      setContactos(contacts || []);
      setLoading(false);
    };
    load();
  }, [propertyId]);

  useEffect(() => {
    if (selectedId) {
      const contacto = contactos.find(c => c.id === selectedId);
      if (contacto) {
        setForm({ nombre: contacto.nombre, telefono: contacto.telefono || "" });
      }
    } else {
      setForm({ nombre: "", telefono: "" });
    }
  }, [selectedId, contactos]);

  const handleAsignar = async () => {
    await supabase
      .from("propiedades")
      .update({ propietario_id: selectedId })
      .eq("id", propertyId);
    onClose();
  };

  const handleDesasignar = async () => {
    await supabase
      .from("propiedades")
      .update({ propietario_id: null })
      .eq("id", propertyId);
    onClose();
  };

  const handleSaveContact = async () => {
    if (!form.nombre.trim()) return;
    if (selectedId) {
      await supabase.from("contactos").update(form).eq("id", selectedId);
    } else {
      const { data } = await supabase
        .from("contactos")
        .insert({ ...form, tipo: "propietario" })
        .select("id")
        .single();
      if (data) setSelectedId(data.id);
    }
    setEditMode(false);
    const { data: contacts } = await supabase
      .from("contactos")
      .select("id, nombre, telefono")
      .eq("tipo", "propietario")
      .order("nombre");
    setContactos(contacts || []);
  };

  const contactoSeleccionado = contactos.find(c => c.id === selectedId);

  if (loading) return <div style={styles.modal}>Cargando...</div>;

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
                <button onClick={() => setEditMode(true)} style={styles.editBtn}>
                  ✏️ Editar
                </button>
              </div>
            </div>
          )}

          {editMode && (
            <div style={styles.editForm}>
              <input
                style={styles.input}
                value={form.nombre}
                onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre"
              />
              <input
                style={styles.input}
                value={form.telefono}
                onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
                placeholder="Teléfono"
              />
              <div style={styles.editActions}>
                <button onClick={handleSaveContact} style={styles.saveBtn}>
                  Guardar
                </button>
                <button onClick={() => setEditMode(false)} style={styles.cancelBtn}>
                  Cancelar
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
                  <option key={c.id} value={c.id}>{c.nombre}</option>
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
                onClick={() => { setSelectedId(null); setEditMode(true); }}
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