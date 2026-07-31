"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Balita {
  id: string;
  nama: string;
  jk: string;
  NamaOrtu: string;
  alamat: string;
}

export default function BalitaPage() {
  const [dataBalita, setDataBalita] = useState<Balita[]>([]);
  const [filteredData, setFilteredData] = useState<Balita[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "balita"));
      const result: Balita[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        result.push({
          id: doc.id,
          nama: String(data.nama || ""),
          jk: String(data.jk || ""),
          NamaOrtu: String(data.NamaOrtu || ""),
          alamat: String(data.alamat || ""),
        });
      });

      result.sort((a, b) => a.nama.localeCompare(b.nama));
      setDataBalita(result);
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
    const filtered = dataBalita.filter((item) =>
      item.nama.toLowerCase().includes(search.toLowerCase())
    );
    filtered.sort((a, b) => a.nama.localeCompare(b.nama));
    setFilteredData(filtered);
  }, [search, dataBalita]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data?")) return;
    try {
      await deleteDoc(doc(db, "balita", id));
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
        <Header title="Data Balita" />

        {/* TOP ACTION AREA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* SEARCH */}
            <div className="flex items-center bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm w-full sm:w-[250px]">
              <Search size={16} className="text-green-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama balita..."
                className="ml-2 w-full outline-none text-xs text-gray-700 placeholder:text-gray-400 bg-transparent"
              />
            </div>

            {/* BUTTON */}
            <Link
              href="/balita/tambah"
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
              <h2 className="text-sm font-semibold text-gray-500">
                Data Tidak Ada
              </h2>
              <p className="text-gray-400 mt-1 text-xs">
                Belum ada data balita
              </p>
            </div>
          )}

          {!loading && filteredData.length > 0 && (
            <>
              {/* TAMPILAN MOBILE (KARTU / CARD RINGKAS SAMA SEPERTI IBU HAMIL) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-xl shadow-sm border border-green-50 flex flex-col gap-2.5"
                  >
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            item.jk === "Laki-laki"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          {item.nama?.charAt(0)?.toUpperCase() || "B"}
                        </div>
                        <div>
                          <h2 className="font-semibold text-xs sm:text-sm text-gray-800">
                            {item.nama || "-"}
                          </h2>
                          <p className="text-[10px] text-gray-500">Balita</p>
                        </div>
                      </div>
                    </div>

                    {/* CARD BODY */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] py-0.5">
                      <div>
                        <span className="text-gray-400 block text-[10px]">
                          Jenis Kelamin:
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.jk || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">
                          Nama Ortu:
                        </span>
                        <span className="text-gray-700 font-medium truncate block">
                          {item.NamaOrtu || "-"}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block text-[10px]">
                          Alamat:
                        </span>
                        <span className="text-gray-700 font-medium truncate block">
                          {item.alamat || "-"}
                        </span>
                      </div>
                    </div>

                    {/* CARD ACTION */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                      <Link
                        href={`/balita/detail/${item.id}`}
                        className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Eye size={14} />
                      </Link>

                      <Link
                        href={`/balita/edit/${item.id}`}
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
                <table className="w-full text-left border-collapse">
                  <thead className="bg-green-50 border-b">
                    <tr>
                      <th className="py-4 px-5 text-gray-700 text-sm font-semibold">
                        Nama Balita
                      </th>
                      <th className="py-4 px-5 text-gray-700 text-sm font-semibold">
                        Jenis Kelamin
                      </th>
                      <th className="py-4 px-5 text-gray-700 text-sm font-semibold">
                        Nama Ortu
                      </th>
                      <th className="py-4 px-5 text-gray-700 text-sm font-semibold">
                        Alamat
                      </th>
                      <th className="py-4 px-5 text-gray-700 text-sm font-semibold text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-green-50/50 transition"
                      >
                        <td className="py-4 px-5 text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                                item.jk === "Laki-laki"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-pink-100 text-pink-600"
                              }`}
                            >
                              {item.nama?.charAt(0).toUpperCase() || "B"}
                            </div>
                            <div>
                              <h2 className="font-semibold text-sm text-gray-800">
                                {item.nama || "-"}
                              </h2>
                              <p className="text-xs text-gray-500">Balita</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-600">
                          {item.jk || "-"}
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-600">
                          {item.NamaOrtu || "-"}
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-600 max-w-[200px] lg:max-w-[300px] truncate">
                          {item.alamat || "-"}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              href={`/balita/detail/${item.id}`}
                              className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                            >
                              <Eye size={16} />
                            </Link>

                            <Link
                              href={`/balita/edit/${item.id}`}
                              className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center hover:scale-105 transition"
                            >
                              <Pencil size={16} />
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:scale-105 transition"
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