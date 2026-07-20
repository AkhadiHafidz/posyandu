"use client";

import { useState } from "react";

import Link from "next/link";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import {
  Mail,
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";

import { db, auth } from "@/lib/firebase";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {

  const router = useRouter();

  // STATE
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // LOGIN
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!username || !password) {

      alert(
        "Username dan password wajib diisi"
      );

      return;
    }

    try {

      setLoading(true);

      // ==========================
      // LOGIN ADMIN FIREBASE AUTH
      // ==========================

      if (username.includes("@")) {

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            username,
            password
          );

        // SIMPAN ADMIN
       // Hapus data user lama
localStorage.removeItem("uid");
localStorage.removeItem("user");

// Simpan data admin
        localStorage.setItem(
          "admin",
          JSON.stringify({
    uid: userCredential.user.uid,
    email: userCredential.user.email,
            role: "admin",
          })
        );

        alert(
          "Login admin berhasil"
        );

        router.push("/user");

        return;
      }

      // ==========================
      // LOGIN USER FIRESTORE
      // ==========================

      const q = query(
        collection(db, "users"),

        where(
          "username",
          "==",
          username
        ),

        where(
          "password",
          "==",
          password
        )
      );

      const querySnapshot =
        await getDocs(q);

      // USER TIDAK ADA
      if (querySnapshot.empty) {

        alert(
          "Username atau password salah"
        );

        return;
      }

      
      // AMBIL DATA USER
        const userDoc = querySnapshot.docs[0];

        const userData = userDoc.data();

        // SIMPAN UID
     // Hapus data admin lama
     await auth.signOut().catch(() => {});
localStorage.removeItem("admin");

// Simpan uid user
localStorage.setItem(
  "uid",
  userDoc.id
);

// Simpan data user
      localStorage.setItem(
        "user",
        JSON.stringify({
    uid: userDoc.id,
          ...userData,
    role: userData.role || "user",
        })
      );

      alert(
        "Login berhasil"
      );

      router.push("/user");

    } catch (error: any) {

      console.log(error);

      // HANDLE ERROR AUTH
      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        alert(
          "Email atau password admin salah"
        );

      } else if (
        error.code ===
        "auth/user-not-found"
      ) {

        alert(
          "Akun admin tidak ditemukan"
        );

      } else if (
        error.code ===
        "auth/wrong-password"
      ) {

        alert(
          "Password admin salah"
        );

      } else {

        alert(error.message);
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-200 via-green-100 to-emerald-200 flex items-center justify-center px-4">

      {/* BLUR */}
      <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] bg-green-300/40 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] left-[-120px] w-[350px] h-[350px] bg-emerald-300/40 rounded-full blur-3xl"></div>

      {/* BACK */}
      <button
        onClick={() =>
          router.push("/")
        }
className="absolute top-5 left-5 flex items-center gap-2 bg-white/80 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition text-gray-700 text-sm font-medium"
      >

        <ArrowLeft size={16} />

        Kembali

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
      className="w-full max-w-[850px] bg-white rounded-[24px] overflow-hidden shadow-xl grid md:grid-cols-2"
      >

        {/* LEFT */}
        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 hidden md:flex items-center justify-center overflow-hidden">

          {/* SHAPE */}
          <div className="absolute top-[-80px] left-[-80px] w-[240px] h-[240px] border-[20px] border-green-200/30 rounded-full"></div>

          <div className="absolute bottom-[-100px] left-[-100px] w-[250px] h-[250px] bg-green-300/20 rounded-full"></div>

          {/* CONTENT */}
          <div className="relative z-10 px-8 text-center">

            <motion.h1
              initial={{
                opacity: 0,
                x: -20,
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
              Welcome
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
              className="mt-6 text-green-100 leading-relaxed text-lg"
            >
              Sistem Informasi Posyandu Digital
              untuk pelayanan kesehatan
              masyarakat yang lebih modern
               dan cepat
            </motion.p>

            {/* IMAGE */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="mt-10 flex justify-center"
            >

              <Image
                src="/healt.png"
                alt="Healthcare"
                width={220}
                height={220}
                priority
                className="drop-shadow-2xl"
              />

            </motion.div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-8 py-12 bg-[#FAFFFC]">

          <div className="w-full max-w-md">

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
              className="text-center"
            >

              <h1 className="text-3xl font-black">
                <span className="text-green-600">
                  Posyandu
                </span>{" "}
                <span className="text-gray-500 font-medium">
                  Cempaka
                </span>
              </h1>

              <p className="text-gray-400 mt-3">
                Login untuk melanjutkan
              </p>

            </motion.div>

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-4"
            >

              {/* USERNAME */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
              >

                <label className="text-sm font-semibold text-gray-700">
                  Username / Email
                </label>

                <div className="mt-2 flex items-center bg-white border border-green-100 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-green-400">

                  <Mail
                    size={20}
                    className="text-green-500"
                  />

                  <input
                    type="text"
                     autoComplete="username"
                    value={
                      username || ""
                    }
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                      )
                    }
                    placeholder="Masukkan username atau email"
                    className="w-full ml-3 outline-none text-gray-700"
                  />

                </div>

              </motion.div>

              {/* PASSWORD */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.4,
                }}
              >

                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="mt-2 flex items-center bg-white border border-green-100 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-green-400">

                  <LockKeyhole
                    size={20}
                    className="text-green-500"
                  />

                  <input
                    type="password"
                    autoComplete="current-password"
                    value={
                      password || ""
                    }
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Masukkan password"
                    className="w-full ml-3 outline-none text-gray-700"
                  />

                </div>

              </motion.div>

              {/* FORGOT */}
              <div className="text-right">

                <button
                  type="button"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-2xl transition disabled:opacity-70"
              >
                {loading
                  ? "Loading..."
                  : "Login"}
              </motion.button>

            </form>

            {/* REGISTER */}
            <div className="mt-8 text-center">

              <p className="text-gray-500">
                Belum punya akun?
              </p>

              <Link
                href="/register"
                className="inline-block mt-2 text-green-600 font-semibold hover:underline"
              >
                Daftar Sekarang
              </Link>

            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}