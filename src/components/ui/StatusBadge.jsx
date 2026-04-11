import { ESTADO_COLORS } from "../../utils/constants";

/**
 * Status badge component showing property status with color coding
 */
export function StatusBadge({ estado }) {
  const colors = ESTADO_COLORS[estado] || ESTADO_COLORS.Disponible;

  return (
    <span
      style={{
        ...statusBadgeStyles.badge,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: colors.dot,
          display: "inline-block",
          marginRight: 5,
        }}
      />
      {estado}
    </span>
  );
}

const statusBadgeStyles = {
  badge: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "3px 9px",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
};
