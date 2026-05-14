"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/header";

export default function UserPage() {

  const dataPemeriksaan = [
    {
      nama: "Budi",
      tanggal: "2026-05-01",
      berat: 12,
      tinggi: 85,
      status: "Sehat",
    },
    {
      nama: "Siti",
      tanggal: "2026-05-02",
      berat: 10,
      tinggi: 80,
      status: "Perlu Cek",
    },
  ];

  const formatTanggal = (tgl: string) => {
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex flex-col flex-1">

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN */}
        <main className="p-6 bg-gray-100 min-h-screen">

          <div className="flex flex-col gap-6">

            {/* TITLE */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard User
              </h1>

              <p className="text-sm text-gray-500">
                Ringkasan data posyandu
              </p>
            </div>

            {/* CARDS */}
            <div className="grid md:grid-cols-4 gap-4">

              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-sm text-gray-500">
                  Total Balita
                </h2>

                <p className="text-2xl font-bold text-green-600 mt-2">
                  120
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-sm text-gray-500">
                  Pemeriksaan Bulan Ini
                </h2>

                <p className="text-2xl font-bold text-blue-600 mt-2">
                  45
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-sm text-gray-500">
                  Balita Sehat
                </h2>

                <p className="text-2xl font-bold text-emerald-600 mt-2">
                  100
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-sm text-gray-500">
                  Perlu Perhatian
                </h2>

                <p className="text-2xl font-bold text-red-500 mt-2">
                  20
                </p>
              </div>

            </div>

            {/* TABLE */}
            <div className="bg-white p-6 rounded-xl shadow">

              <div className="flex items-center gap-2 mb-4">

                <div className="w-1 h-6 bg-green-600 rounded"></div>

                <h2 className="text-lg font-semibold text-gray-800">
                  Pemeriksaan Terbaru
                </h2>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-sm border-collapse">

                  <thead>
                    <tr className="text-gray-600 border-b">
                      <th className="py-3 text-left">
                        Nama
                      </th>

                      <th className="py-3 text-left">
                        Tanggal
                      </th>

                      <th className="py-3 text-center">
                        Berat
                      </th>

                      <th className="py-3 text-center">
                        Tinggi
                      </th>

                      <th className="py-3 text-center">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {dataPemeriksaan.map((item, index) => (

                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* NAMA */}
                        <td className="py-3 font-medium text-gray-800">
                          {item.nama}
                        </td>

                        {/* TANGGAL */}
                        <td className="text-gray-800">
                          {formatTanggal(item.tanggal)}
                        </td>

                        {/* BERAT */}
                        <td className="text-center">

                          <span className="text-base text-gray-800">
                            {item.berat}
                          </span>

                          <span className="text-xs text-gray-500 ml-1">
                            kg
                          </span>

                        </td>

                        {/* TINGGI */}
                        <td className="text-center">

                          <span className="text-base text-gray-800">
                            {item.tinggi}
                          </span>

                          <span className="text-xs text-gray-500 ml-1">
                            cm
                          </span>

                        </td>

                        {/* STATUS */}
                        <td className="text-center">

                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              item.status === "Sehat"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* AKTIVITAS */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold text-gray-800">
                Aktivitas Terbaru
              </h2>

              <ul className="text-sm text-gray-600 space-y-2 mt-4">

                <li>
                  ✔️ Data balita ditambahkan
                </li>

                <li>
                  ✔️ Pemeriksaan bulan Mei selesai
                </li>

                <li>
                  ✔️ Laporan berhasil diunduh
                </li>

              </ul>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}