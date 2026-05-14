"use client";

import Link from "next/link";

export default function PemeriksaanPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        {/* HEADER TABLE */}
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold text-gray-800">
            Data Pemeriksaan
          </h2>

          <Link
            href="/pemeriksaan/tambah"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Tambah Pemeriksaan
          </Link>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 text-left">Nama Balita</th>
                <th className="text-left">Tanggal</th>
                <th className="text-left">Berat Badan</th>
                <th className="text-left">Tinggi Badan</th>
                <th className="text-left">Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>

              {/* DATA 1 */}
              <tr className="border-b hover:bg-gray-50">

                <td className="py-4 font-medium text-gray-800">
                  Budi
                </td>

                <td className="text-gray-700">
                  10 Mei 2026
                </td>

                <td className="text-gray-700">
                  12 kg
                </td>

                <td className="text-gray-700">
                  85 cm
                </td>

                <td>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    Sehat
                  </span>
                </td>

                <td className="text-center">

                  <div className="flex items-center justify-center gap-3">

                    <button className="text-blue-600 hover:underline">
                      Detail
                    </button>

                    <button className="text-yellow-600 hover:underline">
                      Edit
                    </button>

                    <button className="text-red-500 hover:underline">
                      Hapus
                    </button>

                  </div>

                </td>

              </tr>

              {/* DATA 2 */}
              <tr className="border-b hover:bg-gray-50">

                <td className="py-4 font-medium text-gray-800">
                  Siti
                </td>

                <td className="text-gray-700">
                  12 Mei 2026
                </td>

                <td className="text-gray-700">
                  10 kg
                </td>

                <td className="text-gray-700">
                  80 cm
                </td>

                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                    Perlu Cek
                  </span>
                </td>

                <td className="text-center">

                  <div className="flex items-center justify-center gap-3">

                    <button className="text-blue-600 hover:underline">
                      Detail
                    </button>

                    <button className="text-yellow-600 hover:underline">
                      Edit
                    </button>

                    <button className="text-red-500 hover:underline">
                      Hapus
                    </button>

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}