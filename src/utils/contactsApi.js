import { supabase } from "../config/supabase";

export async function fetchContacts(userId, tipo = null) {
  let query = supabase
    .from("contactos")
    .select("*, propiedades:propiedad_id(nombre, tipo, distrito)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (tipo) query = query.eq("tipo", tipo);
  
  const { data, error } = await query;
  if (error) console.error("Error fetching contacts:", error);
  return data || [];
}

export async function fetchContactsByProperty(propertyId, userId, tipo = null) {
  let query = supabase
    .from("contactos")
    .select("*")
    .eq("propiedad_id", propertyId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (tipo) query = query.eq("tipo", tipo);
  
  const { data, error } = await query;
  if (error) console.error("Error fetching contacts by property:", error);
  return data || [];
}

export async function createContact(payload) {
  const { error } = await supabase.from("contactos").insert(payload);
  if (error) console.error("Error creating contacts:", error);
}

export async function createContactAndReturn(payload) {
  const { data, error } = await supabase
    .from("contactos")
    .insert(payload)
    .select("id")
    .single();
  if (error) console.error("Error creating contact:", error);
  return data?.id;
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

export async function fetchPropietarioByPropiedad(propiedadId) {
  const { data, error } = await supabase
    .from("contactos")
    .select("id, nombre, telefono, estado")
    .eq("propiedad_id", propiedadId)
    .eq("tipo", "propietario")
    .single();
  if (error) console.error("Error fetching propietario:", error);
  return data;
}

export async function assignPropietarioToPropiedad(propiedadId, propietarioId) {
  if (!propiedadId || !propietarioId) return;
  
  await supabase
    .from("propiedades")
    .update({ propietario_id: propietarioId })
    .eq("id", propiedadId);
    
  await supabase
    .from("contactos")
    .update({ propiedad_id: propiedadId })
    .eq("id", propietarioId);
}

export async function unassignPropietario(propiedadId, propietarioId) {
  if (!propiedadId || !propietarioId) return;
  
  await supabase
    .from("propiedades")
    .update({ propietario_id: null })
    .eq("id", propiedadId);
    
  await supabase
    .from("contactos")
    .update({ propiedad_id: null })
    .eq("id", propietarioId);
}
