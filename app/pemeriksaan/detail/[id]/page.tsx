"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Pemeriksaan {
  jenis: string;
  nama: string;
  nik?: string;

  // Balita
  umur?: string;
  tinggiBadan?: string;
  lingkarLengan?: string;
  vitaminA?: string;
  asiEksklusif?: string;

  // Ibu Hamil
  usiaKehamilan?: string;
  tekananDarah?: string;
  tfu?: string;
  djj?: string;
  letakJanin?: string;
  tabletFe?: string;
  imunisasiTT?: string;
  keluhan?: string;

  // Umum
  beratBadan: string;
  tanggal: string;
  status: string;
  keterangan?: string;
}

export default function DetailPemeriksaanPage() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] =
    useState<Pemeriksaan | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(
          db,
          "pemeriksaan",
          params.id as string
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          setData(
            docSnap.data() as Pemeriksaan
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

    const formatTanggal = (tanggal?: string) => {

      if (!tanggal) return "-";

      const [tahun, bulan, hari] =
        tanggal.split("-");

      return `${hari}-${bulan}-${tahun}`;

    };


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
        <Header title="Detail Pemeriksaan" />

        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">


          <div className="mt-8 space-y-6">

            {/* Nama */}
            <div>
              <p className="text-sm text-gray-500">
                Nama
              </p>

              <p className="text-2xl font-black text-gray-800 mt-1">
                {data?.nama || "-"}
              </p>
            </div>

            {/* Jenis */}
            <div>
              <p className="text-sm text-gray-500">
                Jenis Pemeriksaan
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.jenis || "-"}
              </p>
            </div>

            {/* NIK Balita */}
            {data?.nik && (
              <div>
                <p className="text-sm text-gray-500">
                  NIK
                </p>

                <p className="text-xl font-semibold text-gray-800 mt-1">
                  {data?.nik || "-"}
                </p>
              </div>
            )}

            {data?.jenis === "Balita" && (
  <div>
    <p className="text-sm text-gray-500">
      Umur
    </p>

    <p className="text-xl font-semibold text-gray-800 mt-1">
      {data?.umur || "-"} Bulan
    </p>
  </div>
)}

            {/* Usia Kehamilan */}
            {data?.jenis === "Ibu Hamil" && (
              <div>
                <p className="text-sm text-gray-500">
                  Usia Kehamilan
                </p>

                <p className="text-xl font-semibold text-gray-800 mt-1">
                  {data?.usiaKehamilan || "-"} Bulan
                </p>
              </div>
            )}

            {/* Berat */}
            <div>
              <p className="text-sm text-gray-500">
                Berat Badan
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.beratBadan || "-"} Kg
              </p>
            </div>

            {data?.jenis === "Balita" ? (
              <>
            <div>
              <p className="text-sm text-gray-500">
                Tinggi Badan
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.tinggiBadan || "-"} Cm
              </p>
            </div>
  <div>
  <p className="text-sm text-gray-500">
    Lingkar Lengan
  </p>

  <p className="text-xl font-semibold text-gray-800 mt-1">
    {data?.lingkarLengan || "-"} cm
  </p>
</div>

<div>
  <p className="text-sm text-gray-500">
    Vitamin A
  </p>

  <p className="text-xl font-semibold text-gray-800 mt-1">
    {data?.vitaminA || "-"}
  </p>
</div>

<div>
  <p className="text-sm text-gray-500">
    ASI Eksklusif
  </p>

  <p className="text-xl font-semibold text-gray-800 mt-1">
    {data?.asiEksklusif || "-"}
  </p>
</div>
</>
) : (
  <>
    <div>
      <p className="text-sm text-gray-500">
        Tekanan Darah
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.tekananDarah || "-"}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Lingkar Lengan
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.lingkarLengan || "-"} cm
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        TFU
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.tfu || "-"} cm
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        DJJ
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.djj || "-"}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Letak Janin
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.letakJanin || "-"}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Tablet Fe
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.tabletFe || "-"}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Imunisasi TT
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.imunisasiTT || "-"}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Keluhan
      </p>

      <p className="text-xl font-semibold text-gray-800 mt-1">
        {data?.keluhan || "-"}
      </p>
    </div>
  </>
)}  

            {/* Tanggal */}
            <div>
              <p className="text-sm text-gray-500">
                Tanggal Pemeriksaan
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {formatTanggal(data?.tanggal)}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-2
                ${
                  data?.status === "Sehat"
                    ? "bg-green-100 text-green-700"
                    : data?.status ===
                      "Monitoring"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {data?.status || "-"}
              </p>
            </div>

            {/* Keterangan */}
            <div>
              <p className="text-sm text-gray-500">
                Keterangan
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {data?.keterangan || "-"}
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              router.push("/pemeriksaan")
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