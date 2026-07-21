"use client";

import { useState } from "react";
import { tfuReferensi } from "@/data/kms/tfu";
import { createScales, buildPath, Padding, formatTanggal } from "./BBUChart/utils";

export interface EvaluasiKehamilanData {
  minggu: number;

  tfu?: number;

  sistol?: number;
  diastol?: number;

  nadi?: number;

  djj?: number;

  letakJanin?: string;
  tabletFe?: string;
  imunisasiTT?: string;
  keluhan?: string;

  tanggal: string;
}
interface GrafikEvaluasiKehamilanProps {
  data: EvaluasiKehamilanData[];
  
}

const WIDTH = 700;
const HEIGHT = 380;
const PADDING: Padding = { top: 25, right: 32, bottom: 45, left: 45 };
const MIN_MINGGU = 8;
const MAX_MINGGU = 42;
const MIN_TFU = 5;
const MAX_TFU = 45;

const { scaleX, scaleY } = createScales(WIDTH, HEIGHT, PADDING, MIN_MINGGU, MAX_MINGGU, MIN_TFU, MAX_TFU);

const STRIP_WIDTH = 700;
const STRIP_HEIGHT = 130;
const STRIP_PADDING: Padding = { top: 15, right: 32, bottom: 25, left: 45 };


function StripChart({
  data,
  getValue,
  minVal,
  maxVal,
  batasNormalMin,
  batasNormalMax,
  label,
  unit,
  color,
}: {
  data: EvaluasiKehamilanData[];
  getValue: (d: EvaluasiKehamilanData) => number | undefined;
  minVal: number;
  maxVal: number;
  batasNormalMin: number;
  batasNormalMax: number;
  label: string;
  unit: string;
  color: string;
}) {
  const { scaleX: sx, scaleY: sy } = createScales(STRIP_WIDTH, STRIP_HEIGHT, STRIP_PADDING, MIN_MINGGU, MAX_MINGGU, minVal, maxVal);

  const valid = data
    .filter((d) => getValue(d) != null && !isNaN(Number(getValue(d))))
    .sort((a, b) => a.minggu - b.minggu);

  const path = buildPath(valid, (d) => d.minggu, (d) => getValue(d)!, sx, sy);

  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <div className="mb-3">
      <p className="text-xs font-semibold text-gray-700 mb-1">{label} ({unit})</p>
      <svg viewBox={`0 0 ${STRIP_WIDTH} ${STRIP_HEIGHT}`} className="w-full h-auto">
       
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={STRIP_PADDING.left} x2={STRIP_WIDTH - STRIP_PADDING.right} y1={sy(v)} y2={sy(v)} stroke="#e0e0e0" strokeWidth={1} />
            <text x={STRIP_PADDING.left - 6} y={sy(v)} textAnchor="end" dominantBaseline="middle" fontSize={8} fill="#666">
              {Math.round(v)}
            </text>
          </g>
        ))}

        {/* Garis batas normal */}
        <line x1={STRIP_PADDING.left} x2={STRIP_WIDTH - STRIP_PADDING.right} y1={sy(batasNormalMin)} y2={sy(batasNormalMin)} stroke="#e53935" strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={STRIP_PADDING.left} x2={STRIP_WIDTH - STRIP_PADDING.right} y1={sy(batasNormalMax)} y2={sy(batasNormalMax)} stroke="#e53935" strokeWidth={1.5} strokeDasharray="4 3" />

        {valid.length > 0 && <path d={path} fill="none" stroke={color} strokeWidth={2} />}
        {valid.map((d, i) => (
          <circle key={i} cx={sx(d.minggu)} cy={sy(getValue(d)!)} r={3} fill={color} />
        ))}

        {Array.from({ length: 8 }, (_, i) => 8 + i * 5).map((v) => (
          <text key={v} x={sx(v)} y={STRIP_HEIGHT - STRIP_PADDING.bottom + 12} textAnchor="middle" fontSize={8} fill="#666">
            {v}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function GrafikEvaluasiKehamilan({ data }: GrafikEvaluasiKehamilanProps) {
  const [hover, setHover] = useState<{ x: number; y: number; tanggal: string; tfu: number; minggu: number } | null>(null);

  const ibuData = [...data]
    .filter((d) => d.tfu != null && !isNaN(Number(d.tfu)) && d.minggu >= MIN_MINGGU && d.minggu <= MAX_MINGGU)
    .sort((a, b) => a.minggu - b.minggu);

  const ibuPath = buildPath(ibuData, (d) => d.minggu, (d) => d.tfu!, scaleX, scaleY);

  const refInRange = tfuReferensi;

  const xTicks = Array.from({ length: 8 }, (_, i) => 8 + i * 5);
  const yTicks = Array.from({ length: 9 }, (_, i) => 5 + i * 5);

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-center font-extrabold text-lg text-gray-900 mb-3">
        Grafik Evaluasi Kehamilan
      </h2>

      {/* ================= KURVA TFU ================= */}
      <p className="text-xs font-semibold text-gray-700 mb-1">
        Tinggi Fundus Uteri (cm) menurut Usia Gestasi (minggu)
      </p>
      <div className="relative mb-4">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
            {/* GRID VERTIKAL SETIAP 1 MINGGU */}
{Array.from(
    { length: MAX_MINGGU - MIN_MINGGU + 1 },
    (_, i) => MIN_MINGGU + i
).map((m) => (
    <line
        key={`v-${m}`}
        x1={scaleX(m)}
        x2={scaleX(m)}
        y1={PADDING.top}
        y2={HEIGHT - PADDING.bottom}
        stroke={m % 5 === 0 ? "#4a4a4a" : "#bdbdbd"}
strokeWidth={m % 5 === 0 ? 1.2 : 0.45}
    />
))}

{/* GRID HORIZONTAL SETIAP 1 CM */}
{Array.from(
    { length: MAX_TFU - MIN_TFU + 1 },
    (_, i) => MIN_TFU + i
).map((cm) => (
    <line
        key={`h-${cm}`}
        x1={PADDING.left}
        x2={WIDTH - PADDING.right}
        y1={scaleY(cm)}
        y2={scaleY(cm)}
       stroke={cm % 5 === 0 ? "#4a4a4a" : "#bdbdbd"}
strokeWidth={cm % 5 === 0 ? 1.2 : 0.45}
    />
))}
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
              <text x={scaleX(v)} y={HEIGHT - PADDING.bottom + 14} textAnchor="middle" fontSize={9} fill="#555">
                {v}
              </text>
            </g>
          ))}

          <text x={WIDTH / 2} y={HEIGHT - 5} textAnchor="middle" fontSize={10} fontWeight={600} fill="#333">
            Usia Gestasi (minggu)
          </text>
          <text transform="rotate(-90)" x={-(HEIGHT / 2)} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill="#333">
            TFU (cm)
          </text>

          {/* Area normal */}
          <path
            d={
              buildPath(refInRange, (d) => d.minggu, (d) => d.batasBawah, scaleX, scaleY) +
              " " +
              refInRange
                .slice()
                .reverse()
                .map((d) => `L ${scaleX(d.minggu).toFixed(2)} ${scaleY(d.batasAtas).toFixed(2)}`)
                .join(" ") +
              " Z"
            }
            fill="#22C55E"
            opacity={0.15}
          />

          <path d={buildPath(refInRange, (d) => d.minggu, (d) => d.batasBawah, scaleX, scaleY)} fill="none" stroke="#1a1a1a" strokeWidth={1.5} strokeDasharray="5 3" />
          <path d={buildPath(refInRange, (d) => d.minggu, (d) => d.median, scaleX, scaleY)} fill="none" stroke="#2e7d32" strokeWidth={2} />
          <path d={buildPath(refInRange, (d) => d.minggu, (d) => d.batasAtas, scaleX, scaleY)} fill="none" stroke="#1a1a1a" strokeWidth={1.5} strokeDasharray="5 3" />

          {/* Data aktual TFU ibu */}
          {ibuData.length > 0 && <path d={ibuPath} fill="none" stroke="#9333ea" strokeWidth={2.5} />}
          {ibuData.map((d, i) => {
            const x = scaleX(d.minggu);
            const y = scaleY(d.tfu!);
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
                onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, tfu: d.tfu!, minggu: d.minggu })}
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
            <div>TFU: {hover.tfu} cm</div>
          </div>
        )}
      </div>

      {/* ================= TENSI & NADI ================= */}
     
      <StripChart
        data={data}
        getValue={(d) => d.diastol}
        minVal={40}
        maxVal={110}
        batasNormalMin={60}
        batasNormalMax={90}
        label="Tekanan Darah Diastol"
        unit="mmHg"
        color="#1565c0"
      />
      <StripChart
  data={data}
  getValue={(d) => d.nadi}
  minVal={40}
  maxVal={140}
  batasNormalMin={60}
  batasNormalMax={100}
  label="Nadi"
  unit="x/menit"
  color="#ef6c00"
/>
  
    <div className="overflow-x-auto mt-3 max-h-52">
    <table className="w-full text-[10px] border border-gray-400 text-gray-900 bg-white">
        <thead className="bg-green-50">
            <tr>
                <th className="border border-gray-400 px-1 py-0.5 text-center">No</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">Tanggal</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">Minggu</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">TFU</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">DJJ</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">TD</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">Nadi</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">Letak Janin</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">Tablet Fe</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">Imunisasi TT</th>
                <th className="border border-gray-400 px-1 py-0.5 text-center">Keluhan</th>
            </tr>
        </thead>

        <tbody>
            {data
                .slice()
                .sort((a,b)=>a.minggu-b.minggu)
                .map((d,index)=>(
                    <tr key={index}>
                        <td className="border p-2 text-center">
                            {index + 1}
                        </td>
                        <td className="border p-2">{formatTanggal(d.tanggal)}</td>
                        <td className="border p-2">{d.minggu}</td>
                        <td className="border p-2">{d.tfu ?? "-"}</td>
                        <td className="border p-2">{d.djj ?? "-"}</td>
                        <td className="border p-2">
                            {d.sistol}/{d.diastol}
                        </td>
                        <td className="border p-2">
                            {d.nadi ?? "-"}
                        </td>
                        <td className="border p-2">
                            {d.letakJanin ?? "-"}
                        </td>
                        <td className="border p-2">
                            {d.tabletFe ?? "-"}
                        </td>
                        <td className="border p-2">
                            {d.imunisasiTT ?? "-"}
                        </td>
                        <td className="border p-2">
                            {d.keluhan ?? "-"}
                        </td>
                    </tr>
                ))}
        </tbody>
    </table>
</div>
    </div>
  );
}