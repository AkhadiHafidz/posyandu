"use client";

import { useState } from "react";
import { pbuBoy } from "@/data/kms/pbuBoy";
import { pbuGirl } from "@/data/kms/pbuGirl";
import { createScales, buildPath, Padding } from "./BBUChart/utils";
import { formatTanggal } from "./BBUChart/utils";

export interface PanjangData {
  umur: number;
  panjang: number;
  tanggal: string;
}

interface PBUChartProps {
  data: PanjangData[];
  jenisKelamin: "Laki-laki" | "Perempuan";
}

const WIDTH = 600;
const HEIGHT = 420;
const PADDING: Padding = { top: 30, right: 32, bottom: 50, left: 45 };
const MIN_UMUR = 0;
const MAX_UMUR = 24;
const MIN_PANJANG = 44;
const MAX_PANJANG = 98;

type RefKey = "minus3" | "minus2" | "median" | "plus2" | "plus3";
const referenceLines: { key: RefKey; label: string; color: string }[] = [
  { key: "minus3", label: "-3", color: "#1a1a1a" },
  { key: "minus2", label: "-2", color: "#e53935" },
  { key: "median", label: "0", color: "#2e7d32" },
  { key: "plus2", label: "2", color: "#e53935" },
  { key: "plus3", label: "3", color: "#1a1a1a" },
];

export default function PBUChart({ data, jenisKelamin }: PBUChartProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    tanggal: string;
    panjang: number;
    umur: number;
  } | null>(null);

  const source = jenisKelamin === "Laki-laki" ? pbuBoy : pbuGirl;
  const refData = source.filter((d) => d.umur >= MIN_UMUR && d.umur <= MAX_UMUR);

  const { scaleX, scaleY } = createScales(
    WIDTH,
    HEIGHT,
    PADDING,
    MIN_UMUR,
    MAX_UMUR,
    MIN_PANJANG,
    MAX_PANJANG
  );

  const anakData = [...data]
    .filter(
      (d) =>
        d.umur != null &&
        d.panjang != null &&
        !isNaN(Number(d.umur)) &&
        !isNaN(Number(d.panjang))
    )
    .filter((d) => d.umur >= MIN_UMUR && d.umur <= MAX_UMUR)
    .sort((a, b) => a.umur - b.umur);

  const anakPath = buildPath(
    anakData,
    (d) => d.umur,
    (d) => d.panjang,
    scaleX,
    scaleY
  );

  const xTicks = Array.from({ length: MAX_UMUR + 1 }, (_, i) => i);
  const yTicks = Array.from(
    { length: Math.floor((MAX_PANJANG - MIN_PANJANG) / 5) + 1 },
    (_, i) => MIN_PANJANG + i * 5
  );

  const color = jenisKelamin === "Laki-laki" ? "#1565c0" : "#d81b60";

  // ==========================================
  // LOGIKA PENJELASAN OTOMATIS (INTERPRETASI PB/U)
  // ==========================================
  const getPenjelasanOtomatis = () => {
    if (anakData.length === 0) return null;

    const terakhir = anakData[anakData.length - 1];
    const sebelum = anakData.length > 1 ? anakData[anakData.length - 2] : null;

    // Cari acuan WHO/Permenkes berdasarkan usia
    const refTerakhir = refData.find((d) => d.umur === terakhir.umur);

    let statusText = "Tidak Diketahui";
    let statusBg = "bg-gray-100 text-gray-800 border-gray-300";
    let evaluasiTren = "";
    let saran = "";

    if (refTerakhir) {
      if (terakhir.panjang < refTerakhir.minus3) {
        statusText = "Sangat Pendek (Severely Stunted)";
        statusBg = "bg-red-100 text-red-800 border-red-300";
        saran = "Segera konsultasikan ke dokter/puskesmas untuk penanganan stunting komprehensif.";
      } else if (terakhir.panjang < refTerakhir.minus2) {
        statusText = "Pendek (Stunted)";
        statusBg = "bg-amber-100 text-amber-800 border-amber-300";
        saran = "Tingkatkan asupan gizi seimbang (ASI/MPASI kaya protein hewani) dan edukasi sanitasi.";
      } else if (terakhir.panjang <= refTerakhir.plus3) {
        statusText = "Tinggi Badan Normal";
        statusBg = "bg-emerald-100 text-emerald-800 border-emerald-300";
        saran = "Pertahankan pola nutrisi seimbang dan tingkatkan stimulasi tumbuh kembang anak.";
      } else {
        statusText = "Tinggi";
        statusBg = "bg-blue-100 text-blue-800 border-blue-300";
        saran = "Pertumbuhan tinggi anak optimal di atas rata-rata. Lanjutkan pemantauan rutin.";
      }
    }

    // Evaluasi Tren Pertumbuhan Dibanding Bulan Sebelumnya
    if (sebelum) {
      const selisih = Number((terakhir.panjang - sebelum.panjang).toFixed(1));
      if (selisih > 0) {
        evaluasiTren = `Panjang badan bertambah +${selisih} cm dari pengukuran sebelumnya (${sebelum.umur} bulan).`;
      } else if (selisih === 0) {
        evaluasiTren = `Panjang badan tetap (${terakhir.panjang} cm) dibandingkan bulan sebelumnya (${sebelum.umur} bulan).`;
      } else {
        evaluasiTren = `Tercatat penurunan panjang badan ${selisih} cm dari bulan sebelumnya. Pastikan teknik pengukuran akurat!`;
      }
    } else {
      evaluasiTren = "Ini merupakan data pengukuran panjang badan pertama yang tercatat.";
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

  // Perhitungan Zoom via ViewBox SVG agar mulus tanpa scrollbar berlebih
  const zoomedWidth = WIDTH / zoomLevel;
  const zoomedHeight = HEIGHT / zoomLevel;
  const viewBox = `0 0 ${zoomedWidth} ${zoomedHeight}`;

  return (
    <div className={`w-full bg-white rounded-2xl border ${jenisKelamin === "Laki-laki" ? "border-blue-200" : "border-pink-200"} p-5 shadow-sm space-y-4`}>
      {/* JUDUL & KONTROL ZOOM */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-extrabold text-base md:text-lg text-gray-900 mb-0.5">
            Grafik Panjang Badan Menurut Umur (PB/U)
          </h2>
          <p className="text-xs text-gray-500">
            Anak {jenisKelamin === "Laki-laki" ? "Laki-Laki" : "Perempuan"} 0 - 24 Bulan
          </p>
        </div>

        {/* TOMBOL ZOOM IN / OUT */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 1.75))}
            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-bold text-gray-700 shadow-xs"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1))}
            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-bold text-gray-700 shadow-xs"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-medium text-gray-600 shadow-xs"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>
      </div>

      {/* CANVAS SVG DENGAN KONTAINER SCROLL OTOMATIS SAAT DI-ZOOM */}
      <div className="w-full overflow-auto max-h-[500px] border border-gray-100 rounded-xl bg-gray-50/50 p-1">
        <div
          className="relative transition-all duration-200 origin-top-left"
          style={{
            width: `${100 * zoomLevel}%`,
            minWidth: zoomLevel > 1 ? `${600 * zoomLevel}px` : "100%",
          }}
        >
          <svg viewBox={viewBox} className="w-full h-auto select-none block">
            
            {/* BINGKAI LUAR GRAFIK (Garis Dipertebal) */}
            <rect
              x={PADDING.left}
              y={PADDING.top}
              width={WIDTH - PADDING.left - PADDING.right}
              height={HEIGHT - PADDING.top - PADDING.bottom}
              fill="#ffffff"
              stroke="#111827"
              strokeWidth={1.5}
            />

            {/* Grid Horizontal + label sumbu Y (Garis Dipertebal) */}
            {yTicks.map((v) => (
              <g key={`y-${v}`}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={scaleY(v)}
                  y2={scaleY(v)}
                  stroke="#9ca3af"
                  strokeWidth={0.8}
                />
                <text
                  x={PADDING.left - 8}
                  y={scaleY(v)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={9}
                  fontWeight="bold"
                  fill="#111827"
                >
                  {v}
                </text>
              </g>
            ))}

            {/* Grid Vertikal + label sumbu X (Garis Dipertebal) */}
            {xTicks.map((v) => (
              <g key={`x-${v}`}>
                <line
                  x1={scaleX(v)}
                  x2={scaleX(v)}
                  y1={PADDING.top}
                  y2={HEIGHT - PADDING.bottom}
                  stroke={v % 4 === 0 ? "#374151" : "#9ca3af"}
                  strokeWidth={v % 4 === 0 ? 1.2 : 0.8}
                />
                {v % 2 === 0 && (
                  <text
                    x={scaleX(v)}
                    y={HEIGHT - PADDING.bottom + 14}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight="bold"
                    fill="#111827"
                  >
                    {v}
                  </text>
                )}
              </g>
            ))}

            {/* Judul Sumbu */}
            <text
              x={WIDTH / 2}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#111827"
            >
              Umur (bulan penuh)
            </text>
            <text
              transform="rotate(-90)"
              x={-(HEIGHT / 2)}
              y={12}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#111827"
            >
              Panjang Badan (Cm)
            </text>

            {/* Garis Referensi WHO */}
            {referenceLines.map((ref) => (
              <g key={ref.key}>
                <path
                  d={buildPath(refData, (d) => d.umur, (d) => d[ref.key], scaleX, scaleY)}
                  fill="none"
                  stroke={ref.color}
                  strokeWidth={2}
                />
                <text
                  x={scaleX(MAX_UMUR) + 5}
                  y={scaleY(refData[refData.length - 1][ref.key])}
                  fontSize={9}
                  fontWeight={700}
                  fill={ref.color}
                  dominantBaseline="middle"
                >
                  {ref.label}
                </text>
              </g>
            ))}

            {/* Garis & Titik Hasil Anak */}
            {anakData.length > 0 && (
              <path d={anakPath} fill="none" stroke={color} strokeWidth={2.5} />
            )}
            {anakData.map((d, i) => {
              const x = scaleX(d.umur);
              const y = scaleY(d.panjang);
              return (
                <g key={`pt-${i}`}>
                  <circle cx={x} cy={y} r={6} fill="#ffffff" stroke={color} strokeWidth={1.5} />
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill={color}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() =>
                      setHover({ x, y, tanggal: d.tanggal, panjang: d.panjang, umur: d.umur })
                    }
                    onMouseLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Tooltip Hover */}
          {hover && (
            <div
              className="absolute bg-gray-900 text-white text-[11px] rounded-md px-2.5 py-1.5 shadow-lg pointer-events-none whitespace-nowrap z-30"
              style={{
                left: `${(hover.x / WIDTH) * 100}%`,
                top: `${(hover.y / HEIGHT) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="font-semibold">{formatTanggal(hover.tanggal)}</div>
              <div>Umur: {hover.umur} bulan</div>
              <div>Panjang: {hover.panjang} cm</div>
            </div>
          )}
        </div>
      </div>

      {/* LEGENDA GARIS */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-700 pt-2 border-t">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#1a1a1a]" />
          <span>+3 SD : Tinggi</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#e53935]" />
          <span>+2 SD : Normal (atas)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#2e7d32]" />
          <span>0 SD : Median</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#e53935]" />
          <span>-2 SD : Pendek (stunted)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#1a1a1a]" />
          <span>-3 SD : Sangat pendek</span>
        </div>
      </div>

      {/* KOTAK PENJELASAN OTOMATIS (ANALISIS PB/U) */}
      {penjelasan ? (
        <div className={`mt-4 p-4 rounded-xl border text-xs text-gray-700 space-y-2 ${jenisKelamin === "Laki-laki" ? "bg-slate-50 border-gray-200" : "bg-pink-50/50 border-pink-200"}`}>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-gray-900 text-sm">
              Analisis Panjang Badan (PB/U)
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${penjelasan.statusBg}`}
            >
              {penjelasan.statusText}
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <p>
              <strong className="text-gray-800">Pengukuran Terakhir:</strong>{" "}
              {penjelasan.terakhir.panjang} cm pada umur {penjelasan.terakhir.umur} bulan
              {penjelasan.terakhir.tanggal && ` (${formatTanggal(penjelasan.terakhir.tanggal)})`}.
            </p>
            <p>
              <strong className="text-gray-800">Evaluasi Pertumbuhan:</strong>{" "}
              {penjelasan.evaluasiTren}
            </p>
            <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-gray-200 mt-1">
              💡 <strong className="text-gray-800">Saran Kader / Nakes:</strong>{" "}
              {penjelasan.saran}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-center text-xs text-gray-500">
          Belum ada data pengukuran panjang badan pada usia 0–24 bulan untuk menampilkan penjelasannya.
        </div>
      )}
    </div>
  );
}