"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface Pasien {
  id: string;
  nama: string;
  nik?: string;
  usiaKehamilan?: string;
}

export default function TambahPemeriksaanPage() {
  const router = useRouter();

  const [jenis, setJenis] =
    useState("Balita");

  const [pasien, setPasien] =
    useState<Pasien[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedPasien, setSelectedPasien] =
    useState<Pasien | null>(null);

    const [usiaKehamilan, setUsiaKehamilan] =
  useState("");

  const [beratBadan, setBeratBadan] =
    useState("");

  const [tinggiBadan, setTinggiBadan] =
    useState("");

  const [tanggal, setTanggal] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [keterangan, setKeterangan] =
    useState("");

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      const result: Pasien[] = [];

      if (jenis === "Balita") {
        const snapshot =
          await getDocs(
            collection(
              db,
              "balita"
            )
          );

        snapshot.forEach((doc) => {
          const data = doc.data();

          result.push({
            id: doc.id,
            nama: data.nama || "",
            nik: data.nik || "",
          });
        });
      } else {
        const snapshot =
          await getDocs(
            collection(
              db,
              "ibu_hamil"
            )
          );

        snapshot.forEach((doc) => {
          const data = doc.data();

          result.push({
            id: doc.id,
            nama: data.nama || "",
            usiaKehamilan:
              data.usiaKehamilan || "",
          });
        });
      }

      setPasien(result);
      setSelectedPasien(null);
      setSearch("");
      setUsiaKehamilan("");
    };

    loadData();
  }, [jenis]);

  const filteredData =
    pasien.filter((item) =>
      item.nama
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const handleSubmit = async () => {
    if (!selectedPasien) {
      alert("Pilih data terlebih dahulu");
      return;
    }

    try {
      await addDoc(
        collection(
          db,
          "pemeriksaan"
        ),
        {
          jenis,

          pasienId:
            selectedPasien.id,

          nama:
            selectedPasien.nama,

          nik:
            selectedPasien.nik || "",

        usiaKehamilan:
        jenis === "Ibu Hamil"
            ? usiaKehamilan
            : "",

          beratBadan,
          tinggiBadan,
          tanggal,
          status,
          keterangan,

          createdAt:
            new Date(),
        }
      );

      alert(
        "Data pemeriksaan berhasil ditambahkan"
      );

      router.push(
        "/pemeriksaan"
      );
    } catch (error) {
      console.log(error);
      alert(
        "Gagal menyimpan data"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        <Header title="Tambah Pemeriksaan" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          <h1 className="text-3xl font-black text-gray-800">
            Tambah Data Pemeriksaan
          </h1>

          <p className="text-gray-500 mt-2">
            Tambahkan data pemeriksaan
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-8">

            {/* JENIS */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Jenis Pemeriksaan
              </label>

              <select
                value={jenis}
                onChange={(e) =>
                  setJenis(
                    e.target.value
                  )
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              >
                <option value="Balita">
                  Balita
                </option>

                <option value="Ibu Hamil">
                  Ibu Hamil
                </option>
              </select>
            </div>

            {/* SEARCH */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Cari Nama
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari nama..."
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />

              {search &&
                !selectedPasien && (
                  <div className="mt-2 border border-green-100 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">

                    {filteredData.map(
                      (item) => (
                        <button
                          key={item.id}
                          type="button"
                        onClick={() => {
                         setSelectedPasien(item);

                         setSearch(item.nama);

                          if (jenis === "Ibu Hamil") {
                            setUsiaKehamilan(
                              item.usiaKehamilan || ""
                                );
                                }
                            }}  
                          className="w-full text-left px-4 py-3 border-b hover:bg-green-50"
                        >
                          <div className="font-bold text-gray-800">
                            {item.nama}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>

            {/* NAMA */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nama
              </label>

              <input
                type="text"
                readOnly
                value={
                  selectedPasien?.nama ||
                  ""
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 bg-gray-50 text-gray-800 font-semibold"
              />
            </div>

            {/* NIK ATAU USIA KEHAMILAN */}
            {jenis === "Balita" ? (
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  NIK
                </label>

                <input
                  type="text"
                  readOnly
                  value={
                    selectedPasien?.nik ||
                    ""
                  }
                  className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 bg-gray-50 text-gray-800 font-semibold"
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
                        placeholder="Masukkan usia kehamilan"
                        className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
                    />
                    </div>
            )}

            {/* BERAT */}
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
                placeholder="contoh: 12"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            {/* TINGGI */}
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
                    placeholder="contoh: 85"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

            {/* TANGGAL */}
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

            {/* STATUS */}
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

            {/* KETERANGAN */}
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
                placeholder="Masukkan keterangan tambahan (opsional)"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              />
            </div>

          </div>

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