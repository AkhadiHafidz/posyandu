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
  Clock3,
  MapPin,
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

  kegiatan: string;

  tanggal: string;

  waktu: string;

  lokasi: string;

  keterangan: string;
}

export default function JadwalPage() {

  // STATE
  const [dataJadwal, setDataJadwal] =
    useState<Jadwal[]>([]);

  const [filteredData, setFilteredData] =
    useState<Jadwal[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // GET DATA
  const getData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "jadwal"
          )
        );

      const result: Jadwal[] = [];

      querySnapshot.forEach((doc) => {

        const data = doc.data();

        result.push({
          id: doc.id,

          kegiatan: String(
            data.kegiatan || ""
          ),

          tanggal: String(
            data.tanggal || ""
          ),

          waktu: String(
            data.waktu || ""
          ),

          lokasi: String(
            data.lokasi || ""
          ),

          keterangan:
            String(
              data.keterangan ||
                ""
            ),
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

  // SEARCH
  useEffect(() => {

    const filtered =
      dataJadwal.filter(
        (item) =>
          item.kegiatan
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredData(filtered);

  }, [search, dataJadwal]);

  // DELETE
  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete =
      confirm(
        "Yakin ingin menghapus jadwal?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "jadwal",
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

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-6 md:p-8">

        {/* HEADER */}
        <Header title="Jadwal Posyandu" />

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-8">

          {/* TITLE */}
          <div>

            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <CalendarDays size={28} />
              </div>

              <div>

                <h1 className="text-3xl font-black text-gray-800">
                  Jadwal Posyandu
                </h1>

                <p className="text-gray-500 mt-1">
                  Kelola jadwal kegiatan posyandu
                </p>

              </div>

            </div>

          </div>

          {/* ACTION */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* SEARCH */}
            <div className="flex items-center bg-white border border-green-100 rounded-2xl px-4 py-3 shadow-sm w-full sm:w-[280px]">

              <Search
                size={20}
                className="text-green-600"
              />

              <input
                type="text"
                value={search || ""}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari kegiatan..."
                className="ml-3 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />

            </div>

            {/* BUTTON */}
            <Link
              href="/jadwal/tambah"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-[1.02] transition"
            >

              <Plus size={20} />

              Tambah Jadwal

            </Link>

          </div>

        </div>

        {/* CARD LIST */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

          {!loading &&
            filteredData.map(
              (item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-xl transition"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between">

                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <CalendarDays
                        size={28}
                      />
                    </div>

                    {/* ACTION */}
                    <div className="flex items-center gap-2">

                      {/* DETAIL */}
                      <Link
                        href={`/jadwal/detail/${item.id}`}
                        className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Eye
                          size={18}
                        />
                      </Link>

                      {/* EDIT */}
                      <Link
                        href={`/jadwal/edit/${item.id}`}
                        className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Pencil
                          size={18}
                        />
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>

                    </div>

                  </div>

                  {/* CONTENT */}
                  <div className="mt-6">

                    <h2 className="text-2xl font-black text-gray-800 leading-snug">
                      {item.kegiatan ||
                        "-"}
                    </h2>

                    {/* TANGGAL */}
                    <div className="flex items-center gap-3 mt-5 text-gray-600">

                      <CalendarDays
                        size={18}
                      />

                      <span>
                        {item.tanggal ||
                          "-"}
                      </span>

                    </div>

                    {/* WAKTU */}
                    <div className="flex items-center gap-3 mt-3 text-gray-600">

                      <Clock3
                        size={18}
                      />

                      <span>
                        {item.waktu ||
                          "-"}
                      </span>

                    </div>

                    {/* LOKASI */}
                    <div className="flex items-center gap-3 mt-3 text-gray-600">

                      <MapPin
                        size={18}
                      />

                      <span>
                        {item.lokasi ||
                          "-"}
                      </span>

                    </div>

                    {/* KETERANGAN */}
                    <div className="mt-5">

                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.keterangan ||
                          "-"}
                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

        </div>

        {/* EMPTY */}
        {!loading &&
          filteredData.length ===
            0 && (

            <div className="bg-white rounded-[30px] py-20 text-center shadow-sm mt-8">

              <h2 className="text-3xl font-black text-gray-700">
                Jadwal Tidak Ada
              </h2>

              <p className="text-gray-500 mt-3">
                Belum ada jadwal kegiatan posyandu
              </p>

            </div>
          )}

        {/* LOADING */}
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