import { useState, useRef, useMemo } from "react";
import { Field } from "../../components/formFields/Field";
import { Select } from "../../components/formFields/Select";
import { Checkbox } from "../../components/formFields/Checkbox";
import { uploadToCloudinary, deleteCloudinaryImages } from "../../utils/cloudinary";
import { useTheme } from "../../hooks/useTheme.jsx";
import {
  ArrowUp, Armchair, Sparkles, Camera, X, Car, Flame,
  Waves, WashingMachine, DoorOpen, Sun, Box, CookingPot,
  ShieldCheck, Building2, Trees, Users, Utensils, Baby, Dumbbell, Wind,
} from "lucide-react";
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
  const { t } = useTheme();
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
    estado: "Disponible",
    balcon: false,
    ventanas_amplias: false,
    vista: "",
    cerca_a: "",
    cocina_equipada: false,
    closet: false,
    recepcion: false,
    areas_comunes: false,
    piscina: false,
    terraza: false,
    jardin: false,
    sum: false,
    parrilla: false,
    juegos_ninos: false,
    gimnasio: false,
    tendal: false,
    gas_natural: false,
    lavanderia: false,
    destacados_manuales: [],
  };

  const formStyles = getFormStyles(t);

  const [form, setForm] = useState(initial || blank);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [dragSourceIdx, setDragSourceIdx] = useState(null);
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
    const fotoUrl = form.fotos_urls[i];
    if (fotoUrl) {
      deleteCloudinaryImages(fotoUrl);
    }
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
    if (dragSourceIdx !== null && dragOverIdx !== null && dragSourceIdx !== dragOverIdx) {
      movePhoto(dragSourceIdx, dragOverIdx);
    }
    setDraggingIdx(null);
    setDragOverIdx(null);
    setDragSourceIdx(null);
  };

  const getVisibleFotos = () => {
    if (draggingIdx === null || dragOverIdx === null) {
      return form.fotos_urls || [];
    }
    const newFotos = [...(form.fotos_urls || [])];
    const [moved] = newFotos.splice(dragSourceIdx, 1);
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
        mantenimiento: form.mantenimiento ? Number(form.mantenimiento) : null,
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
        balcon: !!form.balcon,
        ventanas_amplias: !!form.ventanas_amplias,
        vista: form.vista || null,
        cerca_a: form.cerca_a || null,
        cocina_equipada: !!form.cocina_equipada,
        closet: !!form.closet,
        recepcion: !!form.recepcion,
        areas_comunes: !!form.areas_comunes,
        piscina: !!form.piscina,
        terraza: !!form.terraza,
        jardin: !!form.jardin,
        sum: !!form.sum,
        parrilla: !!form.parrilla,
        juegos_ninos: !!form.juegos_ninos,
        gimnasio: !!form.gimnasio,
        gas_natural: !!form.gas_natural,
        lavanderia: !!form.lavanderia,
        tendal: !!form.tendal,
        destacados_manuales: form.destacados_manuales || [],
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

          <div style={formStyles.section}>Ubicación</div>
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
          <Field
            label="Cerca de..."
            k="cerca_a"
            form={form}
            setForm={setForm}
            placeholder="Ej: Metro, Wong, Parque Kennedy"
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

          <div style={formStyles.section}>Características físicas</div>
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

          <div style={formStyles.section}>Amenities y extras</div>
          <div style={formStyles.checkGrid}>
            <Checkbox label="Cochera" k="cochera" form={form} setForm={setForm} icon={Car} />
            <Checkbox label="Ascensor" k="ascensor" form={form} setForm={setForm} icon={ArrowUp} />
            <Checkbox label="Amoblado" k="amoblado" form={form} setForm={setForm} icon={Armchair} />
            <Checkbox label="Cuarto y baño de servicio" k="area_servicio" form={form} setForm={setForm} icon={Sparkles} />
            <Checkbox label="Gas natural" k="gas_natural" form={form} setForm={setForm} icon={Flame} />
            <Checkbox label="Lavandería" k="lavanderia" form={form} setForm={setForm} icon={WashingMachine} />
          </div>
          <Select
            label="Mascotas"
            k="mascotas"
            form={form}
            setForm={setForm}
            opts={MASCOTAS_OPTIONS}
          />

          <div style={formStyles.section}>Calidad y confort</div>
          <div style={formStyles.checkGrid}>
            <Checkbox label="Balcón" k="balcon" form={form} setForm={setForm} icon={DoorOpen} />
            <Checkbox label="Ventanas amplias" k="ventanas_amplias" form={form} setForm={setForm} icon={Sun} />
            <Checkbox label="Closets empotrados" k="closet" form={form} setForm={setForm} icon={Box} />
            <Checkbox label="Cocina equipada" k="cocina_equipada" form={form} setForm={setForm} icon={CookingPot} />
            <Checkbox label="Recepción / Seguridad 24h" k="recepcion" form={form} setForm={setForm} icon={ShieldCheck} />
          </div>

          <Select
            label="Vista"
            k="vista"
            form={form}
            setForm={setForm}
            opts={["", "Calle", "Avenida", "Parque", "Jardín interior", "Panorámica", "Mar"]}
          />

          <Checkbox
            label="Áreas comunes"
            k="areas_comunes"
            form={form}
            setForm={setForm}
            icon={Building2}
          />

          {form.areas_comunes && (
            <div style={{ marginTop: 8, paddingLeft: 16 }}>
              <div style={formStyles.checkGrid}>
                <Checkbox label="Piscina" k="piscina" form={form} setForm={setForm} icon={Waves} />
                <Checkbox label="Terraza" k="terraza" form={form} setForm={setForm} icon={Sun} />
                <Checkbox label="Jardín" k="jardin" form={form} setForm={setForm} icon={Trees} />
                <Checkbox label="SUM" k="sum" form={form} setForm={setForm} icon={Users} />
                <Checkbox label="Parrilla" k="parrilla" form={form} setForm={setForm} icon={Utensils} />
                <Checkbox label="Juegos infantiles" k="juegos_ninos" form={form} setForm={setForm} icon={Baby} />
                <Checkbox label="Gimnasio" k="gimnasio" form={form} setForm={setForm} icon={Dumbbell} />
                <Checkbox label="Tendal" k="tendal" form={form} setForm={setForm} icon={Wind} />
              </div>
            </div>
          )}

          <div style={formStyles.section}>Destacar en el mensaje</div>
          <p style={{ fontSize: 12, color: '#888888', marginBottom: 8 }}>
            Elige hasta 3 características que quieras resaltar primero en WhatsApp.
          </p>
          <ManualHighlightsSelector form={form} setForm={setForm} />

          {/* MULTIMEDIA (Fotos + Video + Tour 360) */}
          <div style={formStyles.section}>Multimedia</div>
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
                  onDragStart={() => { setDraggingIdx(i); setDragSourceIdx(i); }}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...formStyles.photoThumbWrap,
                    transform: draggingIdx !== null && i === dragOverIdx ? 'scale(1.02)' : 'scale(1)',
                    cursor: 'grab',
                    border: draggingIdx !== null && i === dragOverIdx ? '2px dashed #e8ff4f' : 'none',
                    backgroundColor: draggingIdx !== null && i === dragOverIdx ? 'rgba(232, 255, 79, 0.1)' : 'transparent',
                    padding: draggingIdx !== null && i === dragOverIdx ? 2 : 0,
                    marginLeft: draggingIdx !== null && i === dragOverIdx ? '10px' : '0',
                  }}
                >
                  <span style={formStyles.dragHandle}>⇕</span>
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

const getFormStyles = (theme) => ({
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
    background: theme.colors.bg,
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
    borderBottom: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  title: {
    fontWeight: 800,
    fontSize: 18,
    color: theme.colors.text,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: theme.colors.textMuted,
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
    borderTop: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    background: theme.colors.bgSecondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    color: theme.colors.text,
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
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "20px 0 12px",
    paddingBottom: 8,
    borderBottom: `1px solid ${theme.colors.border}`,
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
    background: theme.colors.bgSecondary,
    border: `1.5px dashed ${theme.colors.border}`,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 14,
    color: theme.colors.text,
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
    transition: "transform 0.2s ease, border 0.2s ease, background-color 0.2s ease",
    borderRadius: 10,
    overflow: "hidden",
    minWidth: 80,
    minHeight: 80,
  },
  photoThumb: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 10,
    display: "block",
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
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 18,
    color: "#ffffff",
    background: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "grab",
    zIndex: 5,
    letterSpacing: 1,
    pointerEvents: "auto",
    border: "1px solid rgba(255,255,255,0.2)",
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
});

function ManualHighlightsSelector({ form, setForm }) {
  const { t } = useTheme();
  const availableOptions = useMemo(() => {
    const options = [];
    const p = form;

    if (p.balcon) options.push({ key: 'balcon', label: '🌿 Balcón privado' });
    if (p.ventanas_amplias) options.push({ key: 'ventanas_amplias', label: '🪟 Ventanas amplias' });
    if (p.vista && p.vista !== '') options.push({ key: `vista_${p.vista}`, label: `🏞️ Vista ${p.vista.toLowerCase()}` });
    if (p.cocina_equipada) options.push({ key: 'cocina_equipada', label: '🍳 Cocina equipada' });
    if (p.closet) options.push({ key: 'closet', label: '🚪 Closets empotrados' });
    if (p.recepcion) options.push({ key: 'recepcion', label: '🛎️ Recepción 24h' });
    if (p.cochera) options.push({ key: 'cochera', label: '🚗 Estacionamiento' });
    if (p.ascensor) options.push({ key: 'ascensor', label: '🛗 Ascensor' });
    if (p.amoblado) options.push({ key: 'amoblado', label: '🛋️ Amoblado' });
    if (p.area_servicio) options.push({ key: 'area_servicio', label: '🧺 Cuarto de servicio' });
    if (p.mascotas === 'Sí') options.push({ key: 'mascotas', label: '🐾 Pet friendly' });
    if (p.gas_natural) options.push({ key: 'gas_natural', label: '🔥 Gas natural' });
    if (p.lavanderia) options.push({ key: 'lavanderia', label: '🧺 Lavandería' });
    if (p.piscina) options.push({ key: 'piscina', label: '🏊 Piscina' });
    if (p.gimnasio) options.push({ key: 'gimnasio', label: '💪 Gimnasio' });
    if (p.tendal) options.push({ key: 'tendal', label: '🧺 Tendal' });
    if (p.terraza) options.push({ key: 'terraza', label: '🌇 Terraza' });
    if (p.jardin) options.push({ key: 'jardin', label: '🌳 Jardín' });
    if (p.parrilla) options.push({ key: 'parrilla', label: '🔥 Parrilla' });
    if (p.juegos_ninos) options.push({ key: 'juegos_ninos', label: '🧸 Juegos infantiles' });

    return options;
  }, [form]);

  const selected = form.destacados_manuales || [];

  const toggleOption = (key) => {
    let newSelected = [...selected];
    if (newSelected.includes(key)) {
      newSelected = newSelected.filter(k => k !== key);
    } else {
      if (newSelected.length >= 3) {
        alert('Puedes seleccionar máximo 3 destacados.');
        return;
      }
      newSelected.push(key);
    }
    setForm({ ...form, destacados_manuales: newSelected });
  };

  if (availableOptions.length === 0) {
    return <p style={{ color: t.colors.textMuted, fontSize: 13, marginBottom: 16 }}>Completa las características del inmueble para poder destacarlas.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
      {availableOptions.map(opt => (
        <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.colors.text, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={selected.includes(opt.key)}
            onChange={() => toggleOption(opt.key)}
            style={{ accentColor: '#d4af37' }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}