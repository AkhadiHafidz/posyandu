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

      <main className="flex-1 p-6 md:p-8">
        <Header title="Pemeriksaan" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-8">
          
          

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
                  setSearch(e.target.value)
                }
                placeholder="Cari nama..."
                className="ml-3 w-full outline-none text-sm text-gray-700"
              />
            </div>

            <Link
              href="/pemeriksaan/tambah"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg"
            >
              <Plus size={20} />
              Tambah Data
            </Link>

          </div>
        </div>

        <div className="mt-8 bg-white rounded-[30px] shadow-sm overflow-hidden overflow-x-auto">

          <table className="w-full min-w-[1000px] text-gray-800">

            <thead >
              <tr>

                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  Nama
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  Jenis
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  Tanggal
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  Berat
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  Tinggi
                </th>

                <th className="text-left py-5 px-6 font-bold text-gray-800">
                  Status
                </th>

                <th className="text-center py-5 px-6 font-bold text-gray-800">
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
                      className="hover:bg-green-50 transition"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                            {item.nama
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <h2 className="font-bold text-gray-900 text-lg">
                              {item.nama}
                            </h2>

                            <p className="text-sm text-gray-600">
                              {item.jenis}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="py-5 px-6 text-gray-700 font-medium">
                        {item.jenis}
                      </td>

                      <td className="py-5 px-6 text-gray-700 font-medium">
                        {item.tanggal}
                      </td>

                      <td className="py-5 px-6 text-gray-700 font-medium">
                        {item.beratBadan} Kg
                      </td>

                      <td className="py-5 px-6 text-gray-700 font-medium">
                        {item.tinggiBadan} Cm
                      </td>

                      <td className="py-5 px-6 text-gray-700 font-medium">
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
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center gap-3">

                          <Link
                            href={`/pemeriksaan/detail/${item.id}`}
                            className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"
                          >
                            <Eye size={18} />
                          </Link>

                          <Link
                            href={`/pemeriksaan/edit/${item.id}`}
                            className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )}

            </tbody>
          </table>

        </div>
      </main>
    </div>
  );
}