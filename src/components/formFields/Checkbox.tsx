"use client";
import { Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { getCheckboxStyles } from "@/styles/componentStyles";

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
        background: isChecked ? `linear-gradient(135deg, ${t.colors.primary} 0%, ${t.colors.primaryDark} 100%)` : t.colors.bgSecondary,
        borderColor: isChecked ? t.colors.primary : t.colors.border,
      }}>
        {isChecked && <Check size={14} strokeWidth={2.5} style={{ color: t.colors.bg }} />}
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