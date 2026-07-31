"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

interface IbuHamilData {
  nik?: string;
  nama?: string;
  umur?: string;
  usiaKehamilan?: string;
  tanggalLahir?: string;
  noHp?: string;
  rt?: string;
  rw?: string;
  alamat?: string;
}

export default function DetailIbuHamilPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [data, setData] = useState<IbuHamilData | null>(null);
  const [loading, setLoading] = useState(true);

  // GET DETAIL
  const getDetail = async () => {
    try {
      const docRef = doc(db, "ibu_hamil", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data() as IbuHamilData);
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
      <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center text-gray-500">
          Loading...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
        <Header title="Detail Ibu Hamil" />

        <div className="mt-6 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm max-w-3xl w-full mx-auto md:mx-0">
          {data ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* NIK */}
                <div>
                  <p className="text-xs text-gray-500">NIK</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1 break-words">
                    {data.nik || "-"}
                  </h1>
                </div>

                {/* Nama Ibu */}
                <div>
                  <p className="text-xs text-gray-500">Nama Ibu</p>
                  <h1 className="text-lg font-black text-gray-800 mt-1 break-words">
                    {data.nama || "-"}
                  </h1>
                </div>

                {/* Umur */}
                <div>
                  <p className="text-xs text-gray-500">Umur</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.umur || "-"}
                  </h1>
                </div>

                {/* Usia Kehamilan */}
                <div>
                  <p className="text-xs text-gray-500">Usia Kehamilan</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.usiaKehamilan || "-"}
                  </h1>
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <p className="text-xs text-gray-500">Tanggal Lahir</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1">
                    {data.tanggalLahir || "-"}
                  </h1>
                </div>

                {/* No HP */}
                <div>
                  <p className="text-xs text-gray-500">No HP</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1 break-words">
                    {data.noHp || "-"}
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

                {/* Alamat */}
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500">Alamat</p>
                  <h1 className="text-base font-semibold text-gray-800 mt-1 leading-relaxed break-words">
                    {data.alamat || "-"}
                  </h1>
                </div>
              </div>

              {/* Button Kembali */}
              <div className="mt-8 pt-2">
                <button
                  onClick={() => router.push("/ibu-hamil")}
                  className="w-full sm:w-36 bg-[#00A859] hover:bg-[#008f4c] text-white text-sm font-semibold py-2.5 rounded-xl transition shadow-sm"
                >
                  Kembali
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-gray-500 text-sm">Data tidak ditemukan.</p>
              <button
                onClick={() => router.push("/ibu-hamil")}
                className="mt-4 w-full sm:w-36 bg-[#00A859] hover:bg-[#008f4c] text-white text-sm font-semibold py-2 rounded-xl transition"
              >
                Kembali
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}