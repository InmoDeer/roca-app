/**
 * Select dropdown component for forms
 */
export function Select({ label, k, form, setForm, opts }) {
  return (
    <div style={selectStyles.container}>
      <label style={selectStyles.label}>{label}</label>
      <select
        style={selectStyles.select}
        value={form[k] ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
      >
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

const selectStyles = {
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
  select: {
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
