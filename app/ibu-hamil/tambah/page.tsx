"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface IbuHamilForm {
  nik: string;
  nama: string;
  umur: string;
  usiaKehamilan: string;
  tanggalLahir: string;
  noHp: string;
  rt: string;
  rw: string;
  alamat: string;
}

export default function TambahIbuHamilPage() {
  const router = useRouter();

  const [form, setForm] = useState<IbuHamilForm>({
    nik: "",
    nama: "",
    umur: "",
    usiaKehamilan: "",
    tanggalLahir: "",
    noHp: "",
    rt: "",
    rw: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!/^\d{16}$/.test(form.nik)) {
      alert("NIK harus terdiri dari 16 digit angka.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "ibu_hamil"), {
        ...form,
        createdAt: new Date(),
      });

      alert("Data berhasil ditambahkan");
      router.push("/ibu-hamil");
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan data");
    } finally {
      setLoading(false);
    }
  };

  // Class styling universal persis seperti pada halaman Balita & Edit Ibu Hamil
  const inputStyle =
    "w-full mt-1.5 sm:mt-2 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition duration-200";

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        <Header title="Tambah Data Ibu Hamil" />

        <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm max-w-3xl mx-auto md:mx-0">
          <form onSubmit={handleSubmit}>
            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-2">
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
                  className={inputStyle}
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
                  className={inputStyle}
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
                  className={inputStyle}
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
                      usiaKehamilan: e.target.value,
                    })
                  }
                  placeholder="Contoh: 6"
                  className={inputStyle}
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
                  className={`${inputStyle} bg-white cursor-pointer`}
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
                  className={inputStyle}
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
                  className={inputStyle}
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
                  className={inputStyle}
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
                      alamat: e.target.value,
                    })
                  }
                  placeholder="Alamat lengkap"
                  className={inputStyle}
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}