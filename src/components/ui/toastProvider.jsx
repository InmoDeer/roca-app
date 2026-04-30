import * as Toast from "@radix-ui/react-toast";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useTheme } from "../../hooks/useTheme.jsx";

/**
 * RocaToastProvider — provider para notificaciones globales
 * 
 * Uso: envolver App con <RocaToastProvider>{children}</RocaToastProvider>
 * потом usar: const { toast } = useToast() en cualquier componente
 */
export function RocaToastProvider({ children }) {
  const { t } = useTheme();

  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 380,
          maxWidth: "calc(100vw - 40px)",
          zIndex: 9999,
          outline: "none",
        }}
      />
    </Toast.Provider>
  );
}

/**
 * ToastItem — componente individual de notificación
 * No usar directamente — usar useToast() hook
 */
export function ToastItem({ open, data, onClose }) {
  const { t, mode } = useTheme();
  const { message, type } = data || {};
  
  if (!open || !message) return null;

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: t.colors.success,
    error: t.colors.danger,
    info: t.colors.primary,
    warning: "#f59e0b",
  };

  const Icon = icons[type] || icons.info;
  const color = colors[type] || colors.info;

  return (
    <Toast.Root
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
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
        animation: "toastSlideIn 0.3s ease forwards",
        fontFamily: t.fonts.family,
      }}
    >
      <Icon size={20} color={color} strokeWidth={2} />
      <Toast.Description style={{ flex: 1, fontSize: 14, color: t.colors.text }}>
        {message}
      </Toast.Description>
      <Toast.Close
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          color: t.colors.textMuted,
          display: "flex",
        }}
      >
        <X size={16} strokeWidth={1.5} />
      </Toast.Close>
    </Toast.Root>
  );
}

/**
 * useToast — hook para mostrar toasts
 * 
 * @returns {{ toast: fn, success: fn, error: fn, info: fn, warning: fn }}
 * 
 * Ejemplo:
 * const { toast } = useToast()
 * toast.success("¡Guardado!")
 * toast.error("Error al guardar")
 */
export { useToast } from "../../hooks/useToast.js";