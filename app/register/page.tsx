"use client";

import { useState } from "react";

import Link from "next/link";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

export default function RegisterPage() {

  const router = useRouter();

  // STATE
  const [nama, setNama] = useState("");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [konfirmasi, setKonfirmasi] = useState("");

  // LOADING
  const [loading, setLoading] = useState(false);

  // REGISTER
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    // VALIDASI
    if (
      nama.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "" ||
      konfirmasi.trim() === ""
    ) {

      alert("Semua field wajib diisi");

      return;
    }

    // PASSWORD TIDAK SAMA
    if (password !== konfirmasi) {

      alert("Konfirmasi password tidak sama");

      return;
    }

    try {

      setLoading(true);

      // SAVE TO FIRESTORE
      await addDoc(collection(db, "users"), {
        nama,
        username,
        password,
        createdAt: new Date(),
      });

      alert("Registrasi berhasil");

      router.push("/login");

    } catch (error: any) {

      console.log(error);

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-200 via-green-100 to-emerald-200 flex items-center justify-center px-4 py-6">

      {/* BLUR */}
      <div className="absolute top-[-100px] right-[-100px] w-[320px] h-[320px] bg-green-300 opacity-30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-emerald-300 opacity-30 rounded-full blur-3xl"></div>

      {/* BACK */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 bg-white/80 backdrop-blur-xl px-3 py-2 rounded-xl shadow-md hover:scale-105 transition text-gray-700 text-xs font-medium"
      >
        ← Kembali
      </button>

      {/* CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="w-full max-w-3xl min-h-[440px] bg-white rounded-2xl overflow-hidden shadow-xl grid md:grid-cols-2"
      >

        {/* LEFT */}
        <div className="relative hidden md:flex bg-gradient-to-br from-green-500 to-emerald-600 items-center justify-center overflow-hidden">

          {/* SHAPE */}
          <div className="absolute top-[-70px] left-[-70px] w-[150px] h-[150px] border-[18px] border-green-200/30 rounded-full"></div>

          <div className="absolute bottom-[-90px] left-[-90px] w-[180px] h-[180px] bg-green-300/20 rounded-full"></div>

          {/* CONTENT */}
          <div className="relative z-10 text-center px-6">

            <motion.h1
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="text-4xl font-black text-white"
            >
              Register
              <span className="text-green-200">!</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.4,
              }}
              className="mt-4 text-green-100 text-sm leading-relaxed"
            >
              Buat akun baru untuk mengakses
              sistem informasi Posyandu Digital
            </motion.p>

            {/* IMAGE */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="mt-8 flex justify-center"
            >

              <Image
                src="/healt.png"
                alt="Doctor"
                width={210}
                height={210}
                priority
                className="drop-shadow-2xl"
              />

            </motion.div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-5 py-6 bg-[#FAFFFB]">

          <div className="w-full max-w-sm">

            {/* TITLE */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="text-center mb-6"
            >

              <h1 className="text-2xl font-black">
                <span className="text-green-600">
                  Register
                </span>{" "}
                <span className="text-gray-500 font-medium">
                  Account
                </span>
              </h1>

              <p className="text-gray-400 mt-1 text-xs">
                Daftar akun Posyandu
              </p>

            </motion.div>

            {/* FORM */}
            <form
              onSubmit={handleRegister}
              className="space-y-3"
            >

              {/* NAMA */}
              <div>

                <label className="text-xs font-semibold text-gray-700">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full mt-1 bg-white border border-green-100 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                />

              </div>

              {/* USERNAME */}
              <div>

                <label className="text-xs font-semibold text-gray-700">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full mt-1 bg-white border border-green-100 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="text-xs font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full mt-1 bg-white border border-green-100 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                />

              </div>

              {/* KONFIRMASI */}
              <div>

                <label className="text-xs font-semibold text-gray-700">
                  Konfirmasi Password
                </label>

                <input
                  type="password"
                  value={konfirmasi}
                  onChange={(e) => setKonfirmasi(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full mt-1 bg-white border border-green-100 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                />

              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition mt-2"
              >
                {loading ? "Loading..." : "Daftar"}
              </motion.button>

            </form>

            {/* LOGIN */}
            <div className="mt-5 text-center">

              <p className="text-gray-500 text-xs">
                Sudah punya akun?
              </p>

              <Link
                href="/login"
                className="text-green-600 font-semibold hover:underline mt-1 inline-block text-sm"
              >
                Login
              </Link>

            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}