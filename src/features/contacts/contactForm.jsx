// src/features/contacts/ContactForm.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "../../config/supabase.js";
import { useTheme } from "../../hooks/useTheme.jsx";
import { getContactFormStyles } from "../../styles/componentStyles.js";
import { ESTADOS_LEAD, ESTADOS_PROPIETARIO } from "../../utils/constants";

export function ContactForm({
  initial,
  propertyId,
  tipoFiltro,
  tipoLabel,
  hideEstado = false,
  defaultEstadoLead = "Interesado",
  defaultEstadoProp = "Captación",
  onSave,
  onClose,
  userId,
}) {
  const { t, mode } = useTheme();

  const defaultEstado = initial?.estado || (tipoFiltro === "lead" ? defaultEstadoLead : defaultEstadoProp);

  const [form, setForm] = useState({
    nombre: initial?.nombre || "",
    telefono: initial?.telefono || "",
    propiedad_id: initial?.propiedad_id || propertyId || null,
    estado: defaultEstado,
    nota: initial?.nota || "",
  });
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!propertyId && userId) {
      supabase
        .from("propiedades")
        .select("id, nombre, tipo, distrito")
        .eq("user_id", userId)
        .order("nombre")
        .then(({ data }) => { if (data) setProperties(data); });
    }
  }, [propertyId, userId]);

  const handleSave = async () => {
    if (!form.nombre.trim()) { alert("El nombre es obligatorio"); return; }
    setSaving(true);
    await onSave({ ...form, propiedad_id: form.propiedad_id || null }, initial?.id);
    setSaving(false);
  };

  const estados = tipoFiltro === "lead" ? ESTADOS_LEAD : ESTADOS_PROPIETARIO;
  const S = getContactFormStyles(t, mode);

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.header}>
          <span style={S.headerTitle}>
            {initial ? `Editar ${tipoLabel}` : `Nuevo ${tipoLabel}`}
          </span>
          <button onClick={onClose} style={S.closeBtn}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div style={S.body}>
          <div>
            <label style={S.label}>Nombre *</label>
            <input
              style={S.input}
              value={form.nombre}
              placeholder="Nombre del contacto"
              onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div>
            <label style={S.label}>Teléfono / WhatsApp</label>
            <input
              style={S.input}
              value={form.telefono}
              placeholder="+51 999 999 999"
              onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
            />
          </div>

          {!propertyId && (
            <div>
              <label style={S.label}>Asociar a Propiedad</label>
              <select
                style={S.input}
                value={form.propiedad_id || ""}
                onChange={(e) => setForm(f => ({ ...f, propiedad_id: e.target.value || null }))}
              >
                <option value="">Ninguna</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} · {p.tipo} ({p.distrito})
                  </option>
                ))}
              </select>
            </div>
          )}

          {!hideEstado && (
          <div>
            <label style={S.label}>Estado</label>
            <select
              style={S.input}
              value={form.estado}
              onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}
            >
              {estados.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          )}

          <div>
            <label style={S.label}>Nota</label>
            <textarea
              style={S.noteInput}
              value={form.nota}
              placeholder="Presupuesto, preferencias, comentarios..."
              onChange={(e) => setForm(f => ({ ...f, nota: e.target.value }))}
            />
          </div>
        </div>

        <div style={S.footer}>
          <button onClick={onClose} style={S.btnCancel}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} style={S.btnSave}>
            {saving ? "Guardando..." : initial ? "Guardar cambios" : `Crear ${tipoLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}