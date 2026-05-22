"use client";
import { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { HIGHLIGHT_GROUPS, LABELS, getAmplitudLabel } from "@/lib/highlights";

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
    if (getAmplitudLabel(p.area_m2)) keys.add("amplitud");

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
    const groups = HIGHLIGHT_GROUPS.slice(0, 2);
    const allGroupKeys = new Set(groups.flatMap(g => g.keys));
    const groupSlots = groups.filter(g =>
      g.keys.some(k => k === "vista"
        ? selected.some(s => s.startsWith("vista_"))
        : selected.includes(k))
    ).length;
    const singles = selected.filter(k =>
      !allGroupKeys.has(k) && !k.startsWith("vista_")
    ).length;
    return groupSlots + singles;
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

  const visibleGroups = HIGHLIGHT_GROUPS.map((g) => ({
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
                      : key === "amplitud" ? (getAmplitudLabel(form.area_m2) ?? LABELS[key])
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
