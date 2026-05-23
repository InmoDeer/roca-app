import type { ActionResult, PropertyIntent } from "@/core/actions/types";
import { searchProperties } from "./searchProperties";
import { getProperty } from "./getProperty";
import { changePropertyStatus } from "./changePropertyStatus";
import { updatePropertyFields } from "./updatePropertyFields";
import { createProperty } from "./createProperty";
import { deletePropertyById } from "./deleteProperty";
import { duplicateProperty } from "./duplicateProperty";
import { getPropertiesSummary } from "./getPropertiesSummary";

export async function executePropertyIntent(
  intent: PropertyIntent
): Promise<ActionResult<unknown>> {
  switch (intent.action) {
    case "search":
      return searchProperties(intent);
    case "get":
      return getProperty(intent.id);
    case "changeStatus":
      return changePropertyStatus(intent.id, intent.estado);
    case "update":
      return updatePropertyFields(intent.id, intent.fields);
    case "create":
      return createProperty(intent.data);
    case "delete":
      return deletePropertyById(intent.id);
    case "duplicate":
      return duplicateProperty(intent.id);
    case "summary":
      return getPropertiesSummary();
    case "unknown":
      return { ok: false, error: `No entendí: "${intent.raw}"` };
    default:
      return { ok: false, error: "Acción no reconocida" };
  }
}
