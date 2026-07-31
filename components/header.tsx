"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Dashboard" }: HeaderProps) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [namaUser, setNamaUser] = useState("User");
  const [avatar, setAvatar] = useState("U");
  const [roleUser, setRoleUser] = useState("User");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // ===================
    // ADMIN
    // ===================
    const admin = localStorage.getItem("admin");

    if (admin) {
      setNamaUser("Admin");
      setRoleUser("Admin");
      setAvatar("A");
      return;
    }

    // ===================
    // USER
    // ===================
    const user = localStorage.getItem("user");

    if (user) {
      try {
        const userData = JSON.parse(user);
        const nama = userData.nama || "Kader";
        setNamaUser(nama);
        setRoleUser(userData.role || "Kader");
        setAvatar(nama.charAt(0).toUpperCase());
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth).catch(() => {});

      localStorage.removeItem("admin");
      localStorage.removeItem("user");
      localStorage.removeItem("uid");

      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Gagal logout");
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-sm border border-green-100 px-4 py-3 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex flex-col min-w-0 pr-2">
        <h1 className="text-lg sm:text-xl font-bold text-white truncate">
          {title}
        </h1>
        <p className="text-white/90 text-xs mt-0.5 truncate hidden sm:block">
          Selamat datang di Sistem Posyandu
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative" ref={dropdownRef}>
          {/* TOMBOL PROFIL DENGAN SKEMA WARNA SESUAI GAMBAR */}
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-100/50 px-3 py-1.5 rounded-2xl shadow-sm transition"
          >
            {/* AVATAR: LINGKARAN HIJAU, TEKS PUTIH */}
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
              {avatar}
            </div>

            {/* USER INFO: TEKS GELAP */}
            <div className="hidden sm:block text-left">
              <h2 className="text-sm font-bold text-gray-900 leading-tight">
                {namaUser}
              </h2>
              <p className="text-xs text-gray-500 leading-tight mt-0.5">
                {roleUser}
              </p>
            </div>
          </button>

          {/* DROPDOWN */}
          {showProfile && (
            <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-3 py-2 bg-gray-50 border-b sm:hidden">
                <p className="text-xs font-bold text-gray-800">{namaUser}</p>
                <p className="text-[10px] text-gray-500">{roleUser}</p>
              </div>

              <Link
                href="/profil"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-gray-700 text-sm transition"
              >
                <User size={16} />
                <span>Profile Saya</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 text-red-600 w-full text-left text-sm transition"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}