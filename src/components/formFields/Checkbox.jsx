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
      {label}
    </label>
  );
}

const checkboxStyles = {
  container: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    cursor: "pointer",
    padding: "8px 0",
  },
  input: {
    marginRight: 8,
  },
};
