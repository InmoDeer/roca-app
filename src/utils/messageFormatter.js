/**
 * Format property data into WhatsApp-optimized messages with emojis and links
 * Genera automáticamente frases cualitativas basadas en los datos del inmueble.
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

  // ---------- GENERACIÓN AUTOMÁTICA DE FRASES CUALITATIVAS ----------

  function generateAutoHighlights(prop) {
    const highlights = [];

    // ----- AMPLITUD -----
    const area = prop.area_m2 || 0;
    const ambientes = prop.ambientes || 0;
    if (area >= 120) highlights.push("🏰 Muy amplio y espacioso");
    else if (area >= 90) highlights.push("📐 Ambientes amplios");
    else if (area >= 60) highlights.push("✨ Bien distribuido");
    if (ambientes >= 4) highlights.push("🛋️ Múltiples ambientes");

    // ----- ILUMINACIÓN Y VISTA (según piso) -----
    const piso = prop.piso || 0;
    if (piso >= 15) {
      highlights.push("🌇 Vista panorámica de la ciudad");
      highlights.push("☀️ Iluminación natural todo el día");
    } else if (piso >= 10) {
      highlights.push("🏙️ Vista despejada");
      highlights.push("☀️ Muy iluminado");
    } else if (piso >= 6) {
      highlights.push("🌳 Buena iluminación y ventilación");
    } else if (piso >= 2) {
      highlights.push("🍃 Vista a zona tranquila");
    }
    if (piso < 6 && area >= 70) {
      highlights.push("💡 Ambientes luminosos");
    }

    // ----- VENTANAS AMPLIAS (nuevo campo) -----
    if (prop.ventanas_amplias) {
      highlights.push("🪟 Ventanas amplias, excelente iluminación natural");
    }

    // ----- BALCÓN (nuevo campo) -----
    if (prop.balcon) {
      highlights.push("🌿 Balcón privado");
    }

    // ----- VISTA ESPECÍFICA (nuevo campo) -----
    if (prop.vista) {
      const vistaMap = {
        "Parque": "🌳 Vista directa al parque",
        "Panorámica": "🏙️ Vista panorámica despejada",
        "Mar": "🌊 Vista al mar",
        "Jardín interior": "🌸 Tranquilidad con vista a jardín interior",
        "Avenida": "🏢 Vista a avenida principal",
        "Calle": "🏘️ Vista a calle residencial"
      };
      highlights.push(vistaMap[prop.vista] || `👀 Vista a ${prop.vista.toLowerCase()}`);
    }

    // ----- CERCA DE (nuevo campo) -----
    if (prop.cerca_a) {
      highlights.push(`🚶 A pasos de ${prop.cerca_a}`);
    }

    // ----- COCINA EQUIPADA (nuevo campo) -----
    if (prop.cocina_equipada) {
      highlights.push("🍳 Cocina completamente equipada");
    }

    // ----- CLOSETS (nuevo campo) -----
    if (prop.closet) {
      highlights.push("🚪 Closets empotrados en dormitorios");
    }

    // ----- RECEPCIÓN (nuevo campo) -----
    if (prop.recepcion) {
      highlights.push("🛎️ Recepción / Seguridad 24h");
    }

    // ----- ANTIGÜEDAD / ESTADO -----
    const antiguedad = prop.antiguedad || "";
    if (antiguedad === "A estrenar") {
      highlights.push("✨ A estrenar, acabados de lujo");
    } else if (antiguedad === "1-5 años") {
      highlights.push("🆕 Como nuevo, muy bien conservado");
    } else if (antiguedad === "5-10 años") {
      highlights.push("🏗 Buen estado general");
    }

    // ----- AMENITIES DESTACABLES (existentes) -----
    if (prop.amoblado) {
      highlights.push("🛋️ Totalmente amoblado y equipado");
    }
    if (prop.cochera) {
      highlights.push("🚗 Estacionamiento privado incluido");
    }
    if (prop.ascensor && piso > 1) {
      highlights.push("🛗 Edificio con ascensor");
    }
    if (prop.area_servicio) {
      highlights.push("🧺 Cuarto y baño de servicio");
    }
    if (prop.mascotas === "Sí") {
      highlights.push("🐾 Pet friendly");
    }

    // ----- ÁREAS COMUNES (nuevos campos) -----
    const areas = [];
    if (prop.piscina) areas.push("piscina");
    if (prop.terraza) areas.push("terraza");
    if (prop.jardin) areas.push("jardín");
    if (prop.sum) areas.push("SUM");
    if (prop.parrilla) areas.push("parrilla / BBQ");
    if (prop.juegos_ninos) areas.push("juegos infantiles");
    if (prop.gimnasio) areas.push("gimnasio");
    
    if (areas.length > 0) {
      highlights.push(`🏊 Áreas comunes: ${areas.join(", ")}`);
    }

    // ----- DORMITORIOS / BAÑOS -----
    if (prop.dormitorios >= 3 && prop.banos >= 2) {
      highlights.push("🚿 Baños completos para cada dormitorio");
    } else if (prop.dormitorios >= 2) {
      highlights.push("🛏 Ideal para familias o roommates");
    }

    // Evitar duplicados y limitar
    const unique = [...new Set(highlights)];
    return unique.slice(0, 8);
  }

  function getLocationHighlight(prop) {
    if (prop.direccion) {
      const dir = prop.direccion.toLowerCase();
      if (dir.includes("av.")) {
        return "📍 Sobre avenida principal, excelente conectividad";
      } else if (dir.includes("jr.") || dir.includes("calle")) {
        return "📍 Zona residencial tranquila y segura";
      } else if (dir.includes("parque") || dir.includes("plaza")) {
        return "🌳 Frente a área verde";
      }
    }
    const distritosTop = ["Miraflores", "San Isidro", "Barranco", "Surco", "La Molina"];
    if (distritosTop.includes(prop.distrito)) {
      return `📍 Ubicación privilegiada en ${prop.distrito}`;
    }
    return `📍 Céntrico en ${prop.distrito}, cerca a todo`;
  }

  const autoHighlights = generateAutoHighlights(p);
  const locationHighlight = getLocationHighlight(p);

  // Multimedia
  const multimedia = [
    fotos.length > 0 ? `📸 Galería (${fotos.length} fotos):\n${propiedadUrl}` : "",
    p.tour360_url ? `🌐 Tour 360°:\n${p.tour360_url}` : "",
    p.video_url ? `🎥 Video:\n${p.video_url}` : "",
  ].filter(Boolean).join("\n");

  // Características básicas
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

  // Mensaje Corto
  const hookPhrase = autoHighlights.length > 0 ? `✨ ${autoHighlights[0]}` : "✨ Excelente oportunidad";
  const mensajeCorto = [
    `🏠 *${p.tipo} en ${p.distrito}*`,
    `💰 *${precioFormatted}*`,
    "",
    specsLine,
    extras,
    "",
    hookPhrase,
    "",
    "¿Te gustaría ver fotos? 📸",
  ].filter(Boolean).join("\n").trim();

  // Características completas
  const caracteristicasCompletas = [
    specsLine,
    extras,
    p.antiguedad ? `🏗 ${p.antiguedad}` : "",
    "",
    autoHighlights.length > 0 ? "✨ *Destacados:*" : "",
    ...autoHighlights.map((f) => `• ${f}`),
  ].filter(Boolean).join("\n");

  // Ubicación mejorada
  const ubicacion = [
    `📍 ${p.distrito}${p.direccion ? ", " + p.direccion : ""}`,
    locationHighlight,
    `🗺 Maps: ${mapsLink}`,
  ].filter(Boolean).join("\n");

  // Mensaje Largo
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