import * as Tabs from "@radix-ui/react-tabs";
import { useTheme } from "../../hooks/useTheme.jsx";

/**
 * RocaTabs — wrapper de Radix Tabs con indicador dorado animado
 * 
 * @param {Array} tabs - [{ value, label, icon?: LucideIcon }]
 * @param {string} defaultValue
 * @param {function} onValueChange
 */
export function RocaTabs({ tabs = [], defaultValue, onValueChange }) {
  const { t, mode } = useTheme();

  const listStyle = {
    display: "flex",
    gap: 4,
    padding: 4,
    background: mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    borderRadius: t.radius.md,
  };

  const triggerStyle = (isActive) => ({
    flex: 1,
    padding: "10px 16px",
    borderRadius: t.radius.sm,
    border: "none",
    background: isActive ? "transparent" : "transparent",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: isActive ? t.colors.primary : t.colors.textMuted,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontFamily: t.fonts.family,
    outline: "none",
  });

  const contentStyle = {
    padding: "16px 0",
    outline: "none",
  };

  return (
    <Tabs.Root defaultValue={defaultValue} onValueChange={onValueChange}>
      <Tabs.List style={listStyle}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tabs.Trigger key={tab.value} value={tab.value} style={triggerStyle(false)}>
              {Icon && <Icon size={14} strokeWidth={1.5} />}
              {tab.label}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} style={contentStyle}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

/**
 * SimpleTabs — tabs simples sin el wrapper completo
 * Útil cuando solo necesitas el componente de tabs sin contenido
 */
export function SimpleTabs({ tabs = [], value, onValueChange, variant = "pill" }) {
  const { t, mode } = useTheme();

  const containerStyle = variant === "pill" ? {
    display: "flex",
    gap: 4,
    padding: 4,
    background: mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    borderRadius: t.radius.md,
  } : {
    display: "flex",
    borderBottom: `1px solid ${t.colors.border}`,
    gap: 0,
  };

  const tabStyle = (isActive) => variant === "pill" ? {
    flex: 1,
    padding: "10px 16px",
    borderRadius: t.radius.sm,
    border: "none",
    background: isActive ? t.colors.bgCard : "transparent",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: isActive ? t.colors.primary : t.colors.textMuted,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontFamily: t.fonts.family,
    outline: "none",
  } : {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    background: "none",
    borderBottom: isActive ? `2px solid ${t.colors.primary}` : "2px solid transparent",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: isActive ? t.colors.primary : t.colors.textMuted,
    transition: "all 0.2s ease",
    fontFamily: t.fonts.family,
    outline: "none",
    marginBottom: -1,
  };

  return (
    <Tabs.Root value={value} onValueChange={onValueChange}>
      <Tabs.List style={containerStyle}>
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value} style={tabStyle(value === tab.value)}>
            {tab.icon && <tab.icon size={14} strokeWidth={1.5} />}
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}