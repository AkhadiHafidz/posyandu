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
<aside className="w-[210px] min-h-screen bg-gradient-to-b from-green-600 to-emerald-700 text-white p-4 hidden md:flex flex-col justify-between shadow-xl">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div>

  <h1 className="text-2xl font-bold tracking-tight">
    Posyandu Cempaka 2B
  </h1>

          <p className="text-green-100 text-[11px] mt-1 leading-5">
    Sistem Informasi Posyandu Digital
  </p>

</div>

        {/* DIVIDER */}
       <div className="w-full h-[1px] bg-white/20 my-6"></div>

        {/* MENU */}
        <div className="flex flex-col gap-1.5">

          {menus.map((menu, index) => {

            const Icon = menu.icon;

            const isActive = pathname === menu.href;

            return (
              <Link
              key={index}
              href={menu.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-300 group
                  
                  ${
                    isActive
                      ? "bg-white text-green-700 shadow-lg"
                      : "hover:bg-white/20 text-white"
                  }
                `}
              >

                <div
                  className={`
                    w-8 h-8 rounded-xl flex items-center justify-center transition

                    ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-white/10 group-hover:bg-white/20"
                    }
                  `}
                >
                  <Icon size={16} />
                </div>

               <span className="text-sm font-medium">
                  {menu.title}
                </span>

              </Link>
            );
          })}

        </div>
      </div>

      {/* BOTTOM */}
      <div>

      

        

      </div>
    </aside>
  );
}