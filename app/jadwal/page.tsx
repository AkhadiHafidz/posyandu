"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  MapPin,
  Users,
} from "lucide-react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface Jadwal {
  id: string;
  namaPosyandu: string;
  alamat: string;
  tanggalKegiatan: string;
  jumlahKader: string;
}

export default function JadwalPage() {
  const [dataJadwal, setDataJadwal] =
    useState<Jadwal[]>([]);

  const [filteredData, setFilteredData] =
    useState<Jadwal[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const getData = async () => {
    try {
      const querySnapshot =
        await getDocs(
          collection(
            db,
            "jadwal_posyandu"
          )
        );

      const result: Jadwal[] = [];

      querySnapshot.forEach((document) => {
        const data =
          document.data();

        result.push({
          id: document.id,

          namaPosyandu:
            data.namaPosyandu ||
            "",

          alamat:
            data.alamat || "",

          tanggalKegiatan:
            data.tanggalKegiatan ||
            "",

          jumlahKader:
            data.jumlahKader ||
            "",
        });
      });

      setDataJadwal(result);
      setFilteredData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const filtered =
      dataJadwal.filter(
        (item) =>
          item.namaPosyandu
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredData(filtered);
  }, [search, dataJadwal]);

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete =
      confirm(
        "Yakin ingin menghapus data?"
      );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(
          db,
          "jadwal_posyandu",
          id
        )
      );

      getData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        <Header title="Jadwal Posyandu" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <CalendarDays
                  size={28}
                />
              </div>

              <div>
                <h1 className="text-3xl font-black text-gray-800">
                  Jadwal Posyandu
                </h1>

                <p className="text-gray-500 mt-1">
                  Kelola data
                  kegiatan posyandu
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">

            <div className="flex items-center bg-white border border-green-100 rounded-2xl px-4 py-3 shadow-sm w-full sm:w-[280px]">
              <Search
                size={20}
                className="text-green-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari Posyandu..."
                className="ml-3 w-full outline-none text-sm text-gray-700"
              />
            </div>

            <Link
              href="/jadwal/tambah"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-3 rounded-2xl shadow-lg"
            >
              <Plus size={20} />
              Tambah Jadwal
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

          {!loading &&
            filteredData.map(
              (item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between">

                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <CalendarDays
                        size={28}
                      />
                    </div>

                    <div className="flex items-center gap-2">

                      <Link
                        href={`/jadwal/detail/${item.id}`}
                        className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"
                      >
                        <Eye
                          size={18}
                        />
                      </Link>

                      <Link
                        href={`/jadwal/edit/${item.id}`}
                        className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center"
                      >
                        <Pencil
                          size={18}
                        />
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>

                    </div>
                  </div>

                  <div className="mt-6">

                    <h2 className="text-2xl font-black text-gray-800">
                      {
                        item.namaPosyandu
                      }
                    </h2>

                    <div className="flex items-center gap-3 mt-5 text-gray-600">
                      <CalendarDays
                        size={18}
                      />

                      <span>
                        {
                          item.tanggalKegiatan
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 text-gray-600">
                      <MapPin
                        size={18}
                      />

                      <span>
                        {item.alamat}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 text-gray-600">
                      <Users
                        size={18}
                      />

                      <span>
                        Jumlah
                        Kader :
                        {" "}
                        {
                          item.jumlahKader
                        }
                      </span>
                    </div>

                  </div>
                </div>
              )
            )}

        </div>

        {!loading &&
          filteredData.length ===
            0 && (
            <div className="bg-white rounded-[30px] py-20 text-center shadow-sm mt-8">
              <h2 className="text-3xl font-black text-gray-700">
                Data Tidak Ada
              </h2>

              <p className="text-gray-500 mt-3">
                Belum ada data
                jadwal posyandu
              </p>
            </div>
          )}

        {loading && (
          <div className="bg-white rounded-[30px] py-20 text-center shadow-sm mt-8">
            <h2 className="text-2xl font-semibold text-gray-600">
              Loading...
            </h2>
          </div>
        )}
      </main>
    </div>
  );
}