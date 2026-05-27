export const primaryGradient = "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)";

export const getLabelStyle = (t: any) => ({
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: t.colors.textMuted,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

export const getFieldStyles = (t: any) => ({
  container: { marginBottom: 14 },
  label: getLabelStyle(t),
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${t.colors.border}`, fontSize: 15,
    boxSizing: "border-box", outline: "none",
    background: t.colors.bgSecondary, color: t.colors.text,
    transition: "all 0.3s ease",
  },
});

export const getSelectStyles = (t: any) => ({
  container: { marginBottom: 14 },
  label: getLabelStyle(t),
  select: {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1px solid ${t.colors.border}`, fontSize: 15,
    boxSizing: "border-box", outline: "none",
    background: t.colors.bgSecondary, color: t.colors.text,
    transition: "all 0.3s ease",
  },
});

export const getCheckboxStyles = (t: any) => ({
  container: { display: "flex", alignItems: "center", fontSize: 14, cursor: "pointer", padding: "10px 0" },
  input: { display: "none" },
  checkmark: {
    width: 20, height: 20, borderRadius: 6,
    border: `1px solid ${t.colors.border}`, marginRight: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.3s ease", flexShrink: 0,
  },
  check: { color: t.colors.text, fontSize: 14, fontWeight: 700 },
  icon: { marginRight: 8, display: "flex", alignItems: "center" },
  label: { flex: 1, color: t.colors.textSecondary },
});

export const getPropertyCardStyles = (t: any, ec: any) => ({
  card: {
    background: t.colors.bgCard,
    borderRadius: 16,
    border: `1px solid ${t.colors.border}`,
    borderLeft: `4px solid ${ec.dot}`,
    position: "relative",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  cardMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  cardLeft: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontWeight: 700,
    fontSize: 15,
    color: t.colors.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: t.colors.textMuted,
    marginBottom: 4,
  },
  cardPrice: {
    fontWeight: 700,
    fontSize: 14,
    color: t.colors.primary,
  },
  cardRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
  },
  dropdown: {
    background: t.colors.bgCard,
    borderRadius: 12,
    padding: 8,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    position: "absolute",
    right: "100%",
    marginRight: 8,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 50,
    border: `1px solid ${t.colors.border}`,
    minWidth: 140,
  },
  dropItem: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: 14,
    cursor: "pointer",
    borderRadius: 8,
    color: t.colors.text,
  },
  dropItemDanger: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: 14,
    cursor: "pointer",
    borderRadius: 8,
    color: t.colors.danger,
  },
  menuDot: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: t.colors.textMuted,
    padding: 8,
    zIndex: 10,
    position: "relative",
  },
});

export const getPropertyDetailStyles = (t: any, mode: string) => ({
  container: {
    padding: "0 0 80px",
    background: t.colors.bg,
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: mode === 'dark' ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
    borderBottom: `1px solid ${t.colors.border}`,
  },
  backBtn: {
    background: "none",
    border: "none",
    color: t.colors.primary,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    padding: 0,
  },
  iconBtn: {
    background: t.colors.bgSecondary,
    border: `1px solid ${t.colors.border}`,
    color: t.colors.text,
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
  },
  heroWrap: {
    position: "relative" as const,
    cursor: "pointer",
  },
  heroImg: {
    width: "100%",
    height: 260,
    objectFit: "cover" as const,
    display: "block",
  },
  heroBadge: {
    position: "absolute" as const,
    bottom: 16,
    right: 16,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(10px)",
    color: "#ffffff",
    borderRadius: 20,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
  },
  card: {
    background: t.colors.bgCard,
    borderRadius: 16,
    margin: "16px 20px 0",
    padding: 20,
    boxShadow: mode === 'dark' ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    border: `1px solid ${t.colors.border}`,
  },
  name: {
    fontWeight: 800,
    fontSize: 20,
    color: t.colors.text,
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: t.colors.textMuted,
    marginBottom: 12,
  },
  estadoSelect: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "4px 10px",
    cursor: "pointer",
    outline: "none",
    background: t.colors.bgSecondary,
    border: `1px solid ${t.colors.border}`,
    color: t.colors.text,
  },
  precioBlock: {
    fontSize: 18,
    fontWeight: 700,
    color: t.colors.primary,
    marginTop: 8,
  },
  mantBlock: {
    fontSize: 13,
    color: t.colors.textMuted,
    marginTop: 6,
  },
  tabRow: {
    display: "flex",
    gap: 10,
    padding: "16px 20px 0",
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 12,
    border: `1px solid ${t.colors.border}`,
    background: t.colors.bgSecondary,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: t.colors.textMuted,
    transition: "all 0.3s ease",
  },
  tabActive: {
    background: primaryGradient,
    color: "#0a0a0a",
    border: "none",
    boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
  },
  msgBox: {
    margin: "12px 20px 0",
    background: t.colors.bgCard,
    borderRadius: 16,
    padding: 16,
    border: `1px solid ${t.colors.border}`,
  },
  msgPre: {
    fontFamily: "'Outfit',sans-serif",
    fontSize: 14,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    color: t.colors.textSecondary,
    margin: "0 0 16px",
    lineHeight: 1.7,
  },
  msgPreNoBox: {
    fontFamily: "'Outfit',sans-serif",
    fontSize: 14,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    color: t.colors.textSecondary,
    background: "none",
    border: "none",
    padding: 0,
    margin: "0 0 12px",
    lineHeight: 1.6,
  },
  actionGrid: {
    display: "flex",
    gap: 10,
    padding: "16px 20px 0",
    flexWrap: "wrap" as const,
  },
  actionBtn: {
    flex: "1 1 calc(50% - 5px)",
    padding: "14px 0",
    background: t.colors.bgSecondary,
    border: `1px solid ${t.colors.border}`,
    borderRadius: 12,
    textAlign: "center" as const,
    textDecoration: "none",
    color: t.colors.text,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: 12,
    color: t.colors.textMuted,
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    textAlign: "center" as const,
  },
});

const overlayBase = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  zIndex: 100,
};

export const getFormStyles = (theme: any) => ({
  overlay: {
    ...overlayBase,
    display: "flex",
    alignItems: "center",
  },
  modal: {
    background: theme.colors.bg,
    borderRadius: 0,
    width: "100%",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    marginTop: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  title: {
    fontWeight: 800,
    fontSize: 18,
    color: theme.colors.text,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: theme.colors.textMuted,
    padding: 4,
  },
  body: {
    overflowY: "auto" as const,
    padding: "20px 24px",
    flex: 1,
  },
  footer: {
    display: "flex",
    gap: 12,
    padding: "16px 24px",
    borderTop: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    background: theme.colors.bgSecondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    color: theme.colors.text,
  },
  saveBtn: {
    flex: 2,
    padding: 14,
    background: primaryGradient,
    color: "#0a0a0a",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
  },
  section: {
    fontWeight: 800,
    fontSize: 11,
    color: theme.colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: "20px 0 12px",
    paddingBottom: 8,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 14,
  },
  uploadBtn: {
    width: "100%",
    padding: "14px",
    background: theme.colors.bgSecondary,
    border: `1.5px dashed ${theme.colors.border}`,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 14,
    color: theme.colors.text,
    transition: "all 0.3s ease",
  },
  photoGrid: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap" as const,
    marginBottom: 14,
  },
  photoThumbWrap: {
    position: "relative" as const,
    transition: "transform 0.2s ease, border 0.2s ease, background-color 0.2s ease",
    borderRadius: 10,
    overflow: "hidden" as const,
    minWidth: 80,
    minHeight: 80,
  },
  photoThumb: {
    width: 80,
    height: 80,
    objectFit: "cover" as const,
    borderRadius: 10,
    display: "block",
  },
  photoRemove: {
    position: "absolute" as const,
    top: 4,
    right: 4,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 20,
    height: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  dragHandle: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 18,
    color: "#ffffff",
    background: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "grab",
    zIndex: 5,
    letterSpacing: 1,
    pointerEvents: "auto" as const,
    border: "1px solid rgba(255,255,255,0.2)",
  },
  mainPhotoBadge: {
    position: "absolute" as const,
    bottom: 6,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 9,
    fontWeight: 700,
    color: "#ffffff",
    background: primaryGradient,
    borderRadius: 4,
    padding: "2px 8px",
    whiteSpace: "nowrap" as const,
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
});

export const getDialogStyles = (t: any, mode: string, variant: string) => {
  const isBottom = variant === "bottom";
  return {
    overlay: { ...overlayBase },
    content: isBottom
      ? {
          position: "fixed" as const,
          bottom: 0,
          left: 0,
          right: 0,
          background: t.colors.bg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column" as const,
          animation: "slideUp 0.3s ease",
          zIndex: 101,
        }
      : {
          position: "fixed" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: t.colors.bg,
          borderRadius: 24,
          width: "90%",
          maxWidth: 500,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column" as const,
          animation: "scaleIn 0.2s ease",
          zIndex: 101,
        },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 24px",
      borderBottom: `1px solid ${t.colors.border}`,
      flexShrink: 0,
    },
    title: {
      fontWeight: 800,
      fontSize: 18,
      color: t.colors.text,
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: 22,
      cursor: "pointer",
      color: t.colors.textMuted,
      padding: 4,
    },
    body: {
      overflowY: "auto" as const,
      padding: "20px 24px",
      flex: 1,
    },
    footer: {
      display: "flex",
      gap: 12,
      padding: "16px 24px",
      borderTop: `1px solid ${t.colors.border}`,
      flexShrink: 0,
    },
  };
};

export const getAppStyles = (t: any, mode: string) => ({
  app: {
    minHeight: "100vh",
    background: t.colors.bg,
    paddingBottom: 100,
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    background: t.colors.bg,
    color: t.colors.text,
  },
  authWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: t.colors.bg,
    padding: 20,
  },
  authCard: {
    width: "100%",
    maxWidth: 360,
    background: t.colors.bgCard,
    borderRadius: 24,
    padding: 32,
    border: `1px solid ${t.colors.border}`,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1px solid ${t.colors.border}`,
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
    background: t.colors.bgSecondary,
    color: t.colors.text,
    transition: "all 0.3s ease",
  },
  newBtn: {
    background: primaryGradient,
    color: "#0a0a0a",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    padding: "10px 16px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: mode === "dark" ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 20,
    borderBottom: `1px solid ${t.colors.border}`,
  },
  logo: {
    fontWeight: 800,
    fontSize: 22,
    color: t.colors.primary,
    letterSpacing: "2px",
  },
  userTag: {
    fontSize: 13,
    color: t.colors.textMuted,
    marginRight: 12,
  },
  list: {
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  empty: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: t.colors.textMuted,
    fontSize: 14,
  },
  fabBtn: {
    position: "fixed" as const,
    bottom: 88,
    right: 20,
    zIndex: 140,
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: primaryGradient,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(212,175,55,0.4)",
  },
});

export const getDashboardStyles = (t: any, mode: string) => ({
  shell: {
    minHeight: "100vh",
    background: t.colors.bg,
    paddingBottom: 72,
  },
  nav: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "8px 8px max(8px, env(safe-area-inset-bottom))",
    background: mode === "dark" ? "rgba(10,10,10,0.98)" : "rgba(255,255,255,0.98)",
    borderTop: `1px solid ${t.colors.border}`,
    zIndex: 30,
    backdropFilter: "blur(10px)",
  },
  navLink: (active: boolean) => ({
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 2,
    padding: "6px 10px",
    borderRadius: 10,
    fontSize: 10,
    fontWeight: active ? 700 : 500,
    color: active ? t.colors.primary : t.colors.textMuted,
    textDecoration: "none",
    background: active ? (mode === "dark" ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.1)") : "transparent",
  }),
  stubWrap: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    textAlign: "center" as const,
    color: t.colors.textMuted,
  },
  stubTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: t.colors.text,
    marginBottom: 8,
  },
});

export const getProfileMenuStyles = (t: any) => ({
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    zIndex: 40,
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    background: t.colors.bgCard,
    borderRight: `1px solid ${t.colors.border}`,
    padding: "24px 20px",
    zIndex: 50,
    animation: "slideInLeft 0.3s ease",
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1px solid ${t.colors.border}`,
  },
  userInfo: {
    fontWeight: 700,
    fontSize: 18,
    color: t.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: t.colors.textMuted,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "14px 12px",
    background: "none",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 500,
    color: t.colors.text,
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.2s ease",
  },
  divider: {
    height: 1,
    background: t.colors.border,
    margin: "16px 0",
  },
});

export const getChatStyles = (t: any, mode: string) => {
  const isDark = mode === "dark";

  return {
    overlay: {
      position: "fixed" as const,
      inset: 0,
      zIndex: 150,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      pointerEvents: "none" as const,
    },
    panel: {
      pointerEvents: "auto" as const,
      width: "100%",
      maxWidth: 420,
      height: "85dvh",
      maxHeight: 700,
      background: isDark ? "#121212" : "#f5f5f5",
      borderRadius: "20px 20px 0 0",
      display: "flex",
      flexDirection: "column" as const,
      boxShadow: isDark
        ? "0 -8px 40px rgba(0,0,0,0.6)"
        : "0 -4px 24px rgba(0,0,0,0.12)",
      border: `1px solid ${t.colors.border}`,
      borderBottom: "none",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px",
      borderBottom: `1px solid ${t.colors.border}`,
      flexShrink: 0,
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    headerIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: isDark ? "#1a1a1a" : "#ffffff",
      border: `1px solid ${t.colors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontWeight: 700,
      fontSize: 15,
      color: t.colors.text,
    },
    headerSub: {
      fontSize: 11,
      color: t.colors.textMuted,
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    aiToggle: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 600,
      padding: "4px 8px",
      borderRadius: 8,
    },
    closeBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: t.colors.textMuted,
      padding: 4,
      display: "flex",
      alignItems: "center",
    },
    messages: {
      flex: 1,
      overflowY: "auto" as const,
      padding: "16px 14px",
      display: "flex",
      flexDirection: "column" as const,
      gap: 12,
    },
    helpWrap: {
      padding: "10px 14px",
      borderTop: `1px solid ${t.colors.border}`,
      background: isDark ? "#0a0a0a" : "#ececec",
      flexShrink: 0,
    },
    helpTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: t.colors.textMuted,
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      marginBottom: 8,
    },
    helpChips: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 4,
      maxHeight: 180,
      overflowY: "auto" as const,
    },
    helpChip: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "7px 10px",
      borderRadius: 8,
      background: isDark ? "#1a1a1a" : "#ffffff",
      border: `1px solid ${t.colors.border}`,
      cursor: "pointer",
      textAlign: "left" as const,
      gap: 8,
    },
    helpChipLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: t.colors.text,
    },
    helpChipExample: {
      fontSize: 11,
      color: t.colors.textMuted,
      fontStyle: "italic" as const,
    },
    inputWrap: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      borderTop: `1px solid ${t.colors.border}`,
      background: isDark ? "#0a0a0a" : "#ececec",
      flexShrink: 0,
    },
    helpBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 6,
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${t.colors.border}`,
      background: isDark ? "#1a1a1a" : "#ffffff",
      color: t.colors.text,
      fontSize: 14,
      outline: "none",
      fontFamily: t.fonts.family,
    },
    voiceBtn: (active: boolean) => ({
      background: active ? "rgba(239,68,68,0.1)" : "none",
      border: "none",
      cursor: "pointer",
      padding: 6,
      borderRadius: 8,
      display: "flex" as const,
      alignItems: "center",
      flexShrink: 0,
      transition: "all 0.15s ease",
    }),
    sendBtn: (enabled: boolean) => ({
      width: 36,
      height: 36,
      borderRadius: 10,
      border: "none",
      cursor: enabled ? "pointer" : "default",
      background: enabled ? primaryGradient : t.colors.border,
      color: enabled ? "#0a0a0a" : t.colors.textMuted,
      display: "flex" as const,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.15s ease",
    }),
    aiNote: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      color: t.colors.primary,
      padding: "4px 14px 8px",
      background: isDark ? "#0a0a0a" : "#ececec",
    },
  };
};

/* ── PropertyFilters ──────────────────────────────── */

export const getPropertyFiltersStyles = (t: any) => ({
  searchWrap: {
    padding: "16px 20px 0",
    background: t.colors.bg,
    position: "sticky" as const,
    top: 60,
    zIndex: 5,
  },
  searchInputWrap: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute" as const,
    left: 14,
    color: t.colors.textMuted,
    pointerEvents: "none" as const,
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 44px",
    border: `1px solid ${t.colors.border}`,
    borderRadius: 12,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
    background: t.colors.bgSecondary,
    color: t.colors.text,
    transition: "all 0.3s ease",
  },
  filterRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: "12px 20px",
    overflowX: "auto" as const,
    background: t.colors.bg,
  },
  count: {
    padding: "4px 20px 8px",
    fontSize: 12,
    color: t.colors.textMuted,
    fontWeight: 600,
    background: t.colors.bg,
  },
});

/* ── CopyShareBtns ────────────────────────────────── */

export const getCopyShareStyles = (t: any) => ({
  container: {
    display: "flex",
    gap: 10,
  },
  copyBtn: {
    flex: 1,
    padding: "12px",
    background: t.colors.primary,
    color: "#0a0a0a",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
  },
  shareBtn: {
    flex: 1,
    padding: "12px",
    background: t.colors.bgSecondary,
    color: t.colors.text,
    border: `1px solid ${t.colors.border}`,
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
});

/* ── PropertyResultCard ───────────────────────────── */

export const getPropertyResultCardStyles = (t: any, dot: string) => ({
  card: {
    background: t.colors.bgCard,
    border: `1px solid ${t.colors.border}`,
    borderLeft: `3px solid ${dot}`,
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    textAlign: "left" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
    transition: "all 0.15s ease",
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    color: t.colors.text,
    marginBottom: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  subtitle: {
    fontSize: 12,
    color: t.colors.textMuted,
  },
});

/* ── MessageBubble ────────────────────────────────── */

export const getMessageBubbleStyles = (t: any, mode: string, isUser: boolean, isError: boolean) => ({
  container: (align: "flex-end" | "flex-start") => ({
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 6,
    alignItems: align,
  }),
  bubble: (align: "flex-end" | "flex-start", br: string) => ({
    maxWidth: "82%",
    padding: "10px 14px",
    borderRadius: br,
    fontSize: 14,
    lineHeight: 1.55,
    wordBreak: "break-word" as const,
    alignSelf: align,
    background: isUser
      ? primaryGradient
      : isError
        ? mode === "dark" ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)"
        : mode === "dark" ? "#1a1a1a" : "#ffffff",
    color: isUser ? "#0a0a0a" : isError ? t.colors.danger : t.colors.text,
    border: isUser ? "none" : `1px solid ${isError ? t.colors.danger + "44" : t.colors.border}`,
  }),
  loadingDots: {
    display: "flex" as const,
    gap: 4,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: t.colors.textMuted,
  },
  resultsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 6,
    width: "100%",
    maxWidth: 320,
  },
  moreResults: {
    fontSize: 12,
    color: t.colors.textMuted,
    paddingLeft: 4,
  },
  meta: {
    display: "flex" as const,
    gap: 6,
    alignItems: "center",
  },
  timestamp: {
    fontSize: 11,
    color: t.colors.textMuted,
  },
  aiBadge: {
    fontSize: 10,
    color: t.colors.primary,
    display: "flex" as const,
    alignItems: "center",
    gap: 2,
  },
});

/* ── Select ───────────────────────────────────────── */

export const getSelectContentStyles = (t: any, mode: string) => ({
  background: t.colors.bgCard,
  border: `1px solid ${t.colors.border}`,
  borderRadius: t.radius.md,
  padding: 6,
  boxShadow: mode === "dark"
    ? "0 8px 32px rgba(0,0,0,0.5)"
    : "0 8px 32px rgba(0,0,0,0.12)",
  zIndex: 200,
  animation: "scaleIn 0.15s ease",
  fontFamily: t.fonts.family,
});

export const getSelectItemStyles = (t: any) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 12px",
  borderRadius: t.radius.sm,
  cursor: "pointer",
  outline: "none",
  fontSize: 13,
  color: t.colors.text,
  transition: "background 0.15s ease",
});

export const getRocaSelectTriggerStyles = (t: any, mode: string) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderRadius: t.radius.md,
  border: `1.5px solid ${t.colors.border}`,
  background: t.colors.bgSecondary,
  color: t.colors.text,
  fontSize: 15,
  cursor: "pointer",
  outline: "none",
  fontFamily: t.fonts.family,
  transition: "border-color 0.2s ease",
  textAlign: "left" as const,
});

export const getRocaSelectItemStyles = (t: any) => ({
  display: "flex" as const,
  alignItems: "center",
  justifyContent: "space-between",
  padding: "9px 12px",
  borderRadius: t.radius.sm,
  cursor: "pointer",
  outline: "none",
  fontSize: 14,
  color: t.colors.text,
  transition: "background 0.15s ease",
});

/* ── MediaViewer ──────────────────────────────────── */

export const getMediaViewerStyles = (t: any) => ({
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    backdropFilter: "blur(20px)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.3s ease",
    touchAction: "none",
    overscrollBehavior: "none",

    height: "100dvh",
  },
  box: {
    width: "100%",
    maxWidth: 500,
    padding: 20,
    position: "relative" as const,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    maxHeight: "100dvh",
    display: "flex",
    flexDirection: "column" as const,
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
    flexShrink: 0,
  },
  tab: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
  },
  tabActive: {
    background: t.colors.primary,
    color: "#0a0a0a",
  },
  imgContainer: {
    width: "100%",
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    background: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    overflow: "hidden",
    flex: 1,
  },
  iframeWrap: {
    width: "100%",
    minHeight: 0,
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  iframe: {
    width: "100%",
    height: "100%",
    minHeight: "60vh",
    border: "none",
    borderRadius: 16,
  },
  loader: {
    position: "absolute" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: t.colors.primary,
  },
  closeBtn: {
    position: "fixed" as const,
    top: 16,
    right: 16,
    background: "rgba(0,0,0,0.5)",
    border: "none",
    color: "#ffffff",
    fontSize: 22,
    cursor: "pointer",
    zIndex: 210,
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain" as const,
    borderRadius: 16,
    display: "block",
    transition: "opacity 0.3s ease",
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
    willChange: "transform",
  },
  count: {
    textAlign: "center" as const,
    color: t.colors.textMuted,
    fontSize: 13,
    marginTop: 12,
    fontWeight: 500,
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    flexShrink: 0,
  },
  arrow: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#ffffff",
    borderRadius: "50%",
    width: 48,
    height: 48,
    fontSize: 24,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  thumbs: {
    display: "flex",
    gap: 10,
    overflowX: "auto" as const,
    marginTop: 16,
    paddingBottom: 8,
    justifyContent: "center",
    flexShrink: 0,
  },
  thumb: {
    width: 60,
    height: 60,
    objectFit: "cover" as const,
    borderRadius: 10,
    flexShrink: 0,
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
});

/* ── CRM ─────────────────────────────────────────── */

export const getCrmContentStyles = (t: any) => ({
  padding: "14px 16px",
  maxWidth: 680,
  margin: "0 auto",
});

export const getCrmEmptyStateStyles = (t: any) => ({
  textAlign: "center" as const,
  padding: "40px 0",
  color: t.colors.textMuted,
});

export const getCrmInputStyles = (t: any) => ({
  width: "100%",
  padding: "9px 12px",
  fontSize: 14,
  border: `1px solid ${t.colors.border}`,
  borderRadius: t.radius.sm,
  marginBottom: t.spacing.xs,
  boxSizing: "border-box" as const,
  color: t.colors.text,
  background: t.colors.bgCard,
});

export const getCrmSectionTitle = (t: any) => ({
  fontSize: 13,
  fontWeight: 600,
  color: t.colors.textSecondary,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: t.spacing.sm,
  marginTop: 0,
});

export const getCrmRowStyles = () => ({
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 6,
  marginTop: 4,
});

export type CrmButtonVariant = "green" | "blue" | "purple" | "red" | "gray" | "ghost";

function getCrmButtonColors(t: any, mode: string, variant: CrmButtonVariant) {
  const isDark = mode === "dark";
  switch (variant) {
    case "green":
      return { bg: isDark ? "rgba(34,197,94,0.15)" : "#dcfce7", color: isDark ? "#4ade80" : "#16a34a" };
    case "blue":
      return { bg: t.crm.blue, color: "#ffffff" };
    case "purple":
      return { bg: isDark ? "rgba(139,92,246,0.15)" : "#ede9fe", color: isDark ? "#a78bfa" : "#7c3aed" };
    case "red":
      return { bg: isDark ? "rgba(239,68,68,0.15)" : "#fee2e2", color: isDark ? "#f87171" : "#dc2626" };
    case "gray":
      return { bg: isDark ? "rgba(100,116,139,0.15)" : "#f1f5f9", color: t.colors.textSecondary };
    case "ghost":
      return { bg: isDark ? "rgba(100,116,139,0.1)" : "#f1f5f9", color: t.colors.textSecondary, border: `1px solid ${t.colors.border}` };
    default:
      return { bg: t.colors.bgSecondary, color: t.colors.text };
  }
}

export function getCrmButtonStyles(t: any, mode: string, variant: CrmButtonVariant): React.CSSProperties {
  const { bg, color, border } = getCrmButtonColors(t, mode, variant);
  return {
    border: border || "none",
    borderRadius: t.radius.sm,
    cursor: "pointer",
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 500,
    background: bg,
    color,
  };
}

export function getCrmHeaderStyles(t: any, mode: string) {
  return {
    background: t.crm.headerBg,
    color: mode === "dark" ? t.colors.text : t.colors.text,
    padding: `${t.spacing.sm}px ${t.spacing.md}px`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  };
}

export function getCrmTabsStyles(t: any) {
  return {
    display: "flex",
    background: t.colors.bgCard,
    borderBottom: `1px solid ${t.colors.border}`,
    position: "sticky" as const,
    top: 52,
    zIndex: 99,
  };
}

export function getCrmTabStyles(t: any, active: boolean) {
  return {
    flex: 1,
    padding: "12px 4px",
    border: "none",
    cursor: "pointer",
    background: "transparent",
    fontSize: 12,
    fontWeight: active ? 700 : 400,
    color: active ? t.crm.blue : t.colors.textSecondary,
    borderBottom: active ? `2px solid ${t.crm.blue}` : "2px solid transparent",
  };
}

export function getCrmBadgeStyles(t: any, active: boolean) {
  return {
    marginLeft: t.spacing.xs,
    background: active ? t.crm.blue : t.colors.border,
    color: active ? "#ffffff" : t.colors.textSecondary,
    borderRadius: t.radius.sm,
    padding: "1px 6px",
    fontSize: 10,
  };
}

export function getCrmStatsCardStyles(t: any) {
  return {
    background: t.colors.bgCard,
    border: `1px solid ${t.colors.border}`,
    borderRadius: t.radius.sm,
    padding: "10px 8px",
    textAlign: "center" as const,
  };
}

export function getCrmCardStyles(t: any, mode: string, overdue = false) {
  return {
    background: overdue ? (mode === "dark" ? "rgba(239,68,68,0.08)" : "#fff5f5") : t.colors.bgCard,
    border: `1px solid ${overdue ? (mode === "dark" ? "rgba(239,68,68,0.25)" : "#fecaca") : t.colors.border}`,
    borderRadius: t.radius.sm,
    padding: "10px 12px",
    marginBottom: t.spacing.sm,
  };
}

export function getUrgencyColor(score: number, t: any) {
  if (score > 70) return t.colors.danger;
  if (score > 40) return t.crm.orange;
  return t.colors.textMuted;
};