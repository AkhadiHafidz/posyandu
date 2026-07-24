"use client";

import { useState } from "react";
import { beratHamil } from "@/data/kms/beratHamil";
import { createScales, buildPath, Padding, formatTanggal } from "./BBUChart/utils";

export interface KenaikanBeratData {
  minggu: number;
  kenaikanBerat: number;
  tanggal: string;
}

interface KMSIbuHamilChartProps {
  data: KenaikanBeratData[];
}

// ================= LAYOUT GLOBAL =================
const WIDTH = 660;
const HEIGHT = 520;
const PADDING: Padding = { top: 45, right: 35, bottom: 40, left: 55 };

const MIN_MINGGU = 0;
const MAX_MINGGU = 42;
const MIN_KG = -3;
const MAX_KG = 23;

const { scaleX, scaleY } = createScales(WIDTH, HEIGHT, PADDING, MIN_MINGGU, MAX_MINGGU, MIN_KG, MAX_KG);

const kategoriInfo = [
  { key: "kurus", label: "< 18,5", rekomendasi: "12,5 - 18 kg", color: "#111111", dash: "6 3", fill: "none" },
  { key: "normal", label: "18,5 - 24,9", rekomendasi: "11,5 - 16 kg", color: "#ec4899", dash: "5 3", fill: "rgba(244, 114, 182, 0.22)" },
  { key: "gemuk", label: "25 - 29,9", rekomendasi: "7 - 11,5 kg", color: "#374151", dash: "", fill: "rgba(107, 114, 128, 0.25)" },
  { key: "obesitas", label: "> 30", rekomendasi: "5 - 9 kg", color: "#ec4899", dash: "5 3", fill: "rgba(52, 211, 153, 0.25)" },
] as const;

function buildBandPath(
  key: "kurus" | "normal" | "gemuk" | "obesitas",
  which: "min" | "max"
) {
  return buildPath(
    beratHamil,
    (d) => d.minggu,
    (d) => d[key][which],
    scaleX,
    scaleY
  );
}

export default function KMSIbuHamilChart({ data = [] }: KMSIbuHamilChartProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    tanggal: string;
    kenaikanBerat: number;
    minggu: number;
  } | null>(null);

  // 1. Parsing & Normalisasi Data Minggu dan Berat
  const parsedData = (data || []).map((d) => {
    let m = Number(d.minggu);
    if (!isNaN(m) && m > 0 && m <= 10) {
      m = m * 4; // Konversi dari bulan ke minggu jika diinput angka kecil (1-10)
    }
    return {
      minggu: m,
      kenaikanBerat: Number(d.kenaikanBerat),
      tanggal: d.tanggal,
    };
  }).filter((d) => !isNaN(d.minggu) && !isNaN(d.kenaikanBerat));

  // 2. Tentukan Berat Acuan Awal (Jika data yang dikirim adalah Berat Total > 25kg)
  const baseWeight = parsedData.length > 0 && parsedData[0].kenaikanBerat > 25
    ? parsedData[0].kenaikanBerat
    : 0;

  // 3. Olah Data Pasien agar Masuk Skala Kenaikan (-3 s/d 23 kg)
  const ibuData = parsedData
    .map((d) => {
      let kb = d.kenaikanBerat;
      if (baseWeight > 0) {
        kb = kb - baseWeight; // Hitung selisih dari berat pertama
      }
      return {
        ...d,
        kenaikanBerat: kb,
      };
    })
    .filter((d) => d.minggu >= MIN_MINGGU && d.minggu <= MAX_MINGGU)
    .sort((a, b) => a.minggu - b.minggu);

  const ibuPath = buildPath(ibuData, (d) => d.minggu, (d) => d.kenaikanBerat, scaleX, scaleY);

  const xTicks = Array.from({ length: 22 }, (_, i) => i * 2);
  const yTicks = Array.from({ length: MAX_KG - MIN_KG + 1 }, (_, i) => MIN_KG + i);

  // ==========================================
  // LOGIKA PENJELASAN & SARAN OTOMATIS (IBU HAMIL)
  // ==========================================
  const getPenjelasanOtomatis = () => {
    if (ibuData.length === 0) return null;

    const terakhir = ibuData[ibuData.length - 1];
    const mingguIni = terakhir.minggu;
    const kenaikan = terakhir.kenaikanBerat;

    // Cari acuan standar normal (menggunakan koridor 'normal' dari data beratHamil)
    const acuanMinggu = beratHamil.find((d) => d.minggu === mingguIni) || beratHamil[beratHamil.length - 1];
    const minNormal = acuanMinggu.normal.min;
    const maxNormal = acuanMinggu.normal.max;

    let statusText = "Normal / Sesuai Target";
    let statusBg = "bg-emerald-100 text-emerald-800 border-emerald-300";
    let saran = "Pertahankan kenaikan berat badan dengan pola makan gizi seimbang, cukup air putih, dan rutin berolahraga ringan khusus ibu hamil.";

    if (kenaikan < minNormal) {
      statusText = "Kenaikan Berat Badan Di Bawah Target";
      statusBg = "bg-amber-100 text-amber-800 border-amber-300";
      saran = "Peningkatan berat badan kurang dari rekomendasi mingguan. Tingkatkan konsumsi makanan padat gizi (protein hewani, karbohidrat kompleks) dan konsultasikan dengan tenaga kesehatan.";
    } else if (kenaikan > maxNormal) {
      statusText = "Kenaikan Berat Badan Di Atas Target";
      statusBg = "bg-orange-100 text-orange-800 border-orange-300";
      saran = "Peningkatan berat badan melebihi target mingguan. Batasi konsumsi makanan/minuman manis serta karbohidrat berlebih, serta perhatikan tanda-tanda bengkak pada kaki/tangan.";
    }

    // Evaluasi tren dari data sebelumnya jika ada
    let evaluasiTren = "";
    if (ibuData.length > 1) {
      const sebelumnya = ibuData[ibuData.length - 2];
      const selisihMinggu = terakhir.minggu - sebelumnya.minggu;
      const selisihBerat = Number((terakhir.kenaikanBerat - sebelumnya.kenaikanBerat).toFixed(1));
      
      if (selisihBerat > 0) {
        evaluasiTren = `Kenaikan berat badan bertambah +${selisihBerat} kg dalam rentang ${selisihMinggu} minggu terakhir (dari minggu ke-${sebelumnya.minggu} ke minggu ke-${terakhir.minggu}).`;
      } else if (selisihBerat === 0) {
        evaluasiTren = `Berat badan tetap (tidak ada perubahan) sejak pemeriksaan pada minggu ke-${sebelumnya.minggu}.`;
      } else {
        evaluasiTren = `Terdapat penurunan berat badan ${selisihBerat} kg dibanding pemantauan minggu ke-${sebelumnya.minggu}. Perhatikan asupan nutrisi harian.`;
      }
    } else {
      evaluasiTren = "Ini merupakan data pemantauan penimbangan pertama pada kehamilan ini.";
    }

    return {
      terakhir,
      statusText,
      statusBg,
      evaluasiTren,
      saran,
    };
  };

  const penjelasan = getPenjelasanOtomatis();

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-1 mb-2">
        <h2 className="font-bold text-xs md:text-sm text-gray-800">
          Grafik Peningkatan Berat Badan
        </h2>
        
        {/* KONTROL ZOOM IN / OUT */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2))}
            className="px-2.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-bold text-gray-700 shadow-xs"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 1))}
            className="px-2.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-bold text-gray-700 shadow-xs"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-medium text-gray-600 shadow-xs"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>
      </div>

      {/* KONTAINER DENGAN SCROLLBAR OTOMATIS SAAT DI-ZOOM */}
      <div className="w-full overflow-auto max-h-[550px] border border-gray-200 rounded-md bg-gray-50/50 p-1">
        <div
          className="relative transition-all duration-200 origin-top-left"
          style={{
            width: `${100 * zoomLevel}%`,
            minWidth: zoomLevel > 1 ? `${660 * zoomLevel}px` : "100%",
          }}
        >
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto select-none font-sans block">
            <defs>
              <clipPath id="bb-chart-clip">
                <rect
                  x={PADDING.left}
                  y={PADDING.top}
                  width={WIDTH - PADDING.left - PADDING.right}
                  height={HEIGHT - PADDING.top - PADDING.bottom}
                />
              </clipPath>
            </defs>

            {/* HEADER HITAM BUKU KIA */}
            <g>
              <rect x={PADDING.left} y={8} width={WIDTH - PADDING.left - PADDING.right} height={26} fill="#111827" rx="2" />
              <text x={WIDTH / 2} y={24} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Grafik Peningkatan Berat Badan untuk Kategori IMT Pra Kehamilan
              </text>
            </g>

            {/* GRID & AXIS (PERTEBAL WARNA & GARIS BINGKAI) */}
            <rect 
              x={PADDING.left} 
              y={PADDING.top} 
              width={WIDTH - PADDING.left - PADDING.right} 
              height={HEIGHT - PADDING.top - PADDING.bottom} 
              fill="#ffffff" 
              stroke="#111827" 
              strokeWidth="1.5" 
            />

            {/* GRID HORISONTAL (PERTEBAL GARIS) */}
            {yTicks.map((v) => (
              <g key={`y-${v}`}>
                <line 
                  x1={PADDING.left} 
                  x2={WIDTH - PADDING.right} 
                  y1={scaleY(v)} 
                  y2={scaleY(v)} 
                  stroke={v % 5 === 0 ? "#374151" : "#9ca3af"} 
                  strokeWidth={v % 5 === 0 ? "1.2" : "0.8"} 
                />
                <text x={PADDING.left - 5} y={scaleY(v) + 2.5} textAnchor="end" fontSize="6.5" fontWeight="bold" fill="#111827">{v}</text>
              </g>
            ))}

            <text x={PADDING.left - 20} y={PADDING.top - 6} fontSize="7.5" fontWeight="bold" fill="#111827" textAnchor="end">kg</text>

            {/* GRID VERTIKAL (PERTEBAL GARIS) */}
            {xTicks.map((v) => (
              <g key={`x-${v}`}>
                <line 
                  x1={scaleX(v)} 
                  x2={scaleX(v)} 
                  y1={PADDING.top} 
                  y2={HEIGHT - PADDING.bottom} 
                  stroke={v % 4 === 0 ? "#374151" : "#9ca3af"} 
                  strokeWidth={v % 4 === 0 ? "1.2" : "0.8"} 
                />
                <text x={scaleX(v)} y={HEIGHT - PADDING.bottom + 10} textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#111827">{v}</text>
              </g>
            ))}

            <text x={PADDING.left - 4} y={HEIGHT - PADDING.bottom + 10} textAnchor="end" fontSize="7" fontWeight="bold" fill="#111827">
              Minggu Kehamilan
            </text>

            {/* AREA SHADED KATEGORI IMT */}
            <g clipPath="url(#bb-chart-clip)">
              {kategoriInfo.map((k) => {
                if (k.fill === "none") return null;
                return (
                  <path
                    key={`band-fill-${k.key}`}
                    d={
                      buildBandPath(k.key, "min") +
                      " " +
                      beratHamil
                        .slice()
                        .reverse()
                        .map((d) => `L ${scaleX(d.minggu).toFixed(2)} ${scaleY(d[k.key].max).toFixed(2)}`)
                        .join(" ") +
                      " Z"
                    }
                    fill={k.fill}
                  />
                );
              })}

              {kategoriInfo.map((k) => (
                <g key={`band-lines-${k.key}`}>
                  <path d={buildBandPath(k.key, "max")} fill="none" stroke={k.color} strokeWidth="1.5" strokeDasharray={k.dash} />
                  <path d={buildBandPath(k.key, "min")} fill="none" stroke={k.color} strokeWidth="1.5" strokeDasharray={k.dash} />
                </g>
              ))}

              {/* GARIS KENAIKAN BERAT BADAN PASIEN */}
              {ibuData.length > 0 && <path d={ibuPath} fill="none" stroke="#7c3aed" strokeWidth="2.5" />}

              {/* TITIK-TITIK HASIL PEMERIKSAAN PASIEN */}
              {ibuData.map((d, i) => {
                const x = scaleX(d.minggu);
                const y = scaleY(d.kenaikanBerat);
                return (
                  <g key={`pt-group-${i}`}>
                    {/* Ring Luar Putih Tebal */}
                    <circle cx={x} cy={y} r={7} fill="#ffffff" stroke="#7c3aed" strokeWidth="1.5" />
                    {/* Lingkaran Utama Ungu */}
                    <circle
                      cx={x}
                      cy={y}
                      r={4.5}
                      fill="#7c3aed"
                      className="cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={() =>
                        setHover({
                          x,
                          y,
                          tanggal: d.tanggal,
                          kenaikanBerat: d.kenaikanBerat,
                          minggu: d.minggu,
                        })
                      }
                      onMouseLeave={() => setHover(null)}
                    />
                  </g>
                );
              })}
            </g>
          </svg>

          {/* TOOLTIP INTERAKTIF */}
          {hover && (
            <div
              className="absolute bg-gray-900/95 text-white text-[8.5px] rounded px-2 py-1 shadow-lg pointer-events-none whitespace-nowrap z-30 border border-gray-700 backdrop-blur-sm"
              style={{
                left: `${(hover.x / WIDTH) * 100}%`,
                top: `${(hover.y / HEIGHT) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="font-bold pb-0.5 border-b border-gray-700 mb-0.5 text-purple-300">
                Kenaikan Berat Badan
              </div>
              <div className="text-gray-200">
                <div>Tanggal: <span className="font-semibold text-white">{formatTanggal(hover.tanggal)}</span></div>
                <div>Usia: <span className="font-semibold text-white">{hover.minggu} minggu</span></div>
                <div>Hasil: <span className="font-bold text-yellow-400">{hover.kenaikanBerat.toFixed(1)} kg</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABEL LEGENDA */}
      <div className="overflow-x-auto border rounded border-gray-300">
        <table className="w-full text-[7.5px] border-collapse text-gray-800 bg-white">
          <thead className="bg-gray-100 font-bold border-b border-gray-300">
            <tr>
              <th className="border-r border-gray-300 px-1 py-0.5 text-center w-8">Tanda</th>
              <th className="border-r border-gray-300 px-1 py-0.5 text-left">BB Pre-kehamilan</th>
              <th className="border-r border-gray-300 px-1 py-0.5 text-center">IMT Pre-kehamilan</th>
              <th className="px-1 py-0.5 text-center">Rekomendasi Peningkatan BB</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">
                <span className="inline-block w-3 border-b-2 border-dashed border-black"></span>
              </td>
              <td className="border-r border-gray-300 px-1 py-0.5 font-medium">Kurus</td>
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">&lt; 18,5</td>
              <td className="px-1 py-0.5 text-center font-semibold">12,5 - 18 kg</td>
            </tr>
            <tr className="border-b border-gray-200 bg-pink-50/30">
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">
                <span className="inline-block w-3 border-b-2 border-dashed border-pink-500"></span>
              </td>
              <td className="border-r border-gray-300 px-1 py-0.5 font-medium">Normal</td>
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">18,5 - 24,9</td>
              <td className="px-1 py-0.5 text-center font-semibold">11,5 - 16 kg</td>
            </tr>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">
                <span className="inline-block w-3 border-b-2 border-gray-700"></span>
              </td>
              <td className="border-r border-gray-300 px-1 py-0.5 font-medium">Gemuk</td>
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">25 - 29,9</td>
              <td className="px-1 py-0.5 text-center font-semibold">7 - 11,5 kg</td>
            </tr>
            <tr className="bg-emerald-50/30">
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">
                <span className="inline-block w-3 border-b-2 border-dashed border-pink-500"></span>
              </td>
              <td className="border-r border-gray-300 px-1 py-0.5 font-medium">Obesitas</td>
              <td className="border-r border-gray-300 px-1 py-0.5 text-center">&gt; 30</td>
              <td className="px-1 py-0.5 text-center font-semibold">5 - 9 kg</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ==========================================
          KOTAK PENJELASAN & SARAN OTOMATIS (IBU HAMIL)
      ========================================== */}
      {penjelasan ? (
        <div className="mt-2 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-gray-700 space-y-2">
          <div className="flex items-center justify-between border-b border-purple-200 pb-2">
            <span className="font-bold text-gray-900 text-sm">
              Analisis Kenaikan Berat Badan Ibu Hamil
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${penjelasan.statusBg}`}
            >
              {penjelasan.statusText}
            </span>
          </div>

          <div className="space-y-1 pt-0.5 text-[11px]">
            <p>
              <strong className="text-gray-800">Pemantauan Terakhir:</strong>{" "}
              Kenaikan berat badan sebesar <strong className="text-purple-700">{penjelasan.terakhir.kenaikanBerat.toFixed(1)} kg</strong> pada usia kehamilan <strong className="text-purple-700">{penjelasan.terakhir.minggu} minggu</strong>
              {penjelasan.terakhir.tanggal && ` (${formatTanggal(penjelasan.terakhir.tanggal)})`}.
            </p>
            <p>
              <strong className="text-gray-800">Evaluasi Tren:</strong>{" "}
              {penjelasan.evaluasiTren}
            </p>
            <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-purple-200 mt-1 shadow-2xs">
              💡 <strong className="text-gray-900">Saran Bidan / Nakes:</strong>{" "}
              {penjelasan.saran}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-center text-xs text-gray-500">
          Belum ada data pemantauan kehamilan untuk menampilkan analisis dan saran otomatis.
        </div>
      )}
    </div>
  );
}