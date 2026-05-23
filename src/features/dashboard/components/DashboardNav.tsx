"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { getDashboardStyles } from "@/styles/componentStyles";
import {
  Building2,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
] as const;

export function DashboardNav() {
  const pathname = usePathname();
  const { t, mode } = useTheme();
  const ds = getDashboardStyles(t, mode);

  return (
    <nav style={ds.nav}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} style={ds.navLink(active)}>
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
