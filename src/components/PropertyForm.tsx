"use client";
import { useState, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { RocaDialog } from "@/components/ui/dialog";
import { Field } from "@/components/formFields/Field";
import { Select } from "@/components/formFields/Select";
import { Checkbox } from "@/components/formFields/Checkbox";
import { ManualHighlightsSelector } from "@/components/ManualHighlightsSelector";
import { uploadToCloudinary, deleteCloudinaryImages } from "@/lib/cloudinary";
import { buildPropertyPayload } from "@/lib/api";
import { getFormStyles } from "@/styles/componentStyles";
import {
  PROPERTY_TYPES, OPERATIONS, CURRENCIES,
  ANTIGUEDAD_OPTIONS, MASCOTAS_OPTIONS,
  ZONA_OPTIONS, PERFIL_IDEAL_OPTIONS, VISTA_OPTIONS,
} from "@/lib/constants";
import {
  ArrowUp, Armchair, Sparkles, Camera, X, Car, Flame,
  Waves, WashingMachine, DoorOpen, Sun, Box, CookingPot,
  ShieldCheck, Building2, Trees, Users, Utensils, Baby, Dumbbell, Wind,
  GripHorizontal,
} from "lucide-react";

export function PropertyForm({ initial, onSave, onClose }: any) {
  const { t } = useTheme();

  const blank = {
    nombre: "", tipo: "Departamento", operacion: "Alquiler", distrito: "",
    direccion: "", maps_url: "", precio: "", moneda: "PEN", mantenimiento: "",
    dormitorios: "", ambientes: "", banos: "", area_m2: "", piso: "",
    antiguedad: "", cochera: false, ascensor: false, amoblado: false,
    area_servicio: false, mascotas: "No", fotos_urls: [], video_url: "",
    tour360_url: "", estado: "Disponible", balcon: false, ventanas_amplias: false,
    vista: "", cerca_a: "", limita_con: "", cocina_equipada: false, closet: false,
    recepcion: false, areas_comunes: false, piscina: false, terraza: false,
    jardin: false, sum: false, parrilla: false, juegos_ninos: false, gimnasio: false,
    tendal: false, gas_natural: false, lavanderia: false, destacados_manuales: [],
    // Campos nuevos
    zona: "",
    perfil_ideal: "",
  };

  const formStyles = getFormStyles(t);
  const [form, setForm] = useState(initial || blank);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragSourceIdx, setDragSourceIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotos = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setForm((f: any) => ({ ...f, fotos_urls: [...(f.fotos_urls || []), ...urls] }));
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (i: number) => {
    const fotoUrl = form.fotos_urls[i];
    if (fotoUrl) deleteCloudinaryImages(fotoUrl);
    setForm((f: any) => {
      const arr = [...f.fotos_urls];
      arr.splice(i, 1);
      return { ...f, fotos_urls: arr };
    });
  };

  const movePhoto = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    setForm((f: any) => {
      const newFotos = [...f.fotos_urls];
      const [moved] = newFotos.splice(fromIdx, 1);
      newFotos.splice(toIdx, 0, moved);
      return { ...f, fotos_urls: newFotos };
    });
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const handleDragOver = (e: any, i: number) => {
    e.preventDefault();
    if (draggingIdx !== null && i !== draggingIdx) setDragOverIdx(i);
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
    if (draggingIdx === null || dragOverIdx === null) return form.fotos_urls || [];
    const newFotos = [...(form.fotos_urls || [])];
    const [moved] = newFotos.splice(dragSourceIdx!, 1);
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
      const payload = buildPropertyPayload(form);

      await onSave(payload, initial?.id);

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <RocaDialog
      open={true}
      onOpenChange={(isOpen: boolean) => { if (!isOpen) onClose(); }}
      title={initial ? "Editar propiedad" : "Nueva propiedad"}
      variant="bottom"
      footer={
        <>
          <button onClick={onClose} style={formStyles.cancelBtn}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={formStyles.saveBtn}>
            {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear inmueble"}
          </button>
        </>
      }
    >
      <div style={formStyles.body}>

        {/* ── GENERAL ── */}
        <div style={formStyles.section}>General</div>
        <Field label="Nombre*" k="nombre" form={form} setForm={setForm} placeholder="Depa Lince 98m²" />
        <div style={formStyles.row2}>
          <Select label="Tipo*" k="tipo" form={form} setForm={setForm} opts={PROPERTY_TYPES} />
          <Select label="Operación*" k="operacion" form={form} setForm={setForm} opts={OPERATIONS} />
        </div>

        {/* ── UBICACIÓN ── */}
        <div style={formStyles.section}>Ubicación</div>
        <div style={formStyles.row2}>
          <Field label="Distrito*" k="distrito" form={form} setForm={setForm} />
          <Field label="Dirección" k="direccion" form={form} setForm={setForm} />
        </div>
        <Field
          label="Google Maps URL (opcional)"
          k="maps_url" form={form} setForm={setForm}
          placeholder="Se genera automático"
        />
        <Field
          label="Limita con distrito..."
          k="limita_con" form={form} setForm={setForm}
          placeholder="Ej: San Isidro, San Miguel, Pueblo Libre"
        />
        <Field
          label="Cerca de..."
          k="cerca_a" form={form} setForm={setForm}
          placeholder="Ej: Metro, Wong, Parque Kennedy"
        />

        {/* Zona y perfil — impactan directamente el mensaje */}
        <div style={formStyles.row2}>
          <Select
            label="Tipo de zona"
            k="zona" form={form} setForm={setForm}
            opts={ZONA_OPTIONS}
          />
          <Select
            label="Perfil ideal"
            k="perfil_ideal" form={form} setForm={setForm}
            opts={PERFIL_IDEAL_OPTIONS}
          />
        </div>

        {/* ── PRECIO ── */}
        <div style={formStyles.section}>Precio</div>
        <div style={formStyles.row2}>
          <Field label="Precio*" k="precio" form={form} setForm={setForm} type="number" />
          <Select label="Moneda*" k="moneda" form={form} setForm={setForm} opts={CURRENCIES} />
        </div>
        <Field
          label="Mantenimiento mensual"
          k="mantenimiento" form={form} setForm={setForm}
          type="number" placeholder="opcional"
        />

        {/* ── CARACTERÍSTICAS FÍSICAS ── */}
        <div style={formStyles.section}>Características físicas</div>
        <div style={formStyles.row2}>
          <Field label="Dormitorios" k="dormitorios" form={form} setForm={setForm} type="number" />
          <Field label="Ambientes" k="ambientes" form={form} setForm={setForm} type="number" />
        </div>
        <div style={formStyles.row2}>
          <Field label="Baños" k="banos" form={form} setForm={setForm} type="number" />
          <Field label="Área m²" k="area_m2" form={form} setForm={setForm} type="number" />
        </div>
        <div style={formStyles.row2}>
          <Field label="Piso" k="piso" form={form} setForm={setForm} type="number" placeholder="ej: 5" />
          <Select label="Antigüedad" k="antiguedad" form={form} setForm={setForm} opts={ANTIGUEDAD_OPTIONS} />
        </div>

        {/* ── AMENITIES Y EXTRAS ── */}
        <div style={formStyles.section}>Amenities y extras</div>
        <div style={formStyles.checkGrid}>
          <Checkbox label="Cochera" k="cochera" form={form} setForm={setForm} icon={Car} />
          <Checkbox label="Ascensor" k="ascensor" form={form} setForm={setForm} icon={ArrowUp} />
          <Checkbox label="Amoblado" k="amoblado" form={form} setForm={setForm} icon={Armchair} />
          <Checkbox label="Cuarto y baño de servicio" k="area_servicio" form={form} setForm={setForm} icon={Sparkles} />
          <Checkbox label="Gas natural" k="gas_natural" form={form} setForm={setForm} icon={Flame} />
          <Checkbox label="Lavandería" k="lavanderia" form={form} setForm={setForm} icon={WashingMachine} />
        </div>
        <Select label="Mascotas" k="mascotas" form={form} setForm={setForm} opts={MASCOTAS_OPTIONS} />

        {/* ── CALIDAD Y CONFORT ── */}
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
          k="vista" form={form} setForm={setForm}
          opts={[...VISTA_OPTIONS]}
        />

        {/* ── ÁREAS COMUNES ── */}
        <Checkbox label="Áreas comunes" k="areas_comunes" form={form} setForm={setForm} icon={Building2} />
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

        {/* ── DESTACADOS MANUALES ── */}
        <div style={formStyles.section}>Destacar en el mensaje</div>
        <p style={{ fontSize: 12, color: t.colors.textMuted, marginBottom: 8 }}>
          Elige hasta 3 características que quieras resaltar primero en WhatsApp.
        </p>
        <ManualHighlightsSelector form={form} setForm={setForm} />

        {/* ── MULTIMEDIA ── */}
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
          onClick={() => fileRef.current?.click()}
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
            {getVisibleFotos().map((url: string, i: number) => (
              <div
                key={i}
                draggable
                onDragStart={() => { setDraggingIdx(i); setDragSourceIdx(i); }}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                style={{
                  ...formStyles.photoThumbWrap,
                  transform: draggingIdx !== null && i === dragOverIdx ? "scale(1.02)" : "scale(1)",
                  cursor: "grab",
                  border: draggingIdx !== null && i === dragOverIdx ? `2px dashed ${t.colors.primary}` : "none",
                  backgroundColor: draggingIdx !== null && i === dragOverIdx ? `${t.colors.primary}1A` : "transparent",
                  padding: draggingIdx !== null && i === dragOverIdx ? 2 : 0,
                  marginLeft: draggingIdx !== null && i === dragOverIdx ? "10px" : "0",
                }}
              >
                <span style={formStyles.dragHandle}><GripHorizontal size={18} strokeWidth={1.5} /></span>
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

        <Field label="Video (YouTube URL)" k="video_url" form={form} setForm={setForm} placeholder="opcional" />
        <Field label="Tour 360 URL" k="tour360_url" form={form} setForm={setForm} placeholder="opcional" />


      </div>
    </RocaDialog>
  );
}
