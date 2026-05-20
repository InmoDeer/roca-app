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

  // ---------- FUSIÓN INTELIGENTE DE MANUALES ----------
  // Antes de procesar, los grupos de claves manuales seleccionadas
  // se colapsan en una sola frase más completa.
  function fuseManuales(manuales: string[], prop: any): { phrases: string[]; consumed: Set<string> } {
    const phrases: string[] = [];
    const consumed = new Set<string>();

    // ── Grupo equipamiento: amoblado + cocina_equipada + closet ──────────────
    const tieneAmoblado  = manuales.includes("amoblado");
    const tieneCocina    = manuales.includes("cocina_equipada");
    const tieneCloset    = manuales.includes("closet");

    if (tieneAmoblado || tieneCocina || tieneCloset) {
      if (tieneAmoblado) {
        phrases.push("🛋️ Totalmente amoblado y equipado");
      } else {
        // Sin amoblado, cocina y closet se fusionan si están juntos
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

    // ── Grupo vista: vista_X + ventanas_amplias + balcon ─────────────────────
    const vistaKey    = manuales.find((k) => k.startsWith("vista_"));
    const tieneVentanas = manuales.includes("ventanas_amplias");
    const tieneBalcon   = manuales.includes("balcon");

    const vistaText = vistaKey
      ? ({
          "vista_Parque":          "vista al parque",
          "vista_Panorámica":      "vista panorámica",
          "vista_Mar":             "vista al mar",
          "vista_Jardín interior": "vista a jardín interior",
          "vista_Avenida":         "vista a avenida",
          "vista_Calle":           "vista a calle tranquila",
        } as Record<string, string>)[vistaKey] || `vista ${vistaKey.replace("vista_", "").toLowerCase()}`
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
        const vistaMapFull: Record<string, string> = {
          "vista_Parque":          "🌳 Vista directa al parque",
          "vista_Panorámica":      "🏙️ Vista panorámica despejada",
          "vista_Mar":             "🌊 Vista al mar",
          "vista_Jardín interior": "🌸 Tranquilidad con vista a jardín interior",
          "vista_Avenida":         "🏢 Vista a avenida principal",
          "vista_Calle":           "🏘️ Vista a calle residencial",
        };
        phrases.push(vistaMapFull[vistaKey] || `👀 Vista ${vistaKey.replace("vista_", "").toLowerCase()}`);
      }

      consumed.add("ventanas_amplias");
      consumed.add("balcon");
      consumed.add("vista");
      consumed.add("iluminacion");
      if (vistaKey) consumed.add(vistaKey);
    }

    // ── Resto de manuales: uno a uno ─────────────────────────────────────────
    const remaining = manuales.filter((k) => !consumed.has(k));
    for (const key of remaining) {
      let phrase: string | null = null;

      if (key === "antiguedad") {
        const antiguedad = prop.antiguedad || "";
        const map: Record<string, string> = {
          "A estrenar":   "✨ A estrenar, acabados de lujo",
          "1-5 años":     "🆕 Como nuevo, muy bien conservado",
          "5-10 años":    "🏗 Buen estado general",
        };
        phrase = map[antiguedad] || null;
      } else if (key === "amplitud") {
        const area = prop.area_m2 || 0;
        if (area >= 120)      phrase = "🏰 Muy amplio y espacioso";
        else if (area >= 90)  phrase = "📐 Ambientes amplios";
        else if (area >= 60)  phrase = "✨ Bien distribuido";
      } else if (key === "areas_comunes") {
        const areaKeys = ["piscina","gimnasio","terraza","jardin","parrilla","juegos_ninos"];
        const emojiMap: Record<string, string> = {
          piscina: "🏊 Piscina", gimnasio: "💪 Gimnasio",
          terraza: "🌇 Terraza", jardin: "🌳 Jardín",
          parrilla: "🔥 Parrilla / BBQ", juegos_ninos: "🧸 Juegos infantiles",
        };
        const areaLabelMap: Record<string, string> = {
          piscina: "piscina", gimnasio: "gimnasio", terraza: "terraza",
          jardin: "jardín", parrilla: "parrilla / BBQ", juegos_ninos: "juegos infantiles",
        };
        const areas = areaKeys.filter((k) => prop[k]);
        if (areas.length === 1) {
          phrase = emojiMap[areas[0]];
        } else if (areas.length > 1) {
          phrase = `🏊 Áreas comunes: ${areas.map((k) => areaLabelMap[k]).join(", ")}`;
        }
        // Marcar todas como consumidas para que auto no las repita
        areas.forEach((k) => consumed.add(k));
      } else {
        phrase = keyToPhraseSingle(key);
      }

      if (phrase) {
        phrases.push(phrase);
        consumed.add(key);
      }
    }

    return { phrases: phrases.slice(0, 3), consumed };
  }

  function cap(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Frase para una clave individual (sin fusión)
  function keyToPhraseSingle(key: string): string | null {
    const map: Record<string, string> = {
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
    return map[key] || null;
  }

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
      } else {
        highlights.push("🌇 Vista panorámica de la ciudad");
        if (iluminacionLibre) highlights.push("☀️ Iluminación natural todo el día");
      }
      covered.add("iluminacion");
    } else if (piso >= 10) {
      if (vistaLibre) {
        highlights.push("🏙️ Vista despejada · Muy iluminado");
        covered.add("vista");
      } else {
        highlights.push("🏙️ Vista despejada y muy iluminado");
      }
      covered.add("iluminacion");
    } else if (piso >= 6) {
      highlights.push("🌳 Buena iluminación y ventilación");
      covered.add("iluminacion");
    } else if (piso >= 2) {
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

    // ── 9. ÁREAS COMUNES ──────────────────────────────────────────────────────
    const areasMap: Record<string, string> = {
      piscina: "piscina", terraza: "terraza", jardin: "jardín",
      sum: "SUM", parrilla: "parrilla / BBQ",
      juegos_ninos: "juegos infantiles", gimnasio: "gimnasio",
    };
    const areasList = Object.keys(areasMap).filter((k) => prop[k] && !covered.has(k));
    if (areasList.length > 0) {
      highlights.push(`🏊 Áreas comunes: ${areasList.map((k) => areasMap[k]).join(", ")}`);
    }

    // ── 10. DORMITORIOS / BAÑOS ───────────────────────────────────────────────
    if (prop.dormitorios >= 3 && prop.banos >= 2) {
      highlights.push("🚿 Baños completos para cada dormitorio");
    } else if (prop.dormitorios >= 2) {
      highlights.push("🛏 Ideal para familias o roommates");
    }

    return [...new Set(highlights)].slice(0, 8);
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
    fotos.length > 0 ? `📸 Galería (${fotos.length} fotos):\n${propiedadUrl}` : "",
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

  const hookPhrase = autoHighlights.length > 0
    ? `✨ ${autoHighlights[0]}`
    : "✨ Excelente oportunidad";

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
