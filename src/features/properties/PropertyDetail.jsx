import { useState } from "react";
import { buildOutputs } from "../../utils/messageFormatter";
import { ESTADO_COLORS } from "../../utils/constants";
import { CopyShareBtns } from "../../components/ui/CopyShareBtns";
import { Gallery } from "../../components/ui/Gallery";
import { useSwipeBack } from "../../hooks/useSwipeBack";

/**
 * Property detail component showing full information for admin
 * Displays messages, photos, location, and status management
 */
export function PropertyDetail({ p, onBack, onEdit, onEstado }) {
  const out = buildOutputs(p);
  const ec = ESTADO_COLORS[p.estado] || ESTADO_COLORS.Disponible;
  const [tab, setTab] = useState("corto");
  const [showGallery, setGallery] = useState(false);

  // Swipe to go back
  useSwipeBack(onBack, true);

  return (
    <div style={detailStyles.container}>
      <div style={detailStyles.header}>
        <button onClick={onBack} style={detailStyles.backBtn}>
          ← Volver
        </button>
        <button onClick={onEdit} style={detailStyles.editBtn}>
          ✏️ Editar
        </button>
      </div>

      {out.fotos.length > 0 && (
        <div style={detailStyles.heroWrap} onClick={() => setGallery(true)}>
          <img src={out.fotos[0]} alt="" style={detailStyles.heroImg} />
          {out.fotos.length > 1 && (
            <div style={detailStyles.heroBadge}>
              📸 {out.fotos.length} fotos
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
            🧾 Mantenimiento: S/ {p.mantenimiento} mensuales
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
            📸 Ver fotos ({out.fotos.length})
          </button>
        )}
        {p.tour360_url && (
          <a href={p.tour360_url} target="_blank" rel="noreferrer" style={detailStyles.actionBtn}>
            🌐 Tour 360
          </a>
        )}
        {p.video_url && (
          <a href={p.video_url} target="_blank" rel="noreferrer" style={detailStyles.actionBtn}>
            🎥 Video
          </a>
        )}
        <a href={out.mapsLink} target="_blank" rel="noreferrer" style={detailStyles.actionBtn}>
          🗺 Ver mapa
        </a>
      </div>

      <div style={detailStyles.card}>
        <div style={detailStyles.sectionTitle}>📍 Ubicación</div>
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
    background: "#f4f4f0",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#1a1a1a",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#e8ff4f",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    padding: 0,
  },
  editBtn: {
    background: "#333",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  heroWrap: {
    position: "relative",
    cursor: "pointer",
  },
  heroImg: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    display: "block",
  },
  heroBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    background: "rgba(0,0,0,.6)",
    color: "#fff",
    borderRadius: 20,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    margin: "12px 16px 0",
    padding: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,.05)",
    border: "1.5px solid #eee",
  },
  name: {
    fontWeight: 800,
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },
  estadoSelect: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "3px 9px",
    cursor: "pointer",
    outline: "none",
  },
  precioBlock: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  mantBlock: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  tabRow: {
    display: "flex",
    gap: 8,
    padding: "14px 16px 0",
  },
  tab: {
    flex: 1,
    padding: "9px 0",
    borderRadius: 10,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#888",
  },
  tabActive: {
    background: "#1a1a1a",
    color: "#e8ff4f",
    border: "1.5px solid #1a1a1a",
  },
  msgBox: {
    margin: "10px 16px 0",
    background: "#fff",
    borderRadius: 14,
    padding: 14,
    border: "1.5px solid #eee",
  },
  msgPre: {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#222",
    margin: "0 0 12px",
    lineHeight: 1.6,
  },
  msgPreNoBox: {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#222",
    background: "none",
    border: "none",
    padding: 0,
    margin: "0 0 12px",
    lineHeight: 1.6,
  },
  actionGrid: {
    display: "flex",
    gap: 8,
    padding: "12px 16px 0",
    flexWrap: "wrap",
  },
  actionBtn: {
    flex: "1 1 calc(50% - 4px)",
    padding: "10px 0",
    background: "#fff",
    border: "1.5px solid #e0e0d8",
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    color: "#1a1a1a",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
};
