import { CLOUDINARY_CLOUD, CLOUDINARY_PRESET, CLOUDINARY_API_SECRET } from "../config/environment";

export async function uploadToCloudinary(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_PRESET);
  form.append("folder", "roca");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: form }
  );

  const data = await res.json();
  return data.secure_url;
}

function getPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const afterUpload = parts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex(p => p.match(/^v\d+$/));
    if (versionIndex > -1) {
      afterUpload.splice(versionIndex, 1);
    }
    const publicId = afterUpload.join("/").replace(/\.[^.]+$/, "");
    return publicId;
  } catch {
    return null;
  }
}

export async function deleteCloudinaryImage(url) {
  if (!url || !url.includes("cloudinary")) {
    console.log("No es imagen de Cloudinary, saltando:", url);
    return;
  }

  const publicId = getPublicIdFromUrl(url);
  if (!publicId) {
    console.log("No se pudo obtener publicId de:", url);
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await generateSignature(publicId, timestamp);

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("api_key", "213115298379474");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/destroy`,
      { method: "POST", body: form }
    );
    const data = await res.json();
    console.log("Cloudinary delete response:", data);
    return data;
  } catch (error) {
    console.error("Error eliminando imagen de Cloudinary:", error);
  }
}

async function generateSignature(publicId, timestamp) {
  const str = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Elimina múltiples imágenes de Cloudinary de forma segura.
 * @param {string|string[]} urls - URL o array de URLs de Cloudinary.
 * @returns {Promise<{deleted: string[], failed: string[]}>}
 */
export async function deleteCloudinaryImages(urls) {
  const urlArray = Array.isArray(urls) ? urls : [urls];
  const validUrls = urlArray.filter(url => url && typeof url === 'string' && url.includes('cloudinary'));
  
  if (validUrls.length === 0) {
    return { deleted: [], failed: [] };
  }
  
  const results = { deleted: [], failed: [] };
  
  await Promise.all(
    validUrls.map(async (url) => {
      try {
        await deleteCloudinaryImage(url);
        results.deleted.push(url);
      } catch (err) {
        console.error(`Error eliminando ${url}:`, err);
        results.failed.push(url);
      }
    })
  );
  
  return results;
}
