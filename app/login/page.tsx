"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {

  const router = useRouter();

  // STATE
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // LOADING
  const [loading, setLoading] = useState(false);

  // FIREBASE AUTH
  const auth = getAuth();

  // LOGIN
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!username || !password) {
      alert("Username dan password wajib diisi");
      return;
    }

    try {

      setLoading(true);

      // =========================
      // LOGIN ADMIN
      // =========================
      // admin login pakai email firebase auth

      if (username.includes("@")) {

        await signInWithEmailAndPassword(
          auth,
          username,
          password
        );

        alert("Login admin berhasil");

        router.push("/dashboard");

        return;
      }

      // =========================
      // LOGIN USER
      // =========================

      const q = query(
        collection(db, "users"),
        where("username", "==", username),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      // USER TIDAK ADA
      if (querySnapshot.empty) {
        alert("Username atau password salah");
        return;
      }

      // AMBIL DATA USER
      const userData = querySnapshot.docs[0].data();

      // SIMPAN
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      alert("Login user berhasil");

      router.push("/user");

    } catch (error: any) {

      console.log(error);

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-green-50 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* TITLE */}
        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-green-600">
            Posyandu Cempaka
          </h1>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          {/* USERNAME */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Username / Email Admin
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username atau email admin"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-500 mt-6">

          Belum punya akun?{" "}

          <Link
            href="/register"
            className="text-green-600 font-medium"
          >
            Daftar
          </Link>

        </p>

      </div>

    </div>
  );
}