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

interface Balita {
  id: string;

  nama: string;

  jk: string;

  umur: string;

  ibu: string;

  alamat: string;
}

export default function BalitaPage() {

  // DATA
  const [dataBalita, setDataBalita] =
    useState<Balita[]>([]);

  const [filteredData, setFilteredData] =
    useState<Balita[]>([]);

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
            "balita"
          )
        );

      const result: Balita[] = [];

      querySnapshot.forEach((doc) => {

        const data = doc.data();

        result.push({
          id: doc.id,

          nama: String(
            data.nama || ""
          ),

          jk: String(
            data.jk || ""
          ),

          umur: String(
            data.umur || ""
          ),

          ibu: String(
            data.ibu || ""
          ),

          alamat: String(
            data.alamat || ""
          ),
        });
      });

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

  // SEARCH
  useEffect(() => {

    const filtered =
      dataBalita.filter((item) =>
        item.nama
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredData(filtered);

  }, [search, dataBalita]);

  // DELETE
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
          "balita",
          id
        )
      );

      getData();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col lg:flex-row">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
     <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">

        {/* HEADER */}
        <Header title="Data Balita" />

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-8">


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
                placeholder="Cari nama balita..."
                className="ml-3 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />

            </div>

            {/* BUTTON */}
            <Link
              href="/balita/tambah"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-[1.02] transition"
            >

              <Plus size={20} />

              Tambah Data

            </Link>

          </div>

        </div>

        {/* TABLE */}
        <div className="mt-8 bg-white rounded-[30px] shadow-sm overflow-x-auto">

          <table className="min-w-[900px] w-full">

            {/* HEAD */}
            <thead className="bg-green-50 border-b">

              <tr>

                <th className="text-left py-5 px-6 text-gray-700 font-bold">
                  Nama Balita
                </th>

                <th className="text-left py-5 px-6 text-gray-700 font-bold">
                  Jenis Kelamin
                </th>

                <th className="text-left py-5 px-6 text-gray-700 font-bold">
                  Umur
                </th>

                <th className="text-left py-5 px-6 text-gray-700 font-bold">
                  Nama Ibu
                </th>

                <th className="text-left py-5 px-6 text-gray-700 font-bold">
                  Alamat
                </th>

                <th className="text-center py-5 px-6 text-gray-700 font-bold">
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
                          <div className="w-10 h-10 md:w-12 md:h-12">
                            {item.nama
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "B"}
                          </div>

                          {/* INFO */}
                          <div>

                            <h2 className="font-semibold text-sm md:text-base text-gray-800">
                              {item.nama ||
                                "-"}
                            </h2>

                            <p className="text-sm text-gray-500">
                              Balita Posyandu
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* JK */}
                      <td className="py-5 px-6 text-gray-600">
                        {item.jk || "-"}
                      </td>

                      {/* UMUR */}
                      <td className="py-5 px-6 text-gray-600">
                        {item.umur || "-"}
                      </td>

                      {/* IBU */}
                      <td className="py-5 px-6 text-gray-600">
                        {item.ibu || "-"}
                      </td>

                      {/* ALAMAT */}
                      <td className="py-5 px-6 text-gray-600 max-w-[150px] md:max-w-[250px] truncate">
                        {item.alamat ||
                          "-"}
                      </td>

                      {/* ACTION */}
                      <td className="py-5 px-6">

                        <div className="flex items-center justify-center gap-3">

                          {/* DETAIL */}
                          <Link
                            href={`/balita/detail/${item.id}`}
                            className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <Eye
                              size={18}
                            />
                          </Link>

                          {/* EDIT */}
                          <Link
                            href={`/balita/edit/${item.id}`}
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
                  Belum ada data balita
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