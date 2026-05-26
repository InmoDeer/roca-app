"use client";
import { useTheme } from "@/hooks/useTheme";
import { getFieldStyles } from "@/styles/componentStyles";

export function Field({ label, k, form, setForm, type = "text", placeholder = "" }: any) {
  const { t } = useTheme();
  const styles = getFieldStyles(t) as Record<string, React.CSSProperties>;
  
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