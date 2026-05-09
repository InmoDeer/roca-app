import { useState, useEffect } from "react";
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  fetchPropertyById,
} from "@/lib/api";

export function useProperties(userId: string | undefined) {
  const [properties, setProperties] = useState<any[]>([]);
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
    
    const interval = setInterval(() => {
      loadProperties();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const saveProperty = async (payload: any, id?: string) => {
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

  const removeProperty = async (id: string) => {
    await deleteProperty(id);
    setProperties((ps) => ps.filter((p) => p.id !== id));
  };

  const changeStatus = async (id: string, estado: string) => {
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