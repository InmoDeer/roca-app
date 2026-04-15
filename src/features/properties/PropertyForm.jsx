import { useState, useRef } from "react";
import { Field } from "../../components/formFields/Field";
import { Select } from "../../components/formFields/Select";
import { Checkbox } from "../../components/formFields/Checkbox";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { ArrowUp, Armchair, Sparkles, PawPrint, Camera, X, Car } from "lucide-react";
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
    if (draggingIdx !== null && dragOverIdx !== null && draggingIdx !== dragOverIdx) {
      movePhoto(draggingIdx, dragOverIdx);
    }
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const getVisibleFotos = () => {
    if (draggingIdx === null || dragOverIdx === null || draggingIdx === dragOverIdx) {
      return form.fotos_urls || [];
    }
    const newFotos = [...(form.fotos_urls || [])];
    const [moved] = newFotos.splice(draggingIdx, 1);
    newFotos.splice(dragOverIdx, 0, moved);
    return newFotos;
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
            {initial ? "Editar propiedad" : "Nueva propiedad"}
          </span>
          <button onClick={onClose} style={formStyles.closeBtn}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div style={formStyles.body}>
          <div style={formStyles.section}>General</div>
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

          <div style={formStyles.section}>Ubicacion</div>
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

          <div style={formStyles.section}>Precio</div>
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

          <div style={formStyles.section}>Características</div>
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

          <div style={formStyles.section}>Extras</div>
          <div style={formStyles.checkGrid}>
            <Checkbox label="Cochera" k="cochera" form={form} setForm={setForm} icon={Car} />
            <Checkbox label="Ascensor" k="ascensor" form={form} setForm={setForm} icon={ArrowUp} />
            <Checkbox label="Amoblado" k="amoblado" form={form} setForm={setForm} icon={Armchair} />
            <Checkbox label="Area servicio" k="area_servicio" form={form} setForm={setForm} icon={Sparkles} />
          </div>
          <Select
            label="Mascotas"
            k="mascotas"
            form={form}
            setForm={setForm}
            opts={MASCOTAS_OPTIONS}
          />

          <div style={formStyles.section}>Fotos</div>
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
            style={{
              ...formStyles.uploadBtn,
              opacity: uploading ? 0.6 : 1,
              pointerEvents: uploading ? "none" : "auto",
            }}
            disabled={uploading}
          >
            {uploading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={formStyles.spinner} />
                Subiendo fotos...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Camera size={18} strokeWidth={1.5} />
                Seleccionar fotos
              </span>
            )}
          </button>
          {(form.fotos_urls || []).length > 0 && (
            <div style={formStyles.photoGrid}>
              {getVisibleFotos().map((url, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDraggingIdx(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...formStyles.photoThumbWrap,
                    opacity: draggingIdx !== null && 
                      ((dragOverIdx === null && i === draggingIdx) || 
                       (dragOverIdx !== null && (
                         (draggingIdx < dragOverIdx && i > draggingIdx && i <= dragOverIdx) ||
                         (draggingIdx > dragOverIdx && i >= dragOverIdx && i < draggingIdx)
                       ))) ? 0.5 : 1,
                    transform: draggingIdx !== null && i === draggingIdx ? 'scale(1.05)' : 'scale(1)',
                    cursor: 'grab',
                    border: dragOverIdx !== null && i === dragOverIdx ? '2px dashed #e8ff4f' : 'none',
                    padding: dragOverIdx !== null && i === dragOverIdx ? 2 : 0,
                  }}
                >
                  <img src={url} alt="" style={formStyles.photoThumb} />
                  <button
                    onClick={() => {
                      const originalIdx = form.fotos_urls.indexOf(url);
                      removePhoto(originalIdx);
                    }}
                    style={formStyles.photoRemove}
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                  {i === 0 && <span style={formStyles.mainPhotoBadge}>Principal</span>}
                </div>
              ))}
            </div>
          )}

          <div style={formStyles.section}>Media</div>
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

          <div style={formStyles.section}>Copywriting</div>
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
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    zIndex: 100,
    display: "flex",
    alignItems: "flex-end",
  },
  modal: {
    background: "#121212",
    borderRadius: 0,
    width: "100%",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    marginTop: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  title: {
    fontWeight: 800,
    fontSize: 18,
    color: "#ffffff",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: "#666666",
    padding: 4,
  },
  body: {
    overflowY: "auto",
    padding: "20px 24px",
    flex: 1,
  },
  footer: {
    display: "flex",
    gap: 12,
    padding: "16px 24px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    color: "#ffffff",
  },
  saveBtn: {
    flex: 2,
    padding: 14,
    background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)",
    color: "#0a0a0a",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
  },
  section: {
    fontWeight: 800,
    fontSize: 11,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "20px 0 12px",
    paddingBottom: 8,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 14,
  },
  uploadBtn: {
    width: "100%",
    padding: "14px",
    background: "rgba(255,255,255,0.03)",
    border: "1.5px dashed rgba(255,255,255,0.15)",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 14,
    color: "#ffffff",
    transition: "all 0.3s ease",
  },
  photoGrid: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  photoThumbWrap: {
    position: "relative",
    transition: "all 0.2s ease",
    borderRadius: 10,
    overflow: "hidden",
  },
  photoThumb: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 10,
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 20,
    height: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  dragHandle: {
    position: "absolute",
    top: 6,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 12,
    color: "#666666",
    background: "rgba(0,0,0,0.6)",
    borderRadius: 4,
    padding: "2px 8px",
    cursor: "grab",
    zIndex: 5,
  },
  mainPhotoBadge: {
    position: "absolute",
    bottom: 6,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 9,
    fontWeight: 700,
    color: "#ffffff",
    background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)",
    borderRadius: 4,
    padding: "2px 8px",
    whiteSpace: "nowrap",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
