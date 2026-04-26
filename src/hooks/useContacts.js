import { useState, useEffect } from "react";
import {
  fetchContacts,
  fetchContactsByProperty,
  createContact,
  createContactAndReturn,
  updateContact,
  deleteContact,
  assignPropietarioToPropiedad,
  unassignPropietario,
} from "../utils/contactsApi";

export function useContacts(userId, tipo = null, propertyId = null) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    const data = propertyId
      ? await fetchContactsByProperty(propertyId, userId, tipo)
      : await fetchContacts(userId, tipo);
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [userId, tipo, propertyId]);

  const saveContact = async (payload, id, tipoFiltro) => {
    if (!userId) return;
    const enriched = { ...payload, user_id: userId, tipo: tipoFiltro };
    
    if (id) {
      const oldContact = contacts.find(c => c.id === id);
      const oldPropiedadId = oldContact?.propiedad_id;
      const newPropiedadId = payload.propiedad_id;
      
      await updateContact(id, enriched);
      
      if (tipoFiltro === 'propietario') {
        if (oldPropiedadId && oldPropiedadId !== newPropiedadId) {
          await unassignPropietario(oldPropiedadId, id);
        }
        if (newPropiedadId && oldPropiedadId !== newPropiedadId) {
          await assignPropietarioToPropiedad(newPropiedadId, id);
        }
      }
    } else {
      await createContact(enriched);
      if (tipoFiltro === 'propietario' && payload.propiedad_id) {
        const newId = await createContactAndReturn(enriched);
        if (newId) {
          await assignPropietarioToPropiedad(payload.propiedad_id, newId);
        }
      }
    }
    
    await load();
  };

  const removeContact = async (id) => {
    await deleteContact(id);
    setContacts((cs) => cs.filter((c) => c.id !== id));
  };

  const changeEstado = async (id, estado, tipoFiltro) => {
    const contacto = contacts.find(c => c.id === id);
    const oldEstado = contacto?.estado;
    
    await updateContact(id, { estado });
    setContacts((cs) => cs.map((c) => c.id === id ? { ...c, estado } : c));
    
    if (tipoFiltro === 'propietario' && estado === "Firmado / Cerrado" && contacto?.propiedad_id) {
      await assignPropietarioToPropiedad(contacto.propiedad_id, id);
    }
    if (tipoFiltro === 'propietario' && oldEstado === "Firmado / Cerrado" && estado !== "Firmado / Cerrado" && contacto?.propiedad_id) {
      await unassignPropietario(contacto.propiedad_id, id);
    }
  };

  return {
    contacts,
    loading,
    saveContact,
    removeContact,
    changeEstado,
    reload: load,
  };
}