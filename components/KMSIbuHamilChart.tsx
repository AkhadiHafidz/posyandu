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

const WIDTH = 600;
const HEIGHT = 420;
const PADDING: Padding = { top: 30, right: 32, bottom: 50, left: 45 };
const MIN_MINGGU = 0;
const MAX_MINGGU = 40;
const MIN_KG = -1;
const MAX_KG = 20;

const { scaleX, scaleY } = createScales(WIDTH, HEIGHT, PADDING, MIN_MINGGU, MAX_MINGGU, MIN_KG, MAX_KG);

const kategoriInfo: {
  key: "kurus" | "normal" | "gemuk" | "obesitas";
  label: string;
  color: string;
  imt: string;
  rekomendasi: string;
}[] = [
  { key: "kurus", label: "Kurus", color: "#1a1a1a", imt: "< 18,5", rekomendasi: "12,5 - 18 kg" },
  { key: "normal", label: "Normal", color: "#d81b60", imt: "18,5 - 24,9", rekomendasi: "11,5 - 16 kg" },
  { key: "gemuk", label: "Gemuk", color: "#2e7d32", imt: "25 - 29,9", rekomendasi: "7 - 11,5 kg" },
  { key: "obesitas", label: "Obesitas", color: "#1565c0", imt: "> 30", rekomendasi: "5 - 9 kg" },
];

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

export default function KMSIbuHamilChart({ data }: KMSIbuHamilChartProps) {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    tanggal: string;
    kenaikanBerat: number;
    minggu: number;
  } | null>(null);

  const ibuData = [...data]
    .filter(
      (d) =>
        d.minggu != null &&
        d.kenaikanBerat != null &&
        !isNaN(Number(d.minggu)) &&
        !isNaN(Number(d.kenaikanBerat))
    )
    .filter((d) => d.minggu >= MIN_MINGGU && d.minggu <= MAX_MINGGU)
    .sort((a, b) => a.minggu - b.minggu);

  const ibuPath = buildPath(ibuData, (d) => d.minggu, (d) => d.kenaikanBerat, scaleX, scaleY);

  const xTicks = Array.from({ length: 11 }, (_, i) => i * 4);
  const yTicks = Array.from({ length: MAX_KG - MIN_KG + 1 }, (_, i) => MIN_KG + i).filter((v) => v % 2 === 0);

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-center font-extrabold text-lg text-gray-900 mb-1">
        Grafik Peningkatan Berat Badan
      </h2>
      <p className="text-center text-xs text-gray-500 mb-3">
        Adaptasi dari IOM, 2009
      </p>

      <div className="relative">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
          {/* Grid horizontal */}
          {yTicks.map((v) => (
            <g key={`y-${v}`}>
              <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleY(v)} y2={scaleY(v)} stroke="#e0e0e0" strokeWidth={1} />
              <text x={PADDING.left - 8} y={scaleY(v)} textAnchor="end" dominantBaseline="middle" fontSize={9} fill="#555">
                {v}
              </text>
            </g>
          ))}

          {/* Grid vertikal */}
          {xTicks.map((v) => (
            <g key={`x-${v}`}>
              <line x1={scaleX(v)} x2={scaleX(v)} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} stroke="#e0e0e0" strokeWidth={1} />
              <text x={scaleX(v)} y={HEIGHT - PADDING.bottom + 14} textAnchor="middle" fontSize={9} fill="#555">
                {v}
              </text>
            </g>
          ))}

          {/* Judul sumbu */}
          <text x={WIDTH / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="#333">
            Minggu Kehamilan
          </text>
          <text transform="rotate(-90)" x={-(HEIGHT / 2)} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill="#333">
            Kenaikan Berat Badan (Kg)
          </text>

          {/* Semua band kategori ditampilkan setara — tanpa highlight, sesuai kartu asli */}
          {kategoriInfo.map((k) => (
            <g key={k.key}>
              <path
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
                fill={k.color}
                opacity={0.12}
              />
              <path d={buildBandPath(k.key, "max")} fill="none" stroke={k.color} strokeWidth={1.5} strokeDasharray="5 3" />
              <path d={buildBandPath(k.key, "min")} fill="none" stroke={k.color} strokeWidth={1.5} strokeDasharray="5 3" />
            </g>
          ))}

          {/* Garis kenaikan berat badan ibu (data aktual) */}
          {ibuData.length > 0 && (
            <path d={ibuPath} fill="none" stroke="#9333ea" strokeWidth={2.5} />
          )}
          {ibuData.map((d, i) => {
            const x = scaleX(d.minggu);
            const y = scaleY(d.kenaikanBerat);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill="#9333ea"
                stroke="#fff"
                strokeWidth={1.2}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, kenaikanBerat: d.kenaikanBerat, minggu: d.minggu })}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </svg>

        {hover && (
          <div
            className="absolute bg-gray-900 text-white text-[11px] rounded-md px-2.5 py-1.5 shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              left: `${(hover.x / WIDTH) * 100}%`,
              top: `${(hover.y / HEIGHT) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="font-semibold">{formatTanggal(hover.tanggal)}</div>
            <div>Usia Gestasi: {hover.minggu} minggu</div>
            <div>Kenaikan Berat: {hover.kenaikanBerat} kg</div>
          </div>
        )}
      </div>

      {/* Legenda kategori — sebagai referensi, bukan status pasien */}
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-700">
        {kategoriInfo.map((k) => (
          <div key={k.key} className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5" style={{ backgroundColor: k.color }} />
            <span>
              {k.label} (IMT {k.imt}): {k.rekomendasi}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}