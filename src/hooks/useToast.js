import { createContext, useContext, useCallback, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";
import { useTheme } from "./useTheme.jsx";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const { t, mode } = useTheme();

  const toast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const success = useCallback((message) => toast(message, "success"), [toast]);
  const error = useCallback((message) => toast(message, "error"), [toast]);
  const info = useCallback((message) => toast(message, "info"), [toast]);
  const warning = useCallback((message) => toast(message, "warning"), [toast]);

  const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colorMap = {
    success: t.colors.success,
    error: t.colors.danger,
    info: t.colors.primary,
    warning: "#f59e0b",
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      <Toast.Provider>
        {children}
        {toasts.map(({ id, message, type }) => {
          const Icon = iconMap[type];
          const color = colorMap[type];
          return (
            <Toast.Root
              key={id}
              style={{
                background: t.colors.bgCard,
                border: `1px solid ${t.colors.border}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: 12,
                padding: "14px 16px",
                boxShadow: mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.4)"
                  : "0 8px 32px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                animation: "toastSlideIn 0.3s ease",
                fontFamily: t.fonts.family,
              }}
            >
              <Icon size={20} color={color} strokeWidth={2} />
              <Toast.Description style={{ flex: 1, fontSize: 14, color: t.colors.text }}>
                {message}
              </Toast.Description>
            </Toast.Root>
          );
        })}
        <Toast.Viewport
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: 360,
            maxWidth: "calc(100vw - 40px)",
            zIndex: 9999,
            listStyle: "none",
            margin: 0,
            padding: 0,
            outline: "none",
          }}
        />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}