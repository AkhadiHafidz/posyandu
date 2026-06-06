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

      <main className="flex-1 p-6 md:p-8">
        <Header title="Tambah Data Ibu Hamil" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              Tambah Data Ibu Hamil
            </h1>

            <p className="text-gray-500 mt-2">
              Tambahkan data ibu hamil baru
            </p>
          </div>

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">

            {/* NAMA */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* UMUR */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* USIA KEHAMILAN */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* NO HP */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* ALAMAT */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Alamat
              </label>

              <textarea
                rows={4}
                value={form.alamat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat:
                      e.target.value,
                  })
                }
                placeholder="Alamat lengkap"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
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