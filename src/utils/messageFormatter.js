/**
 * Format property data into WhatsApp-optimized messages with emojis and links
 * @param {Object} p - Property object from Supabase
 * @returns {Object} Formatted outputs (price, features, messages, links, etc)
 */
export function buildOutputs(p) {
  const sym = p.moneda === "USD" ? "$" : "S/ ";
  const precioRaw = Number(p.precio)?.toLocaleString();
  const precioFormatted = `${sym}${precioRaw}`;

  // URLs
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const propiedadUrl = `${baseUrl}/?id=${p.id}`;
  const mapsLink =
    p.maps_url ||
    `https://maps.google.com/?q=${encodeURIComponent(
      (p.direccion || "") + " " + (p.distrito || "") + " Lima Peru"
    )}`;

  const fotos = Array.isArray(p.fotos_urls) ? p.fotos_urls : [];

  // ---------- FUNCIONES DE INFERENCIA CUALITATIVA ----------
  /**
   * Genera frases atractivas basadas en los datos numéricos y booleanos
   */
  function getQualitativeFeatures(prop) {
    const features = [];

    // Amplitud
    if (prop.area_m2 >= 100) features.push("🏢 Muy amplio");
    else if (prop.area_m2 >= 70) features.push("📐 Ambientes amplios");

    // Iluminación y vista (por piso)
    if (prop.piso >= 10) {
      features.push("☀️ Excelente iluminación natural");
      features.push("🌆 Vista panorámica");
    } else if (prop.piso >= 7) {
      features.push("☀️ Muy iluminado");
      features.push("🏙️ Vista despejada");
    } else if (prop.piso >= 4) {
      features.push("💡 Buena iluminación");
    }

    // Antigüedad
    if (prop.antiguedad === "Estreno") features.push("✨ A estrenar");
    else if (prop.antiguedad === "1-5 años") features.push("🆕 Como nuevo");

    // Amenities destacables
    if (prop.amoblado) features.push("🛋️ Totalmente amoblado");
    if (prop.mascotas === "Sí") features.push("🐾 Pet friendly");
    if (prop.cochera) features.push("🚗 Estacionamiento incluido");
    if (prop.area_servicio) features.push("🧺 Área de servicio");

    return features;
  }

  /**
   * Genera un destacado de ubicación
   */
  function getLocationHighlight(prop) {
    if (prop.direccion) {
      const dirLower = prop.direccion.toLowerCase();
      if (dirLower.includes("av.")) return "📍 Sobre avenida principal";
      if (dirLower.includes("jr.") || dirLower.includes("calle"))
        return "📍 Calle tranquila y residencial";
    }
    return `📍 Céntrico en ${prop.distrito}`;
  }

  // ---------- FIN INFERENCIA ----------

  const qualitativeFeatures = getQualitativeFeatures(p);
  const locationHighlight = getLocationHighlight(p);
  const customHighlight = p.frase_destacada
    ? p.frase_destacada.replace(/^_"|"_$/g, "").trim()
    : null;

  // Multimedia 
  const multimedia = [
    fotos.length > 0
      ? `📸 Galería:\n${propiedadUrl}`
      : "",
    p.tour360_url ? `🌐 Tour 360°:\n${p.tour360_url}` : "",
    p.video_url ? `🎥 Video:\n${p.video_url}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Características básicas en una línea
  const specsLine = [
    p.dormitorios ? `🛏 ${p.dormitorios}` : "",
    p.banos ? `🚿 ${p.banos}` : "",
    p.area_m2 ? `📐 ${p.area_m2}m²` : "",
    p.piso ? `🏢 Piso ${p.piso}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const extras = [
    p.cochera ? "🚗 Cochera" : "",
    p.ascensor ? "🛗 Ascensor" : "",
    p.amoblado ? "🛋 Amoblado" : "",
    p.mascotas === "Sí" ? "🐶 Mascotas OK" : "",
  ]
    .filter(Boolean)
    .join(" · ");

  // ---------- MENSAJE CORTO (Gancho) ----------
  const mensajeCorto = [
    `🏠 *${p.tipo} en ${p.distrito}*`,
    `💰 *${precioFormatted}*`,
    "",
    specsLine,
    extras,
    "",
    qualitativeFeatures.length > 0
      ? `✨ ${qualitativeFeatures[0]}`
      : "",
    customHighlight ? `💬 ${customHighlight}` : "",
    "",
    "¿Te gustaría ver fotos? 📸",
  ]
    .filter(Boolean)
    .join("\n")
    .trim();

  // ---------- CARACTERÍSTICAS COMPLETAS (con destacados) ----------
  const caracteristicasCompletas = [
    specsLine,
    extras,
    p.antiguedad ? `🏗 ${p.antiguedad}` : "",
    "",
    qualitativeFeatures.length > 0 ? "✨ *Destacados:*" : "",
    ...qualitativeFeatures.map((f) => `• ${f}`),
    customHighlight ? `💬 ${customHighlight}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // ---------- UBICACIÓN MEJORADA ----------
  const ubicacion = [
    `📍 ${p.distrito}${p.direccion ? ", " + p.direccion : ""}`,
    locationHighlight,
    `🗺 Maps: ${mapsLink}`,
  ]
    .filter(Boolean)
    .join("\n");

  // ---------- MENSAJE LARGO ----------
  const mensajeLargo = [
    `🏠 *${p.tipo} en ${p.distrito}*`,
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
    "¿Cuándo podés pasar a verla? 📅",
  ]
    .filter(Boolean)
    .join("\n")
    .trim();

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