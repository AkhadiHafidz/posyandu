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

interface BalitaForm {
  nama: string;

  jk: string;

  umur: string;

  ibu: string;

  alamat: string;
}

export default function TambahBalitaPage() {

  const router = useRouter();

  // FORM
  const [form, setForm] =
    useState<BalitaForm>({
      nama: "",
      jk: "",
      umur: "",
      ibu: "",
      alamat: "",
    });

  // SUBMIT
  const handleSubmit = async () => {

    try {

      await addDoc(
        collection(db, "balita"),
        {
          ...form,
          createdAt:
            new Date(),
        }
      );

      alert(
        "Data berhasil ditambahkan"
      );

      router.push("/balita");

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-6 md:p-8">

        <Header title="Tambah Data Balita" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          <div>

            <h1 className="text-3xl font-black text-gray-800">
              Tambah Data Balita
            </h1>

            <p className="text-gray-500 mt-2">
              Tambahkan data balita baru
            </p>

          </div>

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">

            {/* NAMA */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Nama Balita
              </label>

              <input
                type="text"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama:
                      e.target.value,
                  })
                }
                placeholder="Nama balita"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3"
              />

            </div>

            {/* JK */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Jenis Kelamin
              </label>

              <select
                value={form.jk}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jk:
                      e.target.value,
                  })
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3"
              >

                <option value="">
                  Pilih Jenis Kelamin
                </option>

                <option value="Laki-laki">
                  Laki-laki
                </option>

                <option value="Perempuan">
                  Perempuan
                </option>

              </select>

            </div>

            {/* UMUR */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Umur
              </label>

              <input
                type="text"
                value={form.umur}
                onChange={(e) =>
                  setForm({
                    ...form,
                    umur:
                      e.target.value,
                  })
                }
                placeholder="2 Tahun"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3"
              />

            </div>

            {/* IBU */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Nama Ibu
              </label>

              <input
                type="text"
                value={form.ibu}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ibu:
                      e.target.value,
                  })
                }
                placeholder="Nama ibu"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3"
              />

            </div>

            {/* ALAMAT */}
            <div className="md:col-span-2">

              <label className="text-sm font-semibold text-gray-700">
                Alamat
              </label>

              <textarea
                value={form.alamat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat:
                      e.target.value,
                  })
                }
                rows={4}
                placeholder="Alamat lengkap"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3"
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
          >
            Simpan Data
          </button>

        </div>

      </main>
    </div>
  );
}