"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-green-50 via-white to-green-100 text-gray-800">
      
      {/* BACKGROUND BLUR */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-extrabold text-green-700"
          >
            Posyandu Cempaka
          </motion.h1>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#fitur" className="hover:text-green-600 transition">
              Fitur
            </a>

            <a
              href="/login"
              className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition shadow-lg"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto min-h-[90vh] flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20 gap-16">
        
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 text-center md:text-left"
        >
          <motion.div
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm"
          >
            Sistem Informasi Posyandu Modern
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Pelayanan
            <span className="text-green-600"> Posyandu </span>
            Digital
          </h1>

          <p className="mt-8 text-lg text-gray-600 max-w-2xl leading-relaxed">
            Membantu kader posyandu dalam pencatatan data balita,
            pemeriksaan kesehatan, imunisasi, dan laporan digital
            secara cepat, aman, modern, dan terintegrasi.
          </p>

          {/* BUTTON */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
            <motion.a
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              href="/login"
              className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-green-700 transition font-semibold"
            >
              Masuk Dashboard
            </motion.a>

            <motion.a
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              href="#fitur"
              className="border border-green-600 text-green-700 px-8 py-4 rounded-2xl hover:bg-green-50 transition font-semibold"
            >
              Jelajahi Fitur
            </motion.a>
          </div>

        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 flex justify-center"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-green-300 opacity-30 blur-3xl rounded-full"></div>

            <Image
              src="/healt.png"
              alt="Healthcare"
              width={600}
              height={600}
              priority
              className="relative z-10 drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* FITUR */}
      <section
        id="fitur"
        className="py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black">
              Fitur Utama
            </h2>

            <p className="text-gray-600 mt-5 text-lg">
              Solusi digital modern untuk pelayanan kesehatan posyandu.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {[
              {
                icon: "👶",
                title: "Data Balita",
                desc: "Kelola data identitas balita dan riwayat kesehatan secara lengkap.",
              },
              {
                icon: "🩺",
                title: "Pemeriksaan",
                desc: "Catat pemeriksaan kesehatan, imunisasi, dan perkembangan balita.",
              },
              {
                icon: "📊",
                title: "Laporan Digital",
                desc: "Export laporan Excel dan monitoring data secara realtime.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[30px] p-8 shadow-xl"
              >
                <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold mt-7">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-4 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/20 bg-white/70 backdrop-blur-xl py-8 text-center text-gray-500">
        © 2026 Posyandu SI — Sistem Informasi Posyandu Modern
      </footer>
    </div>
  );
}