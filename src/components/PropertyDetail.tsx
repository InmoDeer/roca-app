"use client";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { getPropertyDetailStyles } from "@/styles/componentStyles";
import { buildOutputs } from "@/lib/messageFormatter";
import { PIPELINE_PROPERTY } from "@/lib/constants";
import { StatusSelect } from "@/components/ui/select";
import { CopyShareBtns } from "@/components/ui/CopyShareBtns";
import { MediaViewer } from "@/components/ui/MediaViewer";
import {
  MapPin, PencilLine, Trash2, ArrowLeft,
  Eye, FileText, Globe, Video, Images, Zap, Flame,
} from "lucide-react";

export function PropertyDetail({ p, onBack, onEdit, onEstado, onDelete, onRefresh }: any) {
  const { t, mode } = useTheme();
  const out = buildOutputs(p);
  const [tab, setTab] = useState("corto");
  const [mediaViewer, setMediaViewer] = useState({ open: false, initialTab: "fotos" });

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
          <button onClick={handleDelete} style={detailStyles.iconBtn} title="Eliminar">
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
          <button onClick={onEdit} style={detailStyles.iconBtn} title="Editar">
            <PencilLine size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {out.fotos.length > 0 && (
        <div style={detailStyles.heroWrap} onClick={() => setMediaViewer({ open: true, initialTab: "fotos" })}>
          <img src={out.fotos[0]} alt="" style={detailStyles.heroImg} />
          {out.fotos.length > 1 && (
            <div style={{ ...detailStyles.heroBadge, display: "flex", alignItems: "center", gap: 4 }}>
              <Eye size={14} strokeWidth={1.5} /> {out.fotos.length} fotos
            </div>
          )}
        </div>
      )}

      <div style={detailStyles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={detailStyles.name}>{p.nombre}</div>
            <div style={detailStyles.sub}>{p.tipo} · {p.distrito}</div>
          </div>
          <StatusSelect value={p.estado} onValueChange={(v: string) => onEstado(p.id, v)} pipeline={PIPELINE_PROPERTY} operacion={p.operacion} />
        </div>
        <div style={detailStyles.precioBlock}>{out.precio}</div>
        {p.mantenimiento && (
          <div style={{ ...detailStyles.mantBlock, display: "flex", alignItems: "center", gap: 4 }}>
            <FileText size={14} strokeWidth={1.5} /> Mantenimiento: S/ {p.mantenimiento}/mes
          </div>
        )}
      </div>

      <div style={detailStyles.tabRow}>
        {["corto", "largo"].map((t: string) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...detailStyles.tab, ...(tab === t ? detailStyles.tabActive : {}), display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            {t === "corto" ? <><Zap size={14} strokeWidth={1.5} /> Corto</> : <><Flame size={14} strokeWidth={1.5} /> Largo</>}
          </button>
        ))}
      </div>

      <div style={detailStyles.msgBox}>
        <pre style={detailStyles.msgPre}>{tab === "corto" ? out.mensajeCorto : out.mensajeLargo}</pre>
        <CopyShareBtns text={tab === "corto" ? out.mensajeCorto : out.mensajeLargo} />
      </div>

      <div style={detailStyles.actionGrid}>
        {out.fotos.length > 0 && (
          <button onClick={() => setMediaViewer({ open: true, initialTab: "fotos" })} style={{ ...detailStyles.actionBtn, cursor: "pointer" }}>
            <Images size={16} strokeWidth={1.5} /> Ver fotos ({out.fotos.length})
          </button>
        )}
        {p.tour360_url && (
          <button onClick={() => setMediaViewer({ open: true, initialTab: "tour" })} style={{ ...detailStyles.actionBtn, cursor: "pointer" }}>
            <Globe size={16} strokeWidth={1.5} /> Tour 360
          </button>
        )}
        {p.video_url && (
          <button onClick={() => setMediaViewer({ open: true, initialTab: "video" })} style={{ ...detailStyles.actionBtn, cursor: "pointer" }}>
            <Video size={16} strokeWidth={1.5} /> Video
          </button>
        )}
        <a href={out.mapsLink} target="_blank" rel="noreferrer" style={detailStyles.actionBtn}>
          <MapPin size={16} strokeWidth={1.5} /> Ver mapa
        </a>
      </div>

      <div style={detailStyles.card}>
        <div style={detailStyles.sectionTitle}>Ubicación</div>
        <pre style={detailStyles.msgPreNoBox}>{out.ubicacion}</pre>
        <CopyShareBtns text={out.ubicacion} />
      </div>

      {out.multimedia && (
        <div style={detailStyles.card}>
          <div style={detailStyles.sectionTitle}>Multimedia</div>
          <pre style={detailStyles.msgPreNoBox}>{out.multimedia}</pre>
          <CopyShareBtns text={out.multimedia} />
        </div>
      )}

      {mediaViewer.open && (
        <MediaViewer
          fotos={out.fotos}
          videoUrl={p.video_url}
          tour360Url={p.tour360_url}
          initialTab={mediaViewer.initialTab}
          onClose={() => setMediaViewer((s) => ({ ...s, open: false }))}
        />
      )}
    </div>
  );
}
