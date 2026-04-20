import { useState } from "react";
import { buildOutputs } from "../../utils/messageFormatter";
import { ESTADO_COLORS, getEstadoDisplay } from "../../utils/constants";
import { CopyShareBtns } from "../../components/ui/CopyShareBtns";
import { Gallery } from "../../components/ui/Gallery";
import { useSwipeBack } from "../../hooks/useSwipeBack";
import { useTheme } from "../../hooks/useTheme.jsx";
import { MapPin, Video, PencilLine, Trash2, X, ArrowLeft, Play, Eye, Images, Globe, DollarSign, FileText } from "lucide-react";

/**
 * Property detail component showing full information for admin
 * Displays messages, photos, location, and status management
 */
export function PropertyDetail({ p, onBack, onEdit, onEstado, onDelete }) {
  const { t, mode } = useTheme(); // ← Obtenemos también 'mode' para fondos adaptables
  const out = buildOutputs(p);
  const ec = ESTADO_COLORS[p.estado] || ESTADO_COLORS.Disponible;
  const [tab, setTab] = useState("corto");
  const [showGallery, setGallery] = useState(false);

  // Swipe to go back
  useSwipeBack(onBack, true);

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar este inmueble? Esta acción no se puede deshacer.")) {
      onDelete(p.id);
    }
  };

  // ⬇️ MOVEMOS detailStyles AQUÍ DENTRO para que tenga acceso a 't' y 'mode'
  const detailStyles = {
    container: {
      padding: "0 0 80px",
      background: t.colors.bg,
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 20px",
      background: mode === 'dark' ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.9)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 10,
      borderBottom: `1px solid ${t.colors.border}`,
    },
    backBtn: {
      background: "none",
      border: "none",
      color: t.colors.primary,
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      padding: 0,
    },
    editBtn: {
      background: t.colors.bgSecondary,
      border: `1px solid ${t.colors.border}`,
      color: t.colors.text,
      borderRadius: 10,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
    },
    iconBtn: {
      background: t.colors.bgSecondary,
      border: `1px solid ${t.colors.border}`,
      color: t.colors.text,
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 14,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 40,
    },
    heroWrap: {
      position: "relative",
      cursor: "pointer",
    },
    heroImg: {
      width: "100%",
      height: 260,
      objectFit: "cover",
      display: "block",
    },
    heroBadge: {
      position: "absolute",
      bottom: 16,
      right: 16,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(10px)",
      color: t.colors.text,
      borderRadius: 20,
      padding: "6px 12px",
      fontSize: 12,
      fontWeight: 700,
    },
    card: {
      background: t.colors.bgSecondary,
      borderRadius: 16,
      margin: "16px 20px 0",
      padding: 20,
      boxShadow: mode === 'dark' ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
      border: `1px solid ${t.colors.border}`,
    },
    name: {
      fontWeight: 800,
      fontSize: 20,
      color: t.colors.text,
      marginBottom: 6,
    },
    sub: {
      fontSize: 14,
      color: t.colors.textMuted,
      marginBottom: 12,
    },
    estadoSelect: {
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 20,
      padding: "4px 10px",
      cursor: "pointer",
      outline: "none",
      background: t.colors.bgSecondary,
      border: `1px solid ${t.colors.border}`,
      color: t.colors.text,
    },
    precioBlock: {
      fontSize: 18,
      fontWeight: 700,
      color: t.colors.primary,
      marginTop: 8,
    },
    mantBlock: {
      fontSize: 13,
      color: t.colors.textMuted,
      marginTop: 6,
    },
    tabRow: {
      display: "flex",
      gap: 10,
      padding: "16px 20px 0",
    },
    tab: {
      flex: 1,
      padding: "10px 0",
      borderRadius: 12,
      border: `1px solid ${t.colors.border}`,
      background: t.colors.bgSecondary,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      color: t.colors.textMuted,
      transition: "all 0.3s ease",
    },
    tabActive: {
      background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)",
      color: "#0a0a0a",
      border: "none",
      boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
    },
    msgBox: {
      margin: "12px 20px 0",
      background: t.colors.bgSecondary,
      borderRadius: 16,
      padding: 16,
      border: `1px solid ${t.colors.border}`,
    },
    msgPre: {
      fontFamily: "'Outfit',sans-serif",
      fontSize: 14,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      color: t.colors.textSecondary,
      margin: "0 0 16px",
      lineHeight: 1.7,
    },
    msgPreNoBox: {
      fontFamily: "'Outfit',sans-serif",
      fontSize: 14,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      color: t.colors.textSecondary,
      background: "none",
      border: "none",
      padding: 0,
      margin: "0 0 12px",
      lineHeight: 1.6,
    },
    actionGrid: {
      display: "flex",
      gap: 10,
      padding: "16px 20px 0",
      flexWrap: "wrap",
    },
    actionBtn: {
      flex: "1 1 calc(50% - 5px)",
      padding: "14px 0",
      background: t.colors.bgSecondary,
      border: `1px solid ${t.colors.border}`,
      borderRadius: 12,
      textAlign: "center",
      textDecoration: "none",
      color: t.colors.text,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    sectionTitle: {
      fontWeight: 700,
      fontSize: 12,
      color: t.colors.textMuted,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: "1px",
      textAlign: "center",
    },
  };

  return (
    <div style={detailStyles.container}>
      <div style={detailStyles.header}>
        <button onClick={onBack} style={detailStyles.backBtn}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {/* Landing archivada - descomenta cuando retomes: window.open(`/p/${p.id}`, "_blank") */}
          <button onClick={handleDelete} style={detailStyles.iconBtn} title="Eliminar">
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
          <button onClick={onEdit} style={detailStyles.iconBtn} title="Editar">
            <PencilLine size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {out.fotos.length > 0 && (
        <div style={detailStyles.heroWrap} onClick={() => setGallery(true)}>
          <img src={out.fotos[0]} alt="" style={detailStyles.heroImg} />
          {out.fotos.length > 1 && (
            <div style={detailStyles.heroBadge}>
              <Eye size={14} strokeWidth={1.5} /> {out.fotos.length} fotos
            </div>
          )}
        </div>
      )}

      <div style={detailStyles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div>
            <div style={detailStyles.name}>{out.tituloDinamico}</div>
            <div style={detailStyles.sub}>
              {p.nombre} · {p.tipo} · {p.distrito}
            </div>
          </div>
          <select
            value={p.estado}
            onChange={(e) => onEstado(p.id, e.target.value)}
            style={{
              ...detailStyles.estadoSelect,
              backgroundColor: ec.bg,
              color: ec.text,
              border: `1px solid ${ec.dot}`,
            }}
          >
            {Object.keys(ESTADO_COLORS).map((s) => (
              <option key={s} value={s}>
                {s === "Cerrado" ? getEstadoDisplay(s, p.operacion) : s}
              </option>
            ))}
          </select>
        </div>
        <div style={detailStyles.precioBlock}>{out.precio}</div>
        {p.mantenimiento && (
          <div style={detailStyles.mantBlock}>
            <FileText size={14} strokeWidth={1.5} /> Mantenimiento: S/ {p.mantenimiento} mensuales
          </div>
        )}
      </div>

      <div style={detailStyles.tabRow}>
        {["corto", "largo"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...detailStyles.tab,
              ...(tab === t ? detailStyles.tabActive : {}),
            }}
          >
            {t === "corto" ? "⚡ Corto" : "🔥 Largo"}
          </button>
        ))}
      </div>

      <div style={detailStyles.msgBox}>
        <pre style={detailStyles.msgPre}>
          {tab === "corto" ? out.mensajeCorto : out.mensajeLargo}
        </pre>
        <CopyShareBtns text={tab === "corto" ? out.mensajeCorto : out.mensajeLargo} />
      </div>

      <div style={detailStyles.actionGrid}>
        {out.fotos.length > 0 && (
          <button
            onClick={() => setGallery(true)}
            style={{ ...detailStyles.actionBtn, cursor: "pointer" }}
          >
            <Images size={16} strokeWidth={1.5} /> Ver fotos ({out.fotos.length})
          </button>
        )}
        {p.tour360_url && (
          <a href={p.tour360_url} target="_blank" rel="noreferrer" style={detailStyles.actionBtn}>
            <Globe size={16} strokeWidth={1.5} /> Tour 360
          </a>
        )}
        {p.video_url && (
          <a href={p.video_url} target="_blank" rel="noreferrer" style={detailStyles.actionBtn}>
            <Video size={16} strokeWidth={1.5} /> Video
          </a>
        )}
        <a href={out.mapsLink} target="_blank" rel="noreferrer" style={detailStyles.actionBtn}>
          <MapPin size={16} strokeWidth={1.5} /> Ver mapa
        </a>
      </div>

      <div style={detailStyles.card}>
        <div style={detailStyles.sectionTitle}>Ubicacion</div>
        <pre style={detailStyles.msgPreNoBox}>{out.ubicacion}</pre>
        <CopyShareBtns text={out.ubicacion} />
      </div>

      {out.multimedia && (
        <div style={detailStyles.card}>
          <div style={detailStyles.sectionTitle}>Pack multimedia</div>
          <pre style={detailStyles.msgPreNoBox}>{out.multimedia}</pre>
          <CopyShareBtns text={out.multimedia} />
        </div>
      )}

      {showGallery && (
        <Gallery fotos={out.fotos} onClose={() => setGallery(false)} />
      )}
    </div>
  );
}