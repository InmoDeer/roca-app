"use client";
import { Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { RocaSelect } from "./ui/select";

export function PropertyFilters({ filters, setFilters, loading, filteredCount }: any) {
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
        <RocaSelect
          label=""
          value={filters.operacion}
          onValueChange={(v: string) => setFilters((f: any) => ({ ...f, operacion: v }))}
          options={["Venta", "Alquiler"]}
          placeholder="Operación"
        />
        <RocaSelect
          label=""
          value={filters.tipo}
          onValueChange={(v: string) => setFilters((f: any) => ({ ...f, tipo: v }))}
          options={["Departamento", "Casa", "Local", "Oficina", "Terreno"]}
          placeholder="Tipo"
        />
        <RocaSelect
          label=""
          value={filters.estado}
          onValueChange={(v: string) => setFilters((f: any) => ({ ...f, estado: v }))}
          options={["Disponible", "Reservado", "Cerrado"]}
          placeholder="Estado"
        />
      </div>

      {!loading && (
        <div style={styles.count}>
          {filteredCount} {filteredCount === 1 ? "inmueble" : "inmuebles"}
        </div>
      )}
    </>
  );
}