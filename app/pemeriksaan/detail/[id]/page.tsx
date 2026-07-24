"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";
import Boy024 from "@/components/BBUChart/Boy024";
import Boy2460 from "@/components/BBUChart/Boy2460";
import Girl024 from "@/components/BBUChart/Girl024";
import Girl2460 from "@/components/BBUChart/Girl2460";
import PBUChart from "@/components/PBUChart";
import TBUChart from "@/components/TBUChart";
import KMSIbuHamilChart from "@/components/KMSIbuHamilChart";
import GrafikEvaluasiKehamilan from "@/components/GrafikEvaluasiKehamilan";
import { ChartData } from "@/components/BBUChart/types";

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
  statusPertumbuhan?: string;

  // Ibu Hamil
  usiaKehamilan?: string;
  tekananDarah?: string;
  nadi?: string;
  tfu?: string;
  djj?: string;
  letakJanin?: string;
  tabletFe?: string;
  imunisasiTT?: string;

  // Umum
  beratBadan: string;
  tanggal: string;
  status: string;
  keterangan?: string;
}

export default function DetailPemeriksaanPage() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState<Pemeriksaan | null>(null);
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [jk, setJk] = useState("");
  const [beratSebelumHamil, setBeratSebelumHamil] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, "pemeriksaan", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentPemeriksaan = docSnap.data() as Pemeriksaan;
          setData(currentPemeriksaan);

          await getRiwayat(currentPemeriksaan.pasienId, currentPemeriksaan.tanggal);

          if (currentPemeriksaan.jenis === "Balita") {
            const balitaRef = doc(db, "balita", currentPemeriksaan.pasienId);
            const balitaSnap = await getDoc(balitaRef);

            if (balitaSnap.exists()) {
              setJk(balitaSnap.data().jk || "");
            }
          }

          if (currentPemeriksaan.jenis === "Ibu Hamil") {
            const ibuHamilRef = doc(db, "ibu_hamil", currentPemeriksaan.pasienId);
            const ibuHamilSnap = await getDoc(ibuHamilRef);

            if (ibuHamilSnap.exists()) {
              const d = ibuHamilSnap.data();
              const bsh = d.beratSebelumHamil ?? d.bbSebelumHamil ?? d.beratAwal;
              setBeratSebelumHamil(bsh ? Number(bsh) : undefined);
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const getRiwayat = async (pasienId: string, currentTanggal: string) => {
      const q = query(
        collection(db, "pemeriksaan"),
        where("pasienId", "==", pasienId)
      );

      const snapshot = await getDocs(q);

      const hasil = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((r: any) => r.tanggal && r.tanggal <= currentTanggal);

      hasil.sort((a: any, b: any) => {
        const dateA = new Date(a.tanggal || "").getTime();
        const dateB = new Date(b.tanggal || "").getTime();
        if (dateA !== dateB) return dateA - dateB;
        return Number(a.umur || a.usiaKehamilan || 0) - Number(b.umur || b.usiaKehamilan || 0);
      });

      setRiwayat(hasil);
    };

    getData();
  }, [params.id]);

  const formatTanggal = (tanggal?: string) => {
    if (!tanggal) return "-";
    const [tahun, bulan, hari] = tanggal.split("-");
    return `${hari}-${bulan}-${tahun}`;
  };

  const chartData: ChartData[] = riwayat
    .map((r) => ({
      umur: Number(r.umur),
      berat: Number(r.beratBadan),
      tanggal: r.tanggal,
    }))
    .filter((d) => !isNaN(d.umur) && !isNaN(d.berat));

  const chartDataPanjang = riwayat
    .map((r) => ({
      umur: Number(r.umur),
      panjang: Number(r.tinggiBadan),
      tanggal: r.tanggal,
    }))
    .filter((d) => !isNaN(d.umur) && !isNaN(d.panjang));

  const chartDataTinggi = riwayat
    .map((r) => ({
      umur: Number(r.umur),
      tinggi: Number(r.tinggiBadan),
      tanggal: r.tanggal,
    }))
    .filter((d) => !isNaN(d.umur) && !isNaN(d.tinggi));

  const parseMinggu = (val: any) => {
    let m = Number(val);
    if (isNaN(m)) return NaN;
    if (m > 0 && m <= 10) return m * 4; 
    return m; 
  };

  const chartDataKenaikanBerat = (() => {
    const sorted = [...riwayat]
      .map((r) => ({
        minggu: parseMinggu(r.usiaKehamilan),
        bb: Number(r.beratBadan),
        tanggal: r.tanggal,
      }))
      .filter((d) => !isNaN(d.minggu) && !isNaN(d.bb))
      .sort((a, b) => a.minggu - b.minggu);

    const baseBB = beratSebelumHamil && !isNaN(beratSebelumHamil) && beratSebelumHamil > 0
      ? beratSebelumHamil
      : (sorted.length > 0 ? sorted[0].bb : 0);

    return sorted.map((d) => ({
      minggu: d.minggu,
      kenaikanBerat: baseBB > 0 ? d.bb - baseBB : 0,
      tanggal: d.tanggal,
    }));
  })();

  const chartDataEvaluasi = riwayat
    .map((r) => {
      const [sistolStr, diastolStr] = (r.tekananDarah || "").split("/");
      const sistol = sistolStr ? Number(sistolStr) : undefined;
      const diastol = diastolStr ? Number(diastolStr) : undefined;

      const mingguVal = parseMinggu(r.usiaKehamilan);

      return {
        minggu: mingguVal,
        beratBadan: r.beratBadan ? Number(r.beratBadan) : undefined,
        tfu: r.tfu !== undefined && r.tfu !== "" ? Number(r.tfu) : undefined,
        sistol: sistol && !isNaN(sistol) ? sistol : undefined,
        diastol: diastol && !isNaN(diastol) ? diastol : undefined,
        nadi: r.nadi !== undefined && r.nadi !== "" ? Number(r.nadi) : undefined,
        djj: r.djj !== undefined && r.djj !== "" ? Number(r.djj) : undefined,
        letakJanin: r.letakJanin || "-",
        tabletFe: r.tabletFe || "-",
        imunisasiTT: r.imunisasiTT || "-",
        tanggal: r.tanggal,
      };
    })
    .filter((d) => !isNaN(d.minggu));

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <Header title="Detail Pemeriksaan" />

        <div className="mt-6 bg-white rounded-[30px] p-4 md:p-6 shadow-sm max-w-7xl mx-auto">
          {/* Identitas Pasien */}
          <div className="flex gap-8 mb-6 border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs text-gray-500">Nama</p>
              <p className="text-base font-bold text-gray-800 mt-0.5">
                {data?.nama || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Jenis Pemeriksaan</p>
              <p className="text-base font-semibold text-gray-800 mt-0.5">
                {data?.jenis || "-"}
              </p>
            </div>
          </div>

          {/* SECTION GRAFIK & TABEL RIWAYAT BALITA */}
          {data?.jenis === "Balita" && (
            <div className="mt-4 space-y-6">
              {Number(data?.umur) < 24 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {jk === "Laki-laki" ? (
                    <Boy024 data={chartData} />
                  ) : (
                    <Girl024 data={chartData} />
                  )}
                  <PBUChart
                    data={chartDataPanjang}
                    jenisKelamin={jk === "Laki-laki" ? "Laki-laki" : "Perempuan"}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {jk === "Laki-laki" ? (
                    <Boy2460 data={chartData} />
                  ) : (
                    <Girl2460 data={chartData} />
                  )}
                  <TBUChart
                    data={chartDataTinggi}
                    jenisKelamin={jk === "Laki-laki" ? "Laki-laki" : "Perempuan"}
                  />
                </div>
              )}

              {/* TABEL RIWAYAT PEMERIKSAAN BALITA DI BAWAH KEDUA GRAFIK */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-gray-800 mb-3">Tabel Riwayat Pemeriksaan Balita</h3>
                <div className="overflow-x-auto border rounded-md">
                  <table className="w-full text-[11px] border-collapse text-gray-800 bg-white">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="border px-3 py-2 text-center">No</th>
                        <th className="border px-3 py-2 text-center">Tanggal</th>
                        <th className="border px-3 py-2 text-center">Umur (Bulan)</th>
                        <th className="border px-3 py-2 text-center">Berat Badan (kg)</th>
                        <th className="border px-3 py-2 text-center">Tinggi/Panjang (cm)</th>
                        <th className="border px-3 py-2 text-center">Lingkar Lengan (cm)</th>
                        <th className="border px-3 py-2 text-center">Vitamin A</th>
                        <th className="border px-3 py-2 text-center">ASI Eksklusif</th>
                        <th className="border px-3 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riwayat.map((r, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2 text-center">{index + 1}</td>
                          <td className="border p-2 text-center">{formatTanggal(r.tanggal)}</td>
                          <td className="border p-2 text-center">{r.umur ?? "-"}</td>
                          <td className="border p-2 text-center font-bold text-blue-700">
                            {r.beratBadan ? `${r.beratBadan} kg` : "-"}
                          </td>
                          <td className="border p-2 text-center">{r.tinggiBadan ? `${r.tinggiBadan} cm` : "-"}</td>
                          <td className="border p-2 text-center">{r.lingkarLengan ? `${r.lingkarLengan} cm` : "-"}</td>
                          <td className="border p-2 text-center">{r.vitaminA ?? "-"}</td>
                          <td className="border p-2 text-center">{r.asiEksklusif ?? "-"}</td>
                          <td className="border p-2 text-center font-semibold text-emerald-700">{r.statusPertumbuhan ?? r.status ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION GRAFIK & TABEL RIWAYAT IBU HAMIL */}
          {data?.jenis === "Ibu Hamil" && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* GRAFIK KIRI: Evaluasi Kehamilan (TFU, DJJ, TD, Nadi, BB) */}
                <div className="w-full">
                  <GrafikEvaluasiKehamilan data={chartDataEvaluasi} />
                </div>

                {/* GRAFIK KANAN: KMS Peningkatan Berat Badan IMT */}
                <div className="w-full">
                  <KMSIbuHamilChart data={chartDataKenaikanBerat} />
                </div>
              </div>

              {/* TABEL RIWAYAT PEMERIKSAAN IBU HAMIL DI BAWAH KEDUA GRAFIK */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-gray-800 mb-3">Tabel Riwayat Pemeriksaan Ibu Hamil</h3>
                <div className="overflow-x-auto border rounded-md">
                  <table className="w-full text-[11px] border-collapse text-gray-800 bg-white">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="border px-3 py-2 text-center">No</th>
                        <th className="border px-3 py-2 text-center">Tanggal</th>
                        <th className="border px-3 py-2 text-center">Usia Kehamilan (Minggu)</th>
                        <th className="border px-3 py-2 text-center">Berat Badan (kg)</th>
                        <th className="border px-3 py-2 text-center">Tekanan Darah (mmHg)</th>
                        <th className="border px-3 py-2 text-center">Nadi (x/mnt)</th>
                        <th className="border px-3 py-2 text-center">TFU (cm)</th>
                        <th className="border px-3 py-2 text-center">DJJ (bpm)</th>
                        <th className="border px-3 py-2 text-center">Letak Janin</th>
                        <th className="border px-3 py-2 text-center">Tablet Fe</th>
                        <th className="border px-3 py-2 text-center">Imunisasi TT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riwayat.map((r, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2 text-center">{index + 1}</td>
                          <td className="border p-2 text-center">{formatTanggal(r.tanggal)}</td>
                          <td className="border p-2 text-center">{r.usiaKehamilan ?? "-"}</td>
                          <td className="border p-2 text-center">
                            {r.beratBadan ? `${r.beratBadan} kg` : "-"}
                          </td>
                          <td className="border p-2 text-center">{r.tekananDarah || "-"}</td>
                          <td className="border p-2 text-center">{r.nadi || "-"}</td>
                          <td className="border p-2 text-center">{r.tfu || "-"}</td>
                          <td className="border p-2 text-center">{r.djj || "-"}</td>
                          <td className="border p-2 text-center">{r.letakJanin || "-"}</td>
                          <td className="border p-2 text-center">{r.tabletFe || "-"}</td>
                          <td className="border p-2 text-center">{r.imunisasiTT || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => router.push("/pemeriksaan")}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-2xl font-medium hover:opacity-95 transition-all shadow-sm"
          >
            Kembali
          </button>
        </div>
      </main>
    </div>
  );
}