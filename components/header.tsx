"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import {
  Menu,
  User,
  LogOut,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "@/lib/firebase";

interface HeaderProps {
  title?: string;
}

export default function Header({
  title = "Dashboard",
}: HeaderProps) {

  const router =
    useRouter();

  const [showProfile, setShowProfile] =
    useState(false);

  const [namaUser, setNamaUser] =
    useState("User");

  const [avatar, setAvatar] =
    useState("U");

  const [roleUser, setRoleUser] =
    useState("User");

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

    const userData = JSON.parse(user);

    const nama = userData.nama || "Kader";

    setNamaUser(nama);

    setRoleUser(userData.role || "Kader");

    setAvatar(
      nama.charAt(0).toUpperCase()
    );

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
      <div className="flex items-center gap-2">

        <button className="md:hidden w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
          <Menu size={18} />
        </button>

        <div>

          <h1 className="text-xl font-bold text-white">
            {title}
          </h1>

          <p className="text-white/90 text-xs mt-0.5">
            Selamat datang di Sistem Posyandu
          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        <div className="relative">

          <button
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 px-2.5 py-1.5 rounded-xl"
          >

            {/* AVATAR */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {avatar}
            </div>

            {/* USER */}
            <div className="hidden sm:block text-left">

              <h2 className="text-sm font-semibold text-gray-800">
                {namaUser}
              </h2>

              <p className="text-[11px] text-gray-500">
                {roleUser}
              </p>

            </div>

          </button>

          {/* DROPDOWN */}
          {showProfile && (

            <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">

              <Link
                href="/profil"
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
              >

                <User size={16} />

                Profile Saya

              </Link>

              <button
                onClick={
                  handleLogout
                }
               className="flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 text-red-600 w-full text-left text-sm"
              >

                <LogOut size={16} />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}