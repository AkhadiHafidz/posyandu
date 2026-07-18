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

      <main className="flex-1 p-3 sm:p-5 lg:p-6"> 
        <Header title="Detail Balita" />

        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm max-w-3xl">
          {data && (
           <div className="grid md:grid-cols-2 gap-5 mt-6">

              {/* NIK */}
              <div>
                <p className="text-xs text-gray-500">
                  NIK
                </p>

                <h1 className="text-base font-semibold text-gray-800 mt-1">
                  {data.nik || "-"}
                </h1>
              </div>

              {/* Nama Balita */}
              <div>
                <p className="text-xs text-gray-500">
                  Nama Balita
                </p>

                <h1 className="text-lg font-black text-gray-800 mt-1">
                  {data.nama || "-"}
                </h1>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <p className="text-xs text-gray-500">
                  Jenis Kelamin
                </p>

                <h1 className="text-base font-semibold text-gray-800 mt-1">
                  {data.jk || "-"}
                </h1>
              </div>

              {/* Umur */}
              <div>
                <p className="text-xs text-gray-500">
                  Umur
                </p>

                <h1 className="text-base  font-semibold text-gray-800 mt-1">
                  {data.umur || "-"}
                </h1>
              </div>

              {/* Nama Ibu */}
              <div>
                <p className="text-xs text-gray-500">
                  Nama Ibu
                </p>

                <h1 className="text-base font-semibold text-gray-800 mt-1">
                  {data.ibu || "-"}
                </h1>
              </div>

              {/* Alamat */}
              <div>
                <p className="text-xs text-gray-500">
                  Alamat
                </p>

                <h1 className="text-base font-semibold text-gray-800 mt-1 leading-relaxed">
                  {data.alamat || "-"}
                </h1>
              </div>

           
            

              {/* Button Kembali */}
              <button
                onClick={() =>
                  router.push("/balita")
                }
                className="mt-6 w-36 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition"
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