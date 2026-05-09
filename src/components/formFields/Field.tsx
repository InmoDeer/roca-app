"use client";
import { useTheme } from "@/hooks/useTheme";

export function Field({ label, k, form, setForm, type = "text", placeholder = "" }: any) {
  const { t } = useTheme();
  const styles = getFieldStyles(t);
  
  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        value={form[k] ?? ""}
        placeholder={placeholder}
        onChange={(e: any) =>
          setForm((f: any) => ({
            ...f,
            [k]:
              type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value,
          }))
        }
      />
    </div>
  );
}

const getFieldStyles = (t: any) => ({
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
  input: {
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