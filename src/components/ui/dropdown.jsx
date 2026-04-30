import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "../../hooks/useTheme.jsx";

/**
 * Dropdown — wrapper de Radix DropdownMenu
 * 
 * @param {ReactNode} trigger - Elemento que abre el dropdown
 * @param {Array} items - [{ label, icon: LucideIcon, onClick, danger, divider }]
 * @param {string} side - "bottom" | "top" | "left" | "right"
 * @param {string} align - "start" | "center" | "end"
 */
export function Dropdown({ trigger, items = [], side = "bottom", align = "end" }) {
  const { t, mode } = useTheme();

  const menuStyle = {
    background: mode === "dark" ? "#1a1a1a" : "#ffffff",
    border: `1px solid ${t.colors.border}`,
    borderRadius: t.radius.md,
    padding: "6px",
    boxShadow: mode === "dark"
      ? "0 8px 32px rgba(0,0,0,0.5)"
      : "0 8px 32px rgba(0,0,0,0.12)",
    minWidth: 160,
    zIndex: 100,
    animation: "scaleIn 0.15s ease",
    transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
    fontFamily: t.fonts.family,
  };

  const itemStyle = (danger = false) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "10px 12px",
    background: "none",
    border: "none",
    borderRadius: t.radius.sm,
    textAlign: "left",
    fontSize: 14,
    cursor: "pointer",
    color: danger ? t.colors.danger : t.colors.text,
    fontFamily: t.fonts.family,
    outline: "none",
    transition: "background 0.15s ease",
  });

  const separatorStyle = {
    height: 1,
    background: t.colors.border,
    margin: "4px 0",
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={side}
          align={align}
          sideOffset={4}
          style={menuStyle}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return <DropdownMenu.Separator key={`sep-${i}`} style={separatorStyle} />;
            }

            const Icon = item.icon;

            return (
              <DropdownMenu.Item
                key={item.label}
                onSelect={item.onClick}
                style={itemStyle(item.danger)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                {Icon && <Icon size={15} strokeWidth={1.5} />}
                {item.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
