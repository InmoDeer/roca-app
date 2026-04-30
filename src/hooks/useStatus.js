import { useTheme } from "./useTheme.jsx";
import { getStatusColors, getPipelineForEntity } from "../styles/statusColors.js";

/**
 * useStatus — hook para obtener colores de estado dinámicos
 * 
 * @param {string} status - Estado actual (ej: "Disponible", "Interesado")
 * @param {string} entityType - "property" | "lead" | "propietario"
 * @param {string} variant - "solid" | "subtle" (opcional, default: "solid")
 * @returns {{ bg, text, dot, border, progress }}
 * 
 * Uso:
 * const ec = useStatus("Disponible", "property")
 * const ecSubtle = useStatus("Interesado", "lead", "subtle")
 */
export function useStatus(status, entityType = "property", variant = "solid") {
  const { t, mode } = useTheme();
  const pipeline = getPipelineForEntity(entityType);
  
  return getStatusColors(status, pipeline, t, mode, variant);
}

/**
 * useStatusPalette — genera todos los estados de un pipeline
 * 
 * @param {string} entityType - "property" | "lead" | "propietario"
 * @param {string} variant - "solid" | "subtle"
 * @returns {Array} [{ status, ...colors }]
 */
export function useStatusPalette(entityType = "property", variant = "solid") {
  const { t, mode } = useTheme();
  const pipeline = getPipelineForEntity(entityType);
  
  return pipeline.map((status) => ({
    status,
    ...getStatusColors(status, pipeline, t, mode, variant),
  }));
}