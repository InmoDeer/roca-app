"use client";
import { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";

const LABELS: Record<string, string> = {
  balcon: "Balcón privado",
  ventanas_amplias: "Ventanas amplias",
  cocina_equipada: "Cocina equipada",
  closet: "Closets empotrados",
  recepcion: "Recepción 24h",
  cochera: "Estacionamiento",
  ascensor: "Ascensor",
  amoblado: "Amoblado",
  area_servicio: "Cuarto de servicio",
  gas_natural: "Gas natural",
  lavanderia: "Lavandería",
  piscina: "Piscina",
  gimnasio: "Gimnasio",
  tendal: "Tendal",
  terraza: "Terraza",
  jardin: "Jardín",
  parrilla: "Parrilla",
  juegos_ninos: "Juegos infantiles",
};

export function ManualHighlightsSelector({ form, setForm }: any) {
  const { t } = useTheme();

  const availableOptions = useMemo(() => {
    const options: { key: string; label: string }[] = [];
    const p = form;

    if (p.balcon) options.push({ key: "balcon", label: LABELS.balcon });
    if (p.ventanas_amplias) options.push({ key: "ventanas_amplias", label: LABELS.ventanas_amplias });
    if (p.vista && p.vista !== "") options.push({ key: `vista_${p.vista}`, label: `Vista ${p.vista.toLowerCase()}` });
    if (p.cocina_equipada) options.push({ key: "cocina_equipada", label: LABELS.cocina_equipada });
    if (p.closet) options.push({ key: "closet", label: LABELS.closet });
    if (p.recepcion) options.push({ key: "recepcion", label: LABELS.recepcion });
    if (p.cochera) options.push({ key: "cochera", label: LABELS.cochera });
    if (p.ascensor) options.push({ key: "ascensor", label: LABELS.ascensor });
    if (p.amoblado) options.push({ key: "amoblado", label: LABELS.amoblado });
    if (p.area_servicio) options.push({ key: "area_servicio", label: LABELS.area_servicio });
    if (p.mascotas === "Sí") options.push({ key: "mascotas", label: "Pet friendly" });
    if (p.gas_natural) options.push({ key: "gas_natural", label: LABELS.gas_natural });
    if (p.lavanderia) options.push({ key: "lavanderia", label: LABELS.lavanderia });
    if (p.piscina) options.push({ key: "piscina", label: LABELS.piscina });
    if (p.gimnasio) options.push({ key: "gimnasio", label: LABELS.gimnasio });
    if (p.tendal) options.push({ key: "tendal", label: LABELS.tendal });
    if (p.terraza) options.push({ key: "terraza", label: LABELS.terraza });
    if (p.jardin) options.push({ key: "jardin", label: LABELS.jardin });
    if (p.parrilla) options.push({ key: "parrilla", label: LABELS.parrilla });
    if (p.juegos_ninos) options.push({ key: "juegos_ninos", label: LABELS.juegos_ninos });

    return options;
  }, [form]);

  const selected: string[] = form.destacados_manuales || [];

  const toggleOption = (key: string) => {
    let newSelected = [...selected];
    if (newSelected.includes(key)) {
      newSelected = newSelected.filter((k) => k !== key);
    } else {
      if (newSelected.length >= 3) {
        alert("Puedes seleccionar máximo 3 destacados.");
        return;
      }
      newSelected.push(key);
    }
    setForm({ ...form, destacados_manuales: newSelected });
  };

  if (availableOptions.length === 0) {
    return (
      <p style={{ color: t.colors.textMuted, fontSize: 13, marginBottom: 16 }}>
        Completa las características del inmueble para poder destacarlas.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      {availableOptions.map((opt) => (
        <label
          key={opt.key}
          style={{ display: "flex", alignItems: "center", gap: 8, color: t.colors.text, fontSize: 14, cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.key)}
            onChange={() => toggleOption(opt.key)}
            style={{ accentColor: t.colors.primary }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
