import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { SerwistProvider } from "@serwist/turbopack/react";
import type { Metadata, Viewport } from "next";

const APP_NAME = "ROCA";
const APP_DEFAULT_TITLE = "ROCA - Sistema Inmobiliario";
const APP_DESCRIPTION = "Gestión de propiedades inmobiliarias";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: `%s - ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <SerwistProvider swUrl="/serwist/sw.js">
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}