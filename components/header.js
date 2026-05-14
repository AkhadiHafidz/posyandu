"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // nanti kalau pakai firebase tinggal ganti di sini
    router.push("/");
  };

  return (
    <header className="w-full bg-white border-b px-6 py-4 flex justify-end items-center">

   

      {/* PROFILE */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2"
        >
          <img
            src="/profile.png"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg py-2">

            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              👤 Lihat Profile
            </Link>

            <hr className="my-2" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              🚪 Logout
            </button>

          </div>
        )}
      </div>

    </header>
  );
}