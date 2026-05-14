"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  ClipboardList,
} from "lucide-react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface Pemeriksaan {
  id: string;

  nama: string;

  tanggal: string;

  beratBadan: string;

  tinggiBadan: string;

  status: string;
}

export default function PemeriksaanPage() {

  // STATE
  const [dataPemeriksaan, setDataPemeriksaan] =
    useState<Pemeriksaan[]>([]);

  const [filteredData, setFilteredData] =
    useState<Pemeriksaan[]>([]);

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
            "pemeriksaan"
          )
        );

      const result: Pemeriksaan[] = [];

      querySnapshot.forEach((doc) => {

        const data = doc.data();

        result.push({
          id: doc.id,

          nama: String(
            data.nama || ""
          ),

          tanggal: String(
            data.tanggal || ""
          ),

          beratBadan:
            String(
              data.beratBadan ||
                ""
            ),

          tinggiBadan:
            String(
              data.tinggiBadan ||
                ""
            ),

          status: String(
            data.status || ""
          ),
        });
      });

      setDataPemeriksaan(result);

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
      dataPemeriksaan.filter(
        (item) =>
          item.nama
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredData(filtered);

  }, [search, dataPemeriksaan]);

  // DELETE
  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete =
      confirm(
        "Yakin ingin menghapus data pemeriksaan?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "pemeriksaan",
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
        <Header title="Pemeriksaan" />

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-8">

          {/* TITLE */}
          <div>

            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                <ClipboardList size={28} />
              </div>

              <div>

                <h1 className="text-3xl font-black text-gray-800">
                  Data Pemeriksaan
                </h1>

                <p className="text-gray-500 mt-1">
                  Kelola data pemeriksaan kesehatan
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
                placeholder="Cari nama..."
                className="ml-3 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />

            </div>

            {/* BUTTON */}
            <Link
              href="/pemeriksaan/tambah"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-[1.02] transition"
            >

              <Plus size={20} />

              Tambah Data

            </Link>

          </div>

        </div>

        {/* TABLE */}
        <div className="mt-8 bg-white rounded-[30px] shadow-sm overflow-hidden overflow-x-auto">

          <table className="w-full min-w-[950px]">

            {/* HEAD */}
            <thead className="bg-green-50 border-b">

              <tr>

                <th className="text-left py-5 px-6 font-bold text-gray-700">
                  Nama
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-700">
                  Tanggal
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-700">
                  Berat Badan
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-700">
                  Tinggi Badan
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-700">
                  Status
                </th>

                <th className="text-center py-5 px-6 font-bold text-gray-700">
                  Action
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {!loading &&
                filteredData.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-green-50 transition"
                    >

                      {/* NAMA */}
                      <td className="py-5 px-6">

                        <div className="flex items-center gap-4">

                          {/* AVATAR */}
                          <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                            {item.nama
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "P"}
                          </div>

                          {/* INFO */}
                          <div>

                            <h2 className="font-bold text-gray-800">
                              {item.nama ||
                                "-"}
                            </h2>

                            <p className="text-sm text-gray-500">
                              Pemeriksaan Balita
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* TANGGAL */}
                      <td className="py-5 px-6 text-gray-600">
                        {item.tanggal ||
                          "-"}
                      </td>

                      {/* BERAT */}
                      <td className="py-5 px-6 text-gray-600">
                        {
                          item.beratBadan
                        }{" "}
                        Kg
                      </td>

                      {/* TINGGI */}
                      <td className="py-5 px-6 text-gray-600">
                        {
                          item.tinggiBadan
                        }{" "}
                        Cm
                      </td>

                      {/* STATUS */}
                      <td className="py-5 px-6">

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold
                            
                            ${
                              item.status ===
                              "Sehat"
                                ? "bg-green-100 text-green-700"
                                : item.status ===
                                  "Monitoring"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >
                          {item.status ||
                            "-"}
                        </span>

                      </td>

                      {/* ACTION */}
                      <td className="py-5 px-6">

                        <div className="flex items-center justify-center gap-3">

                          {/* DETAIL */}
                          <Link
                            href={`/pemeriksaan/detail/${item.id}`}
                            className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <Eye
                              size={18}
                            />
                          </Link>

                          {/* EDIT */}
                          <Link
                            href={`/pemeriksaan/edit/${item.id}`}
                            className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center hover:scale-105 transition"
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
                            className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <Trash2
                              size={18}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

            </tbody>

          </table>

          {/* EMPTY */}
          {!loading &&
            filteredData.length ===
              0 && (

              <div className="py-16 text-center">

                <h2 className="text-2xl font-bold text-gray-700">
                  Data Tidak Ada
                </h2>

                <p className="text-gray-500 mt-2">
                  Belum ada data pemeriksaan
                </p>

              </div>
            )}

          {/* LOADING */}
          {loading && (

            <div className="py-16 text-center">

              <h2 className="text-xl font-semibold text-gray-600">
                Loading...
              </h2>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}