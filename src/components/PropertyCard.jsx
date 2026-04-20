import { MoreVertical, PencilLine, Trash2, Copy } from "lucide-react";
import { getEstadoDisplay } from "../utils/constants";
import { useTheme } from "../hooks/useTheme.jsx";

/**
 * PropertyCard - Tarjeta individual de propiedad en la lista
 */
export function PropertyCard({ 
  property, 
  out, 
  ec, 
  onClick, 
  onEdit, 
  onDelete, 
  onDuplicate,
  openMenu, 
  setOpenMenu 
}) {
  const { t } = useTheme();
  const isMenuOpen = openMenu === property.id;

  return (
    <div
      style={styles.card}
      onClick={onClick}
    >
      <div style={styles.cardMain}>
        <div style={styles.cardLeft}>
          <div style={styles.cardName}>{property.nombre}</div>
          <div style={styles.cardSub}>{property.tipo} · {property.distrito}</div>
          <div style={styles.cardPrice}>{out.precio}</div>
        </div>

        <div style={styles.cardRight} onClick={(e) => e.stopPropagation()}>
          <span style={styles.statusBadge(ec)}>
            <span style={styles.statusDot(ec)} />
            {getEstadoDisplay(property.estado, property.operacion)}
          </span>
          
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

const styles = {
  card: {
    background: t.colors.bgCard,
    borderRadius: 16,
    border: `1px solid ${t.colors.border}`,
    position: "relative",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  cardMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  cardLeft: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontWeight: 700,
    fontSize: 15,
    color: t.colors.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: t.colors.textMuted,
    marginBottom: 4,
  },
  cardPrice: {
    fontWeight: 700,
    fontSize: 14,
    color: t.colors.primary,
  },
  cardRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
  },
  statusBadge: (ec) => ({
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "4px 10px",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    backgroundColor: ec?.bg || t.colors.success,
    color: t.colors.text,
  }),
  statusDot: (ec) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: ec?.dot || t.colors.text,
    display: "inline-block",
    marginRight: 4,
  }),
  dropdown: {
    background: t.colors.bgCard,
    borderRadius: 12,
    padding: 8,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    position: "absolute",
    right: "100%",
    marginRight: 8,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 50,
    border: `1px solid ${t.colors.border}`,
    minWidth: 140,
  },
  dropItem: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: 14,
    cursor: "pointer",
    borderRadius: 8,
    color: t.colors.text,
  },
  dropItemDanger: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: 14,
    cursor: "pointer",
    borderRadius: 8,
    color: t.colors.danger,
  },
  menuDot: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: t.colors.textMuted,
    padding: 8,
    zIndex: 10,
    position: "relative",
  },
};

export default PropertyCard;