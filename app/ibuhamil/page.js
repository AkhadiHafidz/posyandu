"use client";

import Link from "next/link";

export default function IbuHamilPage() {
  return (
    <div className="flex flex-col gap-6">
        
      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        {/* HEADER TABLE */}
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Ibu Hamil
          </h2>

          {/* BUTTON TAMBAH */}
          <Link
            href="/ibuhamil/tambah"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Tambah Data
          </Link>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 text-left">Nama</th>
                <th className="text-left">Usia</th>
                <th className="text-left">Usia Kehamilan</th>
                <th className="text-left">Alamat</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>

              {/* DATA 1 */}
              <tr className="border-b hover:bg-gray-50">

                <td className="py-4 font-medium text-gray-800">
                  Siti Aminah
                </td>

                <td className="text-gray-700">
                  28 Tahun
                </td>

                <td className="text-gray-700">
                  6 Bulan
                </td>

                <td className="text-gray-700">
                  Jakarta
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
                  Dewi Lestari
                </td>

                <td className="text-gray-700">
                  30 Tahun
                </td>

                <td className="text-gray-700">
                  8 Bulan
                </td>

                <td className="text-gray-700">
                  Bandung
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