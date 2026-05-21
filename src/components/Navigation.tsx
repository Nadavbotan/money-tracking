"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Lightbulb, TrendingUp, Target } from "lucide-react";

const links = [
  { href: "/", label: "סקירה", icon: LayoutDashboard },
  { href: "/transactions", label: "תנועות", icon: List },
  { href: "/insights", label: "תובנות", icon: Lightbulb },
  { href: "/goals", label: "יעדים", icon: Target },
  { href: "/net-worth", label: "שווי נקי", icon: TrendingUp },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[60px] ${
                active
                  ? "text-emerald-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
