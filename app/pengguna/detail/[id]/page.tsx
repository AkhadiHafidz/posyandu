"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

export default function DetailPenggunaPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const id =
    params.id as string;

  const [data, setData] =
    useState<any>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const getDetail =
    async () => {

      try {

        const docRef =
          doc(
            db,
            "users",
            id
          );

        const docSnap =
          await getDoc(
            docRef
          );

        if (
          docSnap.exists()
        ) {

          setData({
            id:
              docSnap.id,

            ...docSnap.data(),
          });

        } else {

          console.log(
            "Data tidak ditemukan"
          );

        }

      } catch (
        error
      ) {

        console.log(
          error
        );

      } finally {

        setLoading(
          false
        );

      }

    };

  useEffect(() => {

    if (id) {

      getDetail();

    }

  }, [id]);

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">

        <Header title="Detail Pengguna" />

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm max-w-3xl">



          {loading ? (

            <div className="mt-8">
              Loading...
            </div>

          ) : data ? (

           <div className="grid md:grid-cols-2 gap-5 mt-3">

  <div>
    <p className="text-xs text-gray-500">
      Nama
    </p>

    <h2 className="mt-1 text-sm font-semibold text-gray-800">
      {data.nama || "-"}
    </h2>
  </div>

  <div>
    <p className="text-xs text-gray-500">
      Username
    </p>

    <h2 className="mt-1 text-sm font-semibold text-gray-800">
      {data.username || "-"}
    </h2>
  </div>

  <div>
    <p className="text-xs text-gray-500">
      Role
    </p>

    <h2 className="mt-1 text-sm font-semibold text-gray-800">
      {data.role || "-"}
    </h2>
  </div>

  <div>
    <p className="text-xs text-gray-500">
      No HP
    </p>

    <h2 className="mt-1 text-sm font-semibold text-gray-800">
      {data.noHp || "-"}
    </h2>
  </div>

</div>

          ) : (

            <div className="py-10 text-center text-red-500 font-medium">
              Data pengguna tidak ditemukan
            </div>

          )}

          <button
            onClick={() =>
              router.push(
                "/pengguna"
              )
            }
           className="mt-5 w-32 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition"
          >
            Kembali
          </button>

        </div>

      </main>

    </div>
  );
}