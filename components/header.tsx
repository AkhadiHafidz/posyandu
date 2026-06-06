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
  onAuthStateChanged,
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

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {

          // ADMIN
          if (
            firebaseUser?.email ===
            "admin@gmail.com"
          ) {

            setNamaUser(
              "Admin"
            );

            setRoleUser(
              "Admin"
            );

            setAvatar(
              "A"
            );

            return;
          }

          // KADER
          const user =
            localStorage.getItem(
              "user"
            );

          if (user) {

            const userData =
              JSON.parse(
                user
              );

            const nama =
              userData.nama ||
              "Kader";

            setNamaUser(
              nama
            );

            setRoleUser(
              userData.role ||
              "Kader"
            );

            setAvatar(
              nama
                .charAt(0)
                .toUpperCase()
            );
          }
        }
      );

    return () =>
      unsubscribe();

  }, []);

  const handleLogout =
    async () => {

      try {

        await signOut(auth);

        localStorage.removeItem(
          "user"
        );

        router.push("/");

      } catch (error) {

        console.log(error);

        alert(
          "Gagal logout"
        );

      }

    };

  return (
    <header className="w-full bg-white rounded-3xl shadow-sm border border-green-100 px-6 py-5 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <button className="md:hidden w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
          <Menu size={22} />
        </button>

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

        <div className="relative">

          <button
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
            className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 px-4 py-2 rounded-2xl"
          >

            {/* AVATAR */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {avatar}
            </div>

            {/* USER */}
            <div className="hidden sm:block text-left">

              <h2 className="font-bold text-gray-800">
                {namaUser}
              </h2>

              <p className="text-sm text-gray-500">
                {roleUser}
              </p>

            </div>

          </button>

          {/* DROPDOWN */}
          {showProfile && (

            <div className="absolute right-0 top-20 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

              <Link
                href="/profil"
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-gray-700"
              >

                <User size={18} />

                Profil Saya

              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-600 w-full text-left"
              >

                <LogOut size={18} />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}