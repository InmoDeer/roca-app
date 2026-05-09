"use client";
import { Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Checkbox({ label, k, form, setForm, icon: Icon }: any) {
  const { t } = useTheme();
  const styles = getCheckboxStyles(t);
  const isChecked = !!form[k];
  
  return (
    <label style={styles.container}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e: any) =>
          setForm((f: any) => ({ ...f, [k]: e.target.checked }))
        }
        style={styles.input}
      />
      <span style={{
        ...styles.checkmark,
        background: isChecked ? "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)" : t.colors.bgSecondary,
        borderColor: isChecked ? "#d4af37" : t.colors.border,
      }}>
        {isChecked && <Check size={14} strokeWidth={2.5} style={{ color: "#0a0a0a" }} />}
      </span>
      {Icon && (
        <span style={styles.icon}>
          <Icon size={16} strokeWidth={1.5} color={t.colors.textMuted} />
        </span>
      )}
      <span style={styles.label}>{label}</span>
    </label>
  );
}

const getCheckboxStyles = (t: any) => ({
  container: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    cursor: "pointer",
    padding: "10px 0",
  },
  input: {
    display: "none",
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: `1px solid ${t.colors.border}`,
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    flexShrink: 0,
  },
  check: {
    color: "#0a0a0a",
    fontSize: 14,
    fontWeight: 700,
  },
  icon: {
    marginRight: 8,
    display: "flex",
    alignItems: "center",
  },
  label: {
    flex: 1,
    color: t.colors.textSecondary,
  },
});