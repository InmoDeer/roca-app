import { Search } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";

/**
 * PropertyFilters - Componente de búsqueda y filtros
 */
export function PropertyFilters({ filters, setFilters, loading, filteredCount }) {
  const { t } = useTheme();

  // ⬇️ MOVER styles AQUÍ DENTRO para que tenga acceso a 't'
  const styles = {
    searchWrap: {
      padding: "16px 20px 0",
      background: t.colors.bg,
      position: "sticky",
      top: 60,
      zIndex: 5,
    },
    searchInputWrap: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    searchIcon: {
      position: "absolute",
      left: 14,
      color: t.colors.textMuted,
      pointerEvents: "none",
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px 12px 44px",
      border: `1px solid ${t.colors.border}`,
      borderRadius: 12,
      fontSize: 14,
      outline: "none",
      boxSizing: "border-box",
      background: t.colors.bgSecondary,
      color: t.colors.text,
      transition: "all 0.3s ease",
    },
    filterRow: {
      display: "flex",
      gap: 10,
      padding: "12px 20px",
      overflowX: "auto",
      background: t.colors.bg,
    },
    filterSelect: {
      padding: "8px 12px",
      borderRadius: 10,
      border: `1px solid ${t.colors.border}`,
      fontSize: 13,
      background: t.colors.bgSecondary,
      color: t.colors.text,
      flexShrink: 0,
      cursor: "pointer",
      outline: "none",
      minWidth: 100,
    },
    count: {
      padding: "4px 20px 8px",
      fontSize: 12,
      color: t.colors.textMuted,
      fontWeight: 600,
      background: t.colors.bg,
    },
  };

  return (
    <>
      {/* Buscador */}
      <div style={styles.searchWrap}>
        <div style={styles.searchInputWrap}>
          <Search size={18} strokeWidth={1.5} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Buscar..."
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />
        </div>
      </div>

      {/* Filtros */}
      <div style={styles.filterRow}>
        {[
          { k: "operacion", opts: ["Venta", "Alquiler"], label: "Operación" },
          { k: "tipo", opts: ["Departamento", "Casa", "Local", "Oficina", "Terreno"], label: "Tipo" },
          { k: "estado", opts: ["Disponible", "Reservado", "Cerrado"], label: "Estado" },
        ].map(({ k, opts, label }) => (
          <select
            key={k}
            style={styles.filterSelect}
            value={filters[k]}
            onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
          >
            <option value="" style={{ color: t.colors.textMuted }}>{label}</option>
            {opts.map((o) => (
              <option key={o} value={o} style={{ color: t.colors.text }}>{o}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Conteo de resultados */}
      {!loading && (
        <div style={styles.count}>
          {filteredCount} {filteredCount === 1 ? "inmueble" : "inmuebles"}
        </div>
      )}
    </>
  );
}

export default PropertyFilters;