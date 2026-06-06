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

export default function DetailBalitaPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] =
    useState(true);

  // GET DETAIL
  const getDetail = async () => {
    try {
      const docRef = doc(
        db,
        "balita",
        id
      );

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

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
        <Header title="Detail Balita" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">

          <h1 className="text-3xl font-black text-gray-800">
            Detail Data Balita
          </h1>

          <p className="text-gray-500 mt-2">
            Informasi lengkap data balita
          </p>

          {data && (
            <div className="mt-8 space-y-6">

              {/* NIK */}
              <div>
                <p className="text-sm text-gray-500">
                  NIK
                </p>

                <h1 className="text-xl font-semibold text-gray-800 mt-1">
                  {data.nik || "-"}
                </h1>
              </div>

              {/* Nama Balita */}
              <div>
                <p className="text-sm text-gray-500">
                  Nama Balita
                </p>

                <h1 className="text-2xl font-black text-gray-800 mt-1">
                  {data.nama || "-"}
                </h1>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <p className="text-sm text-gray-500">
                  Jenis Kelamin
                </p>

                <h1 className="text-xl font-semibold text-gray-800 mt-1">
                  {data.jk || "-"}
                </h1>
              </div>

              {/* Umur */}
              <div>
                <p className="text-sm text-gray-500">
                  Umur
                </p>

                <h1 className="text-xl font-semibold text-gray-800 mt-1">
                  {data.umur || "-"}
                </h1>
              </div>

              {/* Nama Ibu */}
              <div>
                <p className="text-sm text-gray-500">
                  Nama Ibu
                </p>

                <h1 className="text-xl font-semibold text-gray-800 mt-1">
                  {data.ibu || "-"}
                </h1>
              </div>

              {/* Alamat */}
              <div>
                <p className="text-sm text-gray-500">
                  Alamat
                </p>

                <h1 className="text-lg font-semibold text-gray-800 mt-1 leading-relaxed">
                  {data.alamat || "-"}
                </h1>
              </div>

              {/* Button Kembali */}
              <button
                onClick={() =>
                  router.push("/balita")
                }
                className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
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