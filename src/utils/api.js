import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/environment";
import { deleteCloudinaryImages } from "./cloudinary";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchProperties() {
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) console.error("Error fetching:", error);
  return data || [];
}

export async function fetchPropertyById(id) {
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) console.error("Error fetching by id:", error);
  return data;
}

export async function createProperty(payload) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase.from("propiedades").insert({
    ...payload,
    user_id: user.id
  });
  
  if (error) console.error("Error creating:", error);
}

export async function updateProperty(id, payload) {
  const { error } = await supabase
    .from("propiedades")
    .update(payload)
    .eq("id", id);
  
  if (error) console.error("Error updating:", error);
}

import { supabase, fetchProperties, fetchPropertyById, deleteCloudinaryImages } from "./api";

export async function deleteProperty(id) {
  const property = await fetchPropertyById(id);
  
  if (property && property.fotos_urls && Array.isArray(property.fotos_urls)) {
    await deleteCloudinaryImages(property.fotos_urls);
  }

  const { error } = await supabase
    .from("propiedades")
    .delete()
    .eq("id", id);
  
  if (error) console.error("Error deleting:", error);
}

export async function updatePropertyStatus(id, estado) {
  const { error } = await supabase
    .from("propiedades")
    .update({ estado })
    .eq("id", id);
  
  if (error) console.error("Error updating status:", error);
}
