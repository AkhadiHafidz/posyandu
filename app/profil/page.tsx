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

    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-6 md:p-8">

        <Header title="Profile Saya" />

        <div className="mt-1">

          <div className="bg-white rounded-[30px] shadow-sm p-6 w-full max-w-md">

            {/* FOTO */}
            <div className="flex flex-col items-center">

              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">

                <UserCircle2
                  size={50}
                  className="text-white"
                />

              </div>

              <h1 className="mt-4 text-xl font-black text-gray-800">

                {loading ? "Loading..." : data.nama}

              </h1>

              <p className="text-green-600 font-semibold">

                {loading ? "" : data.role}

              </p>

            </div>

            {/* DATA */}

            <div className="mt-8 space-y-4">

              <div className="border border-green-100 rounded-xl p-4">

                <p className="text-sm text-gray-500">
                  Nama
                </p>

                <h2
                style={{
                    color: "#111827",
                    fontWeight: "700",
                    fontSize: "18px",
                }}
                >
                {data.nama}
                </h2>

              </div>

              <div className="border border-green-100 rounded-xl p-4">

                <p className="text-sm text-gray-500">
                  Username
                </p>

                <h2
                style={{
                    color: "#111827",
                    fontWeight: "700",
                    fontSize: "18px",
                }}
                >
                {data.username}
                </h2>

              </div>

              <div className="border border-green-100 rounded-xl p-4">

                <p className="text-sm text-gray-500">
                  Role
                </p>

                    <h2
                style={{
                    color: "#111827",
                    fontWeight: "700",
                    fontSize: "18px",
                }}
                >
                {data.role}
                </h2>

              </div>

              <div className="border border-green-100 rounded-xl p-4">

                <p className="text-sm text-gray-500">
                  No HP
                </p>

                <h2
                style={{
                    color: "#111827",
                    fontWeight: "700",
                    fontSize: "18px",
                }}
                >
                {data.noHp}
                </h2>

              </div>

            </div>

            {/* BUTTON */}
            {data.role !== "Admin" && (
            <div className="flex gap-3 mt-8">
                
                
              <Link
                href="/profil/edit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 flex items-center justify-center gap-2"
              >

                <Pencil size={18} />

                Edit Profile

            </Link>

              <Link
                href="/profil/password"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 flex items-center justify-center gap-2"
              >

                <Pencil size={18} />

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