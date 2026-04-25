import { supabase } from "../config/supabase";

export async function fetchContacts(userId) {
  const { data, error } = await supabase
    .from("contactos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("Error fetching contacts:", error);
  return data || [];
}

export async function fetchContactsByProperty(propertyId, userId) {
  const { data, error } = await supabase
    .from("contactos")
    .select("*")
    .eq("propiedad_id", propertyId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("Error fetching contacts by property:", error);
  return data || [];
}

export async function createContact(payload) {
  const { error } = await supabase.from("contactos").insert(payload);
  if (error) console.error("Error creating contacts:", error);
}

export async function updateContact(id, payload) {
  const { error } = await supabase
    .from("contactos")
    .update(payload)
    .eq("id", id);
  if (error) console.error("Error updating contacts:", error);
}

export async function deleteContact(id) {
  const { error } = await supabase
    .from("contactos")
    .delete()
    .eq("id", id);
  if (error) console.error("Error deleting contacts:", error);
}
