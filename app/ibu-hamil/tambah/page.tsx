"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface IbuHamilForm {
  nik: string;
  nama: string;
  umur: string;
  usiaKehamilan: string;
  noHp: string;
  alamat: string;
}

export default function TambahIbuHamilPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<IbuHamilForm>({
      nik: "",
      nama: "",
      umur: "",
      usiaKehamilan: "",
      noHp: "",
      alamat: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

        if (!/^\d{16}$/.test(form.nik)) {
  alert("NIK harus terdiri dari 16 digit angka.");
  return;
}
      await addDoc(
        collection(db, "ibu_hamil"),
        {
          ...form,
          createdAt: new Date(),
        }
      );

      alert(
        "Data berhasil ditambahkan"
      );

      router.push("/ibu-hamil");
    } catch (error) {
      console.log(error);

      alert(
        "Gagal menambahkan data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 px-4 py-3 overflow-hidden">
        <Header title="Tambah Data Ibu Hamil" />

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm max-w-3xl">

         

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-3 mt-4">

            {/* NIK */}
          <div>
            <label className="text-xs font-semibold text-gray-700">
              NIK
            </label>

            <input
              type="text"
              value={form.nik}
              onChange={(e) =>
                setForm({
                  ...form,
                 nik: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="Masukkan NIK"
              maxLength={16}
              className="w-full mt-2 border border-pink-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>

            {/* NAMA */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Nama Ibu
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
                placeholder="Masukkan nama ibu"
className="w-full mt-2 border border-pink-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* UMUR */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Umur
              </label>

              <input
                type="number"
                value={form.umur}
                onChange={(e) =>
                  setForm({
                    ...form,
                    umur: e.target.value,
                  })
                }
                placeholder="Masukkan umur"
                className="w-full mt-2 border border-pink-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* USIA KEHAMILAN */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Usia Kehamilan (Bulan)
              </label>

              <input
                type="number"
                value={form.usiaKehamilan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    usiaKehamilan:
                      e.target.value,
                  })
                }
                placeholder="Contoh: 6"
               className="w-full mt-2 border border-pink-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
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
                     noHp: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="08xxxxxxxxxx"
               className="w-full mt-2 border border-pink-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* ALAMAT */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Alamat
              </label>

              <textarea
                rows={2}
                value={form.alamat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat:
                      e.target.value,
                  })
                }
                placeholder="Alamat lengkap"
               className="w-full mt-2 border border-pink-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
          >
            {loading
              ? "Menyimpan..."
              : "Simpan Data"}
          </button>

        </div>
      </main>
    </div>
  );
}