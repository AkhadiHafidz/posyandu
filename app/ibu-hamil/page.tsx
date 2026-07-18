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
  HeartPulse,
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
  const [dataIbu, setDataIbu] =
    useState<IbuHamil[]>([]);

  const [filteredData, setFilteredData] =
    useState<IbuHamil[]>([]);

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
            "ibu_hamil"
          )
        );

      const result: IbuHamil[] = [];

      querySnapshot.forEach((doc) => {

        const data = doc.data();

        result.push({
          id: doc.id,

          nama: String(
            data.nama || ""
          ),

          umur: String(
            data.umur || ""
          ),

          usiaKehamilan:
            String(
              data.usiaKehamilan ||
                ""
            ),

          alamat: String(
            data.alamat || ""
          ),

          noHp: String(
            data.noHp || ""
          ),
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

    const filtered =
      dataIbu.filter((item) =>
        item.nama
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredData(filtered);

  }, [search, dataIbu]);

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
          "ibu_hamil",
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
      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-x-hidden">

        {/* HEADER */}
        <Header title="Data Ibu Hamil" />

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">

          {/* TITLE */}
         
          

          {/* ACTION */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* SEARCH */}
            <div className="flex items-center bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm w-full sm:w-[250px]">

              <Search
                size={18}
                className="text-green-500"
              />

              <input
                type="text"
                value={search || ""}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari nama ibu..."
             className="ml-2 w-full outline-none text-xs text-gray-700 placeholder:text-gray-400"
              />

            </div>

            {/* BUTTON */}
            <Link
              href="/ibu-hamil/tambah"
className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition"
            >

              <Plus size={18} />

              Tambah Data

            </Link>

          </div>

        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">

        <table className="min-w-[900px] w-full">

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

              {!loading &&
                filteredData.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-green-50 transition"
                    >

                      {/* NAMA */}
                      <td className="py-4 px-5 text-sm text-gray-600">

                        <div className="flex items-center gap-4">

                          {/* AVATAR */}
                          <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">
                            {item.nama
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "I"}
                          </div>

                          {/* INFO */}
                          <div>

                            <h2 className="font-semibold text-sm text-gray-800">
                              {item.nama ||
                                "-"}
                            </h2>

                            <p className="text-xs text-gray-500">
                              Ibu Hamil
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* UMUR */}
                      <td className="py-4 px-5 text-sm text-gray-600">
                        {item.umur ||
                          "-"}
                      </td>

                      {/* USIA */}
                      <td className="py-4 px-5 text-sm text-gray-600">
                        {
                          item.usiaKehamilan
                        }{" "}
                        Bulan
                      </td>

                      {/* HP */}
                      <td className="py-4 px-5 text-sm text-gray-600">
                        {item.noHp ||
                          "-"}
                      </td>

                      {/* ALAMAT */}
                      <td className="py-4 px-5 text-sm text-gray-600 max-w-[150px] md:max-w-[250px] truncate">
                        {item.alamat ||
                          "-"}
                      </td>

                      {/* ACTION */}
                      <td className="py-4 px-5">

                        <div className="flex items-center justify-center gap-3">

                          {/* DETAIL */}
                          <Link
                            href={`/ibu-hamil/detail/${item.id}`}
                            className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <Eye
                              size={16}
                            />
                          </Link>

                          {/* EDIT */}
                          <Link
                            href={`/ibu-hamil/edit/${item.id}`}
                            className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <Pencil
                              size={16}
                            />
                          </Link>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <Trash2
                              size={16}
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

              <div className="py-12 text-center">

                <h2 className="text-sm text-gray-500">
                  Data Tidak Ada
                </h2>

                <p className="text-gray-500 mt-2">
                  Belum ada data ibu hamil
                </p>

              </div>
            )}

          {/* LOADING */}
          {loading && (

            <div className="py-16 text-center">

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