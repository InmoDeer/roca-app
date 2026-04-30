import { Search } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";
import { RocaSelect } from "./ui/select.jsx";

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
        <RocaSelect
          label=""
          value={filters.operacion}
          onValueChange={(v) => setFilters((f) => ({ ...f, operacion: v }))}
          options={["Venta", "Alquiler"]}
          placeholder="Operación"
        />
        <RocaSelect
          label=""
          value={filters.tipo}
          onValueChange={(v) => setFilters((f) => ({ ...f, tipo: v }))}
          options={["Departamento", "Casa", "Local", "Oficina", "Terreno"]}
          placeholder="Tipo"
        />
        <RocaSelect
          label=""
          value={filters.estado}
          onValueChange={(v) => setFilters((f) => ({ ...f, estado: v }))}
          options={["Disponible", "Reservado", "Cerrado"]}
          placeholder="Estado"
        />
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