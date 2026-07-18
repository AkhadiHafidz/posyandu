"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { ArrowLeft, 
    KeyRound,
    Eye,
    EyeOff
  } from "lucide-react";

import { db } from "@/lib/firebase";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function PasswordPage() {

  const router = useRouter();

  const [uid, setUid] = useState("");

  const [loading, setLoading] = useState(true);

  const [passwordLama, setPasswordLama] = useState("");

  const [passwordBaru, setPasswordBaru] = useState("");

  const [konfirmasi, setKonfirmasi] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);

const [showNewPassword, setShowNewPassword] = useState(false);

const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {

    const admin = localStorage.getItem("admin");

    if (admin) {

      alert("Admin tidak dapat mengubah password.");

      router.push("/profil");

      return;

    }

    const uid = localStorage.getItem("uid");

    if (!uid) {

      router.push("/");

      return;

    }

    setUid(uid);

    setLoading(false);

  }, []);

  const handleSave = async () => {

    try {

      if (!uid) return;

      const docRef = doc(db, "users", uid);

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {

        alert("User tidak ditemukan");

        return;

      }

      const data = docSnap.data();

      if (passwordLama !== data.password) {

        alert("Password lama salah");

        return;

      }

      if (passwordBaru.length < 6) {

        alert("Password minimal 6 karakter");

        return;

      }

      if (passwordBaru !== konfirmasi) {

        alert("Konfirmasi password tidak sama");

        return;

      }

      await updateDoc(docRef, {

        password: passwordBaru,

      });

      alert("Password berhasil diubah");

      router.push("/profil");

    } catch (error) {

      console.log(error);

      alert("Gagal mengubah password");

    }

  };

  return (

    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />


       <main className="flex-1 p-3 sm:p-4 lg:p-5 overflow-hidden">

        <Header title="Ubah Password" />

        <div className="mt-6">

          <div className="bg-white rounded-2xl shadow-sm p-4 w-full max-w-sm">

      {/* Password Lama */}
<div className="mb-3">
  <label className="block mb-1 text-xs font-semibold text-gray-700">
    Password Lama
  </label>

  <div
    className="
      flex
      items-center
      h-11
      rounded-xl
      border
      border-green-200
      px-3
      focus-within:border-green-500
      transition-all
      duration-200
    "
  >
    <input
      type={showOldPassword ? "text" : "password"}
      value={passwordLama}
      onChange={(e) => setPasswordLama(e.target.value)}
      placeholder="Masukkan password lama"
      className="
        flex-1
        h-full
        bg-transparent
        border-none
        outline-none
        focus:outline-none
        focus:ring-0
        text-gray-800
        placeholder:text-gray-400
      "
    />

    <button
      type="button"
      onClick={() => setShowOldPassword(!showOldPassword)}
      className="ml-3 text-gray-500 hover:text-green-600"
    >
      {showOldPassword ? (
        <EyeOff size={16} />
      ) : (
        <Eye size={16} />
      )}
    </button>
  </div>
</div>

            <div className="mb-4">
  <label className="block mb-1 text-xs font-semibold text-gray-700">
    Password Baru
  </label>

  <div className="flex items-center h-14 rounded-xl border border-gray-300 px-4 focus-within:border-black transition-all duration-200">

    <input 
      type={showNewPassword ? "text" : "password"}
      value={passwordBaru}
      onChange={(e) => setPasswordBaru(e.target.value)}
      placeholder="Masukkan password baru"
      className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
    />

    <button
      type="button"
      onClick={() => setShowNewPassword(!showNewPassword)}
      className="ml-3 text-gray-500 hover:text-green-600"
    >
      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>

  </div>
</div>

            <div className="mb-4">
  <label className="block mb-1 text-xs font-semibold text-gray-700">
    Konfirmasi Password
  </label>

  <div className="flex items-center h-14 rounded-xl border border-gray-300 px-4 focus-within:border-black transition-all duration-200">

    <input
      type={showConfirmPassword ? "text" : "password"}
      value={konfirmasi}
      onChange={(e) => setKonfirmasi(e.target.value)}
      placeholder="Konfirmasi password"
      className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-gray-800 placeholder:text-gray-400"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="ml-3 text-gray-500 hover:text-green-600"
    >
      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>

  </div>
</div>

            {/* Button */}

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => router.push("/profil")}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2"
              >

                <ArrowLeft size={16} />

                Batal

              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2"
              >

                <KeyRound size={16} />

                Simpan

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}