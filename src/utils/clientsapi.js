import { supabase } from "../config/supabase";

export async function fetchClients() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*, propiedades(nombre, distrito, tipo)")
    .order("created_at", { ascending: false });
  if (error) console.error("Error fetching clients:", error);
  return data || [];
}

export async function fetchClientsByProperty(propertyId) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("propiedad_id", propertyId)
    .order("created_at", { ascending: false });
  if (error) console.error("Error fetching clients by property:", error);
  return data || [];
}

export async function createClient(payload) {
  const { error } = await supabase.from("clientes").insert(payload);
  if (error) console.error("Error creating client:", error);
}

export async function updateClient(id, payload) {
  const { error } = await supabase
    .from("clientes")
    .update(payload)
    .eq("id", id);
  if (error) console.error("Error updating client:", error);
}

export async function deleteClient(id) {
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);
  if (error) console.error("Error deleting client:", error);
}
