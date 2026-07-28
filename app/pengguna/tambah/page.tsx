"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";
import { Eye, EyeOff } from "lucide-react"; // Import icon mata

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PenggunaForm {
  nama: string;
  username: string;
  password: string;
  konfirmasiPassword: string;
  noHp: string;
}

export default function TambahPenggunaPage() {
  const router = useRouter();

  const [form, setForm] = useState<PenggunaForm>({
    nama: "",
    username: "",
    password: "",
    konfirmasiPassword: "",
    noHp: "",
  });

  const [loading, setLoading] = useState(false);

  // State untuk toggle visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (
      !form.nama ||
      !form.username ||
      !form.password ||
      !form.konfirmasiPassword
    ) {
      alert("Semua data wajib diisi.");
      return;
    }

    if (form.password !== form.konfirmasiPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "users"), {
        nama: form.nama,
        username: form.username.toLowerCase(),
        password: form.password,
        noHp: form.noHp,
        role: "user", // otomatis user
        createdAt: new Date(),
      });

      alert("Pengguna berhasil ditambahkan.");
      router.push("/pengguna");
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan pengguna.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">
        <Header title="Tambah Pengguna" />

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm max-w-3xl">
          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {/* NAMA LENGKAP */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
                placeholder="Masukkan nama"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-green-500 transition-all"
              />
            </div>

            {/* USERNAME */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                placeholder="Masukkan username"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-green-500 transition-all"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-2 flex items-center h-10 rounded-xl border border-green-200 px-3 focus-within:border-green-500 transition-all duration-200">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Masukkan password"
                  className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-green-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Konfirmasi Password
              </label>
              <div className="mt-2 flex items-center h-10 rounded-xl border border-green-200 px-3 focus-within:border-green-500 transition-all duration-200">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.konfirmasiPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      konfirmasiPassword: e.target.value,
                    })
                  }
                  placeholder="Konfirmasi password"
                  className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {/* NO HP */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                No HP
              </label>
              <input
                type="text"
                value={form.noHp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    noHp: e.target.value,
                  })
                }
                placeholder="08xxxxxxxxxx"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-green-500 transition-all"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </main>
    </div>
  );
}