"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { getDialogStyles } from "@/styles/componentStyles";

export function RocaDialog({ open, onOpenChange, title, children, footer, variant = "bottom" }) {
  const { t, mode } = useTheme();
  const styles = getDialogStyles(t, mode, variant);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={styles.overlay} />
        <Dialog.Content style={styles.content} onOpenAutoFocus={(e) => e.preventDefault()}>
          <div style={styles.header}>
            <Dialog.Title style={styles.title}>{title}</Dialog.Title>
            <Dialog.Close style={styles.closeBtn}>
              <X size={20} strokeWidth={1.5} />
            </Dialog.Close>
          </div>
          <div style={styles.body}>{children}</div>
          {footer && <div style={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}