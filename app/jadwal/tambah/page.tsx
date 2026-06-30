"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function TambahProfilPosyanduPage() {
  const router = useRouter();

  const [namaPosyandu, setNamaPosyandu] =
    useState("");

  const [alamat, setAlamat] =
    useState("");

  const [tanggalKegiatan, setTanggalKegiatan] =
    useState("");

  const [jumlahKader, setJumlahKader] =
  useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    if (
      !namaPosyandu ||
      !alamat ||
      !jumlahKader||
      !tanggalKegiatan
    ) {
      alert("Semua data wajib diisi");
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(
          db,
          "jadwal_posyandu"
        ),
        {
          namaPosyandu,
          alamat,
          tanggalKegiatan,
          jumlahKader,
          createdAt:
            new Date(),
        }
      );

      alert(
        "Data berhasil disimpan"
      );

      router.push(
        "/jadwal"
      );
    } catch (error) {
      console.log(error);
      alert(
        "Gagal menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        <Header title="Profil Posyandu" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          <div className="grid gap-5 mt-8">

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nama Posyandu
              </label>

              <input
                type="text"
                value={namaPosyandu}
                onChange={(e) =>
                  setNamaPosyandu(
                    e.target.value
                  )
                }
                placeholder="Contoh: Posyandu Cempaka"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Alamat
              </label>

              <textarea
                rows={4}
                value={alamat}
                onChange={(e) =>
                  setAlamat(
                    e.target.value
                  )
                }
                placeholder="Masukkan alamat lengkap"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Tanggal Kegiatan
              </label>

              <input
                type="date"
                value={tanggalKegiatan}
                onChange={(e) =>
                  setTanggalKegiatan(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

                            <div>
            <label className="text-sm font-semibold text-gray-700">
                Jumlah Kader
            </label>

            <input
                type="number"
                value={jumlahKader}
                onChange={(e) =>
                setJumlahKader(
                    e.target.value
                )
                }
                placeholder="Contoh: 10"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
            />
            </div>

          </div>

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