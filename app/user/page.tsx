"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

import {
  Baby,
  HeartPulse,
  ClipboardList,
  CalendarDays,
  ArrowRight,
  Activity,
  Users,
} from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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

  // JADWAL
  const [jadwal, setJadwal] =
    useState<Jadwal[]>([]);

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

        const jadwalSnapshot =
          await getDocs(
            collection(
              db,
              "jadwal"
            )
          );

        const jadwalData: Jadwal[] =
          [];

        jadwalSnapshot.forEach(
          (doc) => {

            const data =
              doc.data();

            jadwalData.push({
              id: doc.id,

              kegiatan:
                String(
                  data.kegiatan ||
                    ""
                ),

              tanggal:
                String(
                  data.tanggal ||
                    ""
                ),

              waktu:
                String(
                  data.waktu ||
                    ""
                ),
            });
          }
        );

        setJadwal(
          jadwalData.slice(0, 4)
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    getDashboardData();

  }, []);

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-6 md:p-8">

        {/* HEADER */}
        <Header title="Dashboard" />

        {/* HERO */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-[35px] p-8 md:p-10 text-white shadow-xl relative overflow-hidden">

          {/* SHAPE */}
          <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] bg-white/10 rounded-full"></div>

          <div className="absolute bottom-[-70px] left-[-70px] w-[180px] h-[180px] bg-white/10 rounded-full"></div>

          {/* CONTENT */}
          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

                <Activity size={30} />

              </div>

              <div>

                <h1 className="text-4xl font-black">
                  Dashboard Posyandu
                </h1>

                <p className="text-green-100 mt-2">
                  Monitoring data kesehatan posyandu secara realtime
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* STATISTIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          {/* BALITA */}
          <Link
            href="/balita"
            className="bg-white rounded-[30px] p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                <Baby size={28} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={22}
              />

            </div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalBalita}
            </h1>

            <p className="text-gray-500 mt-2">
              Data Balita
            </p>

          </Link>

          {/* IBU HAMIL */}
          <Link
            href="/ibu-hamil"
            className="bg-white rounded-[30px] p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">

                <HeartPulse size={28} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={22}
              />

            </div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalIbuHamil}
            </h1>

            <p className="text-gray-500 mt-2">
              Ibu Hamil
            </p>

          </Link>

          {/* PEMERIKSAAN */}
          <Link
            href="/pemeriksaan"
            className="bg-white rounded-[30px] p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                <ClipboardList size={28} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={22}
              />

            </div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalPemeriksaan}
            </h1>

            <p className="text-gray-500 mt-2">
              Pemeriksaan
            </p>

          </Link>

          {/* USERS */}
          <Link
            href="/pengguna"
            className="bg-white rounded-[30px] p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">

                <Users size={28} />

              </div>

              <ArrowRight
                className="text-gray-400"
                size={22}
              />

            </div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalPengguna}
            </h1>

            <p className="text-gray-500 mt-2">
              Pengguna
            </p>

          </Link>

        </div>

        {/* CONTENT GRID */}
        <div className="grid xl:grid-cols-3 gap-6 mt-8">

          {/* JADWAL */}
          <div className="xl:col-span-2 bg-white rounded-[30px] p-8 shadow-sm">

            {/* TITLE */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">

                  <CalendarDays size={24} />

                </div>

                <div>

                  <h2 className="text-2xl font-black text-gray-800">
                    Jadwal Kegiatan
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Jadwal posyandu terbaru
                  </p>

                </div>

              </div>

              <Link
                href="/jadwal"
                className="text-green-600 font-semibold hover:underline"
              >
                Lihat Semua
              </Link>

            </div>

            {/* LIST */}
            <div className="mt-8 space-y-5">

              {jadwal.length > 0 ? (
                jadwal.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="border border-green-100 rounded-3xl p-5 hover:bg-green-50 transition"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div>

                          <h3 className="text-lg font-bold text-gray-800">
                            {
                              item.kegiatan
                            }
                          </h3>

                          <p className="text-gray-500 mt-2">
                            {
                              item.tanggal
                            }{" "}
                            •{" "}
                            {
                              item.waktu
                            }
                          </p>

                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                          <CalendarDays
                            size={22}
                          />

                        </div>

                      </div>

                    </div>
                  )
                )
              ) : (
                <div className="text-center py-14">

                  <h2 className="text-2xl font-bold text-gray-700">
                    Jadwal Belum Ada
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Tambahkan jadwal kegiatan posyandu
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* QUICK ACTION */}
          <div className="bg-white rounded-[30px] p-8 shadow-sm">

            <h2 className="text-2xl font-black text-gray-800">
              Quick Action
            </h2>

            <p className="text-gray-500 mt-2">
              Akses cepat menu utama
            </p>

            {/* MENU */}
            <div className="mt-8 space-y-4">

              <Link
                href="/balita/tambah"
                className="flex items-center justify-between bg-green-50 hover:bg-green-100 transition rounded-2xl p-5"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                    <Baby size={24} />

                  </div>

                  <div>

                    <h3 className="font-bold text-gray-800">
                      Tambah Balita
                    </h3>

                    <p className="text-sm text-gray-500">
                      Input data balita baru
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={20}
                />

              </Link>

              <Link
                href="/ibu-hamil/tambah"
                className="flex items-center justify-between bg-pink-50 hover:bg-pink-100 transition rounded-2xl p-5"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">

                    <HeartPulse size={24} />

                  </div>

                  <div>

                    <h3 className="font-bold text-gray-800">
                      Tambah Ibu Hamil
                    </h3>

                    <p className="text-sm text-gray-500">
                      Input data ibu hamil
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={20}
                />

              </Link>

              <Link
                href="/pemeriksaan/tambah"
                className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition rounded-2xl p-5"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                    <ClipboardList size={24} />

                  </div>

                  <div>

                    <h3 className="font-bold text-gray-800">
                      Pemeriksaan
                    </h3>

                    <p className="text-sm text-gray-500">
                      Tambah pemeriksaan
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={20}
                />

              </Link>

              <Link
                href="/laporan"
                className="flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition rounded-2xl p-5"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                    <Activity size={24} />

                  </div>

                  <div>

                    <h3 className="font-bold text-gray-800">
                      Export Laporan
                    </h3>

                    <p className="text-sm text-gray-500">
                      Download laporan excel
                    </p>

                  </div>

                </div>

                <ArrowRight
                  className="text-gray-400"
                  size={20}
                />

              </Link>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}