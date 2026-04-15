/**
 * Checkbox component for forms
 */
export function Checkbox({ label, k, form, setForm }) {
  const isChecked = !!form[k];
  
  return (
    <label style={checkboxStyles.container}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) =>
          setForm((f) => ({ ...f, [k]: e.target.checked }))
        }
        style={checkboxStyles.input}
      />
      <span style={{
        ...checkboxStyles.checkmark,
        background: isChecked ? "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)" : "rgba(255,255,255,0.03)",
        borderColor: isChecked ? "#d4af37" : "rgba(255,255,255,0.2)",
      }}>
        {isChecked && <span style={checkboxStyles.check}>✓</span>}
      </span>
      <span style={{
        ...checkboxStyles.label,
        color: isChecked ? "#ffffff" : "#cccccc",
      }}>{label}</span>
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
  },
  input: {
    display: "none",
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.2)",
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
  label: {
    flex: 1,
    transition: "color 0.3s ease",
  },
};