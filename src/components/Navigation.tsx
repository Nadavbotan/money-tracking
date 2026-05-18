"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, TrendingUp, Target } from "lucide-react";

const links = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/goals", label: "Goals", icon: Target },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 bg-gray-800/50 border border-gray-700/50 rounded-xl p-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              active
                ? "bg-gray-700 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
