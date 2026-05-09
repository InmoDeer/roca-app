"use client";
// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { useTheme } from "@/hooks/useTheme";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { getAppStyles, getProfileMenuStyles } from "@/styles/componentStyles";
import { buildOutputs } from "@/lib/messageFormatter";
import { PIPELINE_PROPERTY } from "@/lib/constants";
import { fetchPropertyById } from "@/lib/api";
import { Sun, Moon, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

function PropertyDetail({ p, onBack, onEdit, onEstado, onDelete, onRefresh }: any) {
  const { t, mode } = useTheme();
  const out = buildOutputs(p);
  const [tab, setTab] = useState("corto");
  const [showGallery, setGallery] = useState(false);
  const { getStatusColors } = require("@/styles/statusColors");

  const detailStyles = require("@/styles/componentStyles").getPropertyDetailStyles(t, mode);
  const StatusSelect = require("@/components/ui/select").StatusSelect;
  const Gallery = require("@/components/ui/Gallery").Gallery;
  const CopyShareBtns = require("@/components/ui/CopyShareBtns").CopyShareBtns;

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar este inmueble? Esta acción no se puede deshacer.")) {
      onDelete(p.id);
    }
  };

  return (
    <div style={detailStyles.container}>
      <div style={detailStyles.header}>
        <button onClick={onBack} style={detailStyles.backBtn}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleDelete} style={detailStyles.iconBtn} title="Eliminar">
            🗑️
          </button>
          <button onClick={onEdit} style={detailStyles.iconBtn} title="Editar">
            ✏️
          </button>
        </div>
      </div>

      {out.fotos.length > 0 && (
        <div style={detailStyles.heroWrap} onClick={() => setGallery(true)}>
          <img src={out.fotos[0]} alt="" style={detailStyles.heroImg} />
          {out.fotos.length > 1 && (
            <div style={detailStyles.heroBadge}>👁️ {out.fotos.length} fotos</div>
          )}
        </div>
      )}

      <div style={detailStyles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={detailStyles.name}>{out.tituloDinamico}</div>
            <div style={detailStyles.sub}>{p.nombre} · {p.tipo} · {p.distrito}</div>
          </div>
          <StatusSelect value={p.estado} onValueChange={(v: string) => onEstado(p.id, v)} pipeline={PIPELINE_PROPERTY} operacion={p.operacion} />
        </div>
        <div style={detailStyles.precioBlock}>{out.precio}</div>
        {p.mantenimiento && <div style={detailStyles.mantBlock}>📄 Mantenimiento: S/ {p.mantenimiento}/mes</div>}
      </div>

      <div style={detailStyles.tabRow}>
        {["corto", "largo"].map((t: string) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...detailStyles.tab, ...(tab === t ? detailStyles.tabActive : {}) }}>
            {t === "corto" ? "⚡ Corto" : "🔥 Largo"}
          </button>
        ))}
      </div>

      <div style={detailStyles.msgBox}>
        <pre style={detailStyles.msgPre}>{tab === "corto" ? out.mensajeCorto : out.mensajeLargo}</pre>
        <CopyShareBtns text={tab === "corto" ? out.mensajeCorto : out.mensajeLargo} />
      </div>

      {showGallery && <Gallery fotos={out.fotos} onClose={() => setGallery(false)} />}
    </div>
  );
}

function PropertyForm({ initial, onSave, onClose }: any) {
  const { t } = useTheme();
  const { FIELD_TYPES } = require("@/lib/constants");
  const RocaDialog = require("@/components/ui/dialog").RocaDialog;
  const Field = require("@/components/formFields/Field").Field;
  const Select = require("@/components/formFields/Select").Select;
  const Checkbox = require("@/components/formFields/Checkbox").Checkbox;
  const { uploadToCloudinary } = require("@/lib/cloudinary");
  const { PROPERTY_TYPES, OPERATIONS, CURRENCIES, ANTIGUEDAD_OPTIONS, MASCOTAS_OPTIONS } = require("@/lib/constants");

  const blank = {
    nombre: "", tipo: "Departamento", operacion: "Alquiler", distrito: "",
    direccion: "", maps_url: "", precio: "", moneda: "PEN", mantenimiento: "",
    dormitorios: "", ambientes: "", banos: "", area_m2: "", piso: "",
    antiguedad: "", cochera: false, ascensor: false, amoblado: false,
    area_servicio: false, mascotas: "No", fotos_urls: [], video_url: "",
    tour360_url: "", estado: "Disponible", balcon: false, ventanas_amplias: false,
    vista: "", cerca_a: "", cocina_equipada: false, closet: false, recepcion: false,
    areas_comunes: false, piscina: false, terraza: false, jardin: false, sum: false,
    parrilla: false, juegos_ninos: false, gimnasio: false, tendal: false,
    gas_natural: false, lavanderia: false, destacados_manuales: [],
  };

  const formStyles = require("@/styles/componentStyles").getFormStyles(t);
  const [form, setForm] = useState(initial || blank);
  const [saving, setSaving] = useState(false);
  const fileRef = require("react").useRef(null);

  const handlePhotos = async (e: any) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const urls = await Promise.all(files.map(uploadToCloudinary));
    setForm((f: any) => ({ ...f, fotos_urls: [...(f.fotos_urls || []), ...urls] }));
  };

  const handleSave = async () => {
    if (!form.nombre || !form.distrito || !form.precio) {
      alert("Por favor completa: Nombre, Distrito y Precio");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, precio: Number(form.precio), mantenimiento: form.mantenimiento ? Number(form.mantenimiento) : null };
      await onSave(payload, initial?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <RocaDialog open={true} onOpenChange={(isOpen: boolean) => { if (!isOpen) onClose(); }} title={initial ? "Editar propiedad" : "Nueva propiedad"} variant="bottom" footer={
      <>
        <button onClick={onClose} style={formStyles.cancelBtn}>Cancelar</button>
        <button onClick={handleSave} disabled={saving} style={formStyles.saveBtn}>{saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear"}</button>
      </>
    }>
      <div style={formStyles.body}>
        <div style={formStyles.section}>General</div>
        <Field label="Nombre*" k="nombre" form={form} setForm={setForm} placeholder="Depa Lince 98m²" />
        <div style={formStyles.row2}>
          <Select label="Tipo*" k="tipo" form={form} setForm={setForm} opts={PROPERTY_TYPES} />
          <Select label="Op*" k="operacion" form={form} setForm={setForm} opts={OPERATIONS} />
        </div>
        <div style={formStyles.section}>Ubicación</div>
        <div style={formStyles.row2}>
          <Field label="Distrito*" k="distrito" form={form} setForm={setForm} />
          <Field label="Dirección" k="direccion" form={form} setForm={setForm} />
        </div>
        <div style={formStyles.section}>Precio</div>
        <div style={formStyles.row2}>
          <Field label="Precio*" k="precio" form={form} setForm={setForm} type="number" />
          <Select label="Moneda*" k="moneda" form={form} setForm={setForm} opts={CURRENCIES} />
        </div>
        <Field label="Mantenimiento" k="mantenimiento" form={form} setForm={setForm} type="number" />
        <div style={formStyles.section}>Características</div>
        <div style={formStyles.row2}>
          <Field label="Dormitorios" k="dormitorios" form={form} setForm={setForm} type="number" />
          <Field label="Baños" k="banos" form={form} setForm={setForm} type="number" />
        </div>
        <div style={formStyles.row2}>
          <Field label="Área m²" k="area_m2" form={form} setForm={setForm} type="number" />
          <Field label="Piso" k="piso" form={form} setForm={setForm} type="number" />
        </div>
        <div style={formStyles.section}>Extras</div>
        <div style={formStyles.checkGrid}>
          <Checkbox label="Cochera" k="cochera" form={form} setForm={setForm} />
          <Checkbox label="Ascensor" k="ascensor" form={form} setForm={setForm} />
          <Checkbox label="Amoblado" k="amoblado" form={form} setForm={setForm} />
          <Checkbox label="Pets" k="mascotas" form={form} setForm={setForm} />
        </div>
        <div style={formStyles.section}>Fotos</div>
        <input type="file" accept="image/*" multiple style={{ display: "none" }} ref={fileRef} onChange={handlePhotos} />
        <button onClick={() => fileRef.current.click()} style={formStyles.uploadBtn}>📷 Seleccionar fotos</button>
        {form.fotos_urls?.length > 0 && (
          <div style={formStyles.photoGrid}>
            {form.fotos_urls.map((url: string, i: number) => (
              <div key={i} style={formStyles.photoThumbWrap}>
                <img src={url} alt="" style={formStyles.photoThumb} />
                {i === 0 && <span style={formStyles.mainPhotoBadge}>Principal</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </RocaDialog>
  );
}

export default function Home() {
  const { user, loading: authLoading, email, setEmail, password, setPassword, login, logout } = useAuth();
  const { properties, loading, saveProperty, removeProperty, changeStatus } = useProperties(user?.id);
  const { t: theme, mode, toggle: cycleTheme } = useTheme();
  
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<any>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ q: "", operacion: "", tipo: "", estado: "" });
  const [publicProperty, setPublicProperty] = useState<any>(null);
  const [publicLoading, setPublicLoading] = useState(false);

  const S = getAppStyles(theme, mode);

  const handleDuplicate = (original: any) => {
    const { id: _id, created_at: _created, updated_at: _updated, ...rest } = original;
    const duplicate = { ...rest, nombre: `${original.nombre} (copia)`, estado: "Disponible", fotos_urls: [], direccion: "", maps_url: "", video_url: "", tour360_url: "" };
    setEdit(duplicate);
    setShowForm(true);
  };

  const handleRefreshProperty = async () => {
    if (!selected?.id) return;
    const refreshed = await fetchPropertyById(selected.id);
    if (refreshed) setSelected(refreshed);
  };

  const filtered = useMemo(() => {
    const result = properties.filter((p: any) => {
      const q = filters.q.toLowerCase();
      if (q && !p.nombre?.toLowerCase().includes(q) && !p.distrito?.toLowerCase().includes(q)) return false;
      if (filters.operacion && p.operacion !== filters.operacion) return false;
      if (filters.tipo && p.tipo !== filters.tipo) return false;
      if (filters.estado === "Cerrado") { if (p.estado !== "Cerrado") return false; }
      else if (filters.estado && p.estado !== filters.estado) return false;
      return true;
    });
    const order: any = { "Disponible": 1, "Reservado": 2, "Cerrado": 3 };
    return result.sort((a: any, b: any) => {
      const orderA = order[a.estado] || 99;
      const orderB = order[b.estado] || 99;
      if (orderA !== orderB) return orderA - orderB;
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [properties, filters]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const galleryId = params.get("id");
    if (!galleryId) return;
    setPublicLoading(true);
    fetchPropertyById(galleryId).then((data: any) => { setPublicProperty(data); setPublicLoading(false); });
  }, []);

  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("id")) {
    if (publicLoading) return <div style={S.loadingWrap}>Cargando...</div>;
    if (publicProperty) {
      const out = buildOutputs(publicProperty);
      return (
        <div style={{ background: "#000", minHeight: "100vh", padding: 20 }}>
          <h1 style={{ color: "#fff", marginBottom: 20 }}>{publicProperty.nombre}</h1>
          {out.fotos.length > 0 && <img src={out.fotos[0]} alt="" style={{ width: "100%", maxWidth: 500, borderRadius: 16 }} />}
          <p style={{ color: "#d4af37", fontSize: 24, marginTop: 20 }}>{out.precio}</p>
          <a href="/" style={{ color: "#d4af37", display: "block", marginTop: 20 }}>← Volver</a>
        </div>
      );
    }
    return <div style={{...S.loadingWrap, background: "#000", color: "#fff"}}>Propiedad no encontrada</div>;
  }

  if (authLoading) return <div style={S.loadingWrap}><div style={{fontSize: 32, marginBottom: 16}}>🪨</div><p>Cargando...</p></div>;

  if (!user) {
    return (
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🪨</div>
          <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 6, color: '#ffffff', letterSpacing: '2px' }}>ROCA</div>
          <div style={{ color: "#666666", fontSize: 13, marginBottom: 32 }}>Sistema inmobiliario premium</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{...S.input, marginBottom: 12}} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login().catch(() => alert("Credenciales incorrectas")); }} style={S.input} placeholder="Contraseña" />
          <button onClick={() => login().catch(() => alert("Credenciales incorrectas"))} style={{ ...S.newBtn, marginTop: 16, width: "100%", padding: "14px" }}>Entrar</button>
        </div>
      </div>
    );
  }

  if (selected) {
    const current = properties.find((p: any) => p.id === selected.id) || selected;
    return (
      <div style={S.app}>
        <PropertyDetail p={current} onBack={() => setSelected(null)} onEdit={() => { setEdit(current); setShowForm(true); }} onEstado={changeStatus} onDelete={(id: string) => { removeProperty(id); setSelected(null); }} onRefresh={handleRefreshProperty} />
        {showForm && <PropertyForm initial={editTarget} onSave={saveProperty} onClose={() => { setShowForm(false); setEdit(null); }} />}
      </div>
    );
  }

  return (
    <div style={S.app} onClick={(e: any) => { if (e.target === e.currentTarget) { setOpenMenu(null); setProfileMenuOpen(false); } }}>
      {profileMenuOpen && (
        <>
          <div style={getProfileMenuStyles(theme).overlay} onClick={() => setProfileMenuOpen(false)} />
          <div style={getProfileMenuStyles(theme).drawer}>
            <div style={getProfileMenuStyles(theme).header}>
              <div style={getProfileMenuStyles(theme).userInfo}>{user.email?.split('@')[0]}</div>
              <div style={getProfileMenuStyles(theme).userEmail}>{user.email}</div>
            </div>
            <button style={getProfileMenuStyles(theme).item} onClick={cycleTheme}>{mode === "light" ? <><Sun size={16} /> Claro</> : <><Moon size={16} /> Oscuro</>}</button>
            <div style={getProfileMenuStyles(theme).divider} />
            <button style={getProfileMenuStyles(theme).item} onClick={logout}><LogOut size={16} /> Cerrar sesión</button>
          </div>
        </>
      )}
      
      <div style={S.topBar}>
        <button onClick={() => setProfileMenuOpen(true)} style={{ ...S.logo, background: 'none', border: 'none', cursor: 'pointer' }}>ROCA</button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={S.userTag}>{user.email?.split('@')[0]}</span>
          <button onClick={() => { setEdit(null); setShowForm(true); }} style={S.newBtn}>+ Nuevo</button>
        </div>
      </div>

      <PropertyFilters filters={filters} setFilters={setFilters} loading={loading} filteredCount={filtered.length} />

      <div style={S.list}>
        {!loading && filtered.length === 0 && <div style={S.empty}>Sin resultados. Toca + Nuevo para agregar.</div>}
        {filtered.map((p: any) => {
          const out = buildOutputs(p);
          return (
            <PropertyCard key={p.id} property={p} out={out} onClick={() => setSelected(p)} onEdit={() => { setEdit(p); setShowForm(true); }} onDelete={() => removeProperty(p.id)} onDuplicate={() => handleDuplicate(p)} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          );
        })}
      </div>

      {showForm && <PropertyForm initial={editTarget} onSave={saveProperty} onClose={() => { setShowForm(false); setEdit(null); }} />}
    </div>
  );
}