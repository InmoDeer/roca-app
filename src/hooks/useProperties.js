import { useState, useEffect } from "react";
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  fetchPropertyById,
} from "../utils/api";

export function useProperties(userId) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    if (!userId) return;
    setLoading(true);
    const data = await fetchProperties();
    setProperties(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
    
    // Recargar cada 30 segundos para detectar cambios del otro usuario
    const interval = setInterval(() => {
      loadProperties();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const saveProperty = async (payload, id) => {
    if (id) {
      await updateProperty(id, payload);
    } else {
      await createProperty(payload);
    }
    await loadProperties();

    if (id) {
      const updated = await fetchPropertyById(id);
      return updated;
    }
  };

  const removeProperty = async (id) => {
    await deleteProperty(id);
    setProperties((ps) => ps.filter((p) => p.id !== id));
  };

  const changeStatus = async (id, estado) => {
    await updatePropertyStatus(id, estado);
    setProperties((ps) =>
      ps.map((p) => (p.id === id ? { ...p, estado } : p))
    );
  };

  return {
    properties,
    loading,
    loadProperties,
    saveProperty,
    removeProperty,
    changeStatus,
  };
}
