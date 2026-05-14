"use client";

import { useState } from "react";

export default function JadwalPage() {

  // STATE FORM
  const [tempat, setTempat] = useState("");
  const [tanggal, setTanggal] = useState("");

  // STATE DATA
  const [jadwal, setJadwal] = useState([
    {
      tempat: "Posyandu Melati",
      tanggal: "2026-05-10",
    },
  ]);

  // TAMBAH JADWAL
  const handleTambah = (e) => {
    e.preventDefault();

    if (!tempat || !tanggal) {
      alert("Lengkapi data terlebih dahulu");
      return;
    }

    const dataBaru = {
      tempat,
      tanggal,
    };

    setJadwal([...jadwal, dataBaru]);

    // RESET FORM
    setTempat("");
    setTanggal("");
  };

  // FORMAT TANGGAL
  const formatTanggal = (tgl) => {
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6">

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tambah Jadwal
        </h2>

        <form
          onSubmit={handleTambah}
          className="grid md:grid-cols-2 gap-4"
        >

          {/* TEMPAT */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Tempat
            </label>

            <input
              type="text"
              value={tempat}
              onChange={(e) => setTempat(e.target.value)}
              placeholder="Masukkan tempat"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* TANGGAL */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Tanggal
            </label>

            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-end">

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
            >
              Simpan Jadwal
            </button>

          </div>

        </form>

      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Daftar Jadwal
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 text-left">Tempat</th>
                <th className="text-left">Tanggal</th>
              </tr>
            </thead>

            <tbody>

              {jadwal.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4 font-medium text-gray-800">
                    {item.tempat}
                  </td>

                  <td className="text-gray-700">
                    {formatTanggal(item.tanggal)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}