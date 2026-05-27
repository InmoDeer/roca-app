import { getChatStyles } from "@/styles/componentStyles";

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
  const s = getChatStyles(t, mode);

  return (
    <div style={s.helpWrap}>
      <div style={s.helpTitle}>
        Comandos disponibles
      </div>
      <div style={s.helpChips}>
        {HELP_COMMANDS.map((cmd) => (
          <button
            key={cmd.example}
            onClick={() => onSelectExample(cmd.example)}
            style={s.helpChip}
          >
            <span style={s.helpChipLabel}>
              {cmd.label}
            </span>
            <span style={s.helpChipExample}>
              {cmd.example}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
