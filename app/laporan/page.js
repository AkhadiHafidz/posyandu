"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function LaporanPage() {

  // DATA SEMENTARA
  const dataLaporan = [
    {
      nama: "Budi",
      umur: "2 Tahun",
      berat: "12 kg",
      tinggi: "85 cm",
      status: "Sehat",
    },
    {
      nama: "Siti",
      umur: "3 Tahun",
      berat: "10 kg",
      tinggi: "80 cm",
      status: "Perlu Cek",
    },
  ];

  // DOWNLOAD EXCEL
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataLaporan);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Laporan Posyandu"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "laporan-posyandu.xlsx");
  };

  return (
    <div className="flex flex-col gap-6">

      {/* CARD */}
      <div className="bg-white p-6 rounded-xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Data Laporan
            </h2>

            <p className="text-sm text-gray-500">
              Download laporan data balita posyandu
            </p>
          </div>

          {/* BUTTON DOWNLOAD */}
          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Download data
        
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 text-left">Nama</th>
                <th className="text-left">Umur</th>
                <th className="text-left">Berat</th>
                <th className="text-left">Tinggi</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>

            <tbody>

              {dataLaporan.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4 font-medium text-gray-800">
                    {item.nama}
                  </td>

                  <td className="text-gray-700">
                    {item.umur}
                  </td>

                  <td className="text-gray-700">
                    {item.berat}
                  </td>

                  <td className="text-gray-700">
                    {item.tinggi}
                  </td>

                  <td>

                    <span
                      className={`px-2 py-1 rounded text-xs ${
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

    </div>
  );
}