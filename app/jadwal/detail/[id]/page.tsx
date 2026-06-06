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
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface ProfilPosyandu {
  namaPosyandu: string;
  alamat: string;
  tanggalKegiatan: string;
  jumlahKader: string;
}

export default function DetailJadwalPage() {
  const params = useParams();

  const router = useRouter();

  const [data, setData] =
    useState<ProfilPosyandu | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(
          db,
          "jadwal_posyandu",
          params.id as string
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          setData(
            docSnap.data() as ProfilPosyandu
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
        <Header title="Detail Jadwal Posyandu" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          <h1 className="text-3xl font-black text-gray-800">
            Detail Jadwal Posyandu
          </h1>

          <p className="text-gray-500 mt-2">
            Informasi lengkap kegiatan
            posyandu
          </p>

          <div className="mt-8 space-y-6">

            <div>
              <p className="text-sm text-gray-500">
                Nama Posyandu
              </p>

              <p className="text-2xl font-black text-gray-800 mt-1">
                {data?.namaPosyandu ||
                  "-"}
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

            <div>
              <p className="text-sm text-gray-500">
                Tanggal Kegiatan
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.tanggalKegiatan ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Jumlah Kader
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.jumlahKader ||
                  "-"}{" "}
                Orang
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              router.push("/jadwal")
            }
            className="mt-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl"
          >
            Kembali
          </button>

        </div>
      </main>
    </div>
  );
}