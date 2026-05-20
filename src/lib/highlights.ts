// ── Constantes compartidas entre ManualHighlightsSelector y messageFormatter ──

export const HIGHLIGHT_GROUPS = [
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
];

export const LABELS: Record<string, string> = {
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
};

const VISTA_NATURE_MAP: Record<string, string> = {
  "vista_Parque":          "vista al parque",
  "vista_Panorámica":      "vista panorámica",
  "vista_Mar":             "vista al mar",
  "vista_Jardín interior": "vista a jardín interior",
  "vista_Avenida":         "vista a avenida",
  "vista_Calle":           "vista a calle tranquila",
};

const VISTA_FULL_MAP: Record<string, string> = {
  "vista_Parque":          "🌳 Vista directa al parque",
  "vista_Panorámica":      "🏙️ Vista panorámica despejada",
  "vista_Mar":             "🌊 Vista al mar",
  "vista_Jardín interior": "🌸 Tranquilidad con vista a jardín interior",
  "vista_Avenida":         "🏢 Vista a avenida principal",
  "vista_Calle":           "🏘️ Vista a calle residencial",
};

const ANTIGUEDAD_MAP: Record<string, string> = {
  "A estrenar":   "✨ A estrenar, acabados de lujo",
  "1-5 años":     "🆕 Como nuevo, muy bien conservado",
  "5-10 años":    "🏗 Buen estado general",
};

const KEY_TO_PHRASE_MAP: Record<string, string> = {
  recepcion:     "🛎️ Recepción / Seguridad 24h",
  cochera:       "🚗 Estacionamiento privado incluido",
  ascensor:      "🛗 Edificio con ascensor",
  area_servicio: "🧺 Cuarto y baño de servicio",
  mascotas:      "🐾 Pet friendly",
  gas_natural:   "🔥 Gas natural",
  lavanderia:    "🫧 Zona de lavandería",
  tendal:        "🌬️ Tendal",
  piscina:       "🏊 Piscina",
  gimnasio:      "💪 Gimnasio",
  terraza:       "🌇 Terraza común",
  jardin:        "🌳 Jardín",
  parrilla:      "🔥 Parrilla / BBQ",
  juegos_ninos:  "🧸 Juegos infantiles",
};

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── FUSIÓN INTELIGENTE DE MANUALES ──────────────────────────────────────────

export function fuseManuales(
  manuales: string[],
  prop: any
): { phrases: string[]; consumed: Set<string> } {
  const phrases: string[] = [];
  const consumed = new Set<string>();

  // ── Grupo equipamiento ──────────────────────────────────────────────────
  const tieneAmoblado  = manuales.includes("amoblado");
  const tieneCocina    = manuales.includes("cocina_equipada");
  const tieneCloset    = manuales.includes("closet");

  if (tieneAmoblado || tieneCocina || tieneCloset) {
    if (tieneAmoblado) {
      phrases.push("🛋️ Totalmente amoblado y equipado");
    } else {
      if (tieneCocina && tieneCloset) {
        phrases.push("🍳 Cocina equipada y closets empotrados");
      } else if (tieneCocina) {
        phrases.push("🍳 Cocina completamente equipada");
      } else if (tieneCloset) {
        phrases.push("🚪 Closets empotrados en dormitorios");
      }
    }
    consumed.add("amoblado");
    consumed.add("cocina_equipada");
    consumed.add("closet");
    consumed.add("equipamiento");
  }

  // ── Grupo vista ─────────────────────────────────────────────────────────
  const vistaKey       = manuales.find((k) => k.startsWith("vista_"));
  const tieneVentanas  = manuales.includes("ventanas_amplias");
  const tieneBalcon    = manuales.includes("balcon");

  const vistaText = vistaKey
    ? (VISTA_NATURE_MAP as Record<string, string>)[vistaKey] || `vista ${vistaKey.replace("vista_", "").toLowerCase()}`
    : null;

  if (vistaKey || tieneVentanas || tieneBalcon) {
    if (tieneBalcon && (vistaKey || tieneVentanas)) {
      const extras: string[] = [];
      if (vistaText) extras.push(vistaText);
      if (tieneVentanas) extras.push("ventanas amplias");
      phrases.push(`🌿 Balcón privado con ${extras.join(" y ")}`);
    } else if (tieneVentanas && vistaKey) {
      phrases.push(`🪟 Ventanas amplias con ${vistaText}`);
    } else if (tieneBalcon) {
      phrases.push("🌿 Balcón privado");
    } else if (tieneVentanas) {
      phrases.push("🪟 Ventanas amplias, excelente iluminación natural");
    } else if (vistaKey) {
      phrases.push((VISTA_FULL_MAP as Record<string, string>)[vistaKey] || `👀 Vista ${vistaKey.replace("vista_", "").toLowerCase()}`);
    }

    consumed.add("ventanas_amplias");
    consumed.add("balcon");
    consumed.add("vista");
    consumed.add("iluminacion");
    if (vistaKey) consumed.add(vistaKey);
  }

  // ── Resto de manuales ─────────────────────────────────────────────────
  const remaining = manuales.filter((k) => !consumed.has(k));
  for (const key of remaining) {
    let phrase: string | null = null;

    if (key === "antiguedad") {
      const antiguedad = prop.antiguedad || "";
      phrase = ANTIGUEDAD_MAP[antiguedad] || null;
    } else if (key === "amplitud") {
      const area = prop.area_m2 || 0;
      if (area >= 120)      phrase = "🏰 Muy amplio y espacioso";
      else if (area >= 90)  phrase = "📐 Ambientes amplios";
      else if (area >= 60)  phrase = "✨ Bien distribuido";
    } else {
      phrase = KEY_TO_PHRASE_MAP[key] || null;
    }

    if (phrase) {
      phrases.push(phrase);
      consumed.add(key);
    }
  }

  return { phrases: phrases.slice(0, 3), consumed };
}
