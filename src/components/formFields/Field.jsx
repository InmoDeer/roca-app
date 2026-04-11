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
    marginBottom: 12,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 9,
    border: "1.5px solid #e0e0d8",
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
    background: "#fafaf8",
    color: "#1a1a1a",
  },
};
