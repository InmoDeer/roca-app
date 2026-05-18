"use client";
import { useTheme } from "@/hooks/useTheme";

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

const getSelectStyles = (t: any) => ({
  container: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: t.colors.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${t.colors.border}`,
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
    background: t.colors.bgSecondary,
    color: t.colors.text,
    transition: "all 0.3s ease",
  },
});