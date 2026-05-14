"use client";

import {
  Bell,
  Search,
  Menu,
} from "lucide-react";

interface HeaderProps {
  title?: string;
}

export default function Header({
  title = "Dashboard",
}: HeaderProps) {

  return (
    <header className="w-full bg-white rounded-3xl shadow-sm border border-green-100 px-6 py-5 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* MOBILE MENU */}
        <button className="md:hidden w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
          <Menu size={22} />
        </button>

        {/* TITLE */}
        <div>

          <h1 className="text-3xl font-black text-gray-800">
            {title}
          </h1>

          <p className="text-gray-500 mt-1">
            Selamat datang di Sistem Posyandu
          </p>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="hidden lg:flex items-center bg-green-50 border border-green-100 rounded-2xl px-4 py-3 w-[260px]">

          <Search
            size={20}
            className="text-green-600"
          />

          <input
            type="text"
            placeholder="Cari data..."
            className="bg-transparent outline-none ml-3 text-sm w-full text-gray-700 placeholder:text-gray-400"
          />

        </div>

        {/* NOTIFICATION */}
        <button className="relative w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center hover:scale-105 transition">

          <Bell size={22} />

          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>

        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 px-4 py-2 rounded-2xl">

          {/* AVATAR */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            A
          </div>

          {/* USER */}
          <div className="hidden sm:block">

            <h2 className="font-bold text-gray-800">
              Admin
            </h2>

            <p className="text-sm text-gray-500">
              Administrator
            </p>

          </div>

        </div>
      </div>
    </header>
  );
}