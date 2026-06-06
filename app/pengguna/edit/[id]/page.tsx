"use client";

import { useEffect, useState } from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface PenggunaForm {
  nama: string;
  email: string;
  role: string;
  noHp: string;
  alamat: string;
}

export default function EditPenggunaPage() {

  const router =
    useRouter();

  const params =
    useParams();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<PenggunaForm>({
      nama: "",
      email: "",
      role: "",
      noHp: "",
      alamat: "",
    });

  // GET DATA
  useEffect(() => {

    const getData =
      async () => {

        try {

          const docRef =
            doc(
              db,
              "users",
              params.id as string
            );

          const docSnap =
            await getDoc(
              docRef
            );

          if (
            docSnap.exists()
          ) {

            setForm({
              nama:
                docSnap.data()
                  .nama || "",

              email:
                docSnap.data()
                  .email || "",

              role:
                docSnap.data()
                  .role || "",

              noHp:
                docSnap.data()
                  .noHp || "",

              alamat:
                docSnap.data()
                  .alamat || "",
            });

          }

        } catch (
          error
        ) {

          console.log(
            error
          );

        }

      };

    getData();

  }, [params.id]);

  // UPDATE
  const handleSubmit =
    async () => {

      try {

        setLoading(
          true
        );

        await updateDoc(
          doc(
            db,
            "users",
            params.id as string
          ),
          {
            ...form,
          }
        );

        alert(
          "Data berhasil diubah"
        );

        router.push(
          "/pengguna"
        );

      } catch (
        error
      ) {

        console.log(
          error
        );

        alert(
          "Gagal mengubah data"
        );

      } finally {

        setLoading(
          false
        );

      }

    };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-6 md:p-8">

        <Header title="Edit Pengguna" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          {/* TITLE */}
          <div>

            <h1 className="text-3xl font-black text-gray-800">
              Edit Data Pengguna
            </h1>

            <p className="text-gray-500 mt-2">
              Ubah data pengguna
            </p>

          </div>

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">

            {/* NAMA */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Nama
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
                placeholder="Nama pengguna"
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

            </div>

          

          

            {/* ROLE */}
            <div>

              <label className="text-sm font-semibold text-gray-700">
                Role
              </label>

              <select
                value={form.role}
                onChange={(e)=>
                  setForm({
                    ...form,
                    role:
                      e.target.value,
                  })
                }
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800"
              >

                <option value="">
                  Pilih Role
                </option>

                <option value="Admin">
                  Admin
                </option>

                <option value="Petugas">
                  Petugas
                </option>

              </select>

            </div>

            {/* HP */}
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
                className="w-full mt-2 border border-green-100 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

            </div>

            

          </div>

          {/* BUTTON */}
          <button
            onClick={
              handleSubmit
            }
            disabled={
              loading
            }
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
          >
            {
              loading
                ? "Menyimpan..."
                : "Simpan Perubahan"
            }
          </button>

        </div>

      </main>

    </div>
  );
}