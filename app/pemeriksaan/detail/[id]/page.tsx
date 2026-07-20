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

  
    // Ibu Hamil
usiaKehamilan?: string;
tekananDarah?: string;
nadi?: string;
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

            if (pemeriksaan.jenis === "Ibu Hamil") {
              const ibuHamilRef = doc(db, "ibu_hamil", pemeriksaan.pasienId);
              const ibuHamilSnap = await getDoc(ibuHamilRef);

              if (ibuHamilSnap.exists()) {
                const d = ibuHamilSnap.data();
                setBeratSebelumHamil(
                  d.beratSebelumHamil ? Number(d.beratSebelumHamil) : undefined
                );
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

        const hasil = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRiwayat(hasil);
      };

      getData();
    }, [params.id]);

    const formatTanggal = (tanggal?: string) => {
      if (!tanggal) return "-";
      const [tahun, bulan, hari] = tanggal.split("-");
      return `${hari}-${bulan}-${tahun}`;
    };

    // Mapping data mentah Firestore -> bentuk yang dibutuhkan komponen chart BBU (berat)
    const chartData: ChartData[] = riwayat
      .map((r) => ({
        umur: Number(r.umur),
        berat: Number(r.beratBadan),
        tanggal: r.tanggal,
      }))
      .filter((d) => !isNaN(d.umur) && !isNaN(d.berat));

    // Mapping data mentah Firestore -> bentuk yang dibutuhkan komponen chart PBU (panjang, 0-24 bulan)
    const chartDataPanjang = riwayat
      .map((r) => ({
        umur: Number(r.umur),
        panjang: Number(r.tinggiBadan),
        tanggal: r.tanggal,
      }))
      .filter((d) => !isNaN(d.umur) && !isNaN(d.panjang));

    // Mapping data mentah Firestore -> bentuk yang dibutuhkan komponen chart TBU (tinggi, 24-60 bulan)
    const chartDataTinggi = riwayat
      .map((r) => ({
        umur: Number(r.umur),
        tinggi: Number(r.tinggiBadan),
        tanggal: r.tanggal,
      }))
      .filter((d) => !isNaN(d.umur) && !isNaN(d.tinggi));

    // Mapping data mentah Firestore -> bentuk yang dibutuhkan komponen chart Kenaikan Berat Ibu Hamil
    const chartDataKenaikanBerat = riwayat
      .map((r) => ({
        minggu: Number(r.usiaKehamilan),
        kenaikanBerat: beratSebelumHamil
          ? Number(r.beratBadan) - beratSebelumHamil
          : NaN,
        tanggal: r.tanggal,
      }))
      .filter((d) => !isNaN(d.minggu) && !isNaN(d.kenaikanBerat));

    // Mapping data mentah Firestore -> bentuk yang dibutuhkan EvaluasiKehamilanChart (TFU, DJJ, Tekanan Darah)
  

const chartDataEvaluasi = riwayat
  .map((r) => {
    const [sistol, diastol] = (r.tekananDarah || "0/0")
      .split("/")
      .map(Number);

    return {
      // Firestore menyimpan bulan
      // Grafik memakai minggu
      minggu: Number(r.usiaKehamilan) * 4,

      tfu: Number(r.tfu),

      sistol,
      diastol,

      nadi: Number(r.nadi),

      djj: Number(r.djj),

      letakJanin: r.letakJanin || "-",
      tabletFe: r.tabletFe || "-",
      imunisasiTT: r.imunisasiTT || "-",
      keluhan: r.keluhan || "-",

      tanggal: r.tanggal,
    };
  })
  .filter((d) => !isNaN(d.minggu));

    return (
      <div className="min-h-screen bg-[#F5FFF8] flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8">
          <Header title="Detail Pemeriksaan" />

          <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm max-w-4xl">
            <div className="flex gap-8 mt-4">
              {/* Nama */}
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="text-base font-bold text-gray-800 mt-0.5">
                  {data?.nama || "-"}
                </p>
              </div>

              {/* Jenis */}
              <div>
                <p className="text-xs text-gray-500">Jenis Pemeriksaan</p>
                <p className="text-base font-semibold text-gray-800 mt-0.5">
                  {data?.jenis || "-"}
                </p>
              </div>
            </div>

            {data?.jenis === "Balita" && (
              <div className="mt-4">
                {Number(data?.umur) < 24 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            )}

          {data?.jenis === "Ibu Hamil" && (
    <div className="mt-4">
      <GrafikEvaluasiKehamilan data={chartDataEvaluasi} />
    </div>
  )}

            <button
              onClick={() => router.push("/pemeriksaan")}
              className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl"
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }