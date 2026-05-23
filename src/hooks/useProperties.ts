import { useState, useEffect } from "react";
import type { Property } from "@/core/entities/property";
import {
  loadAllProperties,
  createProperty,
  updateProperty,
  deletePropertyById,
  changePropertyStatus,
} from "@/core/actions/properties";

export function useProperties(userId: string | undefined) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    if (!userId) return;
    setLoading(true);
    const result = await loadAllProperties();
    if (result.ok) {
      setProperties(result.data || []);
    } else {
      console.error("Error al cargar propiedades:", result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
    
    const interval = setInterval(() => {
      loadProperties();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const saveProperty = async (payload: Partial<Property>, id?: string) => {
    if (id) {
      const result = await updateProperty(id, payload);
      if (!result.ok) throw new Error(result.error);
      await loadProperties();
      return result.data;
    } else {
      const result = await createProperty(payload);
      if (!result.ok) throw new Error(result.error);
      await loadProperties();
    }
  };

  const removeProperty = async (id: string) => {
    const result = await deletePropertyById(id);
    if (!result.ok) throw new Error(result.error);
    setProperties((ps) => ps.filter((p) => p.id !== id));
  };

  const changeStatus = async (id: string, estado: Property["estado"]) => {
    const result = await changePropertyStatus(id, estado);
    if (!result.ok) throw new Error(result.error);
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