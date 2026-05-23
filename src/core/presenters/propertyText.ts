import type { Property } from "@/core/entities/property";

export function formatCurrency(moneda: string, precio: number): string {
  const symbol = moneda === "USD" ? "$" : "S/ ";
  return `${symbol}${precio.toLocaleString()}`;
}

export function formatPropertyBrief(p: Property): string {
  return [
    `**${p.nombre}**`,
    `${p.tipo} · ${p.distrito}`,
    `💰 ${formatCurrency(p.moneda, p.precio)} · Estado: ${p.estado}`,
  ].join("\n");
}

export function formatPropertyCardLine(p: Property): string {
  return `${p.tipo} · ${p.distrito} · ${formatCurrency(p.moneda, p.precio)}`;
}
