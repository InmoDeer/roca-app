/**
 * Checkbox component for forms
 */
export function Checkbox({ label, k, form, setForm }) {
  return (
    <label style={checkboxStyles.container}>
      <input
        type="checkbox"
        checked={!!form[k]}
        onChange={(e) =>
          setForm((f) => ({ ...f, [k]: e.target.checked }))
        }
        style={checkboxStyles.input}
      />
      <span style={checkboxStyles.checkmark}></span>
      <span style={checkboxStyles.label}>{label}</span>
    </label>
  );
}

const checkboxStyles = {
  container: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    cursor: "pointer",
    padding: "10px 0",
    color: "#cccccc",
  },
  input: {
    display: "none",
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.03)",
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  label: {
    flex: 1,
  },
};