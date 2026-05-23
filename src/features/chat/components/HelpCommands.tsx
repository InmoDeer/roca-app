import { Sparkles } from "lucide-react";

const HELP_COMMANDS = [
  { label: "Resumen", example: "resumen" },
  { label: "Buscar", example: "depas disponibles en Miraflores" },
  { label: "Filtrar por precio", example: "alquileres hasta 2000 soles" },
  { label: "Cambiar estado", example: "reservar el depa de Lince" },
  { label: "Crear inmueble", example: "crear depa en Surco alquiler 1500" },
  { label: "Duplicar", example: "duplicar el último" },
  { label: "Ver detalle", example: "info de ese" },
];

export function HelpCommands({
  t,
  mode,
  onSelectExample,
}: {
  t: any;
  mode: string;
  onSelectExample: (text: string) => void;
}) {
  const isDark = mode === "dark";

  return (
    <div
      style={{
        padding: "10px 14px",
        borderTop: `1px solid ${t.colors.border}`,
        background: isDark ? "#0a0a0a" : "#ececec",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: t.colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: 8,
        }}
      >
        Comandos disponibles
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          maxHeight: 180,
          overflowY: "auto",
        }}
      >
        {HELP_COMMANDS.map((cmd) => (
          <button
            key={cmd.example}
            onClick={() => onSelectExample(cmd.example)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              borderRadius: 8,
              background: isDark ? "#1a1a1a" : "#ffffff",
              border: `1px solid ${t.colors.border}`,
              cursor: "pointer",
              textAlign: "left",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: t.colors.text,
              }}
            >
              {cmd.label}
            </span>
            <span
              style={{
                fontSize: 11,
                color: t.colors.textMuted,
                fontStyle: "italic",
              }}
            >
              {cmd.example}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
