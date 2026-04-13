/**
 * Format property data into WhatsApp-optimized messages with emojis and links
 * @param {Object} property - Property object from Supabase
 * @returns {Object} Formatted outputs (price, features, messages, links, etc)
 */
export function buildOutputs(p) {
  const sym = p.moneda === "USD" ? "$" : "S/ ";
  const precio = `💰 ${p.operacion}: ${sym}${Number(p.precio)?.toLocaleString()}`;
  const mant = p.mantenimiento
    ? `\n🧾 Mantenimiento: S/ ${p.mantenimiento} mensuales`
    : "";

  // Characteristics
  const caracteristicas = [
    p.dormitorios
      ? `🛏 ${p.dormitorios} ${p.dormitorios == 1 ? "dormitorio" : "dormitorios"}`
      : "",
    p.ambientes
      ? `🏢 ${p.ambientes} ${p.ambientes == 1 ? "ambiente" : "ambientes"}`
      : "",
    p.banos ? `🚿 ${p.banos} ${p.banos == 1 ? "baño" : "baños"}` : "",
    p.area_m2 ? `📐 ${p.area_m2} m²` : "",
    p.piso ? `🏬 Piso ${p.piso}` : "",
    p.antiguedad ? `🏗 ${p.antiguedad}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Extras
  const extras = [
    p.cochera ? "🚗 Cochera" : "",
    p.ascensor ? "🛗 Ascensor" : "",
    p.amoblado ? "🛋 Amoblado" : "",
    p.area_servicio ? "🧹 Área de servicio" : "",
    p.mascotas === "Sí" ? "🐶 Mascotas permitidas" : "",
    p.mascotas === "A tratar" ? "🐶 Mascotas: consultar" : "",
  ].filter(Boolean);

  const caracteristicasCompletas =
    caracteristicas + (extras.length > 0 ? "\n\n" + extras.join("\n") : "");

  // Photos
  const fotos = Array.isArray(p.fotos_urls) ? p.fotos_urls : [];

  // Media
  const media = [
    p.video_url ? `🎥 Video: ${p.video_url}` : "",
    p.tour360_url ? `🌐 Recorrido 360: ${p.tour360_url}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Location & Maps Links
  const mapsLink =
    p.maps_url ||
    `https://maps.google.com/?q=${encodeURIComponent(
      (p.direccion || "") + " " + (p.distrito || "") + " Lima Peru"
    )}`;
  const wazeLink = `https://waze.com/ul?q=${encodeURIComponent(
    (p.direccion || "") + " " + (p.distrito || "") + " Lima Peru"
  )}`;
  const ubicacion = `📍 ${p.distrito}${
    p.direccion ? ", " + p.direccion : ""
  }\n👉 Maps: ${mapsLink}`;

  // Short message template
  const mensajeCorto = [
    `🏠 ${p.tipo} en ${p.distrito}`,
    "",
    precio,
    "",
    p.dormitorios
      ? `🛏 ${p.dormitorios} ${p.dormitorios == 1 ? "dormitorio" : "dormitorios"}`
      : "",
    p.ambientes
      ? `🏢 ${p.ambientes} ${p.ambientes == 1 ? "ambiente" : "ambientes"}`
      : "",
    p.banos ? `🚿 ${p.banos} ${p.banos == 1 ? "baño" : "baños"}` : "",
    p.piso ? `🏬 Piso ${p.piso}` : "",
    p.antiguedad ? `🏗 ${p.antiguedad}` : "",
    "",
    "👉 Disponible para visitas",
    "",
    "¿Te interesa? Te paso más info 👍",
  ]
    .filter((l) => l !== null && l !== "")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Long message template
  const mensajeLargo = [
    `🏠 ${p.tipo} en ${p.distrito}`,
    "",
    precio + mant,
    "",
    caracteristicasCompletas,
    p.frase_destacada ? `\n✨ ${p.frase_destacada}` : "",
    "",
    media,
    fotos.length > 0 ? `📸 ${fotos.length} fotos` : "",
    "",
    ubicacion,
    "",
    "👉 Disponible para visitas",
    "",
    "¿En qué fecha te gustaría visitar?",
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Property URL for sharing (used in multimedia)
  const baseUrl = window.location.origin;
  const propiedadUrl = `${baseUrl}/galeria?id=${p.id}`;

  // Multimedia pack
  const multimedia = [
    fotos.length > 0 ? `📸 Galería completa: ${propiedadUrl}` : "",
    p.tour360_url ? `🌐 Recorrido 360: ${p.tour360_url}` : "",
    p.video_url ? `🎥 Video: ${p.video_url}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    precio,
    mant,
    caracteristicasCompletas,
    media,
    ubicacion,
    mensajeCorto,
    mensajeLargo,
    multimedia,
    fotos,
    mapsLink,
    wazeLink,
    propiedadUrl,
  };
}
