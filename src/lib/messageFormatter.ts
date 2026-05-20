import { fuseManuales } from "@/lib/highlights";

/**
 * Format property data into WhatsApp-optimized messages with emojis and links
 * @param p - Property object from Supabase
 */
export function buildOutputs(p: any) {
  const sym = p.moneda === "USD" ? "$" : "S/ ";
  const precioRaw = Number(p.precio)?.toLocaleString();
  const precioFormatted = `${sym}${precioRaw}`;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const propiedadUrl = `${baseUrl}/?id=${p.id}`;
  const mapsLink =
    p.maps_url ||
    `https://maps.google.com/?q=${encodeURIComponent(
      (p.direccion || "") + " " + (p.distrito || "") + " Lima Peru"
    )}`;

  const fotos = Array.isArray(p.fotos_urls) ? p.fotos_urls : [];

  // ---------- GENERACIÓN DE HIGHLIGHTS ----------
  function generateAutoHighlights(prop: any): string[] {
    const highlights: string[] = [];
    const covered = new Set<string>();

    // ── 1. MANUALES FUSIONADOS ────────────────────────────────────────────────
    const manuales: string[] = Array.isArray(prop.destacados_manuales)
      ? prop.destacados_manuales
      : [];

    const { phrases: manualPhrases, consumed } = fuseManuales(manuales, prop);
    highlights.push(...manualPhrases);
    consumed.forEach((k) => covered.add(k));

    // ── 2. AMPLITUD ───────────────────────────────────────────────────────────
    const area = prop.area_m2 || 0;
    const ambientes = prop.ambientes || 0;
    if (!covered.has("amplitud")) {
      if (area >= 120)     highlights.push("🏰 Muy amplio y espacioso");
      else if (area >= 90) highlights.push("📐 Ambientes amplios");
      else if (area >= 60) highlights.push("✨ Bien distribuido");
    }
    if (ambientes >= 4 && !covered.has("amplitud")) highlights.push("🛋️ Múltiples ambientes");

    // ── 3. PISO / ILUMINACIÓN / VISTA ─────────────────────────────────────────
    const piso = prop.piso || 0;
    const vistaLibre       = !!prop.vista && !covered.has("vista");
    const iluminacionLibre = !covered.has("iluminacion") && !covered.has("ventanas_amplias");

    if (piso >= 15) {
      if (vistaLibre) {
        highlights.push("🌇 Vista panorámica · Iluminación todo el día");
        covered.add("vista");
      } else if (!covered.has("vista")) {
        highlights.push("🌇 Vista panorámica de la ciudad");
        if (iluminacionLibre) highlights.push("☀️ Iluminación natural todo el día");
      }
      covered.add("iluminacion");
    } else if (piso >= 10) {
      if (vistaLibre) {
        highlights.push("🏙️ Vista despejada · Muy iluminado");
        covered.add("vista");
      } else if (!covered.has("vista")) {
        highlights.push("🏙️ Vista despejada y muy iluminado");
      }
      covered.add("iluminacion");
    } else if (piso >= 6) {
      highlights.push("🌳 Buena iluminación y ventilación");
      covered.add("iluminacion");
    } else if (piso >= 2 && !covered.has("vista")) {
      highlights.push("🍃 Vista a zona tranquila");
    }

    // Ventanas amplias: solo si iluminación libre y piso bajo
    if (!covered.has("ventanas_amplias") && prop.ventanas_amplias && piso < 6) {
      highlights.push("🪟 Ventanas amplias, excelente iluminación natural");
      covered.add("ventanas_amplias");
      covered.add("iluminacion");
    }

    // Ambientes luminosos: último recurso
    if (piso < 6 && area >= 70 && !covered.has("iluminacion") && !prop.ventanas_amplias) {
      highlights.push("💡 Ambientes luminosos");
    }

    // ── 4. BALCÓN ─────────────────────────────────────────────────────────────
    if (prop.balcon && !covered.has("balcon")) {
      highlights.push("🌿 Balcón privado");
      covered.add("balcon");
    }

    // ── 5. VISTA ESPECÍFICA (piso < 10 y no cubierta) ─────────────────────────
    if (vistaLibre && !covered.has("vista") && piso < 10) {
      const vistaMap: Record<string, string> = {
        "Parque":          "🌳 Vista directa al parque",
        "Panorámica":      "🏙️ Vista panorámica despejada",
        "Mar":             "🌊 Vista al mar",
        "Jardín interior": "🌸 Tranquilidad con vista a jardín interior",
        "Avenida":         "🏢 Vista a avenida principal",
        "Calle":           "🏘️ Vista a calle residencial",
      };
      highlights.push(vistaMap[prop.vista] || `👀 Vista a ${prop.vista.toLowerCase()}`);
      covered.add("vista");
    }

    // ── 6. ANTIGÜEDAD ─────────────────────────────────────────────────────────
    if (!covered.has("antiguedad")) {
      const antiguedad = prop.antiguedad || "";
      if (antiguedad === "A estrenar")     highlights.push("✨ A estrenar, acabados de lujo");
      else if (antiguedad === "1-5 años")  highlights.push("🆕 Como nuevo, muy bien conservado");
      else if (antiguedad === "5-10 años") highlights.push("🏗 Buen estado general");
    }

    // ── 7. EQUIPAMIENTO INTERIOR ──────────────────────────────────────────────
    if (prop.amoblado && !covered.has("amoblado")) {
      const extras: string[] = [];
      if (prop.cocina_equipada && !covered.has("cocina_equipada")) extras.push("cocina equipada");
      if (prop.closet && !covered.has("closet"))                   extras.push("closets empotrados");
      highlights.push(
        extras.length > 0
          ? `🛋️ Totalmente amoblado con ${extras.join(" y ")}`
          : "🛋️ Totalmente amoblado y equipado"
      );
      covered.add("amoblado");
      covered.add("cocina_equipada");
      covered.add("closet");
    } else {
      if (prop.cocina_equipada && !covered.has("cocina_equipada"))
        highlights.push("🍳 Cocina completamente equipada");
      if (prop.closet && !covered.has("closet"))
        highlights.push("🚪 Closets empotrados en dormitorios");
    }

    // ── 8. EXTRAS ─────────────────────────────────────────────────────────────
    if (prop.recepcion     && !covered.has("recepcion"))            highlights.push("🛎️ Recepción / Seguridad 24h");
    if (prop.cochera       && !covered.has("cochera"))              highlights.push("🚗 Estacionamiento privado incluido");
    if (prop.ascensor      && !covered.has("ascensor") && piso > 1) highlights.push("🛗 Edificio con ascensor");
    if (prop.area_servicio && !covered.has("area_servicio"))        highlights.push("🧺 Cuarto y baño de servicio");
    if (prop.gas_natural   && !covered.has("gas_natural"))          highlights.push("🔥 Gas natural");
    if (prop.lavanderia    && !covered.has("lavanderia"))           highlights.push("🫧 Zona de lavandería");
    if (prop.tendal        && !covered.has("tendal"))               highlights.push("🌬️ Tendal");
    if (prop.mascotas === "Sí" && !covered.has("mascotas"))         highlights.push("🐾 Pet friendly");

    // ── 9. DORMITORIOS / BAÑOS ───────────────────────────────────────────────
    if (prop.dormitorios >= 3 && prop.banos >= 2) {
      highlights.push("🚿 Baños completos para cada dormitorio");
    } else if (prop.dormitorios >= 2) {
      highlights.push("🛏 Ideal para familias o roommates");
    }

    // Aplicar límite de 8 antes de áreas comunes
    const result = [...new Set(highlights)].slice(0, 8);

    // ── 10. ÁREAS COMUNES (siempre al final, fuera del límite) ─────────────────
    const areasMap: Record<string, string> = {
      piscina: "piscina", terraza: "terraza", jardin: "jardín",
      sum: "SUM", parrilla: "parrilla / BBQ",
      juegos_ninos: "juegos infantiles", gimnasio: "gimnasio",
    };
    const areasList = Object.keys(areasMap).filter((k) => prop[k] && !covered.has(k));
    if (areasList.length > 0) {
      result.push(`🏊 Áreas comunes: ${areasList.map((k) => areasMap[k]).join(", ")}`);
    }

    return result;
  }

  // ---------- UBICACIÓN ----------
  function getLocationHighlight(prop: any): string {
    const lines: string[] = [];

    if (prop.direccion) {
      const dir = prop.direccion.toLowerCase();
      if (dir.includes("av."))
        lines.push("📍 Sobre avenida principal, excelente conectividad");
      else if (dir.includes("jr.") || dir.includes("calle"))
        lines.push("📍 Zona residencial tranquila y segura");
      else if (dir.includes("parque") || dir.includes("plaza"))
        lines.push("🌳 Frente a área verde");
    }

    if (prop.cerca_a) lines.push(`🚶 A pasos de ${prop.cerca_a}`);
    if (prop.limita_con) lines.push(`📍 En el límite con ${prop.limita_con}`);

    if (lines.length === 0) {
      const distritosTop = ["Miraflores", "San Isidro", "Barranco", "Surco", "La Molina"];
      lines.push(
        distritosTop.includes(prop.distrito)
          ? `📍 Ubicación privilegiada en ${prop.distrito}`
          : `📍 Céntrico en ${prop.distrito}, cerca a todo`
      );
    }

    return lines.join("\n");
  }

  // ---------- CONSTRUIR SALIDAS ----------
  const autoHighlights = generateAutoHighlights(p);
  const locationHighlight = getLocationHighlight(p);

  const multimedia = [
    fotos.length > 0 ? `📸 Galería:\n${propiedadUrl}` : "",
    p.tour360_url ? `🌐 Tour 360°:\n${propiedadUrl}` : "",
    p.video_url   ? `🎥 Video:\n${propiedadUrl}` : "",
  ].filter(Boolean).join("\n");

  const specsLine = [
    p.dormitorios ? `🛏 ${p.dormitorios}` : "",
    p.banos       ? `🚿 ${p.banos}` : "",
    p.area_m2     ? `📐 ${p.area_m2}m²` : "",
    p.piso        ? `🏢 Piso ${p.piso}` : "",
  ].filter(Boolean).join(" · ");

  const extras = [
    p.cochera           ? "🚗 Cochera" : "",
    p.amoblado          ? "🛋 Amoblado" : "",
    p.mascotas === "Sí" ? "🐶 Mascotas OK" : "",
  ].filter(Boolean).join(" · ");

  const titleLine = p.limita_con
    ? `🏠 *${p.tipo} en ${p.distrito} límite con ${p.limita_con}*`
    : `🏠 *${p.tipo} en ${p.distrito}*`;

  const hookPhrase = autoHighlights.length > 0
    ? `✨ ${autoHighlights[0]}`
    : "✨ Excelente oportunidad";

  const mensajeCorto = [
    titleLine,
    `💰 *${precioFormatted}*`,
    "",
    specsLine,
    extras,
    "",
    hookPhrase,
    "",
    "¿Te gustaría ver fotos? 📸",
  ].filter(Boolean).join("\n").trim();

  const caracteristicasCompletas = [
    specsLine,
    extras,
    p.antiguedad ? `🏗 ${p.antiguedad}` : "",
    "",
    autoHighlights.length > 0 ? "✨ *Destacados:*" : "",
    ...autoHighlights.map((f) => `• ${f}`),
  ].filter(Boolean).join("\n");

  const ubicacion = [
    `📍 ${p.distrito}${p.direccion ? ", " + p.direccion : ""}`,
    locationHighlight,
    `🗺 Maps: ${mapsLink}`,
  ].filter(Boolean).join("\n");

  const mensajeLargo = [
    titleLine,
    "",
    `💰 *${p.operacion}:* ${precioFormatted}`,
    p.mantenimiento ? `🧾 Mantenimiento: S/ ${p.mantenimiento}/mes` : "",
    "",
    caracteristicasCompletas,
    "",
    "━━━━━━━━━━━",
    multimedia,
    "━━━━━━━━━━━",
    "",
    ubicacion,
    "",
    "¿Cuándo puedes pasar a verla? 📅",
  ].filter(Boolean).join("\n").trim();

  return {
    precio: `💰 ${precioFormatted}`,
    precioRaw: p.precio,
    precioFormatted,
    specsLine,
    caracteristicasCompletas,
    multimedia,
    ubicacion,
    mensajeCorto,
    mensajeLargo,
    fotos,
    mapsLink,
    propiedadUrl,
  };
}
