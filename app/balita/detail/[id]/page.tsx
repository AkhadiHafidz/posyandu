"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

interface BalitaData {
  nik?: string;
  nama?: string;
  jk?: string;
  umur?: string;
  NamaOrtu?: string;
  tanggalLahir?: string;
  rt?: string;
  rw?: string;
  alamat?: string;
}

export default function DetailBalitaPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [data, setData] = useState<BalitaData | null>(null);
  const [loading, setLoading] = useState(true);

  // GET DETAIL
  const getDetail = async () => {
    try {
      const docRef = doc(db, "balita", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data() as BalitaData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FFF8]">
        <div className="text-gray-600 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        <Header title="Detail Balita" />

        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm max-w-3xl">
          {data ? (
            <div>
              {/* Grid 1 Kolom di HP, Tetap 2 Kolom di Tablet & Laptop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* NIK */}
                <div>
                  <p className="text-xs text-gray-500">NIK</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1 break-words">
                    {data.nik || "-"}
                  </h1>
                </div>

                {/* Nama Balita */}
                <div>
                  <p className="text-xs text-gray-500">Nama Balita</p>
                  <h1 className="text-lg font-black text-gray-800 mt-1 break-words">
                    {data.nama || "-"}
                  </h1>
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <p className="text-xs text-gray-500">Jenis Kelamin</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.jk || "-"}
                  </h1>
                </div>

                {/* Umur */}
                <div>
                  <p className="text-xs text-gray-500">Umur</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.umur || "-"}
                  </h1>
                </div>

                {/* Nama Ortu */}
                <div>
                  <p className="text-xs text-gray-500">Nama Ortu</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1 break-words">
                    {data.NamaOrtu || "-"}
                  </h1>
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <p className="text-xs text-gray-500">Tanggal Lahir</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.tanggalLahir || "-"}
                  </h1>
                </div>

                {/* RT */}
                <div>
                  <p className="text-xs text-gray-500">RT</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.rt || "-"}
                  </h1>
                </div>

                {/* RW */}
                <div>
                  <p className="text-xs text-gray-500">RW</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.rw || "-"}
                  </h1>
                </div>

                {/* Alamat - Membentang 2 Kolom pada Tablet/Laptop */}
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Alamat</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1 leading-relaxed break-words">
                    {data.alamat || "-"}
                  </h1>
                </div>
              </div>

              {/* Button Kembali */}
              <div className="mt-8">
                <button
                  onClick={() => router.push("/balita")}
                  className="w-full sm:w-36 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition active:scale-95"
                >
                  Kembali
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Data balita tidak ditemukan.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}