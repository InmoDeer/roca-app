"use client";
import type { PropertyFilters as PropertyFiltersType } from "@/core/entities/property";
import { Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { RocaSelect } from "./ui/select";
import { getPropertyFiltersStyles } from "@/styles/componentStyles";
import { OPERATIONS, PROPERTY_TYPES, PIPELINE_PROPERTY } from "@/core/entities/property";

const ALL = "__all__"

const withAll = (arr: readonly string[]) =>
  [{ value: ALL, label: "Todos" }, ...arr.map(o => ({ value: o, label: o }))]

export function PropertyFilters({ filters, setFilters, loading, filteredCount }: {
  filters: PropertyFiltersType;
  setFilters: (f: PropertyFiltersType | ((prev: PropertyFiltersType) => PropertyFiltersType)) => void;
  loading: boolean;
  filteredCount: number;
}) {
  const { t } = useTheme();
  const styles = getPropertyFiltersStyles(t);

  return (
    <>
      <div style={styles.searchWrap}>
        <div style={styles.searchInputWrap}>
          <Search size={18} strokeWidth={1.5} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Buscar..."
            value={filters.q}
            onChange={(e: any) => setFilters((f: any) => ({ ...f, q: e.target.value }))}
          />
        </div>
      </div>

      <div style={styles.filterRow}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <RocaSelect
            label=""
            value={filters.operacion}
            onValueChange={(v: string) => setFilters((f: any) => ({ ...f, operacion: v === ALL ? "" : v }))}
            options={withAll(OPERATIONS)}
            placeholder="Operación"
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <RocaSelect
            label=""
            value={filters.tipo}
            onValueChange={(v: string) => setFilters((f: any) => ({ ...f, tipo: v === ALL ? "" : v }))}
            options={withAll(PROPERTY_TYPES)}
            placeholder="Tipo"
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <RocaSelect
            label=""
            value={filters.estado}
            onValueChange={(v: string) => setFilters((f: any) => ({ ...f, estado: v === ALL ? "" : v }))}
            options={withAll(PIPELINE_PROPERTY.filter(s => s !== "Descartado" && s !== "Mantenimiento"))}
            placeholder="Estado"
          />
        </div>
      </div>

      {!loading && (
        <div style={styles.count}>
          {filteredCount} {filteredCount === 1 ? "inmueble" : "inmuebles"}
        </div>
      )}
    </>
  );
}