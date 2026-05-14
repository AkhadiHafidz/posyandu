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
  LogOut,
  CalendarDays,
  HeartPulse,
} from "lucide-react";

import { auth } from "@/lib/firebase";

export default function Sidebar() {

  const router = useRouter();

  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);

  // CHECK ADMIN
  useEffect(() => {

    

    const unsubscribe = auth.onAuthStateChanged((user) => {

      if (user) {

        setIsAdmin(true);

      } else {

        setIsAdmin(false);

      }
    });

    return () => unsubscribe();

  }, []);

  // LOGOUT
  const handleLogout = async () => {

    

    try {

      await auth.signOut();

      localStorage.removeItem("user");

      router.push("/login");

    } catch (error) {

      console.log(error);

    }
  };

  // MENU
  const menus = [
    {
      title: "Dashboard",
      href: "/user",
      icon: LayoutDashboard,
    },
    {
      title: "Data Balita",
      href: "/balita",
      icon: Baby,
    },
    {
      title: "Data Ibu Hamil",
      href: "/ibu-hamil",
      icon: HeartPulse,
    },
    {
      title: "Pemeriksaan",
      href: "/pemeriksaan",
      icon: ClipboardList,
    },
    {
      title: "Laporan",
      href: "/laporan",
      icon: FileSpreadsheet,
    },
    {
      title: "Jadwal",
      href: "/jadwal",
      icon: CalendarDays,
    },
  ];

  // ADMIN MENU
  if (isAdmin) {

    menus.splice(3, 0, {
      title: "Pengguna",
      href: "/pengguna",
      icon: Users,
    });
  }

  return (
    <aside className="w-[270px] min-h-screen bg-gradient-to-b from-green-600 to-emerald-700 text-white p-6 hidden md:flex flex-col justify-between shadow-2xl">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div>

          <h1 className="text-3xl font-black tracking-tight">
            Posyandu
          </h1>

          <p className="text-green-100 text-sm mt-2 leading-relaxed">
            Sistem Informasi Posyandu Digital
          </p>

        </div>

        {/* DIVIDER */}
        <div className="w-full h-[1px] bg-white/20 my-8"></div>

        {/* MENU */}
        <div className="flex flex-col gap-3">

          {menus.map((menu, index) => {

            const Icon = menu.icon;

            const isActive = pathname === menu.href;

            return (
              <Link
                key={index}
                href={menu.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                  
                  ${
                    isActive
                      ? "bg-white text-green-700 shadow-lg"
                      : "hover:bg-white/20 text-white"
                  }
                `}
              >

                <div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition

                    ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-white/10 group-hover:bg-white/20"
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                <span className="font-medium">
                  {menu.title}
                </span>

              </Link>
            );
          })}

        </div>
      </div>

      {/* BOTTOM */}
      <div>

        {/* USER INFO */}
        <div className="bg-white/10 rounded-2xl p-4 mb-4 backdrop-blur-xl border border-white/10">

          <div className="flex items-center gap-3">

            {/* AVATAR */}
            <div className="w-12 h-12 rounded-full bg-white text-green-700 flex items-center justify-center font-bold text-lg shadow-md">
              {isAdmin ? "A" : "U"}
            </div>

            {/* INFO */}
            <div>

              <h2 className="font-bold">
                {isAdmin ? "Admin" : "User"}
              </h2>

              <p className="text-sm text-green-100">
                {isAdmin
                  ? "Administrator"
                  : "Pengguna Posyandu"}
              </p>

            </div>

          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-white text-green-700 font-semibold py-3 rounded-2xl hover:scale-[1.02] hover:bg-green-50 transition-all duration-300 shadow-lg"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>
    </aside>
  );
}