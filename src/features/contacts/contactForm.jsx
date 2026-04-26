// src/features/contacts/ContactForm.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "../../config/supabase.js";
import { useTheme } from "../../hooks/useTheme.jsx";

const ESTADOS_LEAD = ["Interesado", "Seguimiento", "Visita", "Vendido/Alquilado", "Cerrado"];
const ESTADOS_PROPIETARIO = ["Captación", "Propuesta/Tasación", "Negociación", "Firmado / Cerrado"];

export function ContactForm({
  initial,
  propertyId,
  tipoFiltro,
  tipoLabel,
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

  const bg = t.colors.bgSecondary;
  const border = t.colors.border;
  const text = t.colors.text;
  const muted = t.colors.textMuted;
  const primary = t.colors.primary;
  const primaryDark = mode === "dark" ? "#0a0a0a" : "#ffffff";
  const overlayBg = mode === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)";

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${border}`, fontSize: 15, boxSizing: "border-box",
    outline: "none", background: bg, color: text,
  };
  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 600, color: muted,
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: overlayBg,
      backdropFilter: "blur(10px)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: bg, width: "90%", maxWidth: 400,
        maxHeight: "85vh", display: "flex", flexDirection: "column", borderRadius: 20,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 24px", borderBottom: `1px solid ${border}`,
        }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: text }}>
            {initial ? `Editar ${tipoLabel}` : `Nuevo ${tipoLabel}`}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: muted, cursor: "pointer" }}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          overflowY: "auto", padding: "20px 24px",
          flex: 1, display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input
              style={inputStyle}
              value={form.nombre}
              placeholder="Nombre del contacto"
              onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Teléfono / WhatsApp</label>
            <input
              style={inputStyle}
              value={form.telefono}
              placeholder="+51 999 999 999"
              onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
            />
          </div>

          {/* Selector de propiedad solo en CRM general */}
          {!propertyId && (
            <div>
              <label style={labelStyle}>Asociar a Propiedad</label>
              <select
                style={inputStyle}
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

          <div>
            <label style={labelStyle}>Estado</label>
            <select
              style={inputStyle}
              value={form.estado}
              onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}
            >
              {estados.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
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

        {/* Footer */}
        <div style={{
          display: "flex", gap: 12, padding: "16px 24px",
          borderTop: `1px solid ${border}`,
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 14, background: bg,
              border: `1px solid ${border}`, borderRadius: 12,
              fontWeight: 700, fontSize: 15, cursor: "pointer", color: text,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2, padding: 14, background: primary, color: primaryDark,
              border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15,
              cursor: "pointer", boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
            }}
          >
            {saving ? "Guardando..." : initial ? "Guardar cambios" : `Crear ${tipoLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}
