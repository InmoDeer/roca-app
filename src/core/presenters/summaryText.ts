export interface SummaryData {
  total: number;
  disponibles: number;
  reservadas: number;
  cerradas: number;
  descartadas: number;
  porDistrito: Record<string, number>;
}

export function buildSummaryText(d: SummaryData): string {
  const lines = [
    "**Resumen del catálogo**",
    "",
    `Total: ${d.total} inmuebles`,
    `Disponibles: ${d.disponibles}`,
    `Reservados: ${d.reservadas}`,
    `Cerrados: ${d.cerradas}`,
  ];

  if (d.descartadas > 0) lines.push(`Descartados: ${d.descartadas}`);

  const topDistritos = Object.entries(d.porDistrito)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (topDistritos.length) {
    lines.push("", "Top distritos:");
    for (const [distrito, count] of topDistritos) {
      lines.push(`  ${distrito}: ${count}`);
    }
  }

  return lines.join("\n");
}
