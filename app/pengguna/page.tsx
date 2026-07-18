"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface Pengguna {
  id: string;

  nama: string;

  username: string;

  role: string;

  createdAt?: any;
}

export default function PenggunaPage() {

  // STATE
  const [dataPengguna, setDataPengguna] =
    useState<Pengguna[]>([]);

  const [filteredData, setFilteredData] =
    useState<Pengguna[]>([]);

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
            "users"
          )
        );

      const result: Pengguna[] = [];

      querySnapshot.forEach((doc) => {

        const data = doc.data();

        result.push({
          id: doc.id,

          nama: String(
            data.nama || ""
          ),

          username:
            String(
              data.username ||
                ""
            ),

          role: String(
            data.role || "user"
          ),

          createdAt:
            data.createdAt ||
            null,
        });
      });

      setDataPengguna(result);

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
      dataPengguna.filter(
        (item) =>
          item.nama
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredData(filtered);

  }, [search, dataPengguna]);

  // DELETE
  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete =
      confirm(
        "Yakin ingin menghapus pengguna?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "users",
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
      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">

        {/* HEADER */}
        <Header title="Pengguna" />

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">

          {/* TITLE */}
         

          {/* ACTION */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* SEARCH */}
            <div className="flex items-center bg-white border border-green-100 rounded-xl px-3 py-2.5 shadow-sm w-full sm:w-[250px]">

              <Search
                size={18}
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
                placeholder="Cari pengguna..."
                className="ml-2 w-full outline-none text-xs text-gray-700 placeholder:text-gray-400"
              />

            </div>

            {/* BUTTON */}
            <Link
              href="/pengguna/tambah"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition">

              <Plus size={20} />

              Tambah Pengguna

            </Link>

          </div>

        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-x-auto">

          <table className="min-w-[900px] w-full">

            {/* HEAD */}
            <thead className="bg-violet-50 border-b">

              <tr>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                  Nama
                </th>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                  Username
                </th>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                  Role
                </th>

                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">
                  Status
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
                      className="border-b hover:bg-violet-50 transition"
                    >

                      {/* NAMA */}
                      <td className="py-5 px-6">

                        <div className="flex items-center gap-4">

                          {/* AVATAR */}
                          <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-lg">
                            {item.nama
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}
                          </div>

                          {/* INFO */}
                          <div>

                            <h2 className="font-semibold text-sm text-gray-800">
                              {item.nama ||
                                "-"}
                            </h2>

                            <p className="text-xs text-gray-500">
                              Pengguna Sistem
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* USERNAME */}
                      <td className="py-5 px-6 text-gray-600">
                        {item.username ||
                          "-"}
                      </td>

                      {/* ROLE */}
                      <td className="py-5 px-6">

                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                            
                            ${
                              item.role ===
                              "admin"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }
                          `}
                        >

                          {item.role ===
                          "admin" ? (
                            <ShieldCheck
                              size={14}
                            />
                          ) : (
                            <UserCircle2
                              size={14}
                            />
                          )}

                          {item.role ||
                            "user"}

                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="py-5 px-6">

                        <span className="bg-green-100 text-green-700 px-3 py-1  text-xs rounded-full text-sm font-semibold">
                          Active
                        </span>

                      </td>

                      {/* ACTION */}
                      <td className="py-5 px-6">

                        <div className="flex items-center justify-center gap-3">

                          {/* DETAIL */}
                          <Link
                            href={`/pengguna/detail/${item.id}`}
                            className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <Eye
                              size={16}
                            />
                          </Link>

                          {/* EDIT */}
                          <Link
                            href={`/pengguna/edit/${item.id}`}
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

                <h2 className="text-xl font-black text-gray-700">
                  Pengguna Tidak Ada
                </h2>

                <p className="text-sm gray-500 mt-3">
                  Belum ada data pengguna
                </p>

              </div>
            )}

          {/* LOADING */}
          {loading && (

            <div className="py-20 text-center">

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