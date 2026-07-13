"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface IbuHamil {
  nik: string;
  nama: string;
  umur: string;
  usiaKehamilan: string;
  noHp: string;
  alamat: string;
}

export default function DetailIbuHamilPage() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] =
    useState<IbuHamil | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(
          db,
          "ibu_hamil",
          params.id as string
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          setData(
            docSnap.data() as IbuHamil
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        <Header title="Detail Ibu Hamil" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">
          <div className="mt-8 space-y-6">

            {/* NIK */}
            <div>
              <p className="text-sm text-gray-500">
                NIK
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.nik || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Nama Ibu
              </p>

              <p className="text-2xl font-black text-gray-800 mt-1">
                {data?.nama || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Umur
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.umur || "-"} Tahun
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Usia Kehamilan
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.usiaKehamilan || "-"} Bulan
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                No HP
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.noHp || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Alamat
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.alamat || "-"}
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              router.push("/ibu-hamil")
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