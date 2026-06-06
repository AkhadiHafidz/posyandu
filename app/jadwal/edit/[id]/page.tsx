"use client";

import { useEffect, useState } from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface JadwalForm {
  namaPosyandu: string;
  alamat: string;
  tanggalKegiatan: string;
  jumlahKader: string;
}

export default function EditJadwalPage() {
  const router = useRouter();

  const params = useParams();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<JadwalForm>({
      namaPosyandu: "",
      alamat: "",
      tanggalKegiatan: "",
      jumlahKader: "",
    });

  // GET DATA
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(
          db,
          "jadwal_posyandu",
          params.id as string
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          setForm({
            namaPosyandu:
              docSnap.data()
                .namaPosyandu || "",

            alamat:
              docSnap.data()
                .alamat || "",

            tanggalKegiatan:
              docSnap.data()
                .tanggalKegiatan || "",

            jumlahKader:
              docSnap.data()
                .jumlahKader || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [params.id]);

  // UPDATE
  const handleSubmit =
    async () => {
      try {
        setLoading(true);

        await updateDoc(
          doc(
            db,
            "jadwal_posyandu",
            params.id as string
          ),
          {
            namaPosyandu:
              form.namaPosyandu,

            alamat:
              form.alamat,

            tanggalKegiatan:
              form.tanggalKegiatan,

            jumlahKader:
              form.jumlahKader,
          }
        );

        alert(
          "Data berhasil diubah"
        );

        router.push(
          "/jadwal"
        );
      } catch (error) {
        console.log(error);

        alert(
          "Gagal mengubah data"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-6 md:p-8">

        <Header title="Edit Jadwal Posyandu" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          <h1 className="text-3xl font-black text-gray-800">
            Edit Jadwal Posyandu
          </h1>

          <p className="text-gray-500 mt-2">
            Ubah data kegiatan posyandu
          </p>

          <div className="grid gap-5 mt-8">

            {/* NAMA POSYANDU */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nama Posyandu
              </label>

              <input
                type="text"
                value={
                  form.namaPosyandu
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    namaPosyandu:
                      e.target.value,
                  })
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            {/* ALAMAT */}
            <div>
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
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            {/* TANGGAL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Tanggal Kegiatan
              </label>

              <input
                type="date"
                value={
                  form.tanggalKegiatan
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    tanggalKegiatan:
                      e.target.value,
                  })
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            {/* JUMLAH KADER */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Jumlah Kader
              </label>

              <input
                type="number"
                value={
                  form.jumlahKader
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    jumlahKader:
                      e.target.value,
                  })
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

          </div>

          <button
            onClick={
              handleSubmit
            }
            disabled={
              loading
            }
            className="mt-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl"
          >
            {loading
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </button>

        </div>

      </main>

    </div>
  );
}