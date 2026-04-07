import { useState, useMemo, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wvihhghuoayrrtdmemfo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aWhoZ2h1b2F5cnJ0ZG1lbWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDU2NDIsImV4cCI6MjA5MTAyMTY0Mn0.86rstgilTvVZgV5KRNPmb7oBx8Xa73e39Sd62_OmkVI";
const CLOUDINARY_CLOUD = "dzqfw8hm3";
const CLOUDINARY_PRESET = "roca_fotos";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function uploadToCloudinary(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_PRESET);
  form.append("folder", "roca");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: form });
  const data = await res.json();
  return data.secure_url;
}

function buildOutputs(p) {
  const sym = p.moneda === "USD" ? "$" : "S/ ";
  const precio = `💰 ${p.operacion}: ${sym}${Number(p.precio)?.toLocaleString()}`;
  const mant = p.mantenimiento ? `\n🧾 Mantenimiento: S/ ${p.mantenimiento} mensuales` : "";
  const caracteristicas = [
    p.dormitorios ? `🛏 ${p.dormitorios} ${p.dormitorios == 1 ? "dormitorio" : "dormitorios"}` : "",
    p.ambientes   ? `🏢 ${p.ambientes} ${p.ambientes == 1 ? "ambiente" : "ambientes"}` : "",
    p.banos       ? `🚿 ${p.banos} ${p.banos == 1 ? "baño" : "baños"}` : "",
    p.area_m2     ? `📐 ${p.area_m2} m²` : "",
  ].filter(Boolean).join("\n");
  const extras = [
    p.cochera ? "🚗 Cochera" : "", p.ascensor ? "🛗 Ascensor" : "",
    p.amoblado ? "🛋 Amoblado" : "", p.area_servicio ? "🧹 Área de servicio" : "",
    p.mascotas === "Sí" ? "🐶 Mascotas permitidas" : "",
    p.mascotas === "A tratar" ? "🐶 Mascotas: consultar" : "",
  ].filter(Boolean);
  const caracteristicasCompletas = caracteristicas + (extras.length > 0 ? "\n\n" + extras.join("\n") : "");
  const fotos = Array.isArray(p.fotos_urls) ? p.fotos_urls : [];
  const baseUrl = typeof import.meta !== "undefined" && import.meta.env?.DEV
    ? "http://localhost:5173"
    : window.location.origin;
  // CAMBIO IMPORTANTE: ahora el enlace de galería usa ?gallery= en lugar de ?id=
  const galleryUrl = `${baseUrl}?gallery=${p.id}`;
  const media = [
    fotos.length > 0 ? `📸 Ver fotos (${fotos.length}): ${galleryUrl}` : "",
    p.video_url ? `🎥 Video: ${p.video_url}` : "",
    p.tour360_url ? `🌐 Recorrido 360: ${p.tour360_url}` : "",
  ].filter(Boolean).join("\n");
  const mapsLink = p.maps_url || `https://maps.google.com/?q=${encodeURIComponent((p.direccion || "") + " " + (p.distrito || "") + " Lima Peru")}`;
  const ubicacion = `📍 ${p.distrito}${p.direccion ? ", " + p.direccion : ""}\n👉 Abrir en Maps: ${mapsLink}`;
  const mensajeCorto = [
    `🏠 ${p.tipo} en ${p.distrito}`, "",
    precio, "",
    p.dormitorios ? `🛏 ${p.dormitorios} ${p.dormitorios == 1 ? "dormitorio" : "dormitorios"}` : "",
    p.ambientes ? `🏢 ${p.ambientes} ${p.ambientes == 1 ? "ambiente" : "ambientes"}` : "",
    p.banos ? `🚿 ${p.banos} ${p.banos == 1 ? "baño" : "baños"}` : "",
    "", "👉 Disponible para visitas", "", "¿Te interesa? Te paso más info 👍",
  ].filter(l => l !== null).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const mensajeLargo = [
    `🏠 ${p.tipo} en ${p.distrito}`, "", precio + mant, "",
    caracteristicasCompletas, p.frase_destacada ? `\n✨ ${p.frase_destacada}` : "",
    "", media, "", ubicacion, "", "👉 Disponible para visitas", "", "¿En qué fecha te gustaría visitar?",
  ].join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const multimedia = [
    fotos.length > 0 ? `📸 Galería completa: ${galleryUrl}` : "",
    p.tour360_url ? `🌐 Recorrido 360: ${p.tour360_url}` : ""
  ].filter(Boolean).join("\n");
  return { precio, mant, caracteristicasCompletas, media, ubicacion, mensajeCorto, mensajeLargo, multimedia, fotos, mapsLink };
}

const ESTADOS = ["Disponible", "Reservado", "Vendido/Alquilado"];
const EC = {
  Disponible: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  Reservado: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "Vendido/Alquilado": { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};

function CopyShareBtns({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const share = () => { if (navigator.share) navigator.share({ text }); else copy(); };
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={copy} style={S.copyBtn}>{copied ? "✅ Copiado" : "📋 Copiar"}</button>
      <button onClick={share} style={S.shareBtn}>📤 Compartir</button>
    </div>
  );
}

function Gallery({ fotos, onClose }) {
  const [idx, setIdx] = useState(0);
  if (!fotos.length) return null;
  return (
    <div style={S.galleryOverlay} onClick={onClose}>
      <div style={S.galleryBox} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={S.galleryClose}>✕</button>
        <img src={fotos[idx]} alt="" style={S.galleryImg} />
        <div style={S.galleryCount}>{idx + 1} / {fotos.length}</div>
        {fotos.length > 1 && (
          <div style={S.galleryNav}>
            <button onClick={() => setIdx(i => (i - 1 + fotos.length) % fotos.length)} style={S.galleryArrow}>‹</button>
            <button onClick={() => setIdx(i => (i + 1) % fotos.length)} style={S.galleryArrow}>›</button>
          </div>
        )}
        <div style={S.galleryThumbs}>
          {fotos.map((f, i) => <img key={i} src={f} alt="" onClick={() => setIdx(i)} style={{ ...S.galleryThumb, outline: i === idx ? "2px solid #e8ff4f" : "none" }} />)}
        </div>
      </div>
    </div>
  );
}

function Field({ label, k, form, setForm, type = "text", placeholder = "" }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} value={form[k] ?? ""} placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [k]: type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value }))} />
    </div>
  );
}
function Sel({ label, k, form, setForm, opts }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <select style={S.input} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Check({ label, k, form, setForm }) {
  return (
    <label style={S.checkRow}>
      <input type="checkbox" checked={!!form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.checked }))} style={{ marginRight: 8 }} />
      {label}
    </label>
  );
}

function PropertyForm({ initial, onSave, onClose }) {
  const blank = {
    nombre: "", tipo: "Departamento", operacion: "Alquiler",
    distrito: "", direccion: "", maps_url: "", precio: "", moneda: "PEN", mantenimiento: "",
    dormitorios: "", ambientes: "", banos: "", area_m2: "",
    cochera: false, ascensor: false, amoblado: false, area_servicio: false,
    mascotas: "No", fotos_urls: [], video_url: "", tour360_url: "", frase_destacada: "",
    estado: "Disponible",
  };
  const [form, setForm] = useState(initial || blank);
  const [uploading, setUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUp(true);
    const urls = await Promise.all(files.map(uploadToCloudinary));
    setForm(f => ({ ...f, fotos_urls: [...(f.fotos_urls || []), ...urls] }));
    setUp(false);
  };
  const removePhoto = (i) => setForm(f => { const arr = [...f.fotos_urls]; arr.splice(i, 1); return { ...f, fotos_urls: arr }; });

  const handleSave = async () => {
    if (!form.nombre || !form.distrito || !form.precio) return;
    setSaving(true);
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
    setSaving(false);
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <span style={S.modalTitle}>{initial ? "✏️ Editar inmueble" : "➕ Nuevo inmueble"}</span>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>
        <div style={S.modalBody}>
          <div style={S.section}>📌 General</div>
          <Field label="Nombre*" k="nombre" form={form} setForm={setForm} placeholder="Depa Lince 98m²" />
          <div style={S.row2}>
            <Sel label="Tipo*" k="tipo" form={form} setForm={setForm} opts={["Departamento","Casa","Local","Oficina","Terreno"]} />
            <Sel label="Operación*" k="operacion" form={form} setForm={setForm} opts={["Venta","Alquiler"]} />
          </div>
          <div style={S.section}>📍 Ubicación</div>
          <div style={S.row2}>
            <Field label="Distrito*" k="distrito" form={form} setForm={setForm} />
            <Field label="Dirección" k="direccion" form={form} setForm={setForm} />
          </div>
          <Field label="Google Maps URL (opcional)" k="maps_url" form={form} setForm={setForm} placeholder="Se genera automático" />
          <div style={S.section}>💰 Precio</div>
          <div style={S.row2}>
            <Field label="Precio*" k="precio" form={form} setForm={setForm} type="number" />
            <Sel label="Moneda*" k="moneda" form={form} setForm={setForm} opts={["PEN","USD"]} />
          </div>
          <Field label="Mantenimiento mensual" k="mantenimiento" form={form} setForm={setForm} type="number" placeholder="opcional" />
          <div style={S.section}>📐 Características</div>
          <div style={S.row2}>
            <Field label="Dormitorios" k="dormitorios" form={form} setForm={setForm} type="number" />
            <Field label="Ambientes" k="ambientes" form={form} setForm={setForm} type="number" />
          </div>
          <div style={S.row2}>
            <Field label="Baños" k="banos" form={form} setForm={setForm} type="number" />
            <Field label="Área m²" k="area_m2" form={form} setForm={setForm} type="number" />
          </div>
          <div style={S.section}>✨ Extras</div>
          <div style={S.checkGrid}>
            <Check label="🚗 Cochera" k="cochera" form={form} setForm={setForm} />
            <Check label="🛗 Ascensor" k="ascensor" form={form} setForm={setForm} />
            <Check label="🛋 Amoblado" k="amoblado" form={form} setForm={setForm} />
            <Check label="🧹 Área servicio" k="area_servicio" form={form} setForm={setForm} />
          </div>
          <Sel label="🐶 Mascotas" k="mascotas" form={form} setForm={setForm} opts={["Sí","No","A tratar"]} />
          <div style={S.section}>📸 Fotos</div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhotos} />
          <button onClick={() => fileRef.current.click()} style={S.uploadBtn} disabled={uploading}>
            {uploading ? "⏳ Subiendo fotos..." : "📱 Seleccionar fotos"}
          </button>
          {(form.fotos_urls || []).length > 0 && (
            <div style={S.photoGrid}>
              {form.fotos_urls.map((url, i) => (
                <div key={i} style={S.photoThumbWrap}>
                  <img src={url} alt="" style={S.photoThumb} />
                  <button onClick={() => removePhoto(i)} style={S.photoRemove}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div style={S.section}>🎥 Media adicional</div>
          <Field label="Video (YouTube URL)" k="video_url" form={form} setForm={setForm} placeholder="opcional" />
          <Field label="Tour 360 URL" k="tour360_url" form={form} setForm={setForm} placeholder="opcional" />
          <div style={S.section}>💬 Copywriting</div>
          <Field label="Frase destacada" k="frase_destacada" form={form} setForm={setForm} placeholder="opcional" />
        </div>
        <div style={S.modalFooter}>
          <button onClick={onClose} style={S.cancelBtn}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={S.saveBtn}>
            {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear inmueble"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyDetail({ p, onBack, onEdit, onEstado, isAdmin }) {
  const out = buildOutputs(p);
  const ec = EC[p.estado] || EC.Disponible;
  const [tab, setTab] = useState("corto");
  const [showGallery, setGallery] = useState(false);
  return (
    <div style={S.detail}>
      <div style={S.detailHeader}>
        <button onClick={onBack} style={S.backBtn}>← Volver</button>
        {isAdmin && <button onClick={onEdit} style={S.editBtn}>✏️ Editar</button>}
      </div>
      {out.fotos.length > 0 && (
        <div style={S.heroWrap} onClick={() => setGallery(true)}>
          <img src={out.fotos[0]} alt="" style={S.heroImg} />
          {out.fotos.length > 1 && <div style={S.heroBadge}>📸 {out.fotos.length} fotos</div>}
        </div>
      )}
      <div style={S.detailCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={S.detailName}>{p.nombre}</div>
            <div style={S.detailSub}>{p.tipo} · {p.distrito}</div>
          </div>
          {isAdmin ? (
            <select value={p.estado} onChange={e => onEstado(p.id, e.target.value)}
              style={{ ...S.estadoBadge, backgroundColor: ec.bg, color: ec.text, border: `1px solid ${ec.dot}`, cursor: "pointer" }}>
              {ESTADOS.map(s => <option key={s}>{s}</option>)}
            </select>
          ) : (
            <span style={{ ...S.estadoBadge, backgroundColor: ec.bg, color: ec.text }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: ec.dot, display: "inline-block", marginRight: 5 }} />
              {p.estado}
            </span>
          )}
        </div>
        <div style={S.precioBlock}>{out.precio}</div>
        {p.mantenimiento ? <div style={S.mantBlock}>🧾 Mantenimiento: S/ {p.mantenimiento} mensuales</div> : null}
      </div>
      <div style={S.tabRow}>
        {["corto","largo"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }}>
            {t === "corto" ? "⚡ Corto" : "🔥 Largo"}
          </button>
        ))}
      </div>
      <div style={S.msgBox}>
        <pre style={S.msgPre}>{tab === "corto" ? out.mensajeCorto : out.mensajeLargo}</pre>
        <CopyShareBtns text={tab === "corto" ? out.mensajeCorto : out.mensajeLargo} />
      </div>
      <div style={S.actionGrid}>
        {out.fotos.length > 0 && <button onClick={() => setGallery(true)} style={{ ...S.actionBtn, cursor: "pointer", border: "1.5px solid #e0e0d8" }}>📸 Ver fotos ({out.fotos.length})</button>}
        {p.tour360_url && <a href={p.tour360_url} target="_blank" rel="noreferrer" style={S.actionBtn}>🌐 Tour 360</a>}
        {p.video_url && <a href={p.video_url} target="_blank" rel="noreferrer" style={S.actionBtn}>🎥 Video</a>}
        <a href={out.mapsLink} target="_blank" rel="noreferrer" style={S.actionBtn}>📍 Google Maps</a>
      </div>
      {out.multimedia && (
        <div style={S.detailCard}>
          <div style={S.sectionTitle}>Pack multimedia</div>
          <pre style={{ ...S.msgPre, background: "none", border: "none", padding: 0, margin: "0 0 12px" }}>{out.multimedia}</pre>
          <CopyShareBtns text={out.multimedia} />
        </div>
      )}
      <div style={S.detailCard}>
        <div style={S.sectionTitle}>Ubicación</div>
        <pre style={{ ...S.msgPre, background: "none", border: "none", padding: 0, margin: "0 0 12px" }}>{out.ubicacion}</pre>
        <CopyShareBtns text={out.ubicacion} />
      </div>
      {showGallery && <Gallery fotos={out.fotos} onClose={() => setGallery(false)} />}
    </div>
  );
}

export default function ROCAApp() {
  const [properties, setProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEdit] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [filters, setFilters] = useState({ q: "", operacion: "", tipo: "", estado: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [galleryProperty, setGalleryProperty] = useState(null);

  useEffect(() => { fetchProps(); }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id && properties.length) {
      const prop = properties.find(p => p.id === id);
      if (prop) setSelected(prop);
    }
    // Verificar si estamos en modo galería
    const galleryId = params.get("gallery");
    if (galleryId && properties.length) {
      const prop = properties.find(p => p.id === galleryId);
      if (prop) setGalleryProperty(prop);
    }
  }, [properties]);

  useEffect(() => {
    const admin = localStorage.getItem("roca_admin");
    if (admin === "true") setIsAdmin(true);
  }, []);

  const fetchProps = async () => {
    setLoading(true);
    const { data } = await supabase.from("propiedades").select("*").order("created_at", { ascending: false });
    if (data) setProps(data);
    setLoading(false);
  };

  const saveProperty = async (payload, id) => {
    if (id) {
      await supabase.from("propiedades").update(payload).eq("id", id);
    } else {
      await supabase.from("propiedades").insert(payload);
    }
    await fetchProps();
    setShowForm(false); setEdit(null);
    if (selected && id === selected.id) {
      const { data } = await supabase.from("propiedades").select("*").eq("id", id).single();
      if (data) setSelected(data);
    }
  };

  const deleteProperty = async (id) => {
    await supabase.from("propiedades").delete().eq("id", id);
    setOpenMenu(null); await fetchProps();
    if (selected?.id === id) setSelected(null);
  };

  const changeEstado = async (id, estado) => {
    await supabase.from("propiedades").update({ estado }).eq("id", id);
    setProps(ps => ps.map(p => p.id === id ? { ...p, estado } : p));
    if (selected?.id === id) setSelected(s => ({ ...s, estado }));
  };

  const checkPassword = (pass) => {
    // Cambia "tucontraseña" por la que desees
    if (pass === "roca2025") {
      setIsAdmin(true);
      localStorage.setItem("roca_admin", "true");
      setLoginPassword("");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const filtered = useMemo(() => properties.filter(p => {
    const q = filters.q.toLowerCase();
    if (q && !p.nombre?.toLowerCase().includes(q) && !p.distrito?.toLowerCase().includes(q)) return false;
    if (filters.operacion && p.operacion !== filters.operacion) return false;
    if (filters.tipo && p.tipo !== filters.tipo) return false;
    if (filters.estado && p.estado !== filters.estado) return false;
    return true;
  }), [properties, filters]);

  // Vista de galería exclusiva
  if (galleryProperty) {
    const out = buildOutputs(galleryProperty);
    return (
      <>
        <Gallery fotos={out.fotos} onClose={() => {
          setGalleryProperty(null);
          // Limpiar el parámetro gallery de la URL sin recargar
          const url = new URL(window.location);
          url.searchParams.delete("gallery");
          window.history.replaceState({}, "", url);
        }} />
      </>
    );
  }

  // Pantalla de bloqueo para no administradores que intentan acceder a la raíz
  if (!isAdmin && !window.location.search.includes("id=") && !window.location.search.includes("gallery=")) {
    return (
      <div style={S.app}>
        <div style={S.topBar}><div style={S.logo}>🪨 ROCA</div></div>
        <div style={{ padding: 20, textAlign: "center" }}>
          <p style={{ marginBottom: 16 }}>Acceso restringido. Introduce la contraseña:</p>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            style={{ ...S.input, maxWidth: 200, marginBottom: 12 }}
            placeholder="Contraseña"
          />
          <button onClick={() => checkPassword(loginPassword)} style={S.saveBtn}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // Vista de detalle de propiedad (con o sin admin)
  if (selected) {
    const current = properties.find(p => p.id === selected.id) || selected;
    return (
      <div style={S.app}>
        <PropertyDetail
          p={current}
          onBack={() => setSelected(null)}
          onEdit={() => { setEdit(current); setShowForm(true); }}
          onEstado={changeEstado}
          isAdmin={isAdmin}
        />
        {showForm && <PropertyForm initial={editTarget} onSave={saveProperty}
          onClose={() => { setShowForm(false); setEdit(null); }} />}
      </div>
    );
  }

  // Panel de administración (solo visible para admin)
  return (
    <div style={S.app} onClick={() => setOpenMenu(null)}>
      <div style={S.topBar}>
        <div style={S.logo}>🪨 ROCA</div>
        <button onClick={() => { setEdit(null); setShowForm(true); }} style={S.newBtn}>+ Nuevo</button>
      </div>
      <div style={S.searchWrap}>
        <input style={S.searchInput} placeholder="🔍 Buscar por nombre o distrito..."
          value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} />
      </div>
      <div style={S.filterRow}>
        {[
          { k: "operacion", opts: ["","Venta","Alquiler"], label: "Operación" },
          { k: "tipo", opts: ["","Departamento","Casa","Local","Oficina","Terreno"], label: "Tipo" },
          { k: "estado", opts: ["","Disponible","Reservado","Vendido/Alquilado"], label: "Estado" },
        ].map(({ k, opts, label }) => (
          <select key={k} style={S.filterSelect} value={filters[k]} onChange={e => setFilters(f => ({ ...f, [k]: e.target.value }))}>
            <option value="">{label}</option>
            {opts.filter(Boolean).map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div style={S.count}>
        {loading ? "Cargando..." : `${filtered.length} inmueble${filtered.length !== 1 ? "s" : ""}`}
      </div>
      <div style={S.list}>
        {!loading && filtered.length === 0 && <div style={S.empty}>Sin resultados. Toca + Nuevo para agregar.</div>}
        {filtered.map(p => {
          const out = buildOutputs(p);
          const ec = EC[p.estado] || EC.Disponible;
          return (
            <div key={p.id} style={S.card} onClick={() => setSelected(p)}>
              {out.fotos.length > 0 && <img src={out.fotos[0]} alt="" style={S.cardThumb} />}
              <div style={S.cardMain}>
                <div style={S.cardLeft}>
                  <div style={S.cardName}>{p.nombre}</div>
                  <div style={S.cardSub}>{p.tipo} · {p.distrito} · {p.operacion}</div>
                  <div style={S.cardPrice}>{out.precio}</div>
                </div>
                <div style={S.cardRight} onClick={e => e.stopPropagation()}>
                  <span style={{ ...S.estadoBadge, backgroundColor: ec.bg, color: ec.text }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: ec.dot, display: "inline-block", marginRight: 5 }} />
                    {p.estado}
                  </span>
                  <button style={S.menuDot} onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === p.id ? null : p.id); }}>⋮</button>
                </div>
              </div>
              {openMenu === p.id && (
                <div style={S.dropdown} onClick={e => e.stopPropagation()}>
                  {ESTADOS.map(s => (
                    <button key={s} style={S.dropItem} onClick={() => { changeEstado(p.id, s); setOpenMenu(null); }}>
                      <span style={{ color: EC[s]?.dot }}>●</span> {s}
                    </button>
                  ))}
                  <div style={S.dropDivider} />
                  <button style={S.dropItem} onClick={() => { setEdit(p); setShowForm(true); setOpenMenu(null); }}>✏️ Editar</button>
                  <button style={{ ...S.dropItem, color: "#ef4444" }} onClick={() => { if (confirm("¿Eliminar este inmueble?")) deleteProperty(p.id); }}>🗑 Eliminar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showForm && <PropertyForm initial={editTarget} onSave={saveProperty}
        onClose={() => { setShowForm(false); setEdit(null); }} />}
    </div>
  );
}

const S = {
  app:            { fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#f4f4f0", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" },
  topBar:         { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 12px", background: "#1a1a1a", position: "sticky", top: 0, zIndex: 10 },
  logo:           { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 },
  newBtn:         { background: "#e8ff4f", color: "#1a1a1a", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  searchWrap:     { padding: "12px 16px 0" },
  searchInput:    { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0d8", fontSize: 15, background: "#fff", outline: "none", boxSizing: "border-box" },
  filterRow:      { display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto" },
  filterSelect:   { padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e0e0d8", fontSize: 13, background: "#fff", flexShrink: 0, cursor: "pointer", outline: "none" },
  count:          { padding: "4px 16px 8px", fontSize: 12, color: "#888", fontWeight: 600 },
  list:           { padding: "0 16px 80px", display: "flex", flexDirection: "column", gap: 10 },
  card:           { background: "#fff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,.06)", cursor: "pointer", border: "1.5px solid #eee", position: "relative" },
  cardThumb:      { display: "none" },
  cardMain:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, padding: 14 },
  cardLeft:       { flex: 1 },
  cardRight:      { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 },
  cardName:       { fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 3 },
  cardSub:        { fontSize: 12, color: "#888", marginBottom: 5 },
  cardPrice:      { fontSize: 14, fontWeight: 700, color: "#1a1a1a" },
  estadoBadge:    { fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 9px", display: "flex", alignItems: "center", whiteSpace: "nowrap" },
  menuDot:        { background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888", lineHeight: 1, padding: "0 2px" },
  dropdown:       { position: "absolute", right: 12, top: 44, background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,.13)", zIndex: 50, minWidth: 180, overflow: "hidden", border: "1px solid #eee" },
  dropItem:       { display: "block", width: "100%", textAlign: "left", padding: "11px 16px", background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#1a1a1a" },
  dropDivider:    { height: 1, background: "#f0f0ec", margin: "2px 0" },
  empty:          { textAlign: "center", color: "#aaa", padding: "40px 0", fontSize: 15 },
  detail:         { padding: "0 0 80px", background: "#f4f4f0", minHeight: "100vh" },
  detailHeader:   { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#1a1a1a", position: "sticky", top: 0, zIndex: 10 },
  backBtn:        { background: "none", border: "none", color: "#e8ff4f", fontWeight: 700, fontSize: 15, cursor: "pointer", padding: 0 },
  editBtn:        { background: "#333", border: "none", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  heroWrap:       { position: "relative", cursor: "pointer" },
  heroImg:        { width: "100%", height: 220, objectFit: "cover", display: "block" },
  heroBadge:      { position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,.6)", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700 },
  detailCard:     { background: "#fff", borderRadius: 14, margin: "12px 16px 0", padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,.05)", border: "1.5px solid #eee" },
  detailName:     { fontWeight: 800, fontSize: 18, color: "#1a1a1a", marginBottom: 4 },
  detailSub:      { fontSize: 13, color: "#888", marginBottom: 10 },
  precioBlock:    { fontSize: 16, fontWeight: 700, color: "#1a1a1a" },
  mantBlock:      { fontSize: 13, color: "#666", marginTop: 4 },
  tabRow:         { display: "flex", gap: 8, padding: "14px 16px 0" },
  tab:            { flex: 1, padding: "9px 0", borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#888" },
  tabActive:      { background: "#1a1a1a", color: "#e8ff4f", border: "1.5px solid #1a1a1a" },
  msgBox:         { margin: "10px 16px 0", background: "#fff", borderRadius: 14, padding: 14, border: "1.5px solid #eee" },
  msgPre:         { fontFamily: "'DM Sans',sans-serif", fontSize: 14, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#222", margin: "0 0 12px", lineHeight: 1.6 },
  copyBtn:        { flex: 1, padding: "10px", background: "#e8ff4f", color: "#1a1a1a", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  shareBtn:       { flex: 1, padding: "10px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  actionGrid:     { display: "flex", gap: 8, padding: "12px 16px 0", flexWrap: "wrap" },
  actionBtn:      { flex: "1 1 calc(50% - 4px)", padding: "10px 0", background: "#fff", border: "1.5px solid #e0e0d8", borderRadius: 10, textAlign: "center", textDecoration: "none", color: "#1a1a1a", fontSize: 13, fontWeight: 600 },
  sectionTitle:   { fontWeight: 700, fontSize: 13, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  galleryOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  galleryBox:     { width: "100%", maxWidth: 480, padding: 16, position: "relative" },
  galleryClose:   { position: "absolute", top: 0, right: 16, background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", zIndex: 10 },
  galleryImg:     { width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 12, display: "block" },
  galleryCount:   { textAlign: "center", color: "#aaa", fontSize: 13, marginTop: 8 },
  galleryNav:     { display: "flex", justifyContent: "center", gap: 16, marginTop: 12 },
  galleryArrow:   { background: "#333", border: "none", color: "#fff", borderRadius: 50, width: 44, height: 44, fontSize: 24, cursor: "pointer" },
  galleryThumbs:  { display: "flex", gap: 8, overflowX: "auto", marginTop: 12, paddingBottom: 4 },
  galleryThumb:   { width: 60, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0, cursor: "pointer" },
  overlay:        { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "flex-end" },
  modal:          { background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column" },
  modalHeader:    { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #eee", flexShrink: 0 },
  modalTitle:     { fontWeight: 800, fontSize: 17 },
  closeBtn:       { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" },
  modalBody:      { overflowY: "auto", padding: "16px 20px", flex: 1 },
  modalFooter:    { display: "flex", gap: 10, padding: "14px 20px", borderTop: "1px solid #eee", flexShrink: 0 },
  cancelBtn:      { flex: 1, padding: 12, background: "#f0f0ec", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" },
  saveBtn:        { flex: 2, padding: 12, background: "#1a1a1a", color: "#e8ff4f", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" },
  section:        { fontWeight: 800, fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, margin: "18px 0 10px", paddingBottom: 6, borderBottom: "1px solid #f0f0ec" },
  field:          { marginBottom: 12 },
  label:          { display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 5 },
  input:          { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e0e0d8", fontSize: 15, boxSizing: "border-box", outline: "none", background: "#fafaf8" },
  row2:           { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  checkGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 },
  checkRow:       { display: "flex", alignItems: "center", fontSize: 14, cursor: "pointer", padding: "8px 0" },
  uploadBtn:      { width: "100%", padding: "12px", background: "#f0f0ec", border: "1.5px dashed #ccc", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 12 },
  photoGrid:      { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  photoThumbWrap: { position: "relative" },
  photoThumb:     { width: 72, height: 72, objectFit: "cover", borderRadius: 8 },
  photoRemove:    { position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 11, cursor: "pointer" },
};