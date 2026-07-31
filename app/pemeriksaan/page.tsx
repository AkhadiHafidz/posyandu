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
} from "lucide-react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Pemeriksaan {
  id: string;
  jenis: string;
  nama: string;
  tanggal: string;
  beratBadan: string;
  tinggiBadan: string;
  status: string;
  createdAt?: any;
}

export default function PemeriksaanPage() {
  const [dataPemeriksaan, setDataPemeriksaan] = useState<Pemeriksaan[]>([]);
  const [filteredData, setFilteredData] = useState<Pemeriksaan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      let querySnapshot;
      try {
        const q = query(
          collection(db, "pemeriksaan"),
          orderBy("createdAt", "desc")
        );
        querySnapshot = await getDocs(q);
      } catch (err) {
        querySnapshot = await getDocs(collection(db, "pemeriksaan"));
      }

      const result: Pemeriksaan[] = [];

      querySnapshot.forEach((document) => {
        const data = document.data();

        let rawStatus = String(data.status || data.statusPertumbuhan || "");
        let formattedStatus = rawStatus;

        const sUpper = rawStatus.toUpperCase();
        if (sUpper === "N" || sUpper.includes("NAIK") || sUpper === "SEHAT") {
          formattedStatus = "Naik";
        } else if (
          sUpper === "T" ||
          sUpper.includes("TETAP") ||
          sUpper === "MONITORING"
        ) {
          formattedStatus = "Tetap";
        } else if (
          sUpper === "O" ||
          sUpper === "B" ||
          sUpper.includes("TURUN") ||
          sUpper === "RESIKO"
        ) {
          formattedStatus = "Turun";
        }

        result.push({
          id: document.id,
          jenis: String(data.jenis || "Balita"),
          nama: String(data.nama || ""),
          tanggal: String(data.tanggal || ""),
          beratBadan: String(data.beratBadan || data.bb || ""),
          tinggiBadan: String(data.tinggiBadan || data.tb || ""),
          status: formattedStatus || "-",
          createdAt: data.createdAt,
        });
      });

      result.sort((a, b) => {
        const timeA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : a.tanggal
          ? new Date(a.tanggal).getTime()
          : 0;
        const timeB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : b.tanggal
          ? new Date(b.tanggal).getTime()
          : 0;
        return timeB - timeA;
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

  useEffect(() => {
    const filtered = dataPemeriksaan.filter((item) =>
      item.nama.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredData(filtered);
  }, [search, dataPemeriksaan]);

  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";

    const parts = tanggal.split("-");
    if (parts.length === 3) {
      const [tahun, bulan, hari] = parts;
      return `${hari}-${bulan}-${tahun}`;
    }

    return tanggal;
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus data pemeriksaan?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "pemeriksaan", id));
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-x-hidden w-full">
        {/* HEADER */}
        <Header title="Pemeriksaan" />

        {/* TOP ACTION AREA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* SEARCH */}
            <div className="flex items-center bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm w-full sm:w-[250px]">
              <Search size={16} className="text-green-600 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama..."
                className="ml-2 w-full outline-none text-xs text-gray-700 placeholder:text-gray-400 bg-transparent"
              />
            </div>

            {/* BUTTON */}
            <Link
              href="/pemeriksaan/tambah"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-md hover:shadow-lg transition shrink-0"
            >
              <Plus size={16} />
              Tambah Data
            </Link>
          </div>
        </div>

        {/* DATA CONTAINER */}
        <div className="mt-4 sm:mt-6">
          {/* LOADING STATE */}
          {loading && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h2 className="text-sm font-semibold text-gray-600">
                Loading...
              </h2>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredData.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700">
                Data Pemeriksaan Tidak Ada
              </h2>
              <p className="text-gray-400 mt-1 text-xs">
                Belum ada data pemeriksaan.
              </p>
            </div>
          )}

          {!loading && filteredData.length > 0 && (
            <>
              {/* TAMPILAN MOBILE (KARTU RINGKAS) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-xl shadow-sm border border-green-50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.nama?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <h2 className="font-semibold text-xs sm:text-sm text-gray-800">
                            {item.nama || "-"}
                          </h2>
                          <p className="text-[10px] text-gray-500">
                            {item.jenis}
                          </p>
                        </div>
                      </div>

                      {/* BADGE STATUS */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === "Naik"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Tetap"
                            ? "bg-amber-100 text-amber-700"
                            : item.status === "Turun"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] py-0.5">
                      <div>
                        <span className="text-gray-400 block text-[10px]">
                          Jenis:
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.jenis || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">
                          Tanggal:
                        </span>
                        <span className="text-gray-700 font-medium">
                          {formatTanggal(item.tanggal)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                      <Link
                        href={`/pemeriksaan/detail/${item.id}`}
                        className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Eye size={14} />
                      </Link>

                      <Link
                        href={`/pemeriksaan/edit/${item.id}`}
                        className="w-7 h-7 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Pencil size={14} />
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* TAMPILAN TABLE (TABLET & LAPTOP) */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-gray-800 text-left border-collapse">
                  <thead className="bg-green-50 border-b border-green-100/80">
                    <tr>
                      <th className="py-4 px-5 text-sm font-semibold text-gray-800">
                        Nama
                      </th>
                      <th className="py-4 px-5 text-sm font-semibold text-gray-800">
                        Jenis
                      </th>
                      <th className="py-4 px-5 text-sm font-semibold text-gray-800">
                        Tanggal
                      </th>
                      <th className="py-4 px-5 text-sm font-semibold text-gray-800">
                        Status
                      </th>
                      <th className="text-center py-4 px-5 text-sm font-semibold text-gray-800">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-green-50/50 transition"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {item.nama?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <h2 className="font-semibold text-sm text-gray-800">
                                {item.nama}
                              </h2>
                              <p className="text-xs text-gray-500">
                                {item.jenis}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-sm text-gray-700">
                          {item.jenis}
                        </td>

                        <td className="py-3.5 px-5 text-sm text-gray-700">
                          {formatTanggal(item.tanggal)}
                        </td>

                        {/* STATUS: NAIK / TETAP / TURUN */}
                        <td className="py-3.5 px-5 text-sm text-gray-700">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === "Naik"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Tetap"
                                ? "bg-amber-100 text-amber-700"
                                : item.status === "Turun"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-5">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/pemeriksaan/detail/${item.id}`}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:scale-105 transition"
                            >
                              <Eye size={16} />
                            </Link>

                            <Link
                              href={`/pemeriksaan/edit/${item.id}`}
                              className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:scale-105 transition"
                            >
                              <Pencil size={16} />
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:scale-105 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}