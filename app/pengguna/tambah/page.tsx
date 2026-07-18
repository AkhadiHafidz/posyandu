"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

interface PenggunaForm {
  nama: string;
  username: string;
  password: string;
  konfirmasiPassword: string;
  noHp: string;
}

export default function TambahPenggunaPage() {

  const router = useRouter();

  const [form, setForm] =
    useState<PenggunaForm>({
      nama: "",
      username: "",
      password: "",
      konfirmasiPassword: "",
      noHp: "",
    });

  const [loading, setLoading] =
    useState(false);

        const handleSubmit = async () => {

          if (
            !form.nama ||
            !form.username ||
            !form.password ||
            !form.konfirmasiPassword
          ) {
            alert("Semua data wajib diisi.");
            return;
          }

          if (form.password !== form.konfirmasiPassword) {
            alert("Konfirmasi password tidak sama.");
            return;
          }

      try {

        setLoading(true);

        await addDoc(
              collection(db, "users"),
          {
                nama: form.nama,
                username: form.username.toLowerCase(),
                password: form.password,
                noHp: form.noHp,
                

                // otomatis user
                role: "user",

                createdAt: new Date(),
          }
        );

            alert("Pengguna berhasil ditambahkan.");

            router.push("/pengguna");

      } catch (error) {

        console.log(error);

            alert("Gagal menambahkan pengguna.");

      } finally {

        setLoading(false);

      }

    };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">

        <Header title="Tambah Pengguna" />

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm max-w-3xl">

        

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-4 mt-5">

            {/* NAMA */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={form.nama}
                onChange={(e)=>
                  setForm({
                    ...form,
                    nama:
                      e.target.value,
                  })
                }
                placeholder="Masukkan nama"
               className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-700">
              Username
              </label>

              <input
              type="text"
              value={form.username}
              onChange={(e)=>
              setForm({
              ...form,
              username:e.target.value
              })
              }
              placeholder="Masukkan username"
              className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

              </div>

                {/*password*/}
                <div>

                <label className="text-xs font-semibold text-gray-700">
                Password
                </label>

                <input
                type="password"
                value={form.password}
                onChange={(e)=>
                  setForm({
                    ...form,
                password:e.target.value
                  })
                }
                placeholder="Masukkan password"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

                {/*konfirmasi password*/}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Konfirmasi Password
              </label>

                <input
                type="password"
                value={form.konfirmasiPassword}
                onChange={(e)=>
                  setForm({
                    ...form,
                konfirmasiPassword:e.target.value
                  })
                }
                placeholder="Konfirmasi password"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                />

            </div>

            {/* NO HP */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                No HP
              </label>

              <input
                type="text"
                value={form.noHp}
                onChange={(e)=>
                  setForm({
                    ...form,
                    noHp:
                      e.target.value,
                  })
                }
                placeholder="08xxxxxxxxxx"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

           

          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
           className="mt-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition"
          >
            {
              loading
                ? "Menyimpan..."
                : "Simpan Data"
            }
          </button>

        </div>

      </main>

    </div>
  );
}