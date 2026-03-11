"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  BarChart2,
  ExternalLink,
  X,
  Menu,
} from "lucide-react";
import { Store } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Produtos", icon: Package },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default function DashboardSidebar({ store }: { store: Store | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/logo_lampstore.webp"
            alt="LampStore"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span
            className="text-xl"
            style={{
              fontFamily: "var(--font-nunito), sans-serif",
              fontWeight: 800,
            }}
          >
            <span style={{ color: "#1e1b4b" }}>Lamp</span>
            <span style={{ color: "#7723A4" }}>Store</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-purple-500" : "text-gray-400",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {store && (
        <div className="p-4 border-t border-gray-100">
          <Link
            href={`/${store.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            Ver minha loja
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 hidden lg:block">
        <SidebarContent />
      </aside>
    </>
  );
}
