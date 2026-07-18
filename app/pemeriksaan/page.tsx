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
  jenis: string;
  nama: string;
  tanggal: string;
  beratBadan: string;
  tinggiBadan: string;
  status: string;
}

export default function PemeriksaanPage() {
  const [dataPemeriksaan, setDataPemeriksaan] =
    useState<Pemeriksaan[]>([]);

  const [filteredData, setFilteredData] =
    useState<Pemeriksaan[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "pemeriksaan")
      );

      const result: Pemeriksaan[] = [];

      querySnapshot.forEach((document) => {
        const data = document.data();

        result.push({
          id: document.id,

          jenis: String(
            data.jenis || "Balita"
          ),

          nama: String(
            data.nama || ""
          ),

          tanggal: String(
            data.tanggal || ""
          ),

          beratBadan: String(
            data.beratBadan || ""
          ),

          tinggiBadan: String(
            data.tinggiBadan || ""
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

  useEffect(() => {
    const filtered =
      dataPemeriksaan.filter((item) =>
        item.nama
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    setFilteredData(filtered);
  }, [search, dataPemeriksaan]);

    const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";

    const [tahun, bulan, hari] = tanggal.split("-");

  return `${hari}-${bulan}-${tahun}`;
};

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus data pemeriksaan?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "pemeriksaan", id)
      );

      getData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">
        <Header title="Pemeriksaan" />

        <div className="mt-6">
          
          

          <div className="flex flex-col sm:flex-row gap-4">

            <div className="flex items-center bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm w-full sm:w-[250px]">
              <Search
                size={18}
                className="text-green-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari nama..."
                className="ml-2 w-full outline-none text-xs text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <Link
              href="/pemeriksaan/tambah"
className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <Plus size={20} />
              Tambah Data
            </Link>

          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-x-auto">

          <table className="min-w-[900px] w-full text-gray-800">

            <thead className="bg-green-50 ">
              <tr>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-800">
                  Nama
                </th>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-800">
                  Jenis
                </th>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-800">
                  Tanggal
                </th>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-800">
                  Status
                </th>

                <th className="text-center py-4 px-5 text-sm font-semibold text-gray-800">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {!loading &&
                filteredData.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className=" hover:bg-green-50 transition"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">

                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                            {item.nama
                              ?.charAt(0)
                              ?.toUpperCase()}
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

                      <td className="py-4 px-5 text-sm text-gray-700">
                        {item.jenis}
                      </td>

                      <td className="py-4 px-5 text-sm text-gray-700">
                         {formatTanggal(item.tanggal)}
                      </td>

                      <td className="py-4 px-5 text-sm text-gray-700">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            item.status ===
                            "Sehat"
                              ? "bg-green-100 text-green-700"
                              : item.status ===
                                "Monitoring"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center gap-3">

                          <Link
                            href={`/pemeriksaan/detail/${item.id}`}
                            className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            href={`/pemeriksaan/edit/${item.id}`}
                            className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )}

            </tbody>
          </table>

{!loading && filteredData.length === 0 && (
  <div className="py-12 text-center">
    <h2 className="text-xl font-bold text-gray-700">
      Data Pemeriksaan Tidak Ada
    </h2>

    <p className="text-sm text-gray-500 mt-2">
      Belum ada data pemeriksaan.
    </p>
  </div>
)}
{loading && (
  <div className="py-12 text-center">
    <h2 className="text-lg font-semibold text-gray-600">
      Loading...
    </h2>
  </div>
)}

        </div>
      </main>
    </div>
  );
}