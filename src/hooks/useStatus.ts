import { useTheme } from "./useTheme";
import { getStatusColors, getPipelineForEntity } from "@/styles/statusColors";

export function useStatus(status: string, entityType = "property", variant = "solid") {
  const { t, mode } = useTheme();
  const pipeline = getPipelineForEntity(entityType);
  
  return getStatusColors(status, pipeline, t, mode, variant);
}

export function useStatusPalette(entityType = "property", variant = "solid") {
  const { t, mode } = useTheme();
  const pipeline = getPipelineForEntity(entityType);
  
  return pipeline.map((status) => ({
    status,
    ...getStatusColors(status, pipeline, t, mode, variant),
  }));
}