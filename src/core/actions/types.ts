import type { Property, PropertyFilters } from "@/core/entities/property";
import type { PropertyEstado } from "@/core/entities/property";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type PropertyIntent =
  | { action: "search"; filters: Partial<PropertyFilters> & { precio_max?: number; precio_min?: number } }
  | { action: "get"; id: string }
  | { action: "changeStatus"; id: string; estado: PropertyEstado }
  | { action: "update"; id: string; fields: Partial<Property> }
  | { action: "create"; data: Partial<Property> }
  | { action: "delete"; id: string }
  | { action: "duplicate"; id: string }
  | { action: "summary" }
  | { action: "unknown"; raw: string };
