"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function PasswordPage() {
  const router = useRouter();

  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
  }, [router]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (!uid) return;

      setSubmitting(true);

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("User tidak ditemukan");
        setSubmitting(false);
        return;
      }

      const data = docSnap.data();

      if (passwordLama !== data.password) {
        alert("Password lama salah");
        setSubmitting(false);
        return;
      }

      if (passwordBaru.length < 6) {
        alert("Password minimal 6 karakter");
        setSubmitting(false);
        return;
      }

      if (passwordBaru !== konfirmasi) {
        alert("Konfirmasi password tidak sama");
        setSubmitting(false);
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
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center text-gray-500">
          Loading...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        <Header title="Ubah Password" />

        <div className="mt-4 sm:mt-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 w-full max-w-md mx-auto md:mx-0">
            <form onSubmit={handleSave}>
              {/* Password Lama */}
              <div className="mb-4">
                <label className="block mb-1.5 text-xs font-semibold text-gray-700">
                  Password Lama
                </label>

                <div className="flex items-center h-[42px] rounded-xl border border-gray-300 px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 transition duration-200">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    placeholder="Masukkan password lama"
                    className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="ml-2 text-gray-500 hover:text-green-600 focus:outline-none"
                  >
                    {showOldPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Baru */}
              <div className="mb-4">
                <label className="block mb-1.5 text-xs font-semibold text-gray-700">
                  Password Baru
                </label>

                <div className="flex items-center h-[42px] rounded-xl border border-gray-300 px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 transition duration-200">
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
                    className="ml-2 text-gray-500 hover:text-green-600 focus:outline-none"
                  >
                    {showNewPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="mb-4">
                <label className="block mb-1.5 text-xs font-semibold text-gray-700">
                  Konfirmasi Password
                </label>

                <div className="flex items-center h-[42px] rounded-xl border border-gray-300 px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 transition duration-200">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={konfirmasi}
                    onChange={(e) => setKonfirmasi(e.target.value)}
                    placeholder="Konfirmasi password"
                    className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="ml-2 text-gray-500 hover:text-green-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/profil")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <ArrowLeft size={16} />
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  <KeyRound size={16} />
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}