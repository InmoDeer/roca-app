import type { Property } from "@/core/entities/property";
import { fuseManuales, getAmplitudLabel } from "@/lib/highlights";

/**
 * Format property data into WhatsApp-optimized messages with emojis and links
 * @param p - Property object from Supabase
 */
export function buildOutputs(p: Property) {
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

  // ---------- HELPERS ----------

  // Título del inmueble con límite de distrito si aplica
  const titleLine = p.limita_con
    ? `🏠 *${p.tipo} en ${p.distrito}, límite con ${p.limita_con}*`
    : `🏠 *${p.tipo} en ${p.distrito}*`;

  // Precio con operación
  const precioLine = `💰 *${p.operacion === "Alquiler" ? "Alquiler" : "Venta"}:* ${precioFormatted}`;

  // Specs en una línea
  const specsLine = [
    p.dormitorios ? `🛏 ${p.dormitorios} dorm.` : "",
    p.banos       ? `🚿 ${p.banos} baños` : "",
    p.area_m2     ? `📐 ${p.area_m2}m²` : "",
    p.piso        ? `🏢 Piso ${p.piso}` : "",
  ].filter(Boolean).join("  ·  ");

  // Badges rápidos: lo que decide en 2 segundos
  const specsLine2 = [
    p.cochera                     ? "🚗 Cochera" : "",
    p.amoblado                    ? "🛋 Amoblado" : "",
    p.mascotas === "Sí"           ? "🐾 Mascotas OK" : "",
    p.antiguedad === "A estrenar" ? "✨ A estrenar" : "",
  ].filter(Boolean).join("  ·  ");

  // ---------- ZONA: frases de contexto ----------
  function getZonaPhrase(zona: string): string {
    const map: Record<string, string> = {
      "Residencial tranquila":        "Zona residencial tranquila, ideal para vivir con familia.",
      "Residencial con comercio":     "Zona residencial con acceso a comercios y servicios.",
      "Zona financiera / empresarial":"En pleno corazón financiero y empresarial.",
      "Corredor comercial":           "Sobre corredor comercial, alta visibilidad y flujo.",
      "Zona universitaria":           "Zona universitaria, bien conectada y con todo cerca.",
      "Cerca a clínicas / salud":     "A pasos de clínicas y centros de salud de referencia.",
      "Zona gastronómica / turística":"Rodeado de restaurantes, cafés y vida de ciudad.",
      "Industrial / almacenes":       "Zona industrial consolidada, acceso a vías principales.",
    };
    return map[zona] || "";
  }

  // ---------- PERFIL IDEAL: cierre del mensaje ----------
  function getPerfilPhrase(perfil: string): string {
    const map: Record<string, string> = {
      "Familias con hijos":        "Ideal para familias que buscan comodidad y seguridad.",
      "Ejecutivos / profesionales":"Perfecto para profesionales que valoran ubicación y confort.",
      "Estudiantes / roommates":   "Excelente opción para estudiantes o para compartir.",
      "Adultos mayores":           "Pensado para quienes buscan tranquilidad y accesibilidad.",
      "Inversión / renta":         "Excelente oportunidad de inversión con alta demanda de alquiler.",
    };
    return map[perfil] || "";
  }

  // ---------- HIGHLIGHTS ----------
  function generateAutoHighlights(prop: Property): string[] {
    const highlights: string[] = [];
    const covered = new Set<string>();

    // ── 1. MANUALES FUSIONADOS (siempre primero) ──────────────────────────────
    const manuales: string[] = Array.isArray(prop.destacados_manuales)
      ? prop.destacados_manuales : [];
    const { phrases: manualPhrases, consumed } = fuseManuales(manuales, prop);
    highlights.push(...manualPhrases);
    consumed.forEach((k) => covered.add(k));

    // ── 2. AMPLITUD (solo en pisos bajos — en pisos altos la vista es el diferencial) ──
    const area = prop.area_m2 || 0;
    const ambientes = prop.ambientes || 0;
    const piso = prop.piso || 0;

    if (!covered.has("amplitud") && piso < 10) {
      const label = getAmplitudLabel(area);
      if (label === "Muy amplio") highlights.push("🏰 Muy amplio y espacioso");
      else if (label === "Amplio") highlights.push("📐 Ambientes amplios y bien distribuidos");
      else if (label === "Bien distribuido") highlights.push("✨ Bien distribuido, aprovecha cada metro");
      if (ambientes >= 4)  highlights.push("🛋️ Múltiples ambientes");
    }

    // ── 3. PISO / VISTA / ILUMINACIÓN (fusionados) ───────────────────────────
    const vistaLibre       = !!prop.vista && !covered.has("vista");
    const iluminacionLibre = !covered.has("iluminacion") && !covered.has("ventanas_amplias");

    if (piso >= 15) {
      highlights.push(
        vistaLibre
          ? "🌇 Vista panorámica desde el piso 360° · Iluminación todo el día"
          : "🌇 Vista panorámica de la ciudad"
      );
      if (vistaLibre) covered.add("vista");
      if (iluminacionLibre && !vistaLibre) highlights.push("☀️ Iluminación natural todo el día");
      covered.add("iluminacion");
    } else if (piso >= 10) {
      highlights.push(
        vistaLibre
          ? "🏙️ Vista despejada · Muy iluminado"
          : "🏙️ Vista despejada y muy iluminado"
      );
      if (vistaLibre) covered.add("vista");
      covered.add("iluminacion");
    } else if (piso >= 6) {
      highlights.push("🌳 Buena iluminación y ventilación natural");
      covered.add("iluminacion");
    } else if (piso >= 2 && !covered.has("vista")) {
      highlights.push("🍃 Ambiente tranquilo y bien ubicado");
    }

    // Ventanas amplias: solo en pisos bajos
    if (!covered.has("ventanas_amplias") && prop.ventanas_amplias && piso < 6) {
      highlights.push("🪟 Ventanas amplias — excelente luz natural");
      covered.add("ventanas_amplias");
      covered.add("iluminacion");
    }

    if (piso < 6 && area >= 70 && !covered.has("iluminacion") && !prop.ventanas_amplias) {
      highlights.push("💡 Ambientes luminosos");
    }

    // ── 4. BALCÓN ─────────────────────────────────────────────────────────────
    if (prop.balcon && !covered.has("balcon")) {
      highlights.push("🌿 Balcón privado");
      covered.add("balcon");
    }

    // ── 5. VISTA ESPECÍFICA (piso < 10) ──────────────────────────────────────
    if (vistaLibre && !covered.has("vista") && piso < 10) {
      const vistaMap: Record<string, string> = {
        "Parque":          "🌳 Vista directa al parque",
        "Panorámica":      "🏙️ Vista panorámica despejada",
        "Mar":             "🌊 Vista al mar",
        "Jardín interior": "🌸 Vista tranquila a jardín interior",
        "Avenida":         "🏢 Vista a avenida principal",
        "Calle":           "🏘️ Vista a calle residencial",
      };
      highlights.push(vistaMap[prop.vista!] || `👀 Vista a ${prop.vista!.toLowerCase()}`);
      covered.add("vista");
    }

    // ── 6. ANTIGÜEDAD (solo 1-5 años y 5-10 — "A estrenar" va en specsLine2) ──
    if (!covered.has("antiguedad")) {
      if (prop.antiguedad === "1-5 años")  highlights.push("🆕 Como nuevo, impecable conservación");
      else if (prop.antiguedad === "5-10 años") highlights.push("🏗 Buen estado general");
    }

    // ── 7. EQUIPAMIENTO ───────────────────────────────────────────────────────
    if (prop.amoblado && !covered.has("amoblado")) {
      const extras: string[] = [];
      if (prop.cocina_equipada && !covered.has("cocina_equipada")) extras.push("cocina equipada");
      if (prop.closet && !covered.has("closet"))                   extras.push("closets empotrados");
      if (extras.length === 0)      highlights.push("🛋️ Amoblado");
      else if (extras.length === 2) highlights.push("🛋️ Amoblado y equipado — listo para entrar");
      else                          highlights.push(`🛋️ Amoblado con ${extras[0]}`);
      covered.add("amoblado"); covered.add("cocina_equipada"); covered.add("closet");
    } else {
      if (prop.cocina_equipada && !covered.has("cocina_equipada"))
        highlights.push("🍳 Cocina completamente equipada");
      if (prop.closet && !covered.has("closet"))
        highlights.push("🚪 Closets empotrados en dormitorios");
    }

    // ── 8. EXTRAS ─────────────────────────────────────────────────────────────
    if (prop.recepcion     && !covered.has("recepcion"))            highlights.push("🛎️ Recepción y seguridad 24h");
    if (prop.cochera       && !covered.has("cochera"))              highlights.push("🚗 Estacionamiento privado incluido");
    if (prop.ascensor      && !covered.has("ascensor") && piso > 1) highlights.push("🛗 Edificio con ascensor");
    if (prop.area_servicio && !covered.has("area_servicio"))        highlights.push("🧺 Cuarto y baño de servicio");
    if (prop.gas_natural   && !covered.has("gas_natural"))          highlights.push("🔥 Gas natural");
    if (prop.lavanderia    && !covered.has("lavanderia"))           highlights.push("🫧 Zona de lavandería");
    if (prop.tendal        && !covered.has("tendal"))               highlights.push("🌬️ Tendal");
    if (prop.mascotas === "Sí" && !covered.has("mascotas"))         highlights.push("🐾 Acepta mascotas");

    // Límite de 6 — suficiente para WhatsApp
    const result = [...new Set(highlights)].slice(0, 6);

    // ── 9. ÁREAS COMUNES (siempre al final, fuera del límite de 6) ────────────
    const areasMap: Record<string, string> = {
      piscina: "piscina", terraza: "terraza", jardin: "jardín",
      sum: "SUM", parrilla: "parrilla / BBQ",
      juegos_ninos: "juegos infantiles", gimnasio: "gimnasio",
    };
    const areasList = Object.keys(areasMap).filter((k) => (prop as any)[k] && !covered.has(k));
    if (areasList.length > 0) {
      result.push(`🏊 Áreas comunes: ${areasList.map((k) => areasMap[k]).join(", ")}`);
    }

    return result;
  }

  // ---------- UBICACIÓN ----------
  function buildUbicacion(prop: Property): string {
    const lines: string[] = [];

    // Línea 1: distrito + dirección
    lines.push(`📍 ${prop.distrito}${prop.direccion ? " · " + prop.direccion : ""}`);

    // Línea 2: contexto de zona (campo nuevo)
    if (prop.zona) {
      const zonaPhrase = getZonaPhrase(prop.zona);
      if (zonaPhrase) lines.push(zonaPhrase);
    } else if (prop.direccion) {
      const dir = prop.direccion.toLowerCase();
      if (dir.includes("av."))
        lines.push("Sobre avenida principal — buena conectividad.");
      else if (dir.includes("jr.") || dir.includes("calle"))
        lines.push("Calle tranquila en zona residencial.");
      else if (dir.includes("parque") || dir.includes("plaza"))
        lines.push("Frente a área verde.");
    }

    // Línea 3: referencias cercanas
    if (prop.cerca_a) lines.push(`🚶 A pasos de ${prop.cerca_a}`);

    // Línea 4: límite con otro distrito
    if (prop.limita_con) lines.push(`↔️ Límite con ${prop.limita_con}`);

    // Línea 5: Maps
    lines.push(`🗺 ${mapsLink}`);

    return lines.join("\n");
  }

  // ---------- MULTIMEDIA con frase de contexto ----------
  function buildMultimedia(prop: Property): string {
    const hasVideo = !!prop.video_url;
    const hasTour  = !!prop.tour360_url;
    const hasFotos = fotos.length > 0;

    if (!hasFotos && !hasVideo && !hasTour) return "";

    // Frase introductoria según qué hay disponible
    const tipos: string[] = [];
    if (hasFotos) tipos.push("fotos");
    if (hasTour)  tipos.push("tour virtual 360°");
    if (hasVideo) tipos.push("video");

    const intro = `📲 *Ver ${tipos.join(", ")}:*`;

    return [
      intro,
      propiedadUrl,
    ].join("\n");
  }

  // ---------- CONSTRUIR SALIDAS ----------
  const autoHighlights = generateAutoHighlights(p);
  const ubicacion      = buildUbicacion(p);
  const multimedia     = buildMultimedia(p);

  const zonaPhrase   = p.zona ? getZonaPhrase(p.zona) : "";
  const perfilPhrase = p.perfil_ideal ? getPerfilPhrase(p.perfil_ideal) : "";

  // Hook: primer highlight sin su emoji propio (evita doble emoji con ✨)
  const firstHighlight = autoHighlights[0] || "";
  const hookPhrase = firstHighlight
    ? `✨ ${firstHighlight.replace(/^[\p{Emoji}\s]+/u, "").trim()}`
    : "✨ Excelente oportunidad";

  // ── MENSAJE CORTO ──────────────────────────────────────────────────────────
  // Objetivo: despertar interés en 5 segundos. Título + precio + specs + 1 gancho
  const mensajeCorto = [
    titleLine,
    precioLine,
    "",
    specsLine,
    specsLine2,
    "",
    hookPhrase,
    perfilPhrase ? perfilPhrase : "",
    "",
    "¿Te envío fotos y más detalles? 📲",
  ].filter(Boolean).join("\n").trim();

  // ── MENSAJE LARGO ──────────────────────────────────────────────────────────
  // Objetivo: información completa para quien ya está interesado
  const caracteristicasCompletas = [
    specsLine,
    specsLine2,
    "",
    autoHighlights.length > 0 ? "✨ *Lo que más destaca:*" : "",
    ...autoHighlights.map((f) => `• ${f}`),
  ].filter(Boolean).join("\n");

  const mensajeLargo = [
    titleLine,
    "",
    precioLine,
    p.mantenimiento ? `🧾 + S/ ${p.mantenimiento}/mes mantenimiento` : "",
    "",
    caracteristicasCompletas,
    "",
    zonaPhrase ? `🏙️ *Zona:* ${zonaPhrase}` : "",
    perfilPhrase ? `👤 ${perfilPhrase}` : "",
    "",
    "━━━━━━━━━━━",
    multimedia,
    "━━━━━━━━━━━",
    "",
    ubicacion,
    "",
    "¿Cuándo te viene bien coordinar una visita? 📅",
  ].filter(Boolean).join("\n").trim();

  // ── TEXTO STANDALONE DE UBICACIÓN ─────────────────────────────────────────
  // Para cuando el agente quiere compartir solo la ubicación
  const ubicacionStandalone = [
    titleLine,
    "",
    ubicacion,
  ].join("\n");

  // ── TEXTO STANDALONE DE MULTIMEDIA ────────────────────────────────────────
  // Para cuando el agente quiere compartir solo el pack multimedia
  const multimediaStandalone = multimedia
    ? [
        titleLine,
        precioLine,
        "",
        multimedia,
      ].join("\n")
    : "";

  return {
    precio: `💰 ${precioFormatted}`,
    precioRaw: p.precio,
    precioFormatted,
    specsLine,
    specsLine2,
    caracteristicasCompletas,
    multimedia,
    multimediaStandalone,
    ubicacion,
    ubicacionStandalone,
    mensajeCorto,
    mensajeLargo,
    fotos,
    mapsLink,
    propiedadUrl,
  };
}
