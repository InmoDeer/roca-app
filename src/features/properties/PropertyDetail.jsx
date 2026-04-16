import { useState } from "react";
import { buildOutputs } from "../../utils/messageFormatter";
import { ESTADO_COLORS } from "../../utils/constants";
import { CopyShareBtns } from "../../components/ui/CopyShareBtns";
import { Gallery } from "../../components/ui/Gallery";
import { useSwipeBack } from "../../hooks/useSwipeBack";
import { MapPin, Video, PencilLine, Trash2, X, ArrowLeft, Link, Play, Eye, Images, Globe, DollarSign, FileText } from "lucide-react";

/**
 * Property detail component showing full information for admin
 * Displays messages, photos, location, and status management
 */
export function PropertyDetail({ p, onBack, onEdit, onEstado, onDelete }) {
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

  return (
    <div style={detailStyles.container}>
      <div style={detailStyles.header}>
        <button onClick={onBack} style={detailStyles.backBtn}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => window.open(`/p/${p.id}`, "_blank")} style={detailStyles.iconBtn} title="Landing" style={{ color: "#d4af37" }}>
            <Link size={18} strokeWidth={1.5} />
          </button>
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
            <div style={detailStyles.name}>{p.nombre}</div>
            <div style={detailStyles.sub}>
              {p.tipo} · {p.distrito}
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
                {s}
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

const detailStyles = {
  container: {
    padding: "0 0 80px",
    background: "#0a0a0a",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "rgba(10,10,10,0.9)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#d4af37",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    padding: 0,
  },
  editBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  iconBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
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
    color: "#fff",
    borderRadius: 20,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    margin: "16px 20px 0",
    padding: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  name: {
    fontWeight: 800,
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  estadoSelect: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "4px 10px",
    cursor: "pointer",
    outline: "none",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
  },
  precioBlock: {
    fontSize: 18,
    fontWeight: 700,
    color: "#d4af37",
    marginTop: 8,
  },
  mantBlock: {
    fontSize: 13,
    color: "#666666",
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
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#666666",
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
    background: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  msgPre: {
    fontFamily: "'Outfit',sans-serif",
    fontSize: 14,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#cccccc",
    margin: "0 0 16px",
    lineHeight: 1.7,
  },
  msgPreNoBox: {
    fontFamily: "'Outfit',sans-serif",
    fontSize: 14,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#cccccc",
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
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    textAlign: "center",
    textDecoration: "none",
    color: "#ffffff",
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
    color: "#666666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: "1px",
    textAlign: "center",
  },
};
