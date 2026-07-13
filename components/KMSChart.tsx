"use client";
import { whoBoy } from "@/data/whoBoy";
import { whoGirl } from "@/data/whoGirl";
import { useState } from "react";

interface ChartData {
  umur: number;
  berat: number;
  tanggal: string;
}

interface Props {
  data: ChartData[];
  jk: string;
}

const WIDTH = 2400;
const HEIGHT = 850;

const LEFT = 70;
const RIGHT = 30;
const TOP = 30;
const BOTTOM = 60;

const GRAPH_WIDTH = WIDTH - LEFT - RIGHT;
const GRAPH_HEIGHT = HEIGHT - TOP - BOTTOM;
const getX = (umur: number) => {
  return LEFT + (umur / 60) * GRAPH_WIDTH;
};

const getY = (berat: number) => {
  return (
    HEIGHT -
    BOTTOM -
    (berat / 18) * GRAPH_HEIGHT
  );
};
const formatTanggal = (tanggal: string) => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};



export default function KMSChart({ 
  data,
  jk, 
}: Props) {
  const [hoverPoint, setHoverPoint] = useState<ChartData | null>(null);
  const who =
    jk === "Laki-laki"
      ? whoBoy
      : whoGirl;

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
      return "#FACC15";

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
  hoverPoint.umur > 55
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
      .map((item) => `${getX(item.umur)},${getY(item[key])}`)
      .join(" ")}
  />
);

  return (
    <div className="mt-10 bg-white rounded-[30px] border border-green-100 shadow-sm p-6">

      <h2 className="text-2xl font-bold text-gray-800">
        Grafik KMS
      </h2>

      <p className="text-gray-500 mb-6">
        Grafik perkembangan berat badan balita.
      </p>

      <div className="overflow-x-auto">

        <svg
          width={WIDTH}
          height={HEIGHT}
          className="min-w-[2400px]"
        >

          {/* GRID VERTIKAL 0-60 */}
          {Array.from({ length: 61 }).map((_, i) => {
            const x =
              LEFT + (i * GRAPH_WIDTH) / 60;

            return (
              <g key={`v-${i}`}>

                <line
                  x1={x}
                  y1={TOP}
                  x2={x}
                  y2={HEIGHT - BOTTOM}
                  stroke="#D1D5DB"
                  strokeWidth={2}
                />

                <text
                  x={x}
                  y={HEIGHT - 30}
                  fontSize="11"
                  textAnchor="middle"
                  fill="#374151"
                >
                  {i}
                </text>

              </g>
            );
          })}
{/* GRID HORIZONTAL + ANGKA BERAT BADAN */}
{Array.from({ length: 19 }).map((_, i) => {
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
      
          {/* Sumbu X */}

          <line
            x1={LEFT}
            y1={HEIGHT - BOTTOM}
            x2={WIDTH - RIGHT}
            y2={HEIGHT - BOTTOM}
            stroke="black"
            strokeWidth={2}
          />

          {/* Sumbu Y */}

          <line
            x1={LEFT}
            y1={TOP}
            x2={LEFT}
            y2={HEIGHT - BOTTOM}
            stroke="black"
            strokeWidth={2}
          />
      {/* Kurva WHO */}
{/* AREA WARNA KMS */}

{/* Kuning bawah (-3 SD s/d -2 SD) */}
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

{/* Hijau muda (-2 SD s/d -1 SD) */}
<polygon
  fill="#A3E635"
  opacity="0.7"
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

{/* Hijau sedang (-1 SD s/d Median) */}
<polygon
  fill="#22C55E"
  opacity="0.7"
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

{/* Hijau sedang (Median s/d +1 SD) */}
<polygon
  fill="#16A34A"
  opacity="0.7"
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

{/* Hijau muda (+1 SD s/d +2 SD) */}
<polygon
  fill="#A3E635"
  opacity="0.7"
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

{/* Kuning atas (+2 SD s/d +3 SD) */}
<polygon
  fill="#FDE047"
  opacity="0.7"
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
{createLine("minus3", "#FACC15")}
{createLine("minus2", "#84CC16")}
{createLine("minus1", "#16A34A")}
{createLine("median", "#166534", 3)}
{createLine("plus1", "#16A34A")}
{createLine("plus2", "#84CC16")}
{createLine("plus3", "#FACC15")}

          {/* Judul X */}

          <text
            x={WIDTH / 2}
            y={HEIGHT - 5}
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
          >
            Umur (Bulan)
          </text>

          {/* Judul Y */}

          <text
            transform={`translate(20 ${HEIGHT / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
          >
            Berat Badan (Kg)
          </text>

          <polyline
  fill="none"
  stroke="#000000"
  strokeWidth="3"
  points={data
    .map(
      (item) =>
        `${getX(item.umur)},${getY(item.berat)}`
    )
    .join(" ")}
/>

{/* Titik Pemeriksaan */}

{data.map((item, index) => (
  <g key={index}>

 <circle
  cx={getX(item.umur)}
  cy={getY(item.berat)}
  r={4}
  fill="#000"
  style={{ cursor: "pointer" }}
  onMouseEnter={() => setHoverPoint(item)}
  onMouseLeave={() => setHoverPoint(null)}
/>


    <text
      x={getX(item.umur)}
      y={getY(item.berat) - 10}
      textAnchor="middle"
      fontSize="11"
      fill="#000000"
      fontWeight="bold"
    >
    </text>

  </g>
))}
{hoverPoint && (
  <g>

    <rect
  x={tooltipX}
  y={getY(hoverPoint.berat) - 105}
  width={220}
  height={120}
  rx={10}
  fill="#ffffff"
  stroke="#16A34A"
  strokeWidth={2}
/>

  <text
  x={tooltipX + 20}
  y={getY(hoverPoint.berat)-80}
  fontSize="13"
  fontWeight="bold"
  fill="#166534"
>
  Pemeriksaan Balita
</text>

<text
  x={tooltipX + 20}
  y={getY(hoverPoint.berat)-58}
  fontSize="12"
>
  Umur : {hoverPoint.umur} Bulan
</text>

<text
  x={tooltipX + 20}
  y={getY(hoverPoint.berat)-38}
  fontSize="12"
>
  BB : {hoverPoint.berat} Kg
</text>
<text
  x={tooltipX + 20}
  y={getY(hoverPoint.berat) - 18}
  fontSize="12"
  fill={getStatusColor(
    getStatusGizi(
      hoverPoint.umur,
      hoverPoint.berat
    )
  )}
  fontWeight="bold"
>
  Status :
  {getStatusGizi(
    hoverPoint.umur,
    hoverPoint.berat
  )}
</text>
<text
  x={tooltipX + 20}
  y={getY(hoverPoint.berat)+2}
  fontSize="12"
>
  Tanggal : {formatTanggal(hoverPoint.tanggal)}
</text>

  </g>
)}
        </svg>
     <div className="flex flex-wrap gap-8 mt-6 text-gray-800">

  <div className="flex items-center gap-2">
    <div
      style={{
        width: "18px",
        height: "18px",
        backgroundColor: "#16A34A",
        borderRadius: "4px",
        flexShrink: 0,
      }}
    ></div>
    <span className="text-gray-800 font-medium">Normal</span>
  </div>

  <div className="flex items-center gap-2">
    <div
      style={{
        width: "18px",
        height: "18px",
        backgroundColor: "#FACC15",
        borderRadius: "4px",
        flexShrink: 0,
      }}
    ></div>
    <span className="text-gray-800 font-medium">Risiko</span>
  </div>

  <div className="flex items-center gap-2">
    <div
      style={{
        width: "18px",
        height: "18px",
        backgroundColor: "#EF4444",
        borderRadius: "4px",
        flexShrink: 0,
      }}
    ></div>
    <span className="text-gray-800 font-medium">Gizi Buruk</span>
  </div>

  <div className="flex items-center gap-2">
    <div
      style={{
        width: "16px",
        height: "16px",
        backgroundColor: "#000",
        borderRadius: "50%",
        flexShrink: 0,
      }}
    ></div>
    <span className="text-gray-800 font-medium">
      Pemeriksaan Balita
    </span>
  </div>

</div>


      </div>  

    </div>
  );
}