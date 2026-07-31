"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-green-50 via-white to-green-100 text-gray-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-700">
            Posyandu Cempaka 2B
          </h1>

          <nav className="flex items-center gap-4 sm:gap-8 text-sm font-medium">
            <a href="#fitur" className="hidden sm:inline hover:text-green-600 transition">
              Fitur
            </a>
            <a
              href="/login"
              className="bg-green-600 text-white px-4 sm:px-5 py-2 rounded-xl hover:bg-green-700 transition shadow-lg text-xs sm:text-sm"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-6 py-8 md:py-16 gap-8">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4">
            Sistem Informasi Posyandu Modern
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight">
            <span className="text-green-600">Posyandu</span> Digital
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Membantu kader posyandu dalam pencatatan data balita, pemeriksaan kesehatan, imunisasi, dan laporan digital secara cepat, aman, modern, dan terintegrasi.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center md:justify-start">
            <a
              href="/login"
              className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-xl hover:bg-green-700 transition font-semibold text-center text-sm sm:text-base"
            >
              Masuk Dashboard
            </a>
            <a
              href="#fitur"
              className="border border-green-600 text-green-700 px-6 py-3 rounded-2xl hover:bg-green-50 transition font-semibold text-center text-sm sm:text-base"
            >
              Jelajahi Fitur
            </a>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex justify-center w-full max-w-[300px] sm:max-w-[400px] md:max-w-none">
          <Image
            src="/healt.png"
            alt="Healthcare"
            width={400}
            height={400}
            priority
            className="w-full h-auto drop-shadow-2xl object-contain"
          />
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black">Fitur Utama</h2>
            <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-lg">
              Solusi digital modern untuk pelayanan kesehatan posyandu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: "👶", title: "Data Balita", desc: "Kelola data identitas balita dan riwayat kesehatan secara lengkap." },
              { icon: "🩺", title: "Pemeriksaan", desc: "Catat pemeriksaan kesehatan, imunisasi, dan perkembangan balita." },
              { icon: "📊", title: "Laporan Digital", desc: "Export laporan Excel dan monitoring data secara realtime." },
            ].map((item, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl sm:rounded-[30px] p-6 sm:p-8 shadow-xl">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mt-4 sm:mt-6">{item.title}</h3>
                <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}