"use client";
import { useState } from "react";
import { PregnancyChart } from "@/data/kms/whoPregnancy";

interface Pemeriksaan {
  bulan:number;
  berat:number|null;
  fundus:number|null;
  lingkarLengan:number|null;
  tekananDarah:string;
  tanggal:string;     
}

interface Props{
  data:Pemeriksaan[];
}
export default function KMSIbuHamilChart({
  data,
}: Props) {
const WIDTH = 780;
const HEIGHT = 360;

const LEFT = 90;
const RIGHT = 90;
const TOP = 40;
const BOTTOM = 70;

const GRAPH_WIDTH = WIDTH - LEFT - RIGHT;
const GRAPH_HEIGHT = HEIGHT - TOP - BOTTOM;

const getX = (bulan: number) =>
  LEFT + ((bulan - 1) / 8) * GRAPH_WIDTH;

const MAX_BERAT = 90;

const getYBerat = (berat: number) =>
  HEIGHT -
  BOTTOM -
  (berat / MAX_BERAT) * GRAPH_HEIGHT;

const getYTFU = (nilai: number) =>
  HEIGHT -
  BOTTOM -
  (nilai / 40) * GRAPH_HEIGHT;
 
  const [hoverData, setHoverData] = useState<{
  x: number;
  y: number;
  data: Pemeriksaan;
} | null>(null);
  const tooltipX =
  hoverData && hoverData.x > WIDTH - 280
    ? hoverData.x - 250
    : hoverData
    ? hoverData.x + 15
    : 0;
    const tooltipY =
  hoverData && hoverData.y < 150
    ? hoverData.y + 20
    : hoverData
    ? hoverData.y - 135
    : 0;
const createPath = (
  data: { bulan:number; value:number }[],
  getY:(v:number)=>number
) => {

  return data
    .map((d,i)=>{

      const x = getX(d.bulan);
      const y = getY(d.value);

      return `${i===0?"M":"L"} ${x} ${y}`;

    })
    .join(" ");

};

const chart = PregnancyChart.map((item) => {
const pemeriksaan = data.find(
  (d) => Number(d.bulan) === item.bulan
);


  return {
    bulan: item.bulan,

    bawah: item.bawah,

    hijau: item.hijau,

    kuning: item.kuning,

    merah: item.merah,

    zonaHijau: item.hijau - item.bawah,

    zonaKuning: item.kuning - item.hijau,

    zonaMerah: item.merah - item.kuning,

    berat: pemeriksaan?.berat ?? null,

    fundus: pemeriksaan?.fundus ?? null,

    lingkarLengan:
      pemeriksaan?.lingkarLengan ?? null,

    tekananDarah:
      pemeriksaan?.tekananDarah ?? "",
      tanggal: pemeriksaan?.tanggal ?? "",
  };
});


 
  return (

    <div className="rounded-2xl border bg-white shadow-md p-4">

      <h2 className="text-2xl font-bold text-gray-800">

        Grafik KMS Ibu Hamil

      </h2>

      <p className="text-sm text-gray-500 mb-4">

        Grafik perkembangan berat badan ibu hamil berdasarkan usia kehamilan.

      </p>

      <div className="overflow-x-auto">

 <svg
    width={WIDTH}
    height={HEIGHT}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    className="w-full h-auto"
>
    {/* Garis Vertikal */}
 {Array.from({ length: 17 }).map((_, i) => {

    const x =
        LEFT + (i * GRAPH_WIDTH) / 16;

    return (

        <g key={i}>

            <line
                x1={x}
                y1={TOP}
                x2={x}
                y2={HEIGHT-BOTTOM}
                stroke="#D1D5DB"
            />

        </g>

    );

})}

    {/* Garis Horizontal */}
   {Array.from({ length: 21 }).map((_, i) => {

    const y =
        TOP + (i * GRAPH_HEIGHT) / 20;

    return (

        <g key={i+50}>

            <line
                x1={LEFT}
                y1={y}
                x2={WIDTH-RIGHT}
                y2={y}
                stroke="#D1D5DB"
            />

        </g>

    );

})}
<line
    x1={LEFT}
    y1={HEIGHT-BOTTOM}
    x2={WIDTH-RIGHT}
    y2={HEIGHT-BOTTOM}
    stroke="black"
    strokeWidth={2}
/>
<line
    x1={LEFT}
    y1={TOP}
    x2={LEFT}
    y2={HEIGHT-BOTTOM}
    stroke="black"
    strokeWidth={2}
/>
<line
    x1={WIDTH-RIGHT}
    y1={TOP}
    x2={WIDTH-RIGHT}
    y2={HEIGHT-BOTTOM}
    stroke="#2563EB"
    strokeWidth={2}
/>
<defs>

  <linearGradient id="zonaHijau" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stopColor="#C8F2D0"/>
    <stop offset="100%" stopColor="#C8F2D0"/>
  </linearGradient>

  <linearGradient id="zonaKuning" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stopColor="#FFF3A6"/>
    <stop offset="100%" stopColor="#FFF3A6"/>
  </linearGradient>

  <linearGradient id="zonaMerah" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stopColor="#FFD5E8"/>
    <stop offset="100%" stopColor="#FFD5E8"/>
  </linearGradient>

</defs>
<polygon
    fill="url(#zonaHijau)"
    opacity={0.9}
    points={
        chart
        .map(d=>`${getX(d.bulan)},${getYBerat(d.bawah)}`)
        .join(" ")
        +" "+
        chart
        .slice()
        .reverse()
        .map(d=>`${getX(d.bulan)},${getYBerat(d.hijau)}`)
        .join(" ")
    }
/>
<polygon
    fill="url(#zonaKuning)"
    opacity={0.9}
    points={
        chart
        .map(d=>`${getX(d.bulan)},${getYBerat(d.hijau)}`)
        .join(" ")
        +" "+
        chart
        .slice()
        .reverse()
        .map(d=>`${getX(d.bulan)},${getYBerat(d.kuning)}`)
        .join(" ")
    }
/>
<polygon
    fill="url(#zonaMerah)"
    opacity={0.9}
    points={
        chart
        .map(d=>`${getX(d.bulan)},${getYBerat(d.kuning)}`)
        .join(" ")
        +" "+
        chart
        .slice()
        .reverse()
        .map(d=>`${getX(d.bulan)},${getYBerat(d.merah)}`)
        .join(" ")
    }
/>
<polyline

fill="none"
stroke="black"
strokeWidth={1}

points={
chart
.map(d=>`${getX(d.bulan)},${getYBerat(d.bawah)}`)
.join(" ")
}

/>
<polyline

fill="none"
stroke="#2E7D32"
strokeWidth={2}

points={
chart
.map(d=>`${getX(d.bulan)},${getYBerat(d.hijau)}`)
.join(" ")
}

/>
<polyline

fill="none"
stroke="#D97706"
strokeWidth={2}

points={
chart
.map(d=>`${getX(d.bulan)},${getYBerat(d.kuning)}`)
.join(" ")
}

/>
<polyline

fill="none"
stroke="#DB2777"
strokeWidth={2}

points={
chart
.map(d=>`${getX(d.bulan)},${getYBerat(d.merah)}`)
.join(" ")
}

/>
<path
  d={createPath(
    chart
      .filter(d=>d.berat!=null)
      .map(d=>({
        bulan:d.bulan,
        value:d.berat!,
      })),
    getYBerat
  )}
  fill="none"
  stroke="#16A34A"
  strokeWidth={4}
/>
{chart
.filter(d=>d.berat!=null)
.map((d,i)=>(

<circle
  key={i}
  cx={getX(d.bulan)}
  cy={getYBerat(d.berat!)}
  r={7}
  fill="#16A34A"
  stroke="white"
  strokeWidth={3}
  style={{ cursor: "pointer" }}
  onMouseEnter={() =>
    setHoverData({
      x: getX(d.bulan),
      y: getYBerat(d.berat!),
      data: d,
    })
  }
  onMouseLeave={() => setHoverData(null)}
/>

))}
<path
  d={createPath(
    chart
      .filter(d=>d.fundus!=null)
      .map(d=>({
        bulan:d.bulan,
        value:d.fundus!,
      })),
    getYTFU
  )}
  fill="none"
  stroke="#2563EB"
  strokeWidth={4}
/>

{chart
.filter(d=>d.fundus!=null)
.map((d,i)=>(

<circle
  key={`tfu${i}`}
  cx={getX(d.bulan)}
  cy={getYTFU(d.fundus!)}
  r={6}
  fill="#2563EB"
  stroke="white"
  strokeWidth={3}
  style={{ cursor: "pointer" }}
  onMouseEnter={() =>
    setHoverData({
      x: getX(d.bulan),
      y: getYTFU(d.fundus!),
      data: d,
    })
  }
  onMouseLeave={() => setHoverData(null)}
/>

))}

<path
  d={createPath(
    chart
      .filter(d=>d.lingkarLengan!=null)
      .map(d=>({
        bulan:d.bulan,
        value:d.lingkarLengan!,
      })),
    getYTFU
  )}
  fill="none"
  stroke="#EA580C"
  strokeWidth={4}
/>
{chart
.filter(d=>d.lingkarLengan!=null)
.map((d,i)=>(

<circle
  key={`lila${i}`}
  cx={getX(d.bulan)}
  cy={getYTFU(d.lingkarLengan!)}
  r={6}
  fill="#EA580C"
  stroke="white"
  strokeWidth={3}
  style={{ cursor: "pointer" }}
  onMouseEnter={() =>
    setHoverData({
      x: getX(d.bulan),
      y: getYTFU(d.lingkarLengan!),
      data: d,
    })
  }
  onMouseLeave={() => setHoverData(null)}
/>

))}
{/* Angka Berat Badan */}
{Array.from({ length:10 }).map((_,i)=>{

   const berat = i * 10;

   return(

      <g key={i}>

         <text
            x={LEFT-12}
            y={getYBerat(berat)+5}
            textAnchor="end"
            fontSize="15"
            fontWeight="bold"
         >
            {berat}
         </text>

         <line
            x1={LEFT-8}
            y1={getYBerat(berat)}
            x2={LEFT}
            y2={getYBerat(berat)}
            stroke="black"
            strokeWidth={2}
         />

      </g>

   );

})}

{/* Angka TFU */}
{Array.from({ length: 9 }).map((_, i) => {

  const nilai = i * 5;

  return (
    <g key={`tfu-${i}`}>

      <text
        x={WIDTH - RIGHT + 10}
        y={getYTFU(nilai) + 5}
        fontSize="15"
        fontWeight="bold"
        fill="#2563EB"
      >
        {nilai}
      </text>

      <line
        x1={WIDTH - RIGHT}
        y1={getYTFU(nilai)}
        x2={WIDTH - RIGHT + 6}
        y2={getYTFU(nilai)}
        stroke="#2563EB"
        strokeWidth="2"
      />


    </g>
  );

})}
{Array.from({ length: 9 }).map((_, i) => {

  const x = getX(i + 1);

  return (
    <line
      key={`tickx-${i}`}
      x1={x}
      y1={HEIGHT - BOTTOM}
      x2={x}
      y2={HEIGHT - BOTTOM + 8}
      stroke="black"
      strokeWidth={2}
    />
  );

})}

{/* Bulan */}
{/* Angka Bulan */}
{Array.from({ length:9 }).map((_,i)=>{

   const bulan=i+1;

   return(

      <text
         key={`bulan-${bulan}`}
         x={getX(bulan)}
         y={HEIGHT-BOTTOM+28}
         textAnchor="middle"
         fontSize="15"
         fontWeight="bold"
      >
         {bulan}
      </text>

   );

})}
<text
  x={WIDTH / 2}
  y={HEIGHT - 28}
  textAnchor="middle"
  fontSize={13}
  fontWeight="600"
>
  Usia Kehamilan (Bulan)
</text>
<text
  transform={`translate(25 ${HEIGHT / 2}) rotate(-90)`}
  textAnchor="middle"
  fontSize="15"
  fontWeight="600"
>
  Berat Badan (Kg)
</text>
<text
  transform={`translate(${WIDTH - 20} ${HEIGHT / 2}) rotate(90)`}
  textAnchor="middle"
  fontSize="15"
  fontWeight="600"
  fill="#2563EB"
>
  TFU / Lingkar Lengan (cm)
</text>

<g transform={`translate(${WIDTH / 2 - 190}, ${HEIGHT - 22})`}>

  <circle cx={0} cy={4} r={5} fill="#16A34A"/>
  <text x={12} y={10} fontSize={15} fontWeight="bold" fill="#16A34A">
    Berat Badan
  </text>

  <circle cx={220} cy={4} r={5} fill="#EA580C"/>
  <text x={232} y={10} fontSize={15} fontWeight="bold" fill="#EA580C">
    Lingkar Lengan
  </text>

  <circle cx={430} cy={4} r={5} fill="#2563EB"/>
  <text x={442} y={10} fontSize={15} fontWeight="bold" fill="#2563EB">
    TFU
  </text>

</g>

{/* Tooltip */}
{hoverData && (
  <g>

<line
    x1={hoverData.x}
    y1={TOP}
    x2={hoverData.x}
    y2={HEIGHT-BOTTOM}
    stroke="#888"
    strokeDasharray="5 5"
/>
    <rect
      filter="drop-shadow(2px 3px 6px rgba(0,0,0,.25))"
      x={tooltipX}
      y={tooltipY}
      width={240}
      height={175}
      rx={10}
      fill="white"
      stroke="#16a36d"
      strokeWidth={2}
    />

    <text
      x={tooltipX+10}
      y={tooltipY + 25}
      fontWeight="bold"
      fill="#15803D"
      fontSize={15}
    >
      Bulan {hoverData.data.bulan}
    </text>

    <text
      x={tooltipX+10}
      y={tooltipY + 70}
      fontSize={14}
    >
      Berat :
      {hoverData.data.berat ?? "-"} Kg
    </text>

    <text
      x={tooltipX+10}
      y={tooltipY + 95}
      fontSize={14}
    >
      TFU :
      {hoverData.data.fundus ?? "-"} cm
    </text>

    <text
      x={tooltipX+10}
      y={tooltipY + 120}
      fontSize={14}
    >
      Lingkar Lengan :
      {hoverData.data.lingkarLengan ?? "-"} cm
    </text>

    <text
      x={tooltipX+10}
      y={tooltipY + 145}
      fontSize={14}
    >
      Tekanan Darah :
      {hoverData.data.tekananDarah || "-"}
    </text>

<text
  x={tooltipX + 10}
  y={tooltipY + 45}
  fontSize={14}
>
  Tanggal :
  {
    hoverData.data.tanggal
      ? new Date(hoverData.data.tanggal).toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : "-"
  }
</text>
  </g>
)}

</svg>

      </div>
<div className="flex justify-center items-center gap-8 mt-4 text-sm font-semibold">

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded bg-green-500"></div>
    <span className="text-green-700">Zona Normal</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded bg-yellow-400"></div>
    <span className="text-yellow-700">Zona Waspada</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded bg-pink-400"></div>
    <span className="text-pink-700">Zona Risiko</span>
  </div>

</div> 

    </div>

  );

}