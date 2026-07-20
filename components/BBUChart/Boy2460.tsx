"use client";

import { useState } from "react";
import { bbuBoy } from "@/data/kms/bbuBoy";
import { ChartProps } from "./types";
import { formatTanggal, createScales, buildPath, Padding } from "./utils";

const WIDTH = 600;
const HEIGHT = 420;
const PADDING: Padding = { top: 30, right: 32, bottom: 50, left: 45 };
const MIN_UMUR = 24;
const MAX_UMUR = 60;
const MIN_BERAT = 8;
const MAX_BERAT = 30;

const { scaleX, scaleY } = createScales(WIDTH, HEIGHT, PADDING, MIN_UMUR, MAX_UMUR, MIN_BERAT, MAX_BERAT);
const refData = bbuBoy.filter((d) => d.umur >= MIN_UMUR && d.umur <= MAX_UMUR);

type RefKey = "minus3" | "minus2" | "median" | "plus2" | "plus3";
const referenceLines: { key: RefKey; label: string; color: string }[] = [
  { key: "minus3", label: "-3", color: "#1a1a1a" },
  { key: "minus2", label: "-2", color: "#e53935" },
  { key: "median", label: "0", color: "#2e7d32" },
  { key: "plus2", label: "2", color: "#e53935" },
  { key: "plus3", label: "3", color: "#1a1a1a" },
];

export default function Boy2460({ data }: ChartProps) {
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

  const anakPath = buildPath(anakData, (d) => d.umur, (d) => d.berat, scaleX, scaleY);

  const xTicks = Array.from({ length: MAX_UMUR - MIN_UMUR + 1 }, (_, i) => MIN_UMUR + i);
  const yTicks = Array.from({ length: MAX_BERAT - MIN_BERAT + 1 }, (_, i) => MIN_BERAT + i);

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-center font-extrabold text-lg text-gray-900 mb-1">
        Grafik Berat Badan Menurut Umur
      </h2>
      <p className="text-center text-xs text-gray-500 mb-3">
        Anak Laki-Laki 24 - 60 Bulan
      </p>

      <div className="relative">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
          {/* Grid horizontal + label sumbu Y */}
          {yTicks.map((v) => (
            <g key={`y-${v}`}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={scaleY(v)}
                y2={scaleY(v)}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 8}
                y={scaleY(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={9}
                fill="#555"
              >
                {v}
              </text>
            </g>
          ))}

          {/* Grid vertikal + label sumbu X */}
          {xTicks.map((v) => (
            <g key={`x-${v}`}>
              <line
                x1={scaleX(v)}
                x2={scaleX(v)}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
              {v % 2 === 0 && (
                <text
                  x={scaleX(v)}
                  y={HEIGHT - PADDING.bottom + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#555"
                >
                  {v}
                </text>
              )}
            </g>
          ))}

          {/* Judul sumbu */}
          <text
            x={WIDTH / 2}
            y={HEIGHT - 6}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill="#333"
          >
            Umur (bulan penuh)
          </text>
          <text
            transform="rotate(-90)"
            x={-(HEIGHT / 2)}
            y={12}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill="#333"
          >
            Berat Badan (Kg)
          </text>

          {/* Kurva referensi WHO */}
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

          {/* Garis pertumbuhan anak (data aktual) */}
          {anakData.length > 0 && (
            <path d={anakPath} fill="none" stroke="#1565c0" strokeWidth={2.5} />
          )}
          {anakData.map((d, i) => {
            const x = scaleX(d.umur);
            const y = scaleY(d.berat);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill="#1565c0"
                stroke="#fff"
                strokeWidth={1.2}
                style={{ cursor: "pointer" }}
                onMouseEnter={() =>
                  setHover({ x, y, tanggal: d.tanggal, berat: d.berat, umur: d.umur })
                }
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip custom */}
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
            <div>Berat: {hover.berat} kg</div>
          </div>
        )}
      </div>

      {/* Legenda garis */}
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-700">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#1a1a1a" }} />
          <span>+3 SD : Risiko lebih</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#e53935" }} />
          <span>+2 SD : Batas atas normal</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#2e7d32" }} />
          <span>0 SD : Median</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#e53935" }} />
          <span>-2 SD : Batas bawah normal</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5" style={{ backgroundColor: "#1a1a1a" }} />
          <span>-3 SD : Sangat kurang</span>
        </div>
      </div>
    </div>
  );
}