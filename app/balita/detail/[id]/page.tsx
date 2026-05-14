"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useParams } from "next/navigation";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

export default function DetailBalitaPage() {

  const params = useParams();

  const id = params.id as string;

  const [data, setData] = useState<any>(null);

  // GET DETAIL
  const getDetail = async () => {

    const docRef = doc(
      db,
      "balita",
      id
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      setData(docSnap.data());
    }
  };

  useEffect(() => {

    getDetail();

  }, []);

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-6 md:p-8">

        <Header title="Detail Balita" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-3xl">

          {data && (

            <div className="space-y-6">

              <div>

                <p className="text-sm text-gray-500">
                  Nama Balita
                </p>

                <h1 className="text-2xl font-black text-gray-800 mt-1">
                  {data.nama}
                </h1>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Jenis Kelamin
                </p>

                <h1 className="text-xl font-semibold text-gray-800 mt-1">
                  {data.jk}
                </h1>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Umur
                </p>

                <h1 className="text-xl font-semibold text-gray-800 mt-1">
                  {data.umur}
                </h1>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Nama Ibu
                </p>

                <h1 className="text-xl font-semibold text-gray-800 mt-1">
                  {data.ibu}
                </h1>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Alamat
                </p>

                <h1 className="text-lg font-semibold text-gray-800 mt-1 leading-relaxed">
                  {data.alamat}
                </h1>

              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}