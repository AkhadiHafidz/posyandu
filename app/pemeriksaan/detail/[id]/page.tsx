"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";
import Boy024 from "@/components/BBUChart/Boy024";
import Boy2460 from "@/components/BBUChart/Boy2460";
import Girl024 from "@/components/BBUChart/Girl024";
import Girl2460 from "@/components/BBUChart/Girl2460";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Pemeriksaan {
  pasienId: string;
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

    const [riwayat, setRiwayat] = useState<any[]>([]);
    const [jk, setJk] = useState("");

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
  const pemeriksaan = docSnap.data();

  setData(pemeriksaan as Pemeriksaan);

  await getRiwayat(pemeriksaan.pasienId);

if (pemeriksaan.jenis === "Balita") {
    const balitaRef = doc(db, "balita", pemeriksaan.pasienId);

  const balitaSnap = await getDoc(balitaRef);

  if (balitaSnap.exists()) {
    setJk(balitaSnap.data().jk || "");
  }
}
}
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
const getRiwayat = async (pasienId: string) => {

    const q = query(
        collection(db, "pemeriksaan"),
        where("pasienId", "==", pasienId)
    );

    const snapshot = await getDocs(q);

    const hasil = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    setRiwayat(hasil);

}

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
          </div>
          {data?.jenis === "Balita" && (
            <>
              {jk === "Laki-laki" ? (
                Number(data?.umur) < 24 ? (
                  <Boy024 data={riwayat} />
                ) : (
                  <Boy2460 data={riwayat} />
                )
              ) : Number(data?.umur) < 24 ? (
                <Girl024 data={riwayat} />
              ) : (
                <Girl2460 data={riwayat} />
              )}
            </>
          )}


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