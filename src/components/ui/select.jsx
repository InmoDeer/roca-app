import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { useTheme } from "../../hooks/useTheme.jsx";
import { getStatusColors } from "../../styles/statusColors.js";

/**
 * StatusSelect — select de estado con colores automáticos del pipeline
 * 
 * @param {string} value - Estado actual
 * @param {function} onValueChange
 * @param {string[]} pipeline - Array de estados
 * @param {string} entityType - "property" | "lead" | "propietario" (para display)
 * @param {string} operacion - "Venta" | "Alquiler" (para label "Cerrado")
 */
export function StatusSelect({ value, onValueChange, pipeline, operacion }) {
  const { t, mode } = useTheme();
  const ec = getStatusColors(value, pipeline, t, mode, "solid");

  const triggerStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 20,
    border: `1px solid ${ec.border}`,
    background: ec.bg,
    color: ec.text,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    outline: "none",
    fontFamily: t.fonts.family,
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  };

  const contentStyle = {
    background: mode === "dark" ? "#1a1a1a" : "#ffffff",
    border: `1px solid ${t.colors.border}`,
    borderRadius: t.radius.md,
    padding: 6,
    boxShadow: mode === "dark"
      ? "0 8px 32px rgba(0,0,0,0.5)"
      : "0 8px 32px rgba(0,0,0,0.12)",
    zIndex: 200,
    animation: "scaleIn 0.15s ease",
    fontFamily: t.fonts.family,
    minWidth: 180,
  };

  function getLabel(estado) {
    if (estado === "Cerrado") {
      return operacion === "Alquiler" ? "Alquilado" : "Vendido";
    }
    return estado;
  }

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger style={triggerStyle}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: ec.dot, flexShrink: 0,
        }} />
        <Select.Value>{getLabel(value)}</Select.Value>
        <Select.Icon>
          <ChevronDown size={12} strokeWidth={2} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content style={contentStyle} position="popper" sideOffset={4}>
          <Select.Viewport>
            {pipeline.map((estado) => {
              const itemEc = getStatusColors(estado, pipeline, t, mode, "solid");
              return (
                <Select.Item
                  key={estado}
                  value={estado}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 12px",
                    borderRadius: t.radius.sm,
                    cursor: "pointer",
                    outline: "none",
                    fontSize: 13,
                    color: t.colors.text,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = mode === "dark"
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: itemEc.dot, flexShrink: 0,
                  }} />
                  <Select.ItemText>{getLabel(estado)}</Select.ItemText>
                  <Select.ItemIndicator style={{ marginLeft: "auto" }}>
                    <Check size={13} color={t.colors.primary} strokeWidth={2.5} />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

/**
 * RocaSelect — select genérico para formularios (reemplaza <select> nativo)
 */
export function RocaSelect({ label, value, onValueChange, options, placeholder = "Seleccionar" }) {
  const { t, mode } = useTheme();

  const triggerStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: t.radius.md,
    border: `1.5px solid ${t.colors.border}`,
    background: mode === "dark" ? "rgba(255,255,255,0.03)" : "#fafaf8",
    color: value ? t.colors.text : t.colors.textMuted,
    fontSize: 15,
    cursor: "pointer",
    outline: "none",
    fontFamily: t.fonts.family,
    transition: "border-color 0.2s ease",
    textAlign: "left",
  };

  const contentStyle = {
    background: mode === "dark" ? "#1a1a1a" : "#ffffff",
    border: `1px solid ${t.colors.border}`,
    borderRadius: t.radius.md,
    padding: 6,
    boxShadow: mode === "dark"
      ? "0 8px 32px rgba(0,0,0,0.5)"
      : "0 8px 32px rgba(0,0,0,0.12)",
    zIndex: 200,
    animation: "scaleIn 0.15s ease",
    fontFamily: t.fonts.family,
    width: "var(--radix-select-trigger-width)",
    maxHeight: 300,
    overflow: "auto",
  };

  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{
          display: "block", fontSize: 12, fontWeight: 600,
          color: t.colors.textMuted, marginBottom: 6,
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>
          {label}
        </label>
      )}
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger style={triggerStyle}>
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown size={16} color={t.colors.textMuted} strokeWidth={1.5} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content style={contentStyle} position="popper" sideOffset={4}>
            <Select.Viewport>
              {options.map((opt) => {
                const val = typeof opt === "string" ? opt : opt.value;
                const lbl = typeof opt === "string" ? opt : opt.label;
                return (
                  <Select.Item
                    key={val}
                    value={val}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: t.radius.sm,
                      cursor: "pointer",
                      outline: "none",
                      fontSize: 14,
                      color: t.colors.text,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = mode === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <Select.ItemText>{lbl || placeholder}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={13} color={t.colors.primary} strokeWidth={2.5} />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
