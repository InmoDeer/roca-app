/**
 * Script para limpiar fotos huérfanas de Cloudinary
 * Ejecutar con: node --experimental-modules src/scripts/cleanupOrphanedPhotos.js
 * 
 * Este script:
 * 1. Obtiene todas las propiedades de Supabase
 * 2. Obtiene todas las imágenes de la carpeta "roca" en Cloudinary
 * 3. Compara y elimina las que no están en la base de datos
 */

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import fetch from "node-fetch";

const SUPABASE_URL = "https://wvihhghuoayrrtdmemfo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aWhoZ2h1b2F5cnJ0ZG1lbWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDU2NDIsImV4cCI6MjA5MTAyMTY0Mn0.86rstgilTvVZgV5KRNPmb7oBx8Xa73e39Sd62_OmkVI";

const CLOUDINARY_CLOUD = "dzqfw8hm3";
const CLOUDINARY_API_KEY = "213115298379474";
const CLOUDINARY_API_SECRET = "nyX4Plsbh1AauomXksDw35Ec2wA";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateSignature(publicId, timestamp) {
  const str = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const hash = crypto.createHash("sha1").update(str).digest("hex");
  return hash;
}

async function deleteCloudinaryImage(publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateSignature(publicId, timestamp);

  const form = new URLSearchParams();
  form.append("public_id", publicId);
  form.append("timestamp", timestamp.toString());
  form.append("signature", signature);
  form.append("api_key", CLOUDINARY_API_KEY);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/destroy`,
      { method: "POST", body: form }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error eliminando:", error);
    return null;
  }
}

async function getAllCloudinaryImages() {
  const images = [];
  let nextCursor = null;
  
  console.log("Obteniendo imágenes de Cloudinary...");
  
  do {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      type: "uploaded",
      prefix: "roca",
      max_results: 500,
      ...(nextCursor && { next_cursor: nextCursor })
    };
    
    const paramStr = Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    
    const signature = generateSignature("roca", timestamp);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/resources/search?${paramStr}&api_key=${CLOUDINARY_API_KEY}&timestamp=${timestamp}&signature=${signature}&expression=folder%3Aroca`;
    
    try {
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();
      
      if (data.resources) {
        images.push(...data.resources.map(r => ({
          publicId: r.public_id,
          url: r.secure_url
        })));
      }
      
      nextCursor = data.next_cursor;
    } catch (error) {
      console.error("Error obteniendo imágenes:", error);
      break;
    }
  } while (nextCursor);
  
  return images;
}

async function cleanup() {
  console.log("=== INICIANDO LIMPIEZA DE FOTOS HUÉRFANAS ===\n");
  
  // 1. Obtener todas las propiedades de Supabase
  console.log("1. Obteniendo propiedades de Supabase...");
  const { data: propiedades } = await supabase
    .from("propiedades")
    .select("fotos_urls");
  
  const fotosEnBD = new Set();
  propiedades?.forEach(p => {
    if (p.fotos_urls && Array.isArray(p.fotos_urls)) {
      p.fotos_urls.forEach(url => {
        if (url) fotosEnBD.add(url);
      });
    }
  });
  
  console.log(`   Propiedades encontradas: ${propiedades?.length || 0}`);
  console.log(`   Fotos en base de datos: ${fotosEnBD.size}`);
  
  // 2. Obtener todas las imágenes de Cloudinary
  console.log("\n2. Obteniendo imágenes de Cloudinary...");
  const cloudImages = await getAllCloudinaryImages();
  console.log(`   Imágenes en Cloudinary: ${cloudImages.length}`);
  
  // 3. Encontrar huérfanas
  const huérfanas = cloudImages.filter(img => !fotosEnBD.has(img.url));
  console.log(`   Fotos huérfanas (no están en BD): ${huérfanas.length}`);
  
  if (huérfanas.length === 0) {
    console.log("\n✅ No hay fotos huérfanas que eliminar.");
    return;
  }
  
  // 4. Eliminar huérfanas
  console.log("\n3. Eliminando fotos huérfanas...\n");
  
  let eliminadas = 0;
  let errores = 0;
  
  for (const img of huérfanas) {
    console.log(`   Eliminando: ${img.publicId}...`);
    const result = await deleteCloudinaryImage(img.publicId);
    
    if (result && result.result === "ok") {
      console.log("   ✅ Eliminado");
      eliminadas++;
    } else {
      console.log("   ❌ Error");
      errores++;
    }
  }
  
  console.log(`\n=== RESUMEN ===`);
  console.log(`   Eliminadas: ${eliminadas}`);
  console.log(`   Errores: ${errores}`);
  console.log(`   Total procesadas: ${huérfanas.length}`);
  
  if (eliminadas > 0) {
    console.log(`\n✅ Limpieza completada. Se eliminaron ${eliminadas} fotos huérfanas.`);
  }
}

cleanup().catch(console.error);