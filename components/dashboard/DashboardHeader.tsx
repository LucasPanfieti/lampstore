"use client";

import { logout } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";
import { Store } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useState } from "react";

export default function DashboardHeader({
  user,
  store,
}: {
  user: SupabaseUser;
  store: Store | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between lg:justify-end">
      <div className="lg:hidden w-8" /> {/* Spacer for mobile menu button */}
      <div className="flex items-center gap-3">
        {store && (
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">{store.name}</p>
            <p className="text-xs text-gray-400">lampstore.com/{store.slug}</p>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
