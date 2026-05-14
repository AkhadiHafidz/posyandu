"use client";

import { useState } from "react";
import Link from "next/link";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

export default function RegisterPage() {

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

      // SIMPAN KE FIRESTORE
      await addDoc(collection(db, "users"), {
        nama: nama,
        username: username,
        password: password,
        createdAt: new Date(),
      });

      alert("Registrasi berhasil");

      // RESET
      setNama("");
      setUsername("");
      setPassword("");
      setKonfirmasi("");

    } catch (error: any) {

      console.log("FIREBASE ERROR:", error);

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
            Daftar Akun
          </h1>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >

          {/* NAMA */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

          </div>

          {/* USERNAME */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
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

          {/* KONFIRMASI */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>

            <input
              type="password"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              placeholder="Ulangi password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Daftar"}
          </button>

        </form>

        {/* LOGIN */}
        <p className="text-center text-sm text-gray-500 mt-6">

          Sudah punya akun?{" "}

          <Link
            href="/login"
            className="text-green-600 font-medium"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}