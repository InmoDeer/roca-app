import { supabase } from "./supabase";
import { deleteCloudinaryImages } from "./cloudinary";

export async function fetchProperties() {
  const { data, error } = await supabase.client
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("Error fetching:", error);
  return data || [];
}

export async function fetchPropertyById(id: string) {
  const { data, error } = await supabase.client
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (error) console.error("Error fetching by id:", error);
  return data;
}

export async function createProperty(payload: any) {
  const { data: { user } } = await supabase.client.auth.getUser();
  const { error } = await supabase.client.from("properties").insert({
    ...payload,
    user_id: user.id
  });
  if (error) console.error("Error creating:", error);
}

export async function updateProperty(id: string, payload: any) {
  const { error } = await supabase.client
    .from("properties")
    .update(payload)
    .eq("id", id);
  if (error) console.error("Error updating:", error);
}

export async function deleteProperty(id: string) {
  const property = await fetchPropertyById(id);
  if (property?.fotos_urls?.length) {
    await deleteCloudinaryImages(property.fotos_urls);
  }
  const { error } = await supabase.client.from("properties").delete().eq("id", id);
  if (error) console.error("Error deleting:", error);
}

export async function fetchPropietarios(userId: string) {
  const { data, error } = await supabase.client
    .from("contacts")
    .select("id, nombre, telefono")
    .eq("tipo", "propietario")
    .eq("estado", "Cerrado")
    .eq("user_id", userId)
    .order("nombre");
  if (error) console.error("Error fetching propietarios:", error);
  return data || [];
}

export async function updatePropertyStatus(id: string, estado: string) {
  const { error } = await supabase.client
    .from("properties")
    .update({ estado })
    .eq("id", id);
  if (error) console.error("Error updating status:", error);
}