"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BalitaForm {
  nik: string;
  nama: string;
  jk: string;
  umur: string;
  NamaOrtu: string;
  tanggalLahir: string;
  rt: string;
  rw: string;
  alamat: string;
}

export default function TambahBalitaPage() {
  const router = useRouter();

  // FORM
  const [form, setForm] = useState<BalitaForm>({
    nik: "",
    nama: "",
    jk: "",
    umur: "",
    NamaOrtu: "",
    tanggalLahir: "",
    rt: "",
    rw: "",
    alamat: "",
  });

  // SUBMIT
  const handleSubmit = async () => {
    if (!/^\d{16}$/.test(form.nik)) {
      alert("NIK harus terdiri dari 16 digit angka.");
      return;
    }

    try {
      await addDoc(collection(db, "balita"), {
        ...form,
        createdAt: new Date(),
      });

      alert("Data berhasil ditambahkan");
      router.push("/balita");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 px-4 py-3">
        <Header title="Tambah Data Balita" />

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
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* NAMA */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Nama Balita
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
                placeholder="Nama balita"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* JK */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Jenis Kelamin
              </label>
              <select
                value={form.jk}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jk: e.target.value,
                  })
                }
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* UMUR */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Umur
              </label>
              <input
                type="text"
                value={form.umur}
                onChange={(e) =>
                  setForm({
                    ...form,
                    umur: e.target.value,
                  })
                }
                placeholder="Umur"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* IBU */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Nama Ortu
              </label>
              <input
                type="text"
                value={form.NamaOrtu}
                onChange={(e) =>
                  setForm({
                    ...form,
                    NamaOrtu: e.target.value,
                  })
                }
                placeholder="Nama Ortu"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* TANGGAL LAHIR */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={form.tanggalLahir}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tanggalLahir: e.target.value,
                  })
                }
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* RT */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                RT
              </label>
              <input
                type="text"
                value={form.rt}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rt: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="001"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* RW */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                RW
              </label>
              <input
                type="text"
                value={form.rw}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rw: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="002"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* ALAMAT */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Alamat
              </label>
              <textarea
                value={form.alamat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat: e.target.value,
                  })
                }
                rows={2}
                placeholder="Alamat lengkap"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition"
          >
            Simpan Data
          </button>
        </div>
      </main>
    </div>
  );
}