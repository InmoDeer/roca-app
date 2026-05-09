export function buildOutputs(p: any) {
  const sym = p.moneda === "USD" ? "$" : "S/ ";
  const precioRaw = Number(p.precio)?.toLocaleString();
  const precioFormatted = `${sym}${precioRaw}`;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const propiedadUrl = `${baseUrl}/?id=${p.id}`;
  const mapsLink = p.maps_url || `https://maps.google.com/?q=${encodeURIComponent((p.direccion || "") + " " + (p.distrito || "") + " Lima Peru")}`;

  const fotos = Array.isArray(p.fotos_urls) ? p.fotos_urls : [];

  const specsLine = [
    p.dormitorios ? `🛏 ${p.dormitorios}` : "",
    p.banos ? `🚿 ${p.banos}` : "",
    p.area_m2 ? `📐 ${p.area_m2}m²` : "",
    p.piso ? `🏢 Piso ${p.piso}` : "",
  ].filter(Boolean).join(" · ");

  const extras = [
    p.cochera ? "🚗 Cochera" : "",
    p.ascensor ? "🛗 Ascensor" : "",
    p.amoblado ? "🛋 Amoblado" : "",
    p.mascotas === "Sí" ? "🐶 Mascotas OK" : "",
  ].filter(Boolean).join(" · ");

  const mensajeCorto = [
    `🏠 *${p.tipo} en ${p.distrito}*`,
    `💰 *${precioFormatted}}`,
    "",
    specsLine,
    extras,
    "",
    "✨ Excelente oportunidad",
    "",
    "¿Te gustaría ver fotos? 📸",
  ].filter(Boolean).join("\n").trim();

  const mensajeLargo = [
    `🏠 *${p.tipo} en ${p.distrito}*`,
    "",
    `💰 *${p.operacion}:* ${precioFormatted}`,
    p.mantenimiento ? `🧾 Mantenimiento: S/ ${p.mantenimiento}/mes` : "",
    "",
    specsLine,
    extras,
    p.antiguedad ? `🏗 ${p.antiguedad}` : "",
    "",
    "━━━━━━━━━━━",
    fotos.length > 0 ? `📸 Galería:\n${propiedadUrl}` : "",
    p.tour360_url ? `🌐 Tour 360°:\n${p.tour360_url}` : "",
    p.video_url ? `🎥 Video:\n${p.video_url}` : "",
    "━━━━━━━━━━━",
    "",
    `📍 ${p.distrito}${p.direccion ? ", " + p.direccion : ""}`,
    `🗺 Maps: ${mapsLink}`,
    "",
    "¿Cuándo podés pasar a verla? 📅",
  ].filter(Boolean).join("\n").trim();

  return {
    precio: `💰 ${precioFormatted}`,
    precioRaw: p.precio,
    precioFormatted,
    specsLine,
    mensajeCorto,
    mensajeLargo,
    fotos,
    mapsLink,
    propiedadUrl,
    tituloDinamico: `🏠 ${p.tipo} en ${p.distrito}`,
    ubicacion: `📍 ${p.distrito}${p.direccion ? ", " + p.direccion : ""}\n🗺 Maps: ${mapsLink}`,
    multimedia: [
      fotos.length > 0 ? `📸 Galería:\n${propiedadUrl}` : "",
      p.tour360_url ? `🌐 Tour 360°:\n${p.tour360_url}` : "",
      p.video_url ? `🎥 Video:\n${p.video_url}` : "",
    ].filter(Boolean).join("\n"),
  };
}