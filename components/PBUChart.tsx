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
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    tanggal: string;
    panjang: number;
    umur: number;
  } | null>(null);

  const source = jenisKelamin === "Laki-laki" ? pbuBoy : pbuGirl;
  const refData = source.filter((d) => d.umur >= MIN_UMUR && d.umur <= MAX_UMUR);

  const { scaleX, scaleY } = createScales(WIDTH, HEIGHT, PADDING, MIN_UMUR, MAX_UMUR, MIN_PANJANG, MAX_PANJANG);

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

  const anakPath = buildPath(anakData, (d) => d.umur, (d) => d.panjang, scaleX, scaleY);

  const xTicks = Array.from({ length: MAX_UMUR + 1 }, (_, i) => i);
  const yTicks = Array.from(
    { length: Math.floor((MAX_PANJANG - MIN_PANJANG) / 5) + 1 },
    (_, i) => MIN_PANJANG + i * 5
  );

  const color = jenisKelamin === "Laki-laki" ? "#1565c0" : "#d81b60";

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-center font-extrabold text-lg text-gray-900 mb-1">
        Grafik Panjang Badan Menurut Umur
      </h2>
      <p className="text-center text-xs text-gray-500 mb-3">
        Anak {jenisKelamin === "Laki-laki" ? "Laki-Laki" : "Perempuan"} 0 - 24 Bulan
      </p>

      <div className="relative">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
          {yTicks.map((v) => (
            <g key={`y-${v}`}>
              <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleY(v)} y2={scaleY(v)} stroke="#e0e0e0" strokeWidth={1} />
              <text x={PADDING.left - 8} y={scaleY(v)} textAnchor="end" dominantBaseline="middle" fontSize={9} fill="#555">
                {v}
              </text>
            </g>
          ))}

          {xTicks.map((v) => (
            <g key={`x-${v}`}>
              <line x1={scaleX(v)} x2={scaleX(v)} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} stroke="#e0e0e0" strokeWidth={1} />
              {v % 2 === 0 && (
                <text x={scaleX(v)} y={HEIGHT - PADDING.bottom + 14} textAnchor="middle" fontSize={9} fill="#555">
                  {v}
                </text>
              )}
            </g>
          ))}

          <text x={WIDTH / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="#333">
            Umur (bulan penuh)
          </text>
          <text transform="rotate(-90)" x={-(HEIGHT / 2)} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill="#333">
            Panjang Badan (Cm)
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

          {anakData.length > 0 && <path d={anakPath} fill="none" stroke={color} strokeWidth={2.5} />}
          {anakData.map((d, i) => {
            const x = scaleX(d.umur);
            const y = scaleY(d.panjang);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill={color}
                stroke="#fff"
                strokeWidth={1.2}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, panjang: d.panjang, umur: d.umur })}
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
            <div>Umur: {hover.umur} bulan</div>
            <div>Panjang: {hover.panjang} cm</div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-700">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#1a1a1a" }} />
          <span>+3 SD : Tinggi</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#e53935" }} />
          <span>+2 SD : Normal (atas)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#2e7d32" }} />
          <span>0 SD : Median</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#e53935" }} />
          <span>-2 SD : Pendek (stunted)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#1a1a1a" }} />
          <span>-3 SD : Sangat pendek</span>
        </div>
      </div>
    </div>
  );
}