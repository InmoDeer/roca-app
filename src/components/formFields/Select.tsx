"use client";
import { useTheme } from "@/hooks/useTheme";
import { getSelectStyles } from "@/styles/componentStyles";

export function Select({ label, k, form, setForm, opts }: any) {
  const { t } = useTheme();
  const styles = getSelectStyles(t) as Record<string, React.CSSProperties>;

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <select
        style={styles.select}
        value={form[k] ?? ""}
        onChange={(e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }))}
      >
        {opts.map((o: string) => (
          <option key={o} value={o} style={{ background: t.colors.bgSecondary, color: t.colors.text }}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}