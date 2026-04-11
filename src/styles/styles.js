/**
 * Centralized styles for ROCA App
 * All inline styles organized by component/section
 */

export const S = {
  // Root app
  app: {
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    background: "#f4f4f0",
    minHeight: "100vh",
    maxWidth: 480,
    margin: "0 auto",
    position: "relative",
  },

  // Auth screen
  authWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#1a1a1a",
    padding: 20,
  },
  authCard: {
    background: "#fff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 320,
    textAlign: "center",
  },

  // Top bar
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 16px 12px",
    background: "#1a1a1a",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: -0.5,
  },

  // Buttons
  newBtn: {
    background: "#e8ff4f",
    color: "#1a1a1a",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  signOutBtn: {
    background: "none",
    border: "1px solid #444",
    color: "#aaa",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    cursor: "pointer",
  },

  // Search
  searchWrap: {
    padding: "12px 16px 0",
  },
  searchInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1.5px solid #e0e0d8",
    fontSize: 15,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    color: "#1a1a1a",
  },

  // Filters
  filterRow: {
    display: "flex",
    gap: 8,
    padding: "10px 16px",
    overflowX: "auto",
  },
  filterSelect: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1.5px solid #e0e0d8",
    fontSize: 13,
    background: "#fff",
    flexShrink: 0,
    cursor: "pointer",
    outline: "none",
    color: "#1a1a1a",
  },

  // List
  count: {
    padding: "4px 16px 8px",
    fontSize: 12,
    color: "#888",
    fontWeight: 600,
  },
  list: {
    padding: "0 16px 80px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    padding: "40px 0",
    fontSize: 15,
  },

  // Card
  card: {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    cursor: "pointer",
    border: "1.5px solid #eee",
    position: "relative",
  },
  cardMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    padding: 14,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
    flexShrink: 0,
  },
  cardName: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1a1a1a",
  },

  // Dropdown menu
  menuDot: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: "#888",
    lineHeight: 1,
    padding: "0 2px",
  },
  dropdown: {
    position: "absolute",
    right: 12,
    top: 44,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,.13)",
    zIndex: 50,
    minWidth: 180,
    overflow: "hidden",
    border: "1px solid #eee",
  },
  dropItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "11px 16px",
    background: "none",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    color: "#1a1a1a",
  },
  dropDivider: {
    height: 1,
    background: "#f0f0ec",
    margin: "2px 0",
  },

  // Form common
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
