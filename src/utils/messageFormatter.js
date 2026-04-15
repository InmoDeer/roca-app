/**
 * Format property data into WhatsApp-optimized messages with emojis and links
 * @param {Object} property - Property object from Supabase
 * @returns {Object} Formatted outputs (price, features, messages, links, etc)
 */
export function buildOutputs(p) {
  const sym = p.moneda === "USD" ? "$" : "S/ ";
  const precioRaw = Number(p.precio)?.toLocaleString();
  const precioFormatted = `${sym}${precioRaw}`;
  
  // URLs
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const propiedadUrl = `${baseUrl}/?id=${p.id}`;
  const mapsLink = p.maps_url || `https://maps.google.com/?q=${encodeURIComponent(
    (p.direccion || "") + " " + (p.distrito || "") + " Lima Peru"
  )}`;

  const fotos = Array.isArray(p.fotos_urls) ? p.fotos_urls : [];

  // Multimedia (solo galería, video, tour360)
  const multimedia = [
    fotos.length > 0 ? `📸 Galería:\n${propiedadUrl}` : "",
    p.tour360_url ? `🌐 Tour 360°:\n${p.tour360_url}` : "",
    p.video_url ? `🎥 Video:\n${p.video_url}` : ""
  ].filter(Boolean).join("\n");

  // Características en formato línea
  const specsLine = [
    p.dormitorios ? `🛏 ${p.dormitorios}` : "",
    p.banos ? `🚿 ${p.banos}` : "",
    p.area_m2 ? `📐 ${p.area_m2}m²` : "",
    p.piso ? `🏢 Piso ${p.piso}` : ""
  ].filter(Boolean).join(" · ");

  const extras = [
    p.cochera ? "🚗 Cochera" : "",
    p.ascensor ? "🛗 Ascensor" : "",
    p.amoblado ? "🛋 Amoblado" : "",
    p.mascotas === "Sí" ? "🐶 Mascotas OK" : ""
  ].filter(Boolean).join(" · ");

  // 1️⃣ MENSAJE CORTO (Gancho)
  const mensajeCorto = [
    `🏠 *${p.tipo}* en *${p.distrito}*`,
    "",
    `💰 *${precioFormatted}*`,
    "",
    specsLine,
    extras,
    "",
    "¿Te gustaría ver fotos? 📸"
  ].filter(Boolean).join("\n").trim();

  // 2️⃣ CARACTERÍSTICAS COMPLETAS
  const caracteristicasCompletas = [
    specsLine,
    extras,
    p.antiguedad ? `🏗 ${p.antiguedad}` : ""
  ].filter(Boolean).join("\n");

  // 3️⃣ UBICACIÓN (distrito, direccion)
  const ubicacion = [
    `📍 ${p.distrito}${p.direccion ? ", " + p.direccion : ""}`,
    `🗺 Maps: ${mapsLink}`
  ].filter(Boolean).join("\n");

  // 4️⃣ MENSAJE LARGO (reutiliza caracteristicasCompletas + ubicacion)
  const mensajeLargo = [
    `🏠 *${p.tipo} en ${p.distrito}*`,
    "",
    `💰 *${p.operacion}:* ${precioFormatted}`,
    p.mantenimiento ? `🧾 Mantenimiento: S/ ${p.mantenimiento}/mes` : "",
    "",
    caracteristicasCompletas,
    "",
    p.frase_destacada ? `💬 _${p.frase_destacada.replace(/^_"|"_$/g, "")}_` : "",
    "",
    "━━━━━━━━━━━",
    multimedia,
    "━━━━━━━━━━━",
    "",
    ubicacion,
    "",
    "¿Cuándo podés pasar a verla? 📅"
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
    propiedadUrl
  };
}