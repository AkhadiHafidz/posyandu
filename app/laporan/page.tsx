"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  FileSpreadsheet,
  Download,
} from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import * as XLSX from "xlsx-js-style";

export default function LaporanPage() {

const [namaPosyandu, setNamaPosyandu] = useState("");

const [lokasiRTRW, setLokasiRTRW] = useState("");

const [puskesmasKelurahan, setPuskesmasKelurahan] = useState("");

const [kecamatan, setKecamatan] = useState("");

const [kotaKabupaten, setKotaKabupaten] = useState("");

const [jumlahKader, setJumlahKader] = useState("");

const [bulanKegiatan, setBulanKegiatan] = useState("");

const [tahun, setTahun] = useState(
  new Date().getFullYear().toString()
        );


const [jenisLaporan, setJenisLaporan] =
  useState("balita");
  // EXPORT LAPORAN
const exportLaporan = async () => {
  let totalBalita = 0;
let totalIbuHamil = 0;

  if (
    !namaPosyandu ||
    !lokasiRTRW ||
    !puskesmasKelurahan ||
    !kecamatan ||
    !kotaKabupaten ||
    !jumlahKader ||
    !bulanKegiatan ||
    !tahun
  ) {
    alert("Lengkapi identitas laporan terlebih dahulu.");
    return;
  }

  const querySnapshot = await getDocs(
    collection(db, "pemeriksaan")
      );

    const data: any[] = [];

   const namaBulan = {
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

    querySnapshot.forEach((doc) => {

  const item = doc.data();
  if (item.jenis === "Balita") {
  totalBalita++;
}

if (item.jenis === "Ibu Hamil") {
  totalIbuHamil++;
}

  if (!item.tanggal) return;

  // tanggal format : 2026-07-02
  const tanggal = item.tanggal.split("-");

  const tahunData = tanggal[0];
  const bulanData = tanggal[1];

  // Filter berdasarkan jenis, bulan dan tahun
  if (
    item.jenis ===
      (jenisLaporan === "balita"
        ? "Balita"
        : "Ibu Hamil") &&
    bulanData === bulanKegiatan &&
    tahunData === tahun
  ) {

    if (jenisLaporan === "balita") {

      data.push({
        No: data.length + 1,
        Nama: item.nama,
        NIK: item.nik,
        Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
        "Berat Badan (Kg)": item.beratBadan,
        "Tinggi Badan (Cm)": item.tinggiBadan,
        "Lingkar Lengan (cm)": item.lingkarLengan,
        Status: item.status,
        Keterangan: item.keterangan,
      });

    } else {

      data.push({
         No: data.length + 1,
        Nama: item.nama,
        NIK: item.nik,
        Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
        "Usia Kehamilan (Minggu)": item.usiaKehamilan,
        "Berat Badan (Kg)": item.beratBadan,
        "Lingkar Lengan (cm)": item.lingkarLengan,
        "Tekanan Darah": item.tekananDarah,
        "Tinggi Fundus (cm)": item.tfu,
        DJJ: item.djj,
        "Letak Janin": item.letakJanin,
        "Tablet Fe": item.tabletFe,
        "Imunisasi TT": item.imunisasiTT,
        Keluhan: item.keluhan || "-",
        Status: item.status,
        Keterangan: item.keterangan || "-",
      });

    }

  }

});
if (data.length === 0) {
  alert(
    `Tidak ada data ${
      jenisLaporan === "balita"
        ? "Balita"
        : "Ibu Hamil"
    } pada bulan ${
      namaBulan[
        bulanKegiatan as keyof typeof namaBulan
      ]
    } ${tahun}`
  );

  return;
}

 const worksheet = XLSX.utils.json_to_sheet([]);

XLSX.utils.sheet_add_aoa(
worksheet,
[
["LAPORAN POSYANDU CEMPAKA 2B"],
[],

["IDENTITAS POSYANDU","","","","RINGKASAN LAPORAN",""],

["Nama Posyandu",namaPosyandu,"","","Total Balita",totalBalita],

["Lokasi RT/RW",lokasiRTRW,"","","Total Ibu Hamil",totalIbuHamil],

["Puskesmas Kelurahan",puskesmasKelurahan,"","","Bulan",
namaBulan[bulanKegiatan as keyof typeof namaBulan]],

["Kecamatan",kecamatan,"","","Tahun",tahun],

["Kota / Kabupaten",kotaKabupaten,"","","Jenis Pemeriksaan",
jenisLaporan==="balita"
?"Balita"
:"Ibu Hamil"],

["Jumlah Kader",jumlahKader],

[],
],
{
origin:"A1",
}
);

worksheet["!merges"] = [
  
  XLSX.utils.decode_range("A1:P1"),
  XLSX.utils.decode_range("A3:B3"),
  XLSX.utils.decode_range("E3:F3"),
];
worksheet["A1"].s={

font:{
bold:true,
sz:20,
color:{rgb:"FFFFFF"},
},

fill:{
fgColor:{
rgb:"2E7D32",
},
},

alignment:{
horizontal:"center",
vertical:"center",
},

border:{
top:{style:"thin"},
bottom:{style:"thin"},
left:{style:"thin"},
right:{style:"thin"},
},

};

["A3","E3"].forEach((cell)=>{

worksheet[cell].s={

font:{
bold:true,
color:{rgb:"FFFFFF"},
},

fill:{
fgColor:{
rgb:"4CAF50",
},
},

alignment:{
horizontal:"center",
vertical:"center",
},

border:{
top:{style:"thin"},
bottom:{style:"thin"},
left:{style:"thin"},
right:{style:"thin"},
},

};

});
  

  XLSX.utils.sheet_add_json(
    
        worksheet,
    data,
    {
      origin: "A13",
      skipHeader: false,
    }
    
  );
  const totalRow = 14 + data.length;

worksheet[`A${totalRow}`] = {
  t: "s",
  v:
    jenisLaporan === "balita"
      ? "Total Balita yang Diperiksa"
      : "Total Ibu Hamil yang Diperiksa",
};

worksheet[`B${totalRow}`] = {
  t: "n",
  v: data.length,
};

worksheet[`A${totalRow}`].s = {

  font:{
    bold:true,
    color:{rgb:"FFFFFF"},
  },

  fill:{
    fgColor:{
      rgb:"4CAF50",
    },
  },

  border:{
    top:{style:"thin"},
    bottom:{style:"thin"},
    left:{style:"thin"},
    right:{style:"thin"},
  },

};

worksheet[`B${totalRow}`].s = {
  font: { bold: true },
};
 for (let r = 3; r <= 8; r++) {

  const a = XLSX.utils.encode_cell({ r, c: 0 });
  const b = XLSX.utils.encode_cell({ r, c: 1 });

  if (worksheet[a]) {

    worksheet[a].s = {

      font: {
        bold: r === 2,
        color:
          r === 2
            ? { rgb: "FFFFFF" }
            : { rgb: "000000" },
      },

      fill:
        r === 2
          ? {
              fgColor: {
                rgb: "4CAF50",
              },
            }
          : {
              fgColor: {
                rgb: "E8F5E9",
              },
            },

      alignment: {
        horizontal: "left",
        vertical: "center",
      },

      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },

    };

  }

  if (worksheet[b]) {

    worksheet[b].s = {

      alignment: {
        horizontal: "left",
        vertical: "center",
      },

      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },

    };

  }

}
// =========================
// BORDER RINGKASAN LAPORAN
// =========================

for (let r = 3; r <= 8; r++) {

  const e = XLSX.utils.encode_cell({ r, c: 4 }); // Kolom E
  const f = XLSX.utils.encode_cell({ r, c: 5 }); // Kolom F

  if (worksheet[e]) {

    worksheet[e].s = {

      font: {
        bold: false,
      },

      fill: {
        fgColor: {
          rgb: "E8F5E9",
        },
      },

      alignment: {
        horizontal: "left",
        vertical: "center",
      },

      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },

    };

  }

  if (worksheet[f]) {

    worksheet[f].s = {

      alignment: {
        horizontal: "center",
        vertical: "center",
      },

      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },

    };

  }

}
const range = XLSX.utils.decode_range(worksheet["!ref"]!);

for (let C = range.s.c; C <= range.e.c; C++) {
  const headerCell = XLSX.utils.encode_cell({ r: 12, c: C });

  if (worksheet[headerCell]) {
    worksheet[headerCell].s = {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" },
      },
      fill: {
        fgColor: { rgb: "4CAF50" },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
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
// Border seluruh isi tabel
for (let R = 13; R <= range.e.r; R++) {
  for (let C = range.s.c; C <= range.e.c; C++) {

    const cell = XLSX.utils.encode_cell({
      r: R,
      c: C,
    });

    if (worksheet[cell]) {
      worksheet[cell].s = {
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  }
}
 // Auto Filter
 if (data.length > 0) {
worksheet["!autofilter"] = {
  ref: XLSX.utils.encode_range({
    s: { r: 12, c: 0 },
    e: {
      r: 12 + data.length,
      c: Object.keys(data[0]).length - 1,
    },
  }),
};
 }

// Lebar kolom otomatis
if (data.length > 0) {
worksheet["!cols"] = Object.keys(data[0]).map((key) => ({
  wch: Math.max(key.length + 5, 18),
}));
}

  const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
    "Laporan"
      );

      XLSX.writeFile(
        workbook,
    `Laporan_${jenisLaporan}_${namaBulan[bulanKegiatan as keyof typeof namaBulan]}_${tahun}.xlsx`
      );

    };
  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-6 md:p-8">

        {/* HEADER */}
        <Header title="Laporan" />

        {/* TOP */}
        <div className="mt-8 bg-white rounded-[30px] p-8 shadow-sm">

<h2 className="text-3xl font-black text-gray-800">
Buat Laporan Posyandu
</h2>

            <p className="text-gray-500 mt-2">
Isi identitas laporan terlebih dahulu
            </p>

<div className="grid md:grid-cols-2 gap-5 mt-8">

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2"
  >
  Nama Posyandu
</label>

<input
type="text"
placeholder="Masukkan nama posyandu"
value={namaPosyandu}
onChange={(e)=>setNamaPosyandu(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
/>

          </div>

<div>

<label  className="block text-sm font-semibold text-gray-700 mb-2"
>Lokasi RT/RW</label>

<input
type="text"
placeholder="Masukkan lokasi RT/RW"
value={lokasiRTRW}
onChange={(e)=>setLokasiRTRW(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
/>

            </div>

<div>

<label  className="block text-sm font-semibold text-gray-700 mb-2"
>Puskesmas Kelurahan</label>

<input
type="text"
placeholder="Masukkan puskesmas kelurahan"
value={puskesmasKelurahan}
onChange={(e)=>setPuskesmasKelurahan(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
/>

          </div>

<div>

<label  className="block text-sm font-semibold text-gray-700 mb-2"
>Kecamatan</label>

<input
type="text"
placeholder="Masukkan kecamatan"
value={kecamatan}
onChange={(e)=>setKecamatan(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
/>

            </div>

<div>

<label  className="block text-sm font-semibold text-gray-700 mb-2"
>Kota / Kabupaten</label>

<input
type="text"
placeholder="Masukkan kota/kabupaten"
value={kotaKabupaten}
onChange={(e)=>setKotaKabupaten(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
/>

</div>

<div>

  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Jumlah Kader
  </label>

  <input
    type="number"
    placeholder="Masukkan jumlah kader"
    value={jumlahKader}
    onChange={(e) => setJumlahKader(e.target.value)}
    className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
  />

</div>

<div>

<label className="block text-sm font-semibold text-gray-700 mb-2">
Bulan Kegiatan
</label>

<select
value={bulanKegiatan}
onChange={(e)=>setBulanKegiatan(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800"
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

<div>

<label className="block text-sm font-semibold text-gray-700 mb-2"
>Tahun</label>

<input
type="number"
placeholder="Masukkan tahun"
value={tahun}
onChange={(e)=>setTahun(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
/>

</div>

<div>

<label  className="block text-sm font-semibold text-gray-700 mb-2">Jenis Laporan</label>

<select
value={jenisLaporan}
onChange={(e)=>setJenisLaporan(e.target.value)}
className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
>

<option value="balita">
Pemeriksaan Balita
</option>

<option value="ibu_hamil">
Pemeriksaan Ibu Hamil
</option>

</select>

          </div>

        </div>

</div>    
        {/* EXPORT */}
        <div className="mt-10 bg-white rounded-[30px] p-8 shadow-sm">

          <h2 className="text-3xl font-black text-gray-800">
            Export Laporan
          </h2>

          <p className="text-gray-500 mt-2">
            Download laporan data dalam format Excel
          </p>

          {/* BUTTON */}
          <div className="grid md:grid-cols-3 gap-5 mt-8">

            {/* PEMERIKSAAN */}
            <button
              onClick={
                exportLaporan
              }
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-3xl p-6 text-left shadow-lg hover:scale-[1.02] transition"
            >

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <FileSpreadsheet size={28} />
              </div>

              <h2 className="text-2xl font-black mt-6">
                Download Laporan
              </h2>

              <p className="text-blue-100 mt-2">
                Download data 
              </p>

              <div className="flex items-center gap-2 mt-6">

                <Download size={18} />

                Download Excel

              </div>

            </button>

          </div>

        </div>

      </main>
    </div>
  );
}