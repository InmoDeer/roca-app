/** @deprecated Import from `@/core/repositories/properties.repository` — re-export. */
import {
  fetchProperties,
  fetchPropertyById,
  createPropertyRow,
  updatePropertyRow,
  deletePropertyRow,
  updatePropertyStatusRow,
  buildPropertyPayload,
} from "@/core/repositories/properties.repository";

export {
  fetchProperties,
  fetchPropertyById,
  buildPropertyPayload,
};

export async function createProperty(payload: Parameters<typeof createPropertyRow>[0]) {
  return createPropertyRow(payload);
}

export async function updateProperty(id: string, payload: Parameters<typeof updatePropertyRow>[1]) {
  return updatePropertyRow(id, payload);
}

export async function deleteProperty(id: string) {
  return deletePropertyRow(id);
}

export async function updatePropertyStatus(id: string, estado: string) {
  return updatePropertyStatusRow(id, estado);
}
