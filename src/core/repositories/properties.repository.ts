import { supabase } from "@/core/services/supabase/client";
import { deleteCloudinaryImages } from "@/core/services/cloudinary";
import type { Property } from "@/core/entities/property";
import { mapRowToProperty } from "@/core/entities/property";

function handleError(context: string, error: unknown) {
  console.error(`Error ${context}:`, error);
}

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase.client
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) handleError("fetching", error);
  return ((data as Record<string, unknown>[]) || []).map(mapRowToProperty);
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase.client
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (error) handleError("fetching by id", error);
  return data ? mapRowToProperty(data as Record<string, unknown>) : null;
}

export async function createPropertyRow(payload: Partial<Property>) {
  const {
    data: { user },
  } = await supabase.client.auth.getUser();
  const { error } = await supabase.client.from("properties").insert({
    ...payload,
    user_id: user!.id,
  });
  if (error) handleError("creating", error);
}

export async function updatePropertyRow(id: string, payload: Partial<Property>) {
  const { error } = await supabase.client.from("properties").update(payload).eq("id", id);
  if (error) handleError("updating", error);
}

export async function deletePropertyRow(id: string) {
  const property = await fetchPropertyById(id);
  if (property?.fotos_urls?.length) {
    await deleteCloudinaryImages(property.fotos_urls);
  }
  const { error } = await supabase.client.from("properties").delete().eq("id", id);
  if (error) handleError("deleting", error);
}

export async function updatePropertyStatusRow(id: string, estado: string) {
  const { error } = await supabase.client.from("properties").update({ estado }).eq("id", id);
  if (error) handleError("updating status", error);
}

export function buildPropertyPayload(form: Record<string, unknown>) {
  return {
    nombre: form.nombre,
    tipo: form.tipo,
    operacion: form.operacion,
    estado: form.estado || "Disponible",
    distrito: form.distrito,
    direccion: form.direccion || null,
    maps_url: form.maps_url || null,
    precio: Number(form.precio),
    moneda: form.moneda,
    mantenimiento: form.mantenimiento ? Number(form.mantenimiento) : null,
    dormitorios: form.dormitorios ? Number(form.dormitorios) : null,
    ambientes: form.ambientes ? Number(form.ambientes) : null,
    banos: form.banos ? Number(form.banos) : null,
    area_m2: form.area_m2 ? Number(form.area_m2) : null,
    piso: form.piso ? Number(form.piso) : null,
    antiguedad: form.antiguedad || null,
    cochera: !!form.cochera,
    ascensor: !!form.ascensor,
    amoblado: !!form.amoblado,
    area_servicio: !!form.area_servicio,
    mascotas: form.mascotas || "No",
    fotos_urls: form.fotos_urls || [],
    video_url: form.video_url || null,
    tour360_url: form.tour360_url || null,
    balcon: !!form.balcon,
    ventanas_amplias: !!form.ventanas_amplias,
    vista: form.vista || null,
    cerca_a: form.cerca_a || null,
    limita_con: form.limita_con || null,
    cocina_equipada: !!form.cocina_equipada,
    closet: !!form.closet,
    recepcion: !!form.recepcion,
    areas_comunes: !!form.areas_comunes,
    piscina: !!form.piscina,
    terraza: !!form.terraza,
    jardin: !!form.jardin,
    sum: !!form.sum,
    parrilla: !!form.parrilla,
    juegos_ninos: !!form.juegos_ninos,
    gimnasio: !!form.gimnasio,
    gas_natural: !!form.gas_natural,
    lavanderia: !!form.lavanderia,
    tendal: !!form.tendal,
    destacados_manuales: form.destacados_manuales || [],
    zona: form.zona || null,
    perfil_ideal: form.perfil_ideal || null,
  };
}
