/**
 * Navigation buttons component for Google Maps and Waze links
 */
export function NavButtons({ mapsLink, wazeLink }) {
  return (
    <div style={navButtonsStyles.container}>
      <a
        href={mapsLink}
        target="_blank"
        rel="noreferrer"
        style={{
          ...navButtonsStyles.btn,
          background: "#4285F4",
          color: "#fff",
        }}
      >
        🗺 Google Maps
      </a>
      <a
        href={wazeLink}
        target="_blank"
        rel="noreferrer"
        style={{
          ...navButtonsStyles.btn,
          background: "#00D4FF",
          color: "#1a1a1a",
        }}
      >
        🔵 Waze
      </a>
    </div>
  );
}

const navButtonsStyles = {
  container: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  btn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
  },
};
