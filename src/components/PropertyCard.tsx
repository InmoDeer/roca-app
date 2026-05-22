"use client";
import type { Property } from "@/core/entities/property";
import { MoreVertical, PencilLine, Trash2, Copy } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { getPropertyCardStyles } from "@/styles/componentStyles";
import { useStatus } from "@/hooks/useStatus";

export function PropertyCard({ 
  property, 
  out, 
  onClick, 
  onEdit, 
  onDelete, 
  onDuplicate,
  openMenu, 
  setOpenMenu 
}: {
  property: Property;
  out: any;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
}) {
  const { t } = useTheme();
  const isMenuOpen = openMenu === property.id;
  const ec = useStatus(property.estado, "property", "solid");

  const styles = getPropertyCardStyles(t, ec) as Record<string, React.CSSProperties>;

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.cardMain}>
        <div style={styles.cardLeft}>
          <div style={styles.cardName}>{property.nombre}</div>
          <div style={styles.cardSub}>{property.tipo} · {property.distrito}</div>
          <div style={styles.cardPrice}>{out.precio}</div>
        </div>

        <div style={styles.cardRight} onClick={(e: any) => e.stopPropagation()}>
          {isMenuOpen && (
            <div style={styles.dropdown} onClick={(e: any) => e.stopPropagation()}>
              <button 
                style={styles.dropItem} 
                onClick={() => { onEdit(); setOpenMenu(null); }}
              >
                <PencilLine size={16} strokeWidth={1.5} style={{ marginRight: 8 }} /> 
                Editar
              </button>
              <button 
                style={styles.dropItem} 
                onClick={() => { onDuplicate(); setOpenMenu(null); }}
              >
                <Copy size={16} strokeWidth={1.5} style={{ marginRight: 8 }} /> 
                Duplicar
              </button>
              <button
                style={styles.dropItemDanger}
                onClick={() => { if (confirm("¿Eliminar este inmueble?")) onDelete(); }}
              >
                <Trash2 size={16} strokeWidth={1.5} style={{ marginRight: 8 }} /> 
                Eliminar
              </button>
            </div>
          )}
          
          <button
            style={styles.menuDot}
            onClick={(e: any) => { e.stopPropagation(); setOpenMenu(isMenuOpen ? null : property.id); }}
          >
            <MoreVertical size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}