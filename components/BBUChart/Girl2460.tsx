"use client";

import { useState } from "react";
import { bbuGirl } from "@/data/kms/bbuGirl";
import { ChartProps, ChartData } from "./types";
import { formatTanggal } from "./utils";

const WIDTH = 1800;
const HEIGHT = 850;

const LEFT = 70;
const RIGHT = 30;
const TOP = 30;
const BOTTOM = 60;

const GRAPH_WIDTH = WIDTH - LEFT - RIGHT;
const GRAPH_HEIGHT = HEIGHT - TOP - BOTTOM;

const MIN_UMUR = 24;
const MAX_UMUR = 60;

const MAX_BERAT = 28;

const who = bbuGirl.filter(
  (item) => item.umur >= 24
);

const getX = (umur: number) =>
  LEFT +
  ((umur - MIN_UMUR) /
    (MAX_UMUR - MIN_UMUR)) *
    GRAPH_WIDTH;

const getY = (berat: number) =>
  HEIGHT -
  BOTTOM -
  (berat / MAX_BERAT) *
    GRAPH_HEIGHT;

export default function Girl2460({
  data,
}: ChartProps) {

  const riwayat = data.filter(
    (item) => item.umur >= 24
  );

  const [hoverPoint, setHoverPoint] =
    useState<ChartData | null>(null);

  const getStatusGizi = (
    umur: number,
    berat: number
  ) => {

    const row = who.find(
      (item) => item.umur === umur
    );

    if (!row) return "Tidak diketahui";

    if (berat < row.minus3)
      return "Gizi Buruk";

    if (berat < row.minus2)
      return "Risiko Gizi Kurang";

    if (berat <= row.plus2)
      return "Normal";

    if (berat <= row.plus3)
      return "Risiko Gizi Lebih";

    return "Gizi Lebih";
  };

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "Normal":
        return "#16A34A";

      case "Risiko Gizi Kurang":
      case "Risiko Gizi Lebih":
        return "#FACC15";

      case "Gizi Buruk":
        return "#DC2626";

      case "Gizi Lebih":
        return "#2563EB";

      default:
        return "#6B7280";
    }

  };

  const tooltipX =
    hoverPoint &&
    hoverPoint.umur > 56
      ? getX(hoverPoint.umur) - 240
      : hoverPoint
      ? getX(hoverPoint.umur) + 10
      : 0;

  const createLine = (
    key:
      | "minus3"
      | "minus2"
      | "minus1"
      | "median"
      | "plus1"
      | "plus2"
      | "plus3",
    color: string,
    width = 2
  ) => (

    <polyline
      fill="none"
      stroke={color}
      strokeWidth={width}
      points={who
        .map(
          (item) =>
            `${getX(item.umur)},${getY(item[key])}`
        )
        .join(" ")}
    />

  );

  if (riwayat.length === 0) {
    return (
      <div className="mt-10 p-6 bg-white rounded-3xl shadow-sm">
        Belum ada riwayat pemeriksaan umur 24–60 bulan.
      </div>
    );
  }

  return (

    <div className="mt-10 bg-white rounded-[30px] border border-pink-100 shadow-sm p-6">

      <h2 className="text-2xl font-bold text-gray-800">
        Grafik Berat Badan Menurut Umur (BB/U)
      </h2>

      <p className="text-gray-600">
        Anak Perempuan • 24–60 Bulan
      </p>

      <div className="overflow-x-auto">

        <svg
          width={WIDTH}
          height={HEIGHT}
          className="min-w-[1800px]"
        >
            {/* ================= GRID VERTIKAL ================= */}

{Array.from({
  length: MAX_UMUR - MIN_UMUR + 1,
}).map((_, i) => {

  const umur = i + MIN_UMUR;

  const x = getX(umur);

  return (

    <g key={`v-${umur}`}>

      <line
        x1={x}
        y1={TOP}
        x2={x}
        y2={HEIGHT - BOTTOM}
        stroke="#D1D5DB"
        strokeWidth={1}
      />

      <text
        x={x}
        y={HEIGHT - 30}
        textAnchor="middle"
        fontSize="11"
        fill="#374151"
      >
        {umur}
      </text>

    </g>

  );

})}

{/* ================= GRID HORIZONTAL ================= */}

{Array.from({
  length: MAX_BERAT + 1,
}).map((_, i) => {

  const y = getY(i);

  return (

    <g key={`h-${i}`}>

      <line
        x1={LEFT}
        y1={y}
        x2={WIDTH - RIGHT}
        y2={y}
        stroke="#E5E7EB"
        strokeWidth={1}
      />

      <text
        x={LEFT - 12}
        y={y + 4}
        textAnchor="end"
        fontSize="12"
        fontWeight="600"
        fill="#374151"
      >
        {i}
      </text>

    </g>

  );

})}

{/* ================= SUMBU X ================= */}

<line
  x1={LEFT}
  y1={HEIGHT - BOTTOM}
  x2={WIDTH - RIGHT}
  y2={HEIGHT - BOTTOM}
  stroke="#000"
  strokeWidth={2}
/>

{/* ================= SUMBU Y ================= */}

<line
  x1={LEFT}
  y1={TOP}
  x2={LEFT}
  y2={HEIGHT - BOTTOM}
  stroke="#000"
  strokeWidth={2}
/>

{/* ================= JUDUL SUMBU X ================= */}

<text
  x={WIDTH / 2}
  y={HEIGHT - 5}
  textAnchor="middle"
  fontSize="15"
  fontWeight="bold"
>
  Umur (Bulan)
</text>

{/* ================= JUDUL SUMBU Y ================= */}

<text
  transform={`translate(20 ${
    HEIGHT / 2
  }) rotate(-90)`}
  textAnchor="middle"
  fontSize="15"
  fontWeight="bold"
>
  Berat Badan (Kg)
</text>

{/* ================= AREA WARNA KMS ================= */}

{/* -3 SD s/d -2 SD */}
<polygon
  fill="#FDE047"
  opacity={0.45}
  points={
    who
      .map((d) => `${getX(d.umur)},${getY(d.minus3)}`)
      .join(" ") +
    " " +
    who
      .slice()
      .reverse()
      .map((d) => `${getX(d.umur)},${getY(d.minus2)}`)
      .join(" ")
  }
/>

{/* -2 SD s/d -1 SD */}
<polygon
  fill="#A3E635"
  opacity={0.7}
  points={
    who
      .map((d) => `${getX(d.umur)},${getY(d.minus2)}`)
      .join(" ") +
    " " +
    who
      .slice()
      .reverse()
      .map((d) => `${getX(d.umur)},${getY(d.minus1)}`)
      .join(" ")
  }
/>

{/* -1 SD s/d Median */}
<polygon
  fill="#22C55E"
  opacity={0.7}
  points={
    who
      .map((d) => `${getX(d.umur)},${getY(d.minus1)}`)
      .join(" ") +
    " " +
    who
      .slice()
      .reverse()
      .map((d) => `${getX(d.umur)},${getY(d.median)}`)
      .join(" ")
  }
/>

{/* Median s/d +1 SD */}
<polygon
  fill="#16A34A"
  opacity={0.7}
  points={
    who
      .map((d) => `${getX(d.umur)},${getY(d.median)}`)
      .join(" ") +
    " " +
    who
      .slice()
      .reverse()
      .map((d) => `${getX(d.umur)},${getY(d.plus1)}`)
      .join(" ")
  }
/>

{/* +1 SD s/d +2 SD */}
<polygon
  fill="#A3E635"
  opacity={0.7}
  points={
    who
      .map((d) => `${getX(d.umur)},${getY(d.plus1)}`)
      .join(" ") +
    " " +
    who
      .slice()
      .reverse()
      .map((d) => `${getX(d.umur)},${getY(d.plus2)}`)
      .join(" ")
  }
/>

{/* +2 SD s/d +3 SD */}
<polygon
  fill="#FDE047"
  opacity={0.7}
  points={
    who
      .map((d) => `${getX(d.umur)},${getY(d.plus2)}`)
      .join(" ") +
    " " +
    who
      .slice()
      .reverse()
      .map((d) => `${getX(d.umur)},${getY(d.plus3)}`)
      .join(" ")
  }
/>

{/* ================= GARIS WHO ================= */}

{createLine("minus3", "#FACC15")}
{createLine("minus2", "#84CC16")}
{createLine("minus1", "#16A34A")}
{createLine("median", "#166534", 4)}
{createLine("plus1", "#16A34A")}
{createLine("plus2", "#84CC16")}
{createLine("plus3", "#FACC15")}

{/* ================= LABEL SD ================= */}

<text
  x={WIDTH - 15}
  y={getY(who[0].plus3)}
  fontSize="12"
  fill="#374151"
>
  +3 SD
</text>

<text
  x={WIDTH - 15}
  y={getY(who[0].plus2)}
  fontSize="12"
  fill="#374151"
>
  +2 SD
</text>

<text
  x={WIDTH - 15}
  y={getY(who[0].plus1)}
  fontSize="12"
  fill="#374151"
>
  +1 SD
</text>

<text
  x={WIDTH - 15}
  y={getY(who[0].median)}
  fontSize="12"
  fontWeight="bold"
  fill="#166534"
>
  Median
</text>

<text
  x={WIDTH - 15}
  y={getY(who[0].minus1)}
  fontSize="12"
  fill="#374151"
>
  -1 SD
</text>

<text
  x={WIDTH - 15}
  y={getY(who[0].minus2)}
  fontSize="12"
  fill="#374151"
>
  -2 SD
</text>

<text
  x={WIDTH - 15}
  y={getY(who[0].minus3)}
  fontSize="12"
  fill="#374151"
>
  -3 SD
</text>

{/* ================= GARIS RIWAYAT ================= */}

<polyline
  fill="none"
  stroke="#000"
  strokeWidth={3}
  points={riwayat
    .map(
      (item) =>
        `${getX(item.umur)},${getY(item.berat)}`
    )
    .join(" ")}
/>

{/* ================= TITIK PEMERIKSAAN ================= */}

{riwayat.map((item, index) => (

  <g key={index}>

    <circle
      cx={getX(item.umur)}
      cy={getY(item.berat)}
      r={5}
      fill="#000"
      style={{ cursor: "pointer" }}
      onMouseEnter={() =>
        setHoverPoint(item)
      }
      onMouseLeave={() =>
        setHoverPoint(null)
      }
    />

  </g>

))}

{/* ================= TOOLTIP ================= */}

{hoverPoint && (

<g>

<rect
  x={tooltipX}
  y={getY(hoverPoint.berat)-105}
  width={220}
  height={120}
  rx={10}
  fill="#FFF"
  stroke="#16A34A"
  strokeWidth={2}
/>

<text
  x={tooltipX+20}
  y={getY(hoverPoint.berat)-82}
  fontSize="13"
  fontWeight="bold"
  fill="#166534"
>
  Pemeriksaan Balita
</text>

<text
  x={tooltipX+20}
  y={getY(hoverPoint.berat)-60}
  fontSize="12"
>
  Umur : {hoverPoint.umur} Bulan
</text>

<text
  x={tooltipX+20}
  y={getY(hoverPoint.berat)-40}
  fontSize="12"
>
  Berat : {hoverPoint.berat} Kg
</text>

<text
  x={tooltipX+20}
  y={getY(hoverPoint.berat)-20}
  fontSize="12"
  fontWeight="bold"
  fill={
    getStatusColor(
      getStatusGizi(
        hoverPoint.umur,
        hoverPoint.berat
      )
    )
  }
>
  Status :
  {" "}
  {getStatusGizi(
    hoverPoint.umur,
    hoverPoint.berat
  )}
</text>

<text
  x={tooltipX+20}
  y={getY(hoverPoint.berat)}
  fontSize="12"
>
  {formatTanggal(
    hoverPoint.tanggal
  )}
</text>

</g>

)}

</svg>

{/* ================= LEGEND ================= */}

<div className="flex flex-wrap gap-8 mt-6 text-gray-800">

  <div className="flex items-center gap-2">
    <div
      style={{
        width:18,
        height:18,
        background:"#16A34A",
        borderRadius:4,
      }}
    />
    <span className="font-medium">
      Normal
    </span>
  </div>

  <div className="flex items-center gap-2">
    <div
      style={{
        width:18,
        height:18,
        background:"#FACC15",
        borderRadius:4,
      }}
    />
    <span className="font-medium">
      Risiko
    </span>
  </div>

  <div className="flex items-center gap-2">
    <div
      style={{
        width:18,
        height:18,
        background:"#EF4444",
        borderRadius:4,
      }}
    />
    <span className="font-medium">
      Gizi Buruk
    </span>
  </div>

  <div className="flex items-center gap-2">
    <div
      style={{
        width:16,
        height:16,
        background:"#000",
        borderRadius:"50%",
      }}
    />
    <span className="font-medium">
      Pemeriksaan Balita
    </span>
  </div>

</div>

</div>

</div>

);
}