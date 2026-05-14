"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

import {
  FileSpreadsheet,
  Download,
  Baby,
  HeartPulse,
  ClipboardList,
} from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import * as XLSX from "xlsx";

export default function LaporanPage() {

  // TOTAL
  const [totalBalita, setTotalBalita] =
    useState(0);

  const [totalIbuHamil, setTotalIbuHamil] =
    useState(0);

  const [totalPemeriksaan, setTotalPemeriksaan] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  // GET DATA
  const getData = async () => {

    try {

      // BALITA
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

      // IBU HAMIL
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

      // PEMERIKSAAN
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

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    getData();

  }, []);

  // EXPORT BALITA
  const exportBalita = async () => {

    const querySnapshot =
      await getDocs(
        collection(
          db,
          "balita"
        )
      );

    const data: any[] = [];

    querySnapshot.forEach((doc) => {

      data.push(doc.data());
    });

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Data Balita"
    );

    XLSX.writeFile(
      workbook,
      "laporan-balita.xlsx"
    );
  };

  // EXPORT IBU HAMIL
  const exportIbuHamil =
    async () => {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "ibu_hamil"
          )
        );

      const data: any[] = [];

      querySnapshot.forEach(
        (doc) => {

          data.push(doc.data());
        }
      );

      const worksheet =
        XLSX.utils.json_to_sheet(
          data
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Data Ibu Hamil"
      );

      XLSX.writeFile(
        workbook,
        "laporan-ibu-hamil.xlsx"
      );
    };

  // EXPORT PEMERIKSAAN
  const exportPemeriksaan =
    async () => {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "pemeriksaan"
          )
        );

      const data: any[] = [];

      querySnapshot.forEach(
        (doc) => {

          data.push(doc.data());
        }
      );

      const worksheet =
        XLSX.utils.json_to_sheet(
          data
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Data Pemeriksaan"
      );

      XLSX.writeFile(
        workbook,
        "laporan-pemeriksaan.xlsx"
      );
    };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-6 md:p-8">

        {/* HEADER */}
        <Header title="Laporan" />

        {/* TOP */}
        <div className="mt-8">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
              <FileSpreadsheet size={34} />
            </div>

            <div>

              <h1 className="text-4xl font-black text-gray-800">
                Laporan Posyandu
              </h1>

              <p className="text-gray-500 mt-2">
                Download laporan data posyandu dalam format Excel
              </p>

            </div>

          </div>

        </div>

        {/* STATISTIC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          {/* BALITA */}
          <div className="bg-white rounded-[30px] p-8 shadow-sm hover:shadow-lg transition">

            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <Baby size={28} />
            </div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalBalita}
            </h1>

            <p className="text-gray-500 mt-2">
              Total Data Balita
            </p>

          </div>

          {/* IBU HAMIL */}
          <div className="bg-white rounded-[30px] p-8 shadow-sm hover:shadow-lg transition">

            <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <HeartPulse size={28} />
            </div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalIbuHamil}
            </h1>

            <p className="text-gray-500 mt-2">
              Total Data Ibu Hamil
            </p>

          </div>

          {/* PEMERIKSAAN */}
          <div className="bg-white rounded-[30px] p-8 shadow-sm hover:shadow-lg transition">

            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ClipboardList size={28} />
            </div>

            <h1 className="text-4xl font-black text-gray-800 mt-6">
              {loading
                ? "..."
                : totalPemeriksaan}
            </h1>

            <p className="text-gray-500 mt-2">
              Total Pemeriksaan
            </p>

          </div>

        </div>

        {/* EXPORT */}
        <div className="mt-10 bg-white rounded-[30px] p-8 shadow-sm">

          <h2 className="text-3xl font-black text-gray-800">
            Export Laporan
          </h2>

          <p className="text-gray-500 mt-2">
            Download laporan data dalam format Excel
          </p>

          {/* BUTTON */}
          <div className="grid md:grid-cols-3 gap-5 mt-8">

            {/* BALITA */}
            <button
              onClick={exportBalita}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 text-left shadow-lg hover:scale-[1.02] transition"
            >

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Baby size={28} />
              </div>

              <h2 className="text-2xl font-black mt-6">
                Laporan Balita
              </h2>

              <p className="text-green-100 mt-2">
                Download data balita
              </p>

              <div className="flex items-center gap-2 mt-6">

                <Download size={18} />

                Download Excel

              </div>

            </button>

            {/* IBU HAMIL */}
            <button
              onClick={exportIbuHamil}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-3xl p-6 text-left shadow-lg hover:scale-[1.02] transition"
            >

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <HeartPulse size={28} />
              </div>

              <h2 className="text-2xl font-black mt-6">
                Laporan Ibu Hamil
              </h2>

              <p className="text-pink-100 mt-2">
                Download data ibu hamil
              </p>

              <div className="flex items-center gap-2 mt-6">

                <Download size={18} />

                Download Excel

              </div>

            </button>

            {/* PEMERIKSAAN */}
            <button
              onClick={
                exportPemeriksaan
              }
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-3xl p-6 text-left shadow-lg hover:scale-[1.02] transition"
            >

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <ClipboardList size={28} />
              </div>

              <h2 className="text-2xl font-black mt-6">
                Laporan Pemeriksaan
              </h2>

              <p className="text-blue-100 mt-2">
                Download data pemeriksaan
              </p>

              <div className="flex items-center gap-2 mt-6">

                <Download size={18} />

                Download Excel

              </div>

            </button>

          </div>

        </div>

      </main>
    </div>
  );
}