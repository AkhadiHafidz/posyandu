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

      <main className="flex-1 p-6 md:p-8">

        <Header title="Detail Pengguna" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">



          {loading ? (

            <div className="mt-8">
              Loading...
            </div>

          ) : data ? (

            <div className="mt-8 space-y-6">

  <div>
    <p className="text-sm text-gray-500">
      Nama
    </p>

    <h1 className="text-2xl font-black text-gray-800">
      {data.nama || "-"}
    </h1>
  </div>

  <div>
    <p className="text-sm text-gray-500">
      Username
    </p>

    <h1 className="text-xl font-semibold text-gray-800">
      {data.username || "-"}
    </h1>
  </div>

  <div>
    <p className="text-sm text-gray-500">
      Role
    </p>

    <h1 className="text-xl font-semibold text-gray-800">
      {data.role || "-"}
    </h1>
  </div>

        <div>
          <p className="text-sm text-gray-500">
            No HP
          </p>

          <h1 className="text-xl font-semibold text-gray-800">
            {data.noHp || "-"}
          </h1>
        </div>

</div>

          ) : (

            <div className="mt-8 text-red-500">
              Data pengguna tidak ditemukan
            </div>

          )}

          <button
            onClick={() =>
              router.push(
                "/pengguna"
              )
            }
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
          >
            Kembali
          </button>

        </div>

      </main>

    </div>
  );
}