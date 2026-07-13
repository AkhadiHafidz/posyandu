"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";
import KMSChart from "@/components/KMSChart";


const formatTanggal = (tanggal: string) => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function DetailBalitaPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] =
    useState(true);

    const [chartData, setChartData] = useState<any[]>([]);

    //GET RIWAYAT
   const getRiwayat = async () => {
  try {
    const q = query(
      collection(db, "pemeriksaan"),
      where("pasienId", "==", id)
    );

    const querySnapshot = await getDocs(q);

    const hasil = querySnapshot.docs.map((item) => ({
      id: item.id,
      umur: Number(item.data().umur),
      berat: Number(item.data().beratBadan),
      tinggi: Number(item.data().tinggiBadan),
      lingkarLengan: item.data().lingkarLengan || "-",
      vitaminA: item.data().vitaminA || "-",
      asiEksklusif: item.data().asiEksklusif || "-",
      tanggal: item.data().tanggal,
    }));

    hasil.sort((a, b) => a.umur - b.umur);

    setChartData(hasil);
  } catch (error) {
    console.log(error);
  }
};
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
    getRiwayat();
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

              {/* Grafik KMS */}
              <KMSChart
              data={chartData}
              jk={data.jk}
            />
              <div className="mt-10">

  <h2 className="text-2xl font-bold text-gray-800 mb-5">
    Riwayat Pemeriksaan
  </h2>

  <div className="overflow-x-auto">

    <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">

      <thead className="bg-green-600 text-white">

        <tr>

          <th className="px-4 py-3 text-left">
            Tanggal
          </th>

          <th className="px-4 py-3 text-center">
            Umur
          </th>

          <th className="px-4 py-3 text-center">
            BB
          </th>

          <th className="px-4 py-3 text-center">
            TB
          </th>

          <th className="px-4 py-3 text-center">
            Lingkar Lengan
          </th>

          <th className="px-4 py-3 text-center">
            Vitamin A
          </th>

          <th className="px-4 py-3 text-center">
            ASI
          </th>

        </tr>

      </thead>

      <tbody>

        {chartData.map((item, index) => (

          <tr
            key={item.id}
            className={
              index % 2 === 0
                ? "bg-white"
                : "bg-green-50"
            }
          >

            <td className="px-4 py-3 text-center text-gray-800">
              {formatTanggal(item.tanggal)}
            </td>

            <td className="px-4 py-3 text-center text-gray-800">
              {item.umur} bln
            </td>

            <td className="px-4 py-3 text-center text-gray-800">
              {item.berat} Kg
            </td>

            <td className="px-4 py-3 text-center text-gray-800">
              {item.tinggi} Cm
            </td>

            <td className="px-4 py-3 text-center text-gray-800">
              {item.lingkarLengan}
            </td>

            <td className="px-4 py-3 text-center text-gray-800">
              {item.vitaminA}
            </td>

            <td className="px-4 py-3 text-center text-gray-800">
              {item.asiEksklusif}
            </td>

         

          </tr>

        ))}

      </tbody>

    </table>

  </div>

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