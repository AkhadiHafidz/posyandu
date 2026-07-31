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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface IbuHamil {
  id: string;
  nama: string;
  umur: string;
  usiaKehamilan: string;
  alamat: string;
  noHp: string;
}

export default function IbuHamilPage() {
  // STATE
  const [dataIbu, setDataIbu] = useState<IbuHamil[]>([]);
  const [filteredData, setFilteredData] = useState<IbuHamil[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // GET DATA
  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ibu_hamil"));
      const result: IbuHamil[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        result.push({
          id: doc.id,
          nama: String(data.nama || ""),
          umur: String(data.umur || ""),
          usiaKehamilan: String(data.usiaKehamilan || ""),
          alamat: String(data.alamat || ""),
          noHp: String(data.noHp || ""),
        });
      });

      setDataIbu(result);
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
    const filtered = dataIbu.filter((item) =>
      item.nama.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, dataIbu]);

  // DELETE
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus data?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "ibu_hamil", id));
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
        <Header title="Data Ibu Hamil" />

        {/* TOP ACTION AREA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* SEARCH */}
            <div className="flex items-center bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm w-full sm:w-[250px]">
              <Search size={16} className="text-green-500 shrink-0" />
              <input
                type="text"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama ibu..."
                className="ml-2 w-full outline-none text-xs text-gray-700 placeholder:text-gray-400 bg-transparent"
              />
            </div>

            {/* BUTTON */}
            <Link
              href="/ibu-hamil/tambah"
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
              <h2 className="text-sm font-semibold text-gray-600">Loading...</h2>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredData.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500">
                Data Tidak Ada
              </h2>
              <p className="text-gray-400 mt-1 text-xs">
                Belum ada data ibu hamil
              </p>
            </div>
          )}

          {!loading && filteredData.length > 0 && (
            <>
              {/* TAMPILAN MOBILE (KARTU / CARD RINGKAS) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-xl shadow-sm border border-green-50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.nama?.charAt(0)?.toUpperCase() || "I"}
                        </div>
                        <div>
                          <h2 className="font-semibold text-xs sm:text-sm text-gray-800">
                            {item.nama || "-"}
                          </h2>
                          <p className="text-[10px] text-gray-500">Ibu Hamil</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] py-0.5">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Umur:</span>
                        <span className="text-gray-700 font-medium">
                          {item.umur || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">
                          Usia Kehamilan:
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.usiaKehamilan} Bulan
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">No HP:</span>
                        <span className="text-gray-700 font-medium">
                          {item.noHp || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Alamat:</span>
                        <span className="text-gray-700 font-medium truncate block">
                          {item.alamat || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                      <Link
                        href={`/ibu-hamil/detail/${item.id}`}
                        className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                      >
                        <Eye size={14} />
                      </Link>

                      <Link
                        href={`/ibu-hamil/edit/${item.id}`}
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
                <table className="w-full">
                  {/* HEAD */}
                  <thead className="bg-green-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                        Nama
                      </th>
                      <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                        Umur
                      </th>
                      <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                        Usia Kehamilan
                      </th>
                      <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                        No HP
                      </th>
                      <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                        Alamat
                      </th>
                      <th className="text-center py-4 px-5 text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-green-50 transition"
                      >
                        {/* NAMA */}
                        <td className="py-4 px-5 text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {item.nama?.charAt(0)?.toUpperCase() || "I"}
                            </div>
                            <div>
                              <h2 className="font-semibold text-sm text-gray-800">
                                {item.nama || "-"}
                              </h2>
                              <p className="text-xs text-gray-500">
                                Ibu Hamil
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* UMUR */}
                        <td className="py-4 px-5 text-sm text-gray-600">
                          {item.umur || "-"}
                        </td>

                        {/* USIA */}
                        <td className="py-4 px-5 text-sm text-gray-600">
                          {item.usiaKehamilan} Bulan
                        </td>

                        {/* HP */}
                        <td className="py-4 px-5 text-sm text-gray-600">
                          {item.noHp || "-"}
                        </td>

                        {/* ALAMAT */}
                        <td className="py-4 px-5 text-sm text-gray-600 max-w-[200px] lg:max-w-[300px] truncate">
                          {item.alamat || "-"}
                        </td>

                        {/* ACTION */}
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              href={`/ibu-hamil/detail/${item.id}`}
                              className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                            >
                              <Eye size={16} />
                            </Link>

                            <Link
                              href={`/ibu-hamil/edit/${item.id}`}
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