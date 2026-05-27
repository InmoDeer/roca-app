"use client";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { getStatusColors } from "@/styles/statusColors";
import { getEstadoDisplay } from "@/core/entities/property";
import {
  getLabelStyle,
  getSelectContentStyles,
  getSelectItemStyles,
  getRocaSelectTriggerStyles,
  getRocaSelectItemStyles,
} from "@/styles/componentStyles";

export function StatusSelect({ value, onValueChange, pipeline, operacion }: any) {
  const { t, mode } = useTheme();
  const ec = getStatusColors(value, pipeline, t, mode, "solid");

  const triggerStyle: any = {
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

  const contentStyle: any = { ...getSelectContentStyles(t, mode), minWidth: 180 };
  const itemStyle = getSelectItemStyles(t);

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger style={triggerStyle}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: ec.dot, flexShrink: 0,
        }} />
        <Select.Value>{getEstadoDisplay(value, operacion)}</Select.Value>
        <Select.Icon>
          <ChevronDown size={12} strokeWidth={2} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content style={contentStyle} position="popper" sideOffset={4}>
          <Select.Viewport>
            {pipeline.map((estado: string) => {
              const itemEc = getStatusColors(estado, pipeline, t, mode, "solid");
              return (
                <Select.Item key={estado} value={estado} style={itemStyle as any}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: itemEc.dot, flexShrink: 0,
                  }} />
                  <Select.ItemText>{getEstadoDisplay(estado, operacion)}</Select.ItemText>
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

export function RocaSelect({ label, value, onValueChange, options, placeholder = "Seleccionar" }: any) {
  const { t, mode } = useTheme();

  const triggerStyle = { ...getRocaSelectTriggerStyles(t, mode), color: value ? t.colors.text : t.colors.textMuted };
  const contentStyle: any = {
    ...getSelectContentStyles(t, mode),
    width: "var(--radix-select-trigger-width)",
    maxHeight: 300,
    overflow: "auto",
  };
  const itemStyle = getRocaSelectItemStyles(t);

  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={getLabelStyle(t)}>
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
              {options.map((opt: any) => {
                const val = typeof opt === "string" ? opt : opt.value;
                const lbl = typeof opt === "string" ? opt : opt.label;
                return (
                  <Select.Item key={val} value={val} style={itemStyle as any}>
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