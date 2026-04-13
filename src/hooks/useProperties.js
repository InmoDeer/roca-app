import { useState, useEffect } from "react";
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  fetchPropertyById,
} from "../utils/api";

/**
 * Custom hook for managing properties data from Supabase
 * Handles CRUD operations and syncing with database
 * @returns {Object} - Properties state and methods
 */
export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all properties on mount
  const loadProperties = async () => {
    setLoading(true);
    const data = await fetchProperties();
    setProperties(data || []);
    setLoading(false);
  };

  // Initialize on first render
  useEffect(() => {
    loadProperties();
  }, []);

  // Save property (create or update)
  const saveProperty = async (payload, id) => {
    if (id) {
      await updateProperty(id, payload);
    } else {
      await createProperty(payload);
    }
    await loadProperties();

    // If editing, re-fetch to get updated data
    if (id) {
      const updated = await fetchPropertyById(id);
      return updated;
    }
  };

  // Delete property
  const removeProperty = async (id) => {
    await deleteProperty(id);
    setProperties((ps) => ps.filter((p) => p.id !== id));
  };

  // Change property status
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
