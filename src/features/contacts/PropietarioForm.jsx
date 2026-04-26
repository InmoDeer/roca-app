import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { supabase } from "../../config/supabase";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const ESTADOS_PROPIETARIO = ["Captación", "Propuesta/Tasación", "Negociación", "Firmado / Cerrado"];

export function PropietarioForm({ initial, onSave, onClose, onCrearPropiedad }) {
  const { t, mode } = useTheme();
  const { user } = useAuth();
  const userId = user?.id;

  const [form, setForm] = useState({
    nombre: initial?.nombre || "",
    telefono: initial?.telefono || "",
    propiedad_id: initial?.propiedad_id || null,
    estado: initial?.estado || "Captación",
  });
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (userId) {
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
  }, [userId]);

  const handleSave = async () => {
    if (!form.nombre.trim()) { alert("El nombre es obligatorio"); return; }
    setSaving(true);
    
    const payload = { 
      ...form, 
      propiedad_id: form.propiedad_id || null,
      tipo: "propietario",
      user_id: userId,
    };
    
    if (initial?.id) {
      await supabase.from("contactos").update(payload).eq("id", initial.id);
    } else {
      await supabase.from("contactos").insert(payload);
    }
    
    if (onSave) onSave();
    setSaving(false);
  };

  const handleCrearPropiedad = async () => {
    if (!form.nombre.trim()) { alert("Guarda primero el propietario"); return; }
    setSaving(true);
    
    const payload = { 
      ...form, 
      propiedad_id: form.propiedad_id || null,
      tipo: "propietario",
      user_id: userId,
    };
    
    let propietarioId;
    if (initial?.id) {
      await supabase.from("contactos").update(payload).eq("id", initial.id);
      propietarioId = initial.id;
    } else {
      const { data } = await supabase
        .from("contactos")
        .insert(payload)
        .select("id")
        .single();
      if (data) propietarioId = data.id;
    }
    
    setSaving(false);
    if (onClose) onClose();
    if (onCrearPropiedad) onCrearPropiedad(propietarioId);
  };

  const bg = t.colors.bg;
  const border = t.colors.border;
  const text = t.colors.text;
  const muted = t.colors.textMuted;

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${border}`, fontSize: 15, boxSizing: "border-box",
    outline: "none", background: t.colors.bgSecondary, color: text,
  };
  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 600, color: muted,
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px",
  };

  const showPropiedadSelector = form.estado === "Firmado / Cerrado";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: bg, width: "90%", maxWidth: 400, maxHeight: "85vh", display: "flex", flexDirection: "column", borderRadius: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${border}` }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: text }}>
            {initial ? "Editar Propietario" : "Nuevo Propietario"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: muted, cursor: "pointer" }}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input style={inputStyle} value={form.nombre} placeholder="Nombre del propietario" onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono / WhatsApp</label>
            <input style={inputStyle} value={form.telefono} placeholder="+51 999 999 999" onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <select 
              style={inputStyle} 
              value={form.estado} 
              onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}
            >
              {ESTADOS_PROPIETARIO.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {showPropiedadSelector && (
            <div>
              <label style={labelStyle}>Asociar a Propiedad</label>
              <div style={{ display: "flex", gap: 8 }}>
                <select 
                  style={{ ...inputStyle, flex: 1 }} 
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
                <button
                  onClick={handleCrearPropiedad}
                  disabled={saving}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "#d4af37",
                    color: "#000",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Plus size={18} /> Crear
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "20px 24px", borderTop: `1px solid ${border}`, display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: 12, border: `1px solid ${border}`, background: "transparent", color: text, fontSize: 15, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "#d4af37", color: "#000", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}