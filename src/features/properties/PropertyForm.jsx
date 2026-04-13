import { useState, useRef } from "react";
import { Field } from "../../components/formFields/Field";
import { Select } from "../../components/formFields/Select";
import { Checkbox } from "../../components/formFields/Checkbox";
import { uploadToCloudinary } from "../../utils/cloudinary";
import {
  PROPERTY_TYPES,
  OPERATIONS,
  CURRENCIES,
  ANTIGUEDAD_OPTIONS,
  MASCOTAS_OPTIONS,
} from "../../utils/constants";

/**
 * Property form component for creating/editing properties
 * Handles photo uploads to Cloudinary, form validation and submission
 */
export function PropertyForm({ initial, onSave, onClose }) {
  const blank = {
    nombre: "",
    tipo: "Departamento",
    operacion: "Alquiler",
    distrito: "",
    direccion: "",
    maps_url: "",
    precio: "",
    moneda: "PEN",
    mantenimiento: "",
    dormitorios: "",
    ambientes: "",
    banos: "",
    area_m2: "",
    piso: "",
    antiguedad: "",
    cochera: false,
    ascensor: false,
    amoblado: false,
    area_servicio: false,
    mascotas: "No",
    fotos_urls: [],
    video_url: "",
    tour360_url: "",
    frase_destacada: "",
    estado: "Disponible",
  };

  const [form, setForm] = useState(initial || blank);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const fileRef = useRef();

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setForm((f) => ({
        ...f,
        fotos_urls: [...(f.fotos_urls || []), ...urls],
      }));
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (i) => {
    setForm((f) => {
      const arr = [...f.fotos_urls];
      arr.splice(i, 1);
      return { ...f, fotos_urls: arr };
    });
  };

  const movePhoto = (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return;
    setForm((f) => {
      const newFotos = [...f.fotos_urls];
      const [moved] = newFotos.splice(fromIdx, 1);
      newFotos.splice(toIdx, 0, moved);
      return { ...f, fotos_urls: newFotos };
    });
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (draggingIdx !== null && i !== draggingIdx) {
      setDragOverIdx(i);
    }
  };

  const handleDragEnd = () => {
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const handleSave = async () => {
    if (!form.nombre || !form.distrito || !form.precio) {
      alert("Por favor completa: Nombre, Distrito y Precio");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre,
        tipo: form.tipo,
        operacion: form.operacion,
        estado: form.estado || "Disponible",
        distrito: form.distrito,
        direccion: form.direccion || null,
        maps_url: form.maps_url || null,
        precio: Number(form.precio),
        moneda: form.moneda,
        mantenimiento: form.mantenimiento
          ? Number(form.mantenimiento)
          : null,
        dormitorios: form.dormitorios ? Number(form.dormitorios) : null,
        ambientes: form.ambientes ? Number(form.ambientes) : null,
        banos: form.banos ? Number(form.banos) : null,
        area_m2: form.area_m2 ? Number(form.area_m2) : null,
        piso: form.piso ? Number(form.piso) : null,
        antiguedad: form.antiguedad || null,
        cochera: !!form.cochera,
        ascensor: !!form.ascensor,
        amoblado: !!form.amoblado,
        area_servicio: !!form.area_servicio,
        mascotas: form.mascotas || "No",
        fotos_urls: form.fotos_urls || [],
        video_url: form.video_url || null,
        tour360_url: form.tour360_url || null,
        frase_destacada: form.frase_destacada || null,
      };

      await onSave(payload, initial?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={formStyles.overlay} onClick={onClose}>
      <div style={formStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={formStyles.header}>
          <span style={formStyles.title}>
            {initial ? "✏️ Editar inmueble" : "➕ Nuevo inmueble"}
          </span>
          <button onClick={onClose} style={formStyles.closeBtn}>
            ✕
          </button>
        </div>
        <div style={formStyles.body}>
          <div style={formStyles.section}>📌 General</div>
          <Field
            label="Nombre*"
            k="nombre"
            form={form}
            setForm={setForm}
            placeholder="Depa Lince 98m²"
          />
          <div style={formStyles.row2}>
            <Select
              label="Tipo*"
              k="tipo"
              form={form}
              setForm={setForm}
              opts={PROPERTY_TYPES}
            />
            <Select
              label="Operación*"
              k="operacion"
              form={form}
              setForm={setForm}
              opts={OPERATIONS}
            />
          </div>

          <div style={formStyles.section}>📍 Ubicación</div>
          <div style={formStyles.row2}>
            <Field label="Distrito*" k="distrito" form={form} setForm={setForm} />
            <Field label="Dirección" k="direccion" form={form} setForm={setForm} />
          </div>
          <Field
            label="Google Maps URL (opcional)"
            k="maps_url"
            form={form}
            setForm={setForm}
            placeholder="Se genera automático"
          />

          <div style={formStyles.section}>💰 Precio</div>
          <div style={formStyles.row2}>
            <Field
              label="Precio*"
              k="precio"
              form={form}
              setForm={setForm}
              type="number"
            />
            <Select
              label="Moneda*"
              k="moneda"
              form={form}
              setForm={setForm}
              opts={CURRENCIES}
            />
          </div>
          <Field
            label="Mantenimiento mensual"
            k="mantenimiento"
            form={form}
            setForm={setForm}
            type="number"
            placeholder="opcional"
          />

          <div style={formStyles.section}>📐 Características</div>
          <div style={formStyles.row2}>
            <Field
              label="Dormitorios"
              k="dormitorios"
              form={form}
              setForm={setForm}
              type="number"
            />
            <Field
              label="Ambientes"
              k="ambientes"
              form={form}
              setForm={setForm}
              type="number"
            />
          </div>
          <div style={formStyles.row2}>
            <Field
              label="Baños"
              k="banos"
              form={form}
              setForm={setForm}
              type="number"
            />
            <Field
              label="Área m²"
              k="area_m2"
              form={form}
              setForm={setForm}
              type="number"
            />
          </div>
          <div style={formStyles.row2}>
            <Field
              label="🏬 Piso"
              k="piso"
              form={form}
              setForm={setForm}
              type="number"
              placeholder="ej: 5"
            />
            <Select
              label="🏗 Antigüedad"
              k="antiguedad"
              form={form}
              setForm={setForm}
              opts={ANTIGUEDAD_OPTIONS}
            />
          </div>

          <div style={formStyles.section}>✨ Extras</div>
          <div style={formStyles.checkGrid}>
            <Checkbox label="🚗 Cochera" k="cochera" form={form} setForm={setForm} />
            <Checkbox label="🛗 Ascensor" k="ascensor" form={form} setForm={setForm} />
            <Checkbox label="🛋 Amoblado" k="amoblado" form={form} setForm={setForm} />
            <Checkbox label="🧹 Área servicio" k="area_servicio" form={form} setForm={setForm} />
          </div>
          <Select
            label="🐶 Mascotas"
            k="mascotas"
            form={form}
            setForm={setForm}
            opts={MASCOTAS_OPTIONS}
          />

          <div style={formStyles.section}>📸 Fotos</div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handlePhotos}
          />
          <button
            onClick={() => fileRef.current.click()}
            style={formStyles.uploadBtn}
            disabled={uploading}
          >
            {uploading ? "⏳ Subiendo fotos..." : "📱 Seleccionar fotos"}
          </button>
          {(form.fotos_urls || []).length > 0 && (
            <div style={formStyles.photoGrid}>
              {form.fotos_urls.map((url, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDraggingIdx(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => { e.preventDefault(); movePhoto(draggingIdx, i); }}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...formStyles.photoThumbWrap,
                    opacity: draggingIdx === i ? 0.5 : 1,
                    transform: draggingIdx === i ? 'scale(1.05)' : 'scale(1)',
                    cursor: 'grab',
                    border: dragOverIdx === i && draggingIdx !== i ? '2px dashed #e8ff4f' : 'none',
                    padding: dragOverIdx === i && draggingIdx !== i ? 2 : 0,
                  }}
                >
                  <span style={formStyles.dragHandle}>⋮⋮</span>
                  <img src={url} alt="" style={formStyles.photoThumb} />
                  <button
                    onClick={() => removePhoto(i)}
                    style={formStyles.photoRemove}
                  >
                    ✕
                  </button>
                  {i === 0 && <span style={formStyles.mainPhotoBadge}>Principal</span>}
                </div>
              ))}
            </div>
          )}

          <div style={formStyles.section}>🎥 Media adicional</div>
          <Field
            label="Video (YouTube URL)"
            k="video_url"
            form={form}
            setForm={setForm}
            placeholder="opcional"
          />
          <Field
            label="Tour 360 URL"
            k="tour360_url"
            form={form}
            setForm={setForm}
            placeholder="opcional"
          />

          <div style={formStyles.section}>💬 Copywriting</div>
          <Field
            label="Frase destacada"
            k="frase_destacada"
            form={form}
            setForm={setForm}
            placeholder="opcional"
          />
        </div>

        <div style={formStyles.footer}>
          <button onClick={onClose} style={formStyles.cancelBtn}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} style={formStyles.saveBtn}>
            {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear inmueble"}
          </button>
        </div>
      </div>
    </div>
  );
}

const formStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    zIndex: 100,
    display: "flex",
    alignItems: "flex-end",
  },
  modal: {
    background: "#fff",
    borderRadius: "20px 20px 0 0",
    width: "100%",
    maxHeight: "92vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #eee",
    flexShrink: 0,
  },
  title: {
    fontWeight: 800,
    fontSize: 17,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    color: "#888",
  },
  body: {
    overflowY: "auto",
    padding: "16px 20px",
    flex: 1,
  },
  footer: {
    display: "flex",
    gap: 10,
    padding: "14px 20px",
    borderTop: "1px solid #eee",
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    background: "#f0f0ec",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  saveBtn: {
    flex: 2,
    padding: 12,
    background: "#1a1a1a",
    color: "#e8ff4f",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  section: {
    fontWeight: 800,
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    margin: "18px 0 10px",
    paddingBottom: 6,
    borderBottom: "1px solid #f0f0ec",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 12,
  },
  uploadBtn: {
    width: "100%",
    padding: "12px",
    background: "#f0f0ec",
    border: "1.5px dashed #ccc",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 12,
  },
  photoGrid: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  photoThumbWrap: {
    position: "relative",
    transition: "all 0.2s ease",
  },
  photoThumb: {
    width: 72,
    height: 72,
    objectFit: "cover",
    borderRadius: 8,
  },
  photoRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 20,
    height: 20,
    fontSize: 11,
    cursor: "pointer",
  },
  dragHandle: {
    position: "absolute",
    top: 4,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 12,
    color: "#888",
    background: "rgba(255,255,255,0.9)",
    borderRadius: 4,
    padding: "2px 6px",
    cursor: "grab",
    zIndex: 5,
  },
  mainPhotoBadge: {
    position: "absolute",
    bottom: 4,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 9,
    fontWeight: 700,
    color: "#fff",
    background: "rgba(0,0,0,0.7)",
    borderRadius: 4,
    padding: "2px 6px",
    whiteSpace: "nowrap",
  },
};
