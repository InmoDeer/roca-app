const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || "dzqfw8hm3";
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "roca_fotos";

export function isCloudinaryUrl(url: string): boolean {
  return !!url && url.includes("cloudinary");
}

export async function uploadToCloudinary(file: File) {
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

export async function deleteCloudinaryImage(url: string) {
  if (!isCloudinaryUrl(url)) return;

  try {
    const res = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) console.error("Error eliminando de Cloudinary:", data.error);
    return data;
  } catch (error) {
    console.error("Error eliminando imagen de Cloudinary:", error);
  }
}

export async function deleteCloudinaryImages(urls: string | string[]) {
  const urlArray = Array.isArray(urls) ? urls : [urls];
  const validUrls = urlArray.filter(url => typeof url === 'string' && isCloudinaryUrl(url));
  
  if (validUrls.length === 0) {
    return { deleted: [], failed: [] };
  }
  
  const results = { deleted: [] as string[], failed: [] as string[] };
  
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