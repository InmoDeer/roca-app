/**
 * Text input field component used in forms
 */
export function Field({ label, k, form, setForm, type = "text", placeholder = "" }) {
  return (
    <div style={fieldStyles.container}>
      <label style={fieldStyles.label}>{label}</label>
      <input
        style={fieldStyles.input}
        type={type}
        value={form[k] ?? ""}
        placeholder={placeholder}
        onChange={(e) =>
          setForm((f) => ({
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

const fieldStyles = {
  container: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#888888",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
    background: "rgba(255,255,255,0.03)",
    color: "#ffffff",
    transition: "all 0.3s ease",
  },
};