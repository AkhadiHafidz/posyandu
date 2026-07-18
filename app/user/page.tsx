"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  Baby,
  HeartPulse,
  ClipboardList,
  ArrowRight,
  Activity,
  Users,
} from "lucide-react";

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

interface Jadwal {
  id: string;

  kegiatan: string;

  tanggal: string;

  waktu: string;
}

export default function DashboardPage() {

  // TOTAL
  const [totalBalita, setTotalBalita] =
    useState(0);

  const [totalIbuHamil, setTotalIbuHamil] =
    useState(0);

  const [totalPemeriksaan, setTotalPemeriksaan] =
    useState(0);

  const [totalPengguna, setTotalPengguna] =
    useState(0);

  const [roleUser, setRoleUser] =
    useState("");

  // JADWAL
  const [chartData, setChartData] = useState([
  { bulan: "Jan",balita: 0, ibuHamil: 0 },
  { bulan: "Feb", balita: 0, ibuHamil: 0 },
  { bulan: "Mar", balita: 0, ibuHamil: 0 },
  { bulan: "Apr", balita: 0, ibuHamil: 0 },
  { bulan: "Mei", balita: 0, ibuHamil: 0 },
  { bulan: "Jun", balita: 0, ibuHamil: 0 },
  { bulan: "Jul", balita: 0, ibuHamil: 0 },
  { bulan: "Agu", balita: 0, ibuHamil: 0 },
  { bulan: "Sep", balita: 0, ibuHamil: 0 },
  { bulan: "Okt", balita: 0, ibuHamil: 0 },
  { bulan: "Nov", balita: 0, ibuHamil: 0 },
  { bulan: "Des", balita: 0, ibuHamil: 0 },
]);


  const [loading, setLoading] =
    useState(true);

  // GET DATA
  const getDashboardData =
    async () => {

      try {

        // ======================
        // BALITA
        // ======================

        const balitaSnapshot =
          await getDocs(
            collection(
              db,
              "balita"
            )
          );

        setTotalBalita(
          balitaSnapshot.size
        );

        // ======================
        // IBU HAMIL
        // ======================

        const ibuSnapshot =
          await getDocs(
            collection(
              db,
              "ibu_hamil"
            )
          );

        setTotalIbuHamil(
          ibuSnapshot.size
        );

        // ======================
        // PEMERIKSAAN
        // ======================

        const pemeriksaanSnapshot =
          await getDocs(
            collection(
              db,
              "pemeriksaan"
            )
          );

        setTotalPemeriksaan(
          pemeriksaanSnapshot.size
        );

        // ======================
        // USERS
        // ======================

        const usersSnapshot =
          await getDocs(
            collection(
              db,
              "users"
            )
          );

        setTotalPengguna(
          usersSnapshot.size
        );

        // ======================
        // JADWAL
        // ======================
const bulan = [
  { bulan: "Jan", balita: 0, ibuHamil: 0 },
  { bulan: "Feb", balita: 0, ibuHamil: 0 },
  { bulan: "Mar", balita: 0, ibuHamil: 0 },
  { bulan: "Apr", balita: 0, ibuHamil: 0 },
  { bulan: "Mei", balita: 0, ibuHamil: 0 },
  { bulan: "Jun", balita: 0, ibuHamil: 0 },
  { bulan: "Jul", balita: 0, ibuHamil: 0 },
  { bulan: "Agu", balita: 0, ibuHamil: 0 },
  { bulan: "Sep", balita: 0, ibuHamil: 0 },
  { bulan: "Okt", balita: 0, ibuHamil: 0 },
  { bulan: "Nov", balita: 0, ibuHamil: 0 },
  { bulan: "Des", balita: 0, ibuHamil: 0 },
];

pemeriksaanSnapshot.forEach((doc) => {

  const data = doc.data();

  if (!data.tanggal) return;

  const parts = data.tanggal.split("-");

  const month = Number(parts[1]) - 1;

  if (month >= 0 && month <= 11) {

  if (data.jenis === "Balita") {

    bulan[month].balita++;

  } else if (data.jenis === "Ibu Hamil") {

    bulan[month].ibuHamil++;

  }

}

});

setChartData([...bulan]);
console.log("Bulan =", bulan);
} catch (error) {
  console.log(error);
} finally {
  setLoading(false);
}
};

  useEffect(() => {

  const loadData = async () => {

    await getDashboardData();

    // ADMIN (Firebase Auth)
    if (auth.currentUser?.email === "admin@gmail.com") {
      setRoleUser("admin");
      return;
    }

    // USER / KADER (Firestore)
    const uid = localStorage.getItem("uid");

    if (!uid) return;

    const docRef = doc(db, "users", uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      setRoleUser(data.role?.toLowerCase());

    }

  };

  loadData();

}, []);



  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col lg:flex-row">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6">

        {/* HEADER */}
        <Header title="Dashboard" />

      

        {/* STATISTIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

          {/* BALITA */}
          <Link
            href="/balita"
            className="bg-white rounded-[20px] p-4 min-h-[100px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-8 h-8 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">

                <Baby size={20} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={16}
              />

            </div>

            <h1 className="text-3xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalBalita}
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Data Balita
            </p>

          </Link>

          {/* IBU HAMIL */}
          <Link
            href="/ibu-hamil"
            className="bg-white rounded-[20px] p-4 min-h-[100px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">

                <HeartPulse size={20} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={16}
              />

            </div>

            <h1 className="text-3xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalIbuHamil}
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Ibu Hamil
            </p>

          </Link>

          {/* PEMERIKSAAN */}
          <Link
            href="/pemeriksaan"
            className="bg-white rounded-[20px] p-4 min-h-[100px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                <ClipboardList size={20} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={16}
              />

            </div>

            <h1 className="text-3xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalPemeriksaan}
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Pemeriksaan
            </p>

          </Link>

          {/* USERS */}
          {roleUser === "admin" && (
          <Link
            href="/pengguna"
            className="bg-white rounded-[20px] p-4 min-h-[100px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                <Users size={20} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={18}
              />

            </div>

            <h1 className="text-3xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalPengguna}
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Pengguna
            </p>

          </Link>
          )}

        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">

          {/* GRAFIK */}
<div className="xl:col-span-2 bg-white rounded-[20px] p-4 shadow-sm">

  <ResponsiveContainer width="95%" height={250}>

    <BarChart data={chartData}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="bulan" />

    <YAxis
  allowDecimals={false}
  domain={[0, "dataMax + 5"]}
/>

      <Tooltip
  cursor={{ fill: "#f3f4f6" }}
  contentStyle={{
    backgroundColor: "#ffffff",
    border: "1px solid #22c55e",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
  }}
  labelStyle={{
    color: "#111827",
    fontWeight: "bold",
    fontSize: 16,
  }}
  itemStyle={{
    fontSize: 15,
    fontWeight: 600,
  }}
/>

      <Legend />

      <Bar
    dataKey="balita"
    name="Balita"
    fill="#ef4444"
    radius={[6,6,0,0]}
  />

  <Bar
    dataKey="ibuHamil"
    name="Ibu Hamil"
    fill="#3b82f6"
    radius={[6,6,0,0]}
  />

    </BarChart>

  </ResponsiveContainer>

</div>

          {/* QUICK ACTION */}
<div className="xl:col-span-1 bg-white rounded-[20px] p-5 shadow-sm h-fit">

            <h2 className="text-sm font-black text-gray-800">
              Quick Action
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Akses cepat menu utama
            </p>

            {/* MENU */}
            <div className="mt-3 space-y-2">

              <Link
                href="/balita/tambah"
                className="flex items-center justify-between bg-green-50 hover:bg-green-100 transition rounded-2xl p-1"
              >

                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                    <Baby size={20} />

                  </div>

                  <div>

                    <h3 className="text-[15px] font-bold text-gray-800">
                      Tambah Balita
                    </h3>

                    <p className="text-xs text-gray-500">
                      Input data balita baru
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={18}
                />

              </Link>

              <Link
                href="/ibu-hamil/tambah"
                className="flex items-center justify-between bg-pink-50 hover:bg-pink-100 transition rounded-2xl p-1"
              >

                <div className="flex items-center gap-4">

                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">

                    <HeartPulse size={20} />

                  </div>

                  <div>

                    <h3 className="text-[15px] font-bold text-gray-800">
                      Tambah Ibu Hamil
                    </h3>

                    <p className="text-xs text-gray-500">
                      Input data ibu hamil
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={18}
                />

              </Link>

              <Link
                href="/pemeriksaan/tambah"
                className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition rounded-2xl p-1"
              >

                <div className="flex items-center gap-4">

                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                    <ClipboardList size={20} />

                  </div>

                  <div>

                    <h3 className="text-[15px] font-bold text-gray-800">
                      Pemeriksaan
                    </h3>

                    <p className="text-xs text-gray-500">
                      Tambah pemeriksaan
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={18}
                />

              </Link>

              <Link
                href="/laporan"
                className="flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition rounded-2xl p-1"
              >

                <div className="flex items-center gap-4">

                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                    <Activity size={20} />

                  </div>

                  <div>

                    <h3 className="text-[15px] font-bold text-gray-800">
                       Laporan
                    </h3>

                    <p className=" text-xs text-gray-500">
                      Download laporan excel
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={18}
                />

              </Link>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}