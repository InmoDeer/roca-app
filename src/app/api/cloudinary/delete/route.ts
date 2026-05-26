import { NextResponse } from "next/server";
import { isCloudinaryUrl } from "@/core/services/cloudinary";

const CLOUDINARY_API_KEY = "213115298379474";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

function getPublicIdFromUrl(url: string) {
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

async function generateSignature(publicId: string, timestamp: number) {
  const str = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!isCloudinaryUrl(url)) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
      return NextResponse.json({ error: "No se pudo extraer publicId" }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(publicId, timestamp);

    const form = new URLSearchParams();
    form.append("public_id", publicId);
    form.append("timestamp", timestamp.toString());
    form.append("signature", signature);
    form.append("api_key", CLOUDINARY_API_KEY);

    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || "dzqfw8hm3";
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/image/destroy`,
      { method: "POST", body: form }
    );
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
