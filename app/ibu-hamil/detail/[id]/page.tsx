"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  doc,
  getDoc,
} from "firebase/firestore";
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

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">
        <Header title="Detail Ibu Hamil" />

        <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm max-w-2xl">
          <div className="mt-3">

  {/* ========================= */}
  {/* KOLOM KIRI */}
  {/* ========================= */}

<div className="grid md:grid-cols-2 gap-5 mt-3">

    <div>
      <p className="text-xs text-gray-500">NIK</p>
      <p className="text-base font-semibold text-gray-800 mt-1">
        {data?.nik || "-"}
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">Nama Ibu</p>
      <p className="text-base font-black text-gray-800 mt-1">
        {data?.nama || "-"}
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">Umur</p>
      <p className="text-base font-semibold text-gray-800 mt-1">
        {data?.umur || "-"} Tahun
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">Usia Kehamilan</p>
      <p className="text-base font-semibold text-gray-800 mt-1">
        {data?.usiaKehamilan || "-"} Bulan
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">No HP</p>
      <p className="text-base font-semibold text-gray-800 mt-1">
        {data?.noHp || "-"}
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">Alamat</p>
      <p className="text-base font-semibold text-gray-800 mt-1">
        {data?.alamat || "-"}
      </p>
    </div>

  </div>

          <button
            onClick={() =>
              router.push("/ibu-hamil")
            }
            className="mt-5 w-36 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition"
          >
            Kembali
          </button>
</div>
        </div>
      </main>
    </div>
  );
}