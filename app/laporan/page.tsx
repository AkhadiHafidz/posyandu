"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";
import { FileSpreadsheet } from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx-js-style";

export default function LaporanPage() {
  const [bulanKegiatan, setBulanKegiatan] = useState("");
  const [tahun, setTahun] = useState(
    new Date().getFullYear().toString()
  );
  const [jenisLaporan, setJenisLaporan] = useState("balita");
  const [loading, setLoading] = useState(false);

  const exportLaporan = async () => {
    if (!bulanKegiatan || !tahun) {
      alert("Pilih bulan kegiatan dan tahun terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const namaBulanMap: { [key: string]: string } = {
        "01": "Januari",
        "02": "Februari",
        "03": "Maret",
        "04": "April",
        "05": "Mei",
        "06": "Juni",
        "07": "Juli",
        "08": "Agustus",
        "09": "September",
        "10": "Oktober",
        "11": "November",
        "12": "Desember",
      };

      const namaBulanText = namaBulanMap[bulanKegiatan] || "";

      // 1. Ambil seluruh data pemeriksaan dari Firestore
      const querySnapshot = await getDocs(collection(db, "pemeriksaan"));
      const rawData: any[] = [];

      querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        if (!item.tanggal) return;

        const [tahunData, bulanData] = item.tanggal.split("-");

        const itemJenis = String(item.jenis || "").toLowerCase();
        const matchesJenis =
          jenisLaporan === "balita"
            ? itemJenis.includes("balita")
            : itemJenis.includes("ibu") || itemJenis.includes("hamil");

        if (matchesJenis && bulanData === bulanKegiatan && tahunData === tahun) {
          rawData.push({ id: docSnap.id, ...item });
        }
      });

      if (rawData.length === 0) {
        alert(
          `Tidak ada data pemeriksaan ${
            jenisLaporan === "balita" ? "Balita" : "Ibu Hamil"
          } pada bulan ${namaBulanText} ${tahun}`
        );
        setLoading(false);
        return;
      }

      // --- DAPATKAN TANGGAL PELAKSANAAN OTOMATIS DARI DATA PEMERIKSAAN ---
      let tanggalPelaksanaanFull = `${namaBulanText.toUpperCase()} ${tahun}`;
      if (rawData.length > 0 && rawData[0].tanggal) {
        // Ambil tanggal pertama, misal "2026-05-13"
        const [thn, bln, tgl] = rawData[0].tanggal.split("-");
        const tglNum = parseInt(tgl, 10);
        const blnName = namaBulanMap[bln] || namaBulanText;
        tanggalPelaksanaanFull = `${tglNum} ${blnName.toUpperCase()} ${thn}`;
      }

      // 2. Olah data & hubungkan dengan koleksi `balita` / `ibu_hamil`
      const dataProcessed: any[] = [];

      for (let i = 0; i < rawData.length; i++) {
        const item = rawData[i];
        let masterDetail: any = {};

        if (jenisLaporan === "balita") {
          // A. Cari berdasarkan balitaId / idBalita / id_balita
          const targetId = item.balitaId || item.idBalita || item.id_balita;
          if (targetId) {
            const balitaSnap = await getDoc(doc(db, "balita", targetId));
            if (balitaSnap.exists()) {
              masterDetail = balitaSnap.data();
            }
          }

          // B. Pencarian berdasarkan NIK jika belum ketemu
          const currentNik = String(item.nik || "").trim();
          if (!masterDetail.nik && currentNik && currentNik !== "-") {
            const qNik = query(
              collection(db, "balita"),
              where("nik", "==", currentNik)
            );
            const querySnapNik = await getDocs(qNik);
            if (!querySnapNik.empty) {
              masterDetail = querySnapNik.docs[0].data();
            }
          }

          // C. Pencarian berdasarkan Nama jika belum ketemu
          const currentNama = String(item.nama || "").trim();
          if (!masterDetail.nama && currentNama && currentNama !== "-") {
            const qNama = query(
              collection(db, "balita"),
              where("nama", "==", currentNama)
            );
            const querySnapNama = await getDocs(qNama);
            if (!querySnapNama.empty) {
              masterDetail = querySnapNama.docs[0].data();
            }
          }

          // --- EKSTRAKSI DATA BALITA ---
          const nikVal = masterDetail.nik || item.nik || "-";
          const namaAnakVal = masterDetail.nama || item.nama || "-";

          const rawTgl =
            masterDetail.tanggalLahir ||
            masterDetail.ttl ||
            masterDetail.tglLahir ||
            item.tanggalLahir ||
            item.ttl;

          let tglLahirFormatted = "-";
          if (rawTgl) {
            const d = new Date(rawTgl);
            tglLahirFormatted = !isNaN(d.getTime())
              ? d.toLocaleDateString("id-ID")
              : String(rawTgl);
          }

          const jkVal = masterDetail.jk || item.jk || "-";

          const namaOrtuVal =
            masterDetail.NamaOrtu ||
            masterDetail.ibu ||
            masterDetail.namaOrtu ||
            item.NamaOrtu ||
            item.ibu ||
            "-";

          const rtVal = masterDetail.rt || item.rt || "-";
          const rwVal = masterDetail.rw || item.rw || "-";
          const alamatVal = masterDetail.alamat || item.alamat || "-";

          const umurVal = item.umur || masterDetail.umur || "-";

          const rawBb = item.beratBadan || item.bb;
          const bbVal = rawBb ? `${rawBb}` : "-";

          const rawTb = item.tinggiBadan || item.tb;
          const tbVal = rawTb ? `${rawTb}` : "-";

          // Format Status Pertumbuhan (Naik / Tetap / Turun)
          let rawStatusStr = String(
            item.statusPertumbuhan || item.status || ""
          ).trim();
          let statusPertumbuhanFormatted = rawStatusStr;

          const sUpper = rawStatusStr.toUpperCase();
          if (sUpper === "NAIK" || sUpper === "N" || sUpper === "SEHAT") {
            statusPertumbuhanFormatted = "Naik";
          } else if (
            sUpper === "TETAP" ||
            sUpper === "T" ||
            sUpper === "MONITORING"
          ) {
            statusPertumbuhanFormatted = "Tetap";
          } else if (
            sUpper === "TURUN" ||
            sUpper === "O" ||
            sUpper === "B" ||
            sUpper === "PERLU TINDAKAN"
          ) {
            statusPertumbuhanFormatted = "Turun";
          } else if (!statusPertumbuhanFormatted) {
            statusPertumbuhanFormatted = "-";
          }

          const vitAVal = item.vitaminA || item.vitA || "-";
          const asiVal = item.asiEksklusif || item.asi || "-";
          const ketVal = item.keterangan || item.ket || "-";

          dataProcessed.push({
            No: i + 1,
            NIK: nikVal,
            "NAMA ANAK": namaAnakVal,
            TTL: tglLahirFormatted,
            JK: jkVal,
            "NAMA ORTU": namaOrtuVal,
            RT: rtVal,
            RW: rwVal,
            ALAMAT: alamatVal,
            "UMUR (BULAN)": umurVal,
            "BB (Kg)": bbVal,
            "TB (Cm)": tbVal,
            "NAIK / TETAP / TURUN": statusPertumbuhanFormatted,
            "VITAMIN A": vitAVal,
            "ASI EKSKLUSIF": asiVal,
            KETERANGAN: ketVal,
          });
        } else {
          // --- EKSTRAKSI DATA IBU HAMIL ---
          const targetId = item.ibuHamilId || item.idIbuHamil;
          if (targetId) {
            const ibuSnap = await getDoc(doc(db, "ibu_hamil", targetId));
            if (ibuSnap.exists()) {
              masterDetail = ibuSnap.data();
            }
          }

          const currentNik = String(item.nik || "").trim();
          if (!masterDetail.nik && currentNik) {
            const qNik = query(
              collection(db, "ibu_hamil"),
              where("nik", "==", currentNik)
            );
            const querySnapNik = await getDocs(qNik);
            if (!querySnapNik.empty) {
              masterDetail = querySnapNik.docs[0].data();
            }
          }

          const rawTgl =
            masterDetail.tanggalLahir || masterDetail.ttl || item.tanggalLahir;
          let tglLahirFormatted = "-";
          if (rawTgl) {
            const d = new Date(rawTgl);
            tglLahirFormatted = !isNaN(d.getTime())
              ? d.toLocaleDateString("id-ID")
              : String(rawTgl);
          }

          // Format Status Pemeriksaan Ibu Hamil
          let rawStatusStr = String(item.status || "").trim();
          let statusFormatted = rawStatusStr;

          const sUpper = rawStatusStr.toUpperCase();
          if (sUpper === "NAIK" || sUpper === "N" || sUpper === "SEHAT") {
            statusFormatted = "Naik";
          } else if (
            sUpper === "TETAP" ||
            sUpper === "T" ||
            sUpper === "MONITORING"
          ) {
            statusFormatted = "Tetap";
          } else if (
            sUpper === "TURUN" ||
            sUpper === "O" ||
            sUpper === "B" ||
            sUpper === "PERLU TINDAKAN"
          ) {
            statusFormatted = "Turun";
          } else if (!statusFormatted) {
            statusFormatted = "-";
          }

          dataProcessed.push({
            No: i + 1,
            NIK: masterDetail.nik || item.nik || "-",
            "NAMA IBU HAMIL": masterDetail.nama || item.nama || "-",
            TTL: tglLahirFormatted,
            RT: masterDetail.rt || item.rt || "-",
            RW: masterDetail.rw || item.rw || "-",
            ALAMAT: masterDetail.alamat || item.alamat || "-",
            "USIA KEHAMILAN (BULAN)":
              item.usiaKehamilan || masterDetail.usiaKehamilan || "-",
            "BB (Kg)": item.beratBadan || item.bb || "-",
            "LILA (Cm)": item.lingkarLengan || item.lila || "-",
            "TEKANAN DARAH": item.tekananDarah || "-",
            "TFU (Cm)": item.tfu || "-",
            DJJ: item.djj || "-",
            "LETAK JANIN": item.letakJanin || "-",
            "TABLET FE": item.tabletFe || "-",
            "IMUNISASI TT": item.imunisasiTT || "-",
            KELUHAN: item.keluhan || "-",
            "NAIK / TETAP / TURUN": statusFormatted,
            KETERANGAN: item.keterangan || "-",
          });
        }
      }

      // 3. SUSUN SHEET EXCEL
      const worksheet = XLSX.utils.json_to_sheet([]);

      const titleHeader =
        jenisLaporan === "balita"
          ? `FORMULIR PEMANTAUAN PERTUMBUHAN BALITA DI POSYANDU KELURAHAN PETOJO SELATAN TAHUN ${tahun}`
          : `FORMULIR PEMANTAUAN IBU HAMIL DI POSYANDU KELURAHAN PETOJO SELATAN TAHUN ${tahun}`;

      // Header Atas (Menggunakan Tanggal Pelaksanaan yang Ditemukan)
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [titleHeader],
          [`POSYANDU : CEMPAKA 2B`],
          [`TANGGAL PELAKSANAAN : ${tanggalPelaksanaanFull}`],
          [],
        ],
        { origin: "A1" }
      );

      // Masukkan Data JSON pada Baris A5
      XLSX.utils.sheet_add_json(worksheet, dataProcessed, {
        origin: "A5",
        skipHeader: false,
      });

      const totalCols = Object.keys(dataProcessed[0]).length;

      // Merge Sel Judul Laporan
      const lastColLetter = XLSX.utils.encode_col(totalCols - 1);
      worksheet["!merges"] = [
        XLSX.utils.decode_range(`A1:${lastColLetter}1`),
        XLSX.utils.decode_range(`A2:${lastColLetter}2`),
        XLSX.utils.decode_range(`A3:${lastColLetter}3`),
      ];

      // Styling Header Judul
      ["A1", "A2", "A3"].forEach((cellRef, idx) => {
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            font: {
              bold: true,
              sz: idx === 0 ? 12 : 10,
              color: { rgb: idx === 0 ? "FFFFFF" : "1E293B" },
            },
            fill:
              idx === 0
                ? { fgColor: { rgb: "2E7D32" } }
                : { fgColor: { rgb: "E8F5E9" } },
            alignment: {
              horizontal: idx === 0 ? "center" : "left",
              vertical: "center",
            },
          };
        }
      });

      // Styling Header Kolom Tabel (Baris A5)
      for (let C = 0; C < totalCols; C++) {
        const headerCell = XLSX.utils.encode_cell({ r: 4, c: C });
        if (worksheet[headerCell]) {
          worksheet[headerCell].s = {
            font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4CAF50" } },
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }

      // Styling Seluruh Isi Data Tabel
      for (let R = 5; R < 5 + dataProcessed.length; R++) {
        for (let C = 0; C < totalCols; C++) {
          const cell = XLSX.utils.encode_cell({ r: R, c: C });
          if (worksheet[cell]) {
            worksheet[cell].s = {
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
              alignment: {
                horizontal:
                  C === 0 || C === 3 || C === 4 || C === 6 || C === 7 || C === 9 || C === 10 || C === 11 || C === 12
                    ? "center"
                    : "left",
                vertical: "center",
              },
            };
          }
        }
      }

      // Lebar Kolom Otomatis
      const keys = Object.keys(dataProcessed[0]);
      worksheet["!cols"] = keys.map((key) => {
        let maxLen = key.length;

        dataProcessed.forEach((row) => {
          const cellValue = String(row[key] ?? "");
          if (cellValue.length > maxLen) {
            maxLen = cellValue.length;
          }
        });

        return {
          wch: Math.max(maxLen + 5, 12),
        };
      });

      // Export File Excel
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Posyandu");

      XLSX.writeFile(
        workbook,
        `Laporan_${
          jenisLaporan === "balita" ? "Balita" : "Ibu_Hamil"
        }_${namaBulanText}_${tahun}.xlsx`
      );
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunduh laporan.");
    } finally {
      setLoading(false);
    }
  };

  // Class styling universal untuk input
  const inputStyle =
    "w-full mt-1.5 sm:mt-2 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition duration-200 bg-white";

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        {/* HEADER */}
        <Header title="Laporan Posyandu" />

        {/* FORM DOWNLOAD */}
        <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm max-w-xl w-full mx-auto md:mx-0">
          <h2 className="text-base sm:text-lg font-black text-gray-800">
            Download Laporan Posyandu
          </h2>

          <div className="space-y-4 mt-4 sm:mt-5">
            {/* BULAN KEGIATAN */}
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Bulan Kegiatan
              </label>
              <select
                value={bulanKegiatan}
                onChange={(e) => setBulanKegiatan(e.target.value)}
                className={`${inputStyle} cursor-pointer`}
              >
                <option value="">Pilih Bulan</option>
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>

            {/* TAHUN */}
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Tahun
              </label>
              <input
                type="number"
                placeholder="Masukkan tahun"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className={inputStyle}
              />
            </div>

            {/* JENIS LAPORAN */}
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Jenis Pemeriksaan / Laporan
              </label>
              <select
                value={jenisLaporan}
                onChange={(e) => setJenisLaporan(e.target.value)}
                className={`${inputStyle} cursor-pointer`}
              >
                <option value="balita">Pemeriksaan Balita</option>
                <option value="ibu_hamil">Pemeriksaan Ibu Hamil</option>
              </select>
            </div>

            {/* BUTTON DOWNLOAD */}
            <div className="pt-2">
              <button
                onClick={exportLaporan}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-4 py-2.5 sm:py-3 text-sm font-semibold shadow-md hover:shadow-lg transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FileSpreadsheet size={18} />
                {loading ? "Memproses Data..." : "Download Excel"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}