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
  username: string;
  password: string;
  konfirmasiPassword: string;
  noHp: string;
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
      username: "",
      password: "",
      konfirmasiPassword: "",
      noHp: "",
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

              username:
                docSnap.data()
                  .username || "",

              password:
                docSnap.data()
                  .password || "",

              konfirmasiPassword:
                docSnap.data()
                  .konfirmasiPassword || "",

              noHp:
                docSnap.data()
                  .noHp || "",

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
        if (form.password !== form.konfirmasiPassword) {
          alert("Konfirmasi password tidak sama.");
          return;
        }
        await updateDoc(
          doc(
            db,
            "users",
            params.id as string
          ),
          {
            nama: form.nama,
            username: form.username,
            password: form.password,
            noHp: form.noHp,
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

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">

        <Header title="Edit Pengguna" />

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm max-w-3xl">

      

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-4 mt-5">

            {/* NAMA */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
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
            className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
            />

            </div>

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
         className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
          />

          </div>


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
          className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
          />

            </div>

            {/* HP */}
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
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
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
className="mt-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition"
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