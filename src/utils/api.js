import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/environment";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch all properties sorted by creation date
export async function fetchProperties() {
  const { data } = await supabase
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

// Fetch a single property by ID
export async function fetchPropertyById(id) {
  const { data } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// Create a new property
export async function createProperty(payload) {
  await supabase.from("propiedades").insert(payload);
}

// Update an existing property
export async function updateProperty(id, payload) {
  await supabase.from("propiedades").update(payload).eq("id", id);
}

// Delete a property
export async function deleteProperty(id) {
  await supabase.from("propiedades").delete().eq("id", id);
}

// Update property status only
export async function updatePropertyStatus(id, estado) {
  await supabase.from("propiedades").update({ estado }).eq("id", id);
}
