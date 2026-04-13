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
          <option key={o} value={o} style={{ background: "#1a1a1a", color: "#fff" }}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

const selectStyles = {
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
  select: {
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