import { MoreVertical, PencilLine, Trash2 } from "lucide-react";

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
  openMenu, 
  setOpenMenu 
}) {
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
            {property.estado}
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
    background: "#1a1a1a",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.06)",
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
    color: "#ffffff",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  cardPrice: {
    fontWeight: 700,
    fontSize: 14,
    color: "#d4af37",
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
    backgroundColor: ec?.bg || "#22c55e",
    color: ec?.text || "#ffffff",
  }),
  statusDot: (ec) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: ec?.dot || "#ffffff",
    display: "inline-block",
    marginRight: 4,
  }),
  dropdown: {
    background: "#1a1a1a",
    borderRadius: 12,
    padding: 8,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    position: "absolute",
    right: "100%",
    marginRight: 8,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 50,
    border: "1px solid rgba(255,255,255,0.08)",
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
    color: "#ffffff",
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
    color: "#ef4444",
  },
  menuDot: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: "#888888",
    padding: 8,
    zIndex: 10,
    position: "relative",
  },
};

export default PropertyCard;