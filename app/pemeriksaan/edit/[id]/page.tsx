"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function EditPemeriksaanPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [jenis, setJenis] =
    useState("");

  const [nama, setNama] =
    useState("");

  const [nik, setNik] =
    useState("");

  const [usiaKehamilan,
    setUsiaKehamilan] =
    useState("");

  const [beratBadan,
    setBeratBadan] =
    useState("");

  const [tinggiBadan,
    setTinggiBadan] =
    useState("");

  const [tanggal,
    setTanggal] =
    useState("");

  const [status,
    setStatus] =
    useState("");

  const [keterangan,
    setKeterangan] =
    useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(
          db,
          "pemeriksaan",
          params.id as string
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          const data =
            docSnap.data();

          setJenis(
            data.jenis || ""
          );

          setNama(
            data.nama || ""
          );

          setNik(
            data.nik || ""
          );

          setUsiaKehamilan(
            data.usiaKehamilan || ""
          );

          setBeratBadan(
            data.beratBadan || ""
          );

          setTinggiBadan(
            data.tinggiBadan || ""
          );

          setTanggal(
            data.tanggal || ""
          );

          setStatus(
            data.status || ""
          );

          setKeterangan(
            data.keterangan || ""
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [params.id]);

  const handleUpdate =
    async () => {
      try {
        const docRef = doc(
          db,
          "pemeriksaan",
          params.id as string
        );

        await updateDoc(
          docRef,
          {
            usiaKehamilan,
            beratBadan,
            tinggiBadan,
            tanggal,
            status,
            keterangan,
          }
        );

        alert(
          "Data berhasil diperbarui"
        );

        router.push(
          "/pemeriksaan"
        );

      } catch (error) {
        console.log(error);

        alert(
          "Gagal memperbarui data"
        );
      }
    };

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">

        <Header title="Edit Pemeriksaan" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          <h1 className="text-3xl font-black text-gray-800">
            Edit Data Pemeriksaan
          </h1>

          <p className="text-gray-500 mt-2">
            Perbarui data pemeriksaan
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-8">

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Jenis
              </label>

              <input
                type="text"
                value={jenis}
                readOnly
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 bg-gray-50 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nama
              </label>

              <input
                type="text"
                value={nama}
                readOnly
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 bg-gray-50 text-gray-800"
              />
            </div>

            {jenis ===
              "Balita" ? (
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  NIK
                </label>

                <input
                  type="text"
                  value={nik}
                  readOnly
                  className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 bg-gray-50 text-gray-800"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Usia Kehamilan (Bulan)
                </label>

                <input
                  type="number"
                  value={usiaKehamilan}
                  onChange={(e) =>
                    setUsiaKehamilan(
                      e.target.value
                    )
                  }
                  className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Berat Badan (Kg)
              </label>

              <input
                type="number"
                value={beratBadan}
                onChange={(e) =>
                  setBeratBadan(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Tinggi Badan (Cm)
              </label>

              <input
                type="number"
                value={tinggiBadan}
                onChange={(e) =>
                  setTinggiBadan(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Tanggal Pemeriksaan
              </label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) =>
                  setTanggal(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              >
                <option value="">
                  Pilih Status
                </option>

                <option value="Sehat">
                  Sehat
                </option>

                <option value="Monitoring">
                  Monitoring
                </option>

                <option value="Perlu Tindakan">
                  Perlu Tindakan
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Keterangan
              </label>

              <textarea
                rows={4}
                value={keterangan}
                onChange={(e) =>
                  setKeterangan(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

          </div>

          <button
            onClick={handleUpdate}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
          >
            Simpan Perubahan
          </button>

        </div>
      </main>
    </div>
  );
}