"use client";

import { useState } from "react";
import { bbuBoy } from "@/data/kms/bbuBoy";
import { ChartProps } from "./types";
import { formatTanggal, createScales, buildPath, Padding } from "./utils";

const WIDTH = 600;
const HEIGHT = 420;
const PADDING: Padding = { top: 30, right: 32, bottom: 50, left: 45 };
const MIN_UMUR = 0;
const MAX_UMUR = 24;
const MIN_BERAT = 1;
const MAX_BERAT = 18;

const { scaleX, scaleY } = createScales(
  WIDTH,
  HEIGHT,
  PADDING,
  MIN_UMUR,
  MAX_UMUR,
  MIN_BERAT,
  MAX_BERAT
);
const refData = bbuBoy.filter((d) => d.umur >= MIN_UMUR && d.umur <= MAX_UMUR);

type RefKey = "minus3" | "minus2" | "median" | "plus2" | "plus3";
const referenceLines: { key: RefKey; label: string; color: string }[] = [
  { key: "minus3", label: "-3", color: "#1a1a1a" },
  { key: "minus2", label: "-2", color: "#e53935" },
  { key: "median", label: "0", color: "#2e7d32" },
  { key: "plus2", label: "2", color: "#e53935" },
  { key: "plus3", label: "3", color: "#1a1a1a" },
];

export default function Boy024({ data }: ChartProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    tanggal: string;
    berat: number;
    umur: number;
  } | null>(null);

  const anakData = [...data]
    .filter(
      (d) =>
        d.umur != null &&
        d.berat != null &&
        !isNaN(Number(d.umur)) &&
        !isNaN(Number(d.berat))
    )
    .filter((d) => d.umur >= MIN_UMUR && d.umur <= MAX_UMUR)
    .sort((a, b) => a.umur - b.umur);

  const anakPath = buildPath(
    anakData,
    (d) => d.umur,
    (d) => d.berat,
    scaleX,
    scaleY
  );

  const xTicks = Array.from({ length: MAX_UMUR + 1 }, (_, i) => i);
  const yTicks = Array.from(
    { length: MAX_BERAT - MIN_BERAT + 1 },
    (_, i) => MIN_BERAT + i
  );

  const getPenjelasanOtomatis = () => {
    if (anakData.length === 0) return null;

    const terkahir = anakData[anakData.length - 1];
    const sebelum = anakData.length > 1 ? anakData[anakData.length - 2] : null;
    const refTerakhir = refData.find((d) => d.umur === terkahir.umur);

    let statusText = "Tidak Diketahui";
    let statusBg = "bg-gray-100 text-gray-800 border-gray-300";
    let evaluasiTren = "";
    let saran = "";

    if (refTerakhir) {
      if (terkahir.berat < refTerakhir.minus3) {
        statusText = "Berat Badan Sangat Kurang (Severely Underweight)";
        statusBg = "bg-red-100 text-red-800 border-gray-300";
        saran = "Segera rujuk ke puskesmas / fasilitas kesehatan untuk penanganan gizi klinis.";
      } else if (terkahir.berat < refTerakhir.minus2) {
        statusText = "Berat Badan Kurang (Underweight)";
        statusBg = "bg-amber-100 text-amber-800 border-gray-300";
        saran = "Perlu konseling gizi, tingkatkan asupan makanan bergizi seimbang dan ASI/MPASI.";
      } else if (terkahir.berat <= refTerakhir.plus2) {
        statusText = "Berat Badan Normal";
        statusBg = "bg-emerald-100 text-emerald-800 border-gray-300";
        saran = "Pertahankan pola makan bergizi seimbang dan rutinkan pemantauan setiap bulan.";
      } else {
        statusText = "Risiko Berat Badan Lebih";
        statusBg = "bg-orange-100 text-orange-800 border-gray-300";
        saran = "Perhatikan asupan gula, lemak, dan atur porsi makan sesuai usia balita.";
      }
    }

    if (sebelum) {
      const selisih = Number((terkahir.berat - sebelum.berat).toFixed(2));
      if (selisih > 0) {
        evaluasiTren = `Berat badan mengalami kenaikan sebesar +${selisih} kg dari bulan sebelumnya (${sebelum.umur} bulan).`;
      } else if (selisih === 0) {
        evaluasiTren = `Berat badan tetap (tidak mengalami perubahan) dibanding bulan sebelumnya (${sebelum.umur} bulan).`;
      } else {
        evaluasiTren = `Berat badan mengalami penurunan sebesar ${selisih} kg dari bulan sebelumnya (${sebelum.umur} bulan). Perlu perhatian ekstra!`;
      }
    } else {
      evaluasiTren = "Ini merupakan data pemeriksaan pertama yang tercatat.";
    }

    return {
      terkahir,
      statusText,
      statusBg,
      evaluasiTren,
      saran,
    };
  };

  const penjelasan = getPenjelasanOtomatis();
  const zoomedWidth = WIDTH / zoomLevel;
  const zoomedHeight = HEIGHT / zoomLevel;
  const viewBox = `0 0 ${zoomedWidth} ${zoomedHeight}`;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-extrabold text-base md:text-lg text-gray-900 mb-0.5">
            Grafik Berat Badan Menurut Umur (BB/U)
          </h2>
          <p className="text-xs text-gray-500">Anak Laki-Laki 0 - 24 Bulan</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 1.75))}
            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-bold text-gray-700"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1))}
            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-bold text-gray-700"
          >
            -
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-medium text-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="w-full overflow-auto max-h-[500px] border border-gray-100 rounded-xl bg-gray-50/50 p-1">
        <div
          className="relative transition-all duration-200 origin-top-left"
          style={{
            width: `${100 * zoomLevel}%`,
            minWidth: zoomLevel > 1 ? `${600 * zoomLevel}px` : "100%",
          }}
        >
          <svg viewBox={viewBox} className="w-full h-auto select-none block">
            <rect
              x={PADDING.left}
              y={PADDING.top}
              width={WIDTH - PADDING.left - PADDING.right}
              height={HEIGHT - PADDING.top - PADDING.bottom}
              fill="#ffffff"
              stroke="#111827"
              strokeWidth={1.5}
            />

            {yTicks.map((v) => (
              <g key={`y-${v}`}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={scaleY(v)}
                  y2={scaleY(v)}
                  stroke={v % 5 === 0 ? "#374151" : "#9ca3af"}
                  strokeWidth={v % 5 === 0 ? 1.2 : 0.8}
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

            <text x={WIDTH / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#111827">
              Umur (bulan penuh)
            </text>
            <text transform="rotate(-90)" x={-(HEIGHT / 2)} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#111827">
              Berat Badan (Kg)
            </text>

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

            {anakData.length > 0 && (
              <path d={anakPath} fill="none" stroke="#1565c0" strokeWidth={2.5} />
            )}
            {anakData.map((d, i) => {
              const x = scaleX(d.umur);
              const y = scaleY(d.berat);
              return (
                <g key={`pt-${i}`}>
                  <circle cx={x} cy={y} r={6} fill="#ffffff" stroke="#1565c0" strokeWidth={1.5} />
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill="#1565c0"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() =>
                      setHover({ x, y, tanggal: d.tanggal, berat: d.berat, umur: d.umur })
                    }
                    onMouseLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
          </svg>

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
              <div>Berat: {hover.berat} kg</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-700 pt-2 border-t">
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[#1a1a1a]" /><span>+3 SD : Risiko lebih</span></div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[#e53935]" /><span>+2 SD : Batas atas normal</span></div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[#2e7d32]" /><span>0 SD : Median</span></div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[#e53935]" /><span>-2 SD : Batas bawah normal</span></div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[#1a1a1a]" /><span>-3 SD : Sangat kurang</span></div>
      </div>

      {penjelasan ? (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-gray-200 text-xs text-gray-700 space-y-2">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-gray-900 text-sm">Analisis Hasil Penimbangan</span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${penjelasan.statusBg}`}>
              {penjelasan.statusText}
            </span>
          </div>
          <div className="space-y-1 pt-1">
            <p><strong className="text-gray-800">Pemeriksaan Terakhir:</strong> {penjelasan.terkahir.berat} kg pada usia {penjelasan.terkahir.umur} bulan {penjelasan.terkahir.tanggal && ` (${formatTanggal(penjelasan.terkahir.tanggal)})`}.</p>
            <p><strong className="text-gray-800">Perkembangan Pertumbuhan:</strong> {penjelasan.evaluasiTren}</p>
            <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
              💡 <strong className="text-gray-800">Saran Kader / Nakes:</strong> {penjelasan.saran}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-center text-xs text-gray-500">
          Belum ada data penimbangan balita pada rentang usia 0–24 bulan untuk ditampilkan penjelasannya.
        </div>
      )}
    </div>
  );
}