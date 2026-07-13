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

      <main className="flex-1 p-6 md:p-8">

        <Header title="Tambah Pengguna" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

        

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">

            {/* NAMA */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

            </div>

            <div>

              <label className="text-sm font-semibold text-gray-700">
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
              className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800"
              />

              </div>

                {/*password*/}
                <div>

                <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800"
              />

            </div>

                {/*konfirmasi password*/}
            <div>

              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800"
                />

            </div>

            {/* NO HP */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

            </div>

           

          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
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