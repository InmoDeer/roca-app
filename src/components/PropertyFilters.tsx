"use client";
import type { PropertyFilters as PropertyFiltersType } from "@/core/entities/property";
import { Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { RocaSelect } from "./ui/select";
import { OPERATIONS, PROPERTY_TYPES, PIPELINE_PROPERTY } from "@/core/entities/property";

export function PropertyFilters({ filters, setFilters, loading, filteredCount }: {
  filters: PropertyFiltersType;
  setFilters: (f: PropertyFiltersType | ((prev: PropertyFiltersType) => PropertyFiltersType)) => void;
  loading: boolean;
  filteredCount: number;
}) {
  const { t } = useTheme();

  const styles: any = {
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
      justifyContent: "space-between",
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
            onValueChange={(v: string) => setFilters((f: any) => ({ ...f, operacion: v }))}
            options={OPERATIONS}
            placeholder="Operación"
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <RocaSelect
            label=""
            value={filters.tipo}
            onValueChange={(v: string) => setFilters((f: any) => ({ ...f, tipo: v }))}
            options={PROPERTY_TYPES}
            placeholder="Tipo"
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <RocaSelect
            label=""
            value={filters.estado}
            onValueChange={(v: string) => setFilters((f: any) => ({ ...f, estado: v }))}
            options={PIPELINE_PROPERTY.filter(s => s !== "Descartado" && s !== "Mantenimiento")}
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