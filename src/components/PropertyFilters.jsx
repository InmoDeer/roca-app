import { Search } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";
import { getPropertyFiltersStyles } from "../styles/componentStyles";

/**
 * PropertyFilters - Componente de búsqueda y filtros
 */
export function PropertyFilters({ filters, setFilters, loading, filteredCount }) {
  const { t } = useTheme();
  const styles = getPropertyFiltersStyles(t);

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
            {opts.map((o) => (
              <option key={o} value={o} style={{ color: "#fff" }}>{o}</option>
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