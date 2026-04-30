import { MoreVertical, PencilLine, Trash2, Copy } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";
import { getPropertyCardStyles } from "../styles/componentStyles.js";
import { useStatus } from "../hooks/useStatus.js";

/**
 * PropertyCard - Tarjeta individual de propiedad en la lista
 */
export function PropertyCard({ 
  property, 
  out, 
  onClick, 
  onEdit, 
  onDelete, 
  onDuplicate,
  openMenu, 
  setOpenMenu 
}) {
  const { t } = useTheme();
  const isMenuOpen = openMenu === property.id;
  const ec = useStatus(property.estado, "property", "solid");

  const styles = getPropertyCardStyles(t, ec);

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.cardMain}>
        <div style={styles.cardLeft}>
          <div style={styles.cardName}>{property.nombre}</div>
          <div style={styles.cardSub}>{property.tipo} · {property.distrito}</div>
          <div style={styles.cardPrice}>{out.precio}</div>
        </div>

        <div style={styles.cardRight} onClick={(e) => e.stopPropagation()}>
          {isMenuOpen && (
            <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
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
            onClick={(e) => { e.stopPropagation(); setOpenMenu(isMenuOpen ? null : property.id); }}
          >
            <MoreVertical size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;