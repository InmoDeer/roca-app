import { Search } from "lucide-react";

/**
 * PropertyFilters - Componente de búsqueda y filtros
 */
export function PropertyFilters({ filters, setFilters, loading, filteredCount }) {
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
          { k: "operacion", opts: ["", "Venta", "Alquiler"], label: "Operación" },
          { k: "tipo", opts: ["", "Departamento", "Casa", "Local", "Oficina", "Terreno"], label: "Tipo" },
          { k: "estado", opts: ["", "Disponible", "Reservado", "Cerrado"], label: "Estado" },
        ].map(({ k, opts, label }) => (
          <select
            key={k}
            style={styles.filterSelect}
            value={filters[k]}
            onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
          >
            <option value="" style={{ color: "#666666" }}>{label}</option>
            {opts.filter(Boolean).map((o) => (
              <option key={o} value={o} style={{ color: "#fff" }}>{o}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Contador */}
      <div style={styles.count}>
        {loading ? "Cargando..." : `${filteredCount} inmueble${filteredCount !== 1 ? "s" : ""}`}
      </div>
    </>
  );
}

const styles = {
  searchWrap: {
    padding: "16px 20px 0",
    background: "#0a0a0a",
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
    color: "#666666",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 44px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    transition: "all 0.3s ease",
  },
  filterRow: {
    display: "flex",
    gap: 10,
    padding: "12px 20px",
    overflowX: "auto",
    background: "#0a0a0a",
  },
  filterSelect: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 13,
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    flexShrink: 0,
    cursor: "pointer",
    outline: "none",
    minWidth: 100,
  },
  count: {
    padding: "4px 20px 8px",
    fontSize: 12,
    color: "#666666",
    fontWeight: 600,
    background: "#0a0a0a",
  },
};

export default PropertyFilters;