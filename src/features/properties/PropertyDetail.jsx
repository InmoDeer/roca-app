import { useState } from "react";
import { buildOutputs } from "../../utils/messageFormatter";
import { ESTADO_COLORS, getEstadoDisplay } from "../../utils/constants";
import { CopyShareBtns } from "../../components/ui/CopyShareBtns";
import { Gallery } from "../../components/ui/Gallery";
import { useSwipeBack } from "../../hooks/useSwipeBack";
import { useTheme } from "../../hooks/useTheme.jsx";
import { getPropertyDetailStyles } from "../../styles/componentStyles.js";
import { MapPin, Video, PencilLine, Trash2, X, ArrowLeft, Play, Eye, Images, Globe, DollarSign, FileText, Users } from "lucide-react";

/**
 * Property detail component showing full information for admin
 * Displays messages, photos, location, and status management
 */
export function PropertyDetail({ p, onBack, onEdit, onEstado, onDelete, onLeads }) {
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

  const detailStyles = getPropertyDetailStyles(t, mode);

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
          {onLeads && (
            <button onClick={onLeads} style={detailStyles.iconBtn} title="Ver Leads">
              <Users size={18} strokeWidth={1.5} />
            </button>
          )}
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