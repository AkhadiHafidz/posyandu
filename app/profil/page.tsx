"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  UserCircle2,
  Pencil,
  KeyRound,
} from "lucide-react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
} from "firebase/auth";

interface ProfileData {
  nama: string;
  username: string;
  role: string;
  noHp: string;
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({
    nama: "",
    username: "",
    role: "",
    noHp: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        // ==========================
        // ADMIN
        // ==========================
        if (firebaseUser?.email === "admin@gmail.com") {
          setData({
            nama: "Admin",
            username: "admin",
            role: "Admin",
            noHp: "-",
          });

          setLoading(false);
          return;
        }

        // ==========================
        // USER
        // ==========================
        const uid = localStorage.getItem("uid");

        console.log("UID =", uid);

        if (!uid) {
          console.log("UID tidak ada");
          setLoading(false);
          return;
        }

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        console.log("Doc Exists =", docSnap.exists());

        if (docSnap.exists()) {
          const user = docSnap.data();

          setData({
            nama: user.nama || "-",
            username: user.username || "-",
            role: user.role || "-",
            noHp: user.noHp || "-",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        {/* HEADER */}
        <Header title="Profile Saya" />

        <div className="mt-4 sm:mt-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 w-full max-w-md mx-auto md:mx-0">
            {/* FOTO & HEADER PROFILE */}
            <div className="flex flex-col items-center border-b border-gray-100 pb-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <UserCircle2
                  size={44}
                  className="text-white"
                />
              </div>

              <h1 className="mt-3 text-base sm:text-lg font-bold text-gray-800 text-center break-words">
                {loading ? "Loading..." : data.nama}
              </h1>

              <p className="text-xs text-green-600 font-semibold capitalize mt-0.5">
                {loading ? "" : data.role}
              </p>
            </div>

            {/* DETAIL DATA PROFILE */}
            <div className="mt-5 space-y-4">
              {/* NAMA */}
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <h2 className="mt-1 text-sm font-semibold text-gray-800 break-words">
                  {loading ? "-" : data.nama}
                </h2>
              </div>

              {/* USERNAME */}
              <div>
                <p className="text-xs text-gray-500">Username</p>
                <h2 className="mt-1 text-sm font-semibold text-gray-800 break-words">
                  {loading ? "-" : data.username}
                </h2>
              </div>

              {/* ROLE */}
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <h2 className="mt-1 text-sm font-semibold text-gray-800 capitalize">
                  {loading ? "-" : data.role}
                </h2>
              </div>

              {/* NO HP */}
              <div>
                <p className="text-xs text-gray-500">No HP</p>
                <h2 className="mt-1 text-sm font-semibold text-gray-800 break-words">
                  {loading ? "-" : data.noHp}
                </h2>
              </div>
            </div>

            {/* BUTTON APLIKASI */}
            {!loading && data.role !== "Admin" && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-2">
                <Link
                  href="/profil/edit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <Pencil size={16} />
                  Edit Profile
                </Link>

                <Link
                  href="/profil/password"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <KeyRound size={16} />
                  Ubah Password
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}