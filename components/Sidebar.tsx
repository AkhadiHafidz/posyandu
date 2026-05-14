"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { auth } from "@/lib/firebase";

export default function Sidebar() {

  const pathname = usePathname();

  // USER LOGIN
  const currentUser = auth.currentUser;

  // CEK ADMIN
  const isAdmin = !!currentUser;

  // MENU
  const menus = [
    { name: "Dashboard", path: "/user" },
    { name: "Data Balita", path: "/balita" },
    { name: "Data ibu hamil", path: "/ibuhamil" },
    { name: "Pemeriksaan", path: "/pemeriksaan" },
    { name: "Laporan", path: "/laporan" },
    { name: "Jadwal", path: "/jadwal" },
  ];

  // MENU ADMIN
  if (isAdmin) {
    menus.push({
      name: "Pengguna",
      path: "/pengguna",
    });
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm p-5">

      {/* LOGO */}
      <h1 className="text-2xl font-bold text-green-600 mb-8">
        Posyandu Cempaka
      </h1>

      {/* MENU */}
      <nav className="flex flex-col gap-2">

        {menus.map((menu, index) => {

          const isActive =
            pathname === menu.path;

          return (
            <Link
              key={index}
              href={menu.path}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              {menu.name}
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}