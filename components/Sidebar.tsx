"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Baby,
  ClipboardList,
  FileSpreadsheet,
  HeartPulse,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const menus = [
    { title: "Dashboard", href: "/user", icon: LayoutDashboard },
    { title: "Data Balita", href: "/balita", icon: Baby },
    { title: "Data Ibu Hamil", href: "/ibu-hamil", icon: HeartPulse },
    { title: "Pemeriksaan", href: "/pemeriksaan", icon: ClipboardList },
    { title: "Laporan", href: "/laporan", icon: FileSpreadsheet },
  ];

  if (isAdmin) {
    menus.splice(3, 0, {
      title: "Pengguna",
      href: "/pengguna",
      icon: Users,
    });
  }

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-4">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Posyandu Cempaka 2B</h1>
            <p className="text-green-100 text-[11px] mt-1">Sistem Informasi Posyandu Digital</p>
          </div>
          {/* Close button inside mobile menu */}
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-white p-1">
            <X size={24} />
          </button>
        </div>

        <div className="w-full h-[1px] bg-white/20 my-5"></div>

        <div className="flex flex-col gap-1.5">
          {menus.map((menu, index) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;

            return (
              <Link
                key={index}
                href={menu.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive ? "bg-white text-green-700 shadow-lg font-semibold" : "hover:bg-white/20 text-white"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                    isActive ? "bg-green-100 text-green-700" : "bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="text-sm">{menu.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/20 text-white transition text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* HAMBURGER TRIGGER FOR MOBILE */}
      <div className="md:hidden bg-gradient-to-r from-green-600 to-emerald-700 p-4 flex items-center justify-between text-white sticky top-0 z-40 shadow-md">
        <h1 className="text-lg font-bold">Posyandu Cempaka 2B</h1>
        <button onClick={() => setIsMobileOpen(true)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20">
          <Menu size={24} />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-[220px] h-screen sticky top-0 bg-gradient-to-b from-green-600 to-emerald-700 text-white hidden md:block shrink-0 shadow-xl overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER (OVERLAY) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
          <div className="relative w-[260px] h-full bg-gradient-to-b from-green-600 to-emerald-700 text-white z-10 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}