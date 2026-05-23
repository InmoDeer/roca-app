import type { Property } from "@/core/entities/property";

export function formatCardBrief(p: Property): string {
  const symbol = p.moneda === "USD" ? "$" : "S/ ";
  return `${p.tipo} · ${p.distrito} · ${symbol}${p.precio.toLocaleString()}`;
}
