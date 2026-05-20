"use client";
import { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";

// Grupos visuales — las claves dentro de cada grupo se muestran juntas
// y se fusionan en una sola frase al generar el mensaje
const GROUPS = [
  {
    label: "Equipamiento interior",
    keys: ["amoblado", "cocina_equipada", "closet"],
    hint: "Se fusionan en una sola frase",
  },
  {
    label: "Vista e iluminación",
    keys: ["vista", "balcon", "ventanas_amplias"],
    hint: "Se fusionan en una sola frase",
  },
  {
    label: "Estado y dimensiones",
    keys: ["antiguedad", "amplitud"],
    hint: "Se adaptan al valor del inmueble",
  },
  {
    label: "Extras y servicios",
    keys: [
      "cochera", "ascensor", "recepcion", "area_servicio",
      "gas_natural", "lavanderia", "tendal", "mascotas",
    ],
  },
  {
    label: "Áreas comunes",
    keys: ["areas_comunes"],
    hint: "Se fusionan en una sola frase",
  },
];

const LABELS: Record<string, string> = {
  amoblado:        "Amoblado",
  cocina_equipada: "Cocina equipada",
  closet:          "Closets empotrados",
  vista:           "Vista (según selección)",
  balcon:          "Balcón privado",
  ventanas_amplias:"Ventanas amplias",
  antiguedad:      "Antigüedad (según valor)",
  amplitud:        "Amplitud (según metraje)",
  cochera:         "Estacionamiento",
  ascensor:        "Ascensor",
  recepcion:       "Recepción 24h",
  area_servicio:   "Cuarto de servicio",
  gas_natural:     "Gas natural",
  lavanderia:      "Lavandería",
  tendal:          "Tendal",
  mascotas:        "Pet friendly",
  piscina:         "Piscina",
  gimnasio:        "Gimnasio",
  terraza:         "Terraza",
  jardin:          "Jardín",
  parrilla:        "Parrilla",
  juegos_ninos:    "Juegos infantiles",
  areas_comunes:   "Áreas comunes (según disponibilidad)",
};

export function ManualHighlightsSelector({ form, setForm }: any) {
  const { t } = useTheme();

  // Construir opciones disponibles según lo que tiene marcado el inmueble
  const availableKeys = useMemo(() => {
    const p = form;
    const keys = new Set<string>();

    if (p.amoblado)        keys.add("amoblado");
    if (p.cocina_equipada) keys.add("cocina_equipada");
    if (p.closet)          keys.add("closet");
    if (p.vista)           keys.add("vista");
    if (p.balcon)          keys.add("balcon");
    if (p.ventanas_amplias) keys.add("ventanas_amplias");
    if (p.cochera)         keys.add("cochera");
    if (p.ascensor)        keys.add("ascensor");
    if (p.recepcion)       keys.add("recepcion");
    if (p.area_servicio)   keys.add("area_servicio");
    if (p.gas_natural)     keys.add("gas_natural");
    if (p.lavanderia)      keys.add("lavanderia");
    if (p.tendal)          keys.add("tendal");
    if (p.mascotas === "Sí") keys.add("mascotas");
    if (p.antiguedad && p.antiguedad !== "") keys.add("antiguedad");
    if (p.area_m2 && p.area_m2 >= 60) keys.add("amplitud");
    if (p.piscina)         keys.add("piscina");
    if (p.gimnasio)        keys.add("gimnasio");
    if (p.terraza)         keys.add("terraza");
    if (p.jardin)          keys.add("jardin");
    if (p.parrilla)        keys.add("parrilla");
    if (p.juegos_ninos)    keys.add("juegos_ninos");
    const hasAnyArea = p.piscina || p.gimnasio || p.terraza || p.jardin || p.parrilla || p.juegos_ninos;
    if (hasAnyArea) keys.add("areas_comunes");

    return keys;
  }, [form]);

  // La clave real que se guarda para "vista" es "vista_<valor>"
  const selected: string[] = form.destacados_manuales || [];

  // Normaliza: "vista" en UI → "vista_Parque" etc. en el array guardado
  function getStoredKey(key: string): string {
    if (key === "vista" && form.vista) return `vista_${form.vista}`;
    return key;
  }

  function isSelected(key: string): boolean {
    return selected.includes(getStoredKey(key));
  }

  // Cuenta cuántos "slots" ocupa la selección actual
  function countSlots(): number {
    const hasEquipGroup = ["amoblado","cocina_equipada","closet"].some(k =>
      selected.includes(k)
    );
    const hasVistaGroup = ["balcon","ventanas_amplias"].some(k => selected.includes(k)) ||
      selected.some(k => k.startsWith("vista_"));
    const hasAreasComunes = selected.includes("areas_comunes");
    const singles = selected.filter(k =>
      !["amoblado","cocina_equipada","closet"].includes(k) &&
      !["balcon","ventanas_amplias"].includes(k) &&
      !k.startsWith("vista_") &&
      k !== "areas_comunes"
    ).length;
    return (hasEquipGroup ? 1 : 0) + (hasVistaGroup ? 1 : 0) + (hasAreasComunes ? 1 : 0) + singles;
  }

  function toggleKey(key: string) {
    const storedKey = getStoredKey(key);
    let next = [...selected];

    if (next.includes(storedKey)) {
      next = next.filter((k) => k !== storedKey);
    } else {
      if (countSlots() >= 3) {
        alert("Podés seleccionar hasta 3 destacados (los grupos cuentan como 1).");
        return;
      }
      next.push(storedKey);
    }

    setForm({ ...form, destacados_manuales: next });
  }

  const visibleGroups = GROUPS.map((g) => ({
    ...g,
    items: g.keys.filter((k) => availableKeys.has(k)),
  })).filter((g) => g.items.length > 0);

  if (visibleGroups.length === 0) {
    return (
      <p style={{ color: t.colors.textMuted, fontSize: 13, marginBottom: 16 }}>
        Completá las características del inmueble para poder destacarlas.
      </p>
    );
  }

  const slots = countSlots();

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Contador de slots */}
      <p style={{ fontSize: 12, color: slots >= 3 ? t.colors.primary : t.colors.textMuted, marginBottom: 12 }}>
        {slots}/3 destacados seleccionados
        {slots > 0 && " · Los grupos fusionados cuentan como 1"}
      </p>

      {visibleGroups.map((group) => (
        <div key={group.label} style={{ marginBottom: 16 }}>
          {/* Cabecera del grupo */}
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: t.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            {group.label}
            {group.hint && (
              <span style={{
                fontSize: 10,
                fontWeight: 400,
                color: t.colors.primary,
                background: `${t.colors.primary}18`,
                borderRadius: 4,
                padding: "1px 6px",
                textTransform: "none",
                letterSpacing: 0,
              }}>
                {group.hint}
              </span>
            )}</div>

          {/* Opciones del grupo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 8 }}>
            {group.items.map((key) => {
              const checked = isSelected(key);
              return (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: checked ? `${t.colors.primary}18` : "transparent",
                    border: `1px solid ${checked ? t.colors.primary : "transparent"}`,
                    transition: "all 0.15s ease",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleKey(key)}
                    style={{ accentColor: t.colors.primary, width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: t.colors.text }}>
                    {key === "vista" && form.vista
                      ? `Vista ${form.vista.toLowerCase()}`
                      : key === "antiguedad" && form.antiguedad
                      ? `Antigüedad: ${form.antiguedad}`
                      : key === "amplitud" && form.area_m2
                      ? (form.area_m2 >= 120 ? "Muy amplio" : form.area_m2 >= 90 ? "Amplio" : "Bien distribuido")
                      : LABELS[key]}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
