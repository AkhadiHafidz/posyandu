"use client";

import React, { useState } from "react";
import { tfuReferensi } from "@/data/kms/tfu";
import { createScales, buildPath, Padding, formatTanggal } from "./BBUChart/utils";

export interface EvaluasiKehamilanData {
  minggu: number;
  beratBadan?: number | string;
  tfu?: number;
  sistol?: number;
  diastol?: number;
  nadi?: number;
  djj?: number;
  letakJanin?: string;
  tabletFe?: string;
  imunisasiTT?: string;
  tanggal: string;
}

interface GrafikEvaluasiKehamilanProps {
  data: EvaluasiKehamilanData[];
}

// ================= LAYOUT GLOBAL (PRESISI UNTUK 2 KOLOM KIRI-KANAN) =================
const WIDTH = 660;
const PADDING: Padding = { top: 8, right: 65, bottom: 35, left: 90 };
const LABEL_W = 80; // Lebar area khusus label di sebelah kiri

const MIN_MINGGU = 8;
const MAX_MINGGU = 42;

const START_Y = 8;
const HEADER_H = 44;        // Tinggi area Pemeriksa & Tanggal
const WEEK_ROW_H = 14;      // Tinggi baris angka minggu
const GAP_HEADER_CHART = 16; // Jarak pemisah vertikal agar angka 170 & 45cm tidak menabrak header
const TFU_TOP_Y = START_Y + HEADER_H + WEEK_ROW_H + GAP_HEADER_CHART;

const TFU_H = 195;          // Tinggi panel utama TFU / DJJ
const TD_H = 100;           // Tinggi panel Tekanan Darah & Nadi

const CHECKLIST_LABELS = [
  "Gerakan Bayi",
  "Urin Protein",
  "Urin Reduksi",
  "Hemoglobin",
  "Tab Tambah Darah",
  "Kalsium",
  "Aspirin",
];
const ROW_H = 13;
const CHECKLIST_H = CHECKLIST_LABELS.length * ROW_H;

// Range Nilai Sumbu Y
const MIN_TFU = 0;
const MAX_TFU = 45;

const MIN_DJJ = 30;
const MAX_DJJ = 170;

const MIN_TD = 60;
const MAX_TD = 180;

const TD_TOP_Y = TFU_TOP_Y + TFU_H + 18;
const CHECKLIST_Y = TD_TOP_Y + TD_H + 12;
const FOOTER_LEGEND_Y = CHECKLIST_Y + CHECKLIST_H + 12;
const TOTAL_H = FOOTER_LEGEND_Y + 28;

const weekList = Array.from({ length: MAX_MINGGU - MIN_MINGGU + 1 }, (_, i) => MIN_MINGGU + i);

// Base Scale X
const { scaleX } = createScales(WIDTH, TFU_H, PADDING, MIN_MINGGU, MAX_MINGGU, MIN_TFU, MAX_TFU);

// Helper Scale Y
function makeScaleY(height: number, topOffset: number, minVal: number, maxVal: number) {
  const chartHeight = height;
  return (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return topOffset + chartHeight - ratio * chartHeight;
  };
}

const scaleYTfu = makeScaleY(TFU_H, TFU_TOP_Y, MIN_TFU, MAX_TFU);
const scaleYDjj = makeScaleY(TFU_H, TFU_TOP_Y, MIN_DJJ, MAX_DJJ);
const scaleYTd = makeScaleY(TD_H, TD_TOP_Y, MIN_TD, MAX_TD);

// Helper Posisi Teks Minggu
function getWeekTextXAndAnchor(m: number) {
  const x = scaleX(m);
  if (m === MIN_MINGGU) return { xPos: x + 1, anchor: "start" as const };
  if (m === MAX_MINGGU) return { xPos: x - 1, anchor: "end" as const };
  return { xPos: x, anchor: "middle" as const };
}

export default function GrafikEvaluasiKehamilan({ data = [] }: GrafikEvaluasiKehamilanProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    tanggal: string;
    label: string;
    val: string | number;
    minggu: number;
    color: string;
  } | null>(null);

  // 1. Normalisasi data dan pastikan diurutkan berdasarkan tanggal pemeriksaan / minggu secara kronologis
  const normalizedData = (data || []).map((d, originalIndex) => {
    let rawMinggu = Number(d.minggu);
    if (!isNaN(rawMinggu) && rawMinggu > 0 && rawMinggu <= 10) {
      rawMinggu = rawMinggu * 4; // Konversi dari bulan ke minggu jika nilainya <= 10
    }
    return {
      ...d,
      minggu: rawMinggu,
      originalIndex,
    };
  }).sort((a, b) => {
    const timeA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
    const timeB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
    if (timeA !== timeB) return timeA - timeB;
    return a.minggu - b.minggu;
  });

  // 2. Data Filtering untuk Plotting Grafik (Hanya data yang valid pada rentang minggu 8 - 42)
  const validChartData = normalizedData.filter(
    (d) => !isNaN(d.minggu) && d.minggu >= MIN_MINGGU && d.minggu <= MAX_MINGGU
  );

  const ibuData = validChartData.filter((d) => d.tfu != null && !isNaN(Number(d.tfu)));
  const djjData = validChartData.filter((d) => d.djj != null && !isNaN(Number(d.djj)));
  const sistolData = validChartData.filter((d) => d.sistol != null && !isNaN(Number(d.sistol)));
  const diastolData = validChartData.filter((d) => d.diastol != null && !isNaN(Number(d.diastol)));
  const nadiData = validChartData.filter((d) => d.nadi != null && !isNaN(Number(d.nadi)));

  // SVG Paths
  const ibuPath = buildPath(ibuData, (d) => d.minggu, (d) => Number(d.tfu!), scaleX, scaleYTfu);
  const djjPath = buildPath(djjData, (d) => d.minggu, (d) => Number(d.djj!), scaleX, scaleYDjj);
  const sistolPath = buildPath(sistolData, (d) => d.minggu, (d) => Number(d.sistol!), scaleX, scaleYTd);
  const diastolPath = buildPath(diastolData, (d) => d.minggu, (d) => Number(d.diastol!), scaleX, scaleYTd);
  const nadiPath = buildPath(nadiData, (d) => d.minggu, (d) => Number(d.nadi!), scaleX, scaleYTd);

  const refInRange = tfuReferensi || [];

  // ==========================================
  // LOGIKA ANALISIS & SARAN OTOMATIS (KEHAMILAN)
  // ==========================================
  const getPenjelasanOtomatis = () => {
    if (validChartData.length === 0) return null;

    const terakhir = validChartData[validChartData.length - 1];
    const mg = terakhir.minggu;

    let statusPemeriksaan = "Kondisi Stabil & Terpantau Normal";
    let statusBg = "bg-emerald-100 text-emerald-800 border-emerald-300";
    let catatanPenting: string[] = [];
    let saran = "Lanjutkan konsumsi Tablet Tambah Darah (Fe) secara rutin, jaga asupan gizi seimbang, dan istirahat yang cukup.";

    if (terakhir.sistol && terakhir.diastol) {
      if (terakhir.sistol >= 140 || terakhir.diastol >= 90) {
        statusPemeriksaan = "Waspada Preeklamsia / Tekanan Darah Tinggi";
        statusBg = "bg-red-100 text-red-800 border-red-300";
        catatanPenting.push(`Tekanan darah cukup tinggi (${terakhir.sistol}/${terakhir.diastol} mmHg).`);
        saran = "Tekanan darah tinggi saat hamil memerlukan pemeriksaan segera ke dokter spesialis kandungan atau fasilitas kesehatan untuk pencegahan preeklamsia.";
      } else if (terakhir.sistol < 90 || terakhir.diastol < 60) {
        catatanPenting.push(`Tekanan darah cenderung rendah (${terakhir.sistol}/${terakhir.diastol} mmHg).`);
        saran = "Perbanyak minum air putih, konsumsi makanan bergizi, dan hindari perubahan posisi tubuh secara mendadak agar tidak pusing.";
      }
    }

    if (terakhir.djj != null) {
      if (terakhir.djj < 110) {
        statusPemeriksaan = "Perhatian Khusus Detak Jantung Janin";
        statusBg = "bg-amber-100 text-amber-800 border-amber-300";
        catatanPenting.push(`DJJ terdeteksi rendah (${terakhir.djj} bpm). Normal berkisar 110-160 bpm.`);
        saran = "Segera lakukan pemeriksaan USG atau konseling kebidanan untuk memastikan kesejahteraan janin.";
      } else if (terakhir.djj > 160) {
        statusPemeriksaan = "Perhatian Khusus Detak Jantung Janin";
        statusBg = "bg-amber-100 text-amber-800 border-amber-300";
        catatanPenting.push(`DJJ terdeteksi cepat / takikardia (${terakhir.djj} bpm).`);
        saran = "Istirahat total di tempat tidur, hindari stres, dan periksakan diri ke bidan/dokter terdekat.";
      }
    }

    if (terakhir.tfu != null && mg >= 20) {
      const refTfuItem = refInRange.find((r) => r.minggu === mg);
      if (refTfuItem) {
        if (terakhir.tfu < refTfuItem.batasBawah) {
          catatanPenting.push(`Tinggi Fundus Uteri (${terakhir.tfu} cm) di bawah garis rujukan normal usia ${mg} minggu.`);
        } else if (terakhir.tfu > refTfuItem.batasAtas) {
          catatanPenting.push(`Tinggi Fundus Uteri (${terakhir.tfu} cm) di atas garis rujukan normal usia ${mg} minggu.`);
        }
      }
    }

    if (catatanPenting.length === 0) {
      catatanPenting.push(`Pemantauan pada usia kehamilan ${mg} minggu berada dalam batas parameter aman.`);
    }

    return {
      terakhir,
      statusPemeriksaan,
      statusBg,
      catatanPenting,
      saran,
    };
  };

  const penjelasan = getPenjelasanOtomatis();

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
        <div>
          <h2 className="font-extrabold text-base md:text-lg text-gray-900 mb-0.5">Grafik Evaluasi Kehamilan</h2>
          <p className="text-xs text-gray-500">Monitoring Kesehatan Ibu & Janin</p>
        </div>
        
        {/* KONTROL ZOOM IN / OUT */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2))}
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

      <div className="w-full overflow-auto border border-gray-100 rounded-xl bg-gray-50/50 p-1 max-h-[550px]">
        <div
          className="relative transition-all duration-200 origin-top-left"
          style={{
            width: `${100 * zoomLevel}%`,
            minWidth: zoomLevel > 1 ? `${660 * zoomLevel}px` : "100%",
          }}
        >
          <svg viewBox={`0 0 ${WIDTH} ${TOTAL_H}`} className="w-full h-auto select-none font-sans block">
            
            <defs>
              <clipPath id="tfu-clip">
                <rect x={PADDING.left} y={TFU_TOP_Y} width={WIDTH - PADDING.left - PADDING.right} height={TFU_H} />
              </clipPath>
              <clipPath id="td-clip">
                <rect x={PADDING.left} y={TD_TOP_Y} width={WIDTH - PADDING.left - PADDING.right} height={TD_H} />
              </clipPath>
            </defs>

            {/* HEADER ATAS */}
            <g>
              <rect x={PADDING.left - LABEL_W} y={8} width={LABEL_W} height={22} fill="#fff" stroke="#333" strokeWidth="0.8" />
              <text x={PADDING.left - LABEL_W + 5} y={22} fontSize="7.5" fontWeight="bold" fill="#333">Pemeriksa</text>

              <rect x={PADDING.left - LABEL_W} y={30} width={LABEL_W} height={22} fill="#fff" stroke="#333" strokeWidth="0.8" />
              <text x={PADDING.left - LABEL_W + 5} y={39} fontSize="7" fontWeight="bold" fill="#333">Tanggal/</text>
              <text x={PADDING.left - LABEL_W + 5} y={48} fontSize="7" fontWeight="bold" fill="#333">Bulan/Tahun</text>

              <rect x={PADDING.left} y={8} width={WIDTH - PADDING.left - PADDING.right} height={44} fill="#fff" stroke="#333" strokeWidth="0.8" />
              <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={30} y2={30} stroke="#333" strokeWidth="0.8" />

              {weekList.map((m) => (
                <line key={`hdr-v-${m}`} x1={scaleX(m)} x2={scaleX(m)} y1={8} y2={52} stroke="#444" strokeWidth="0.6" />
              ))}

              {weekList.slice(0, -1).map((m) => {
                const x1 = scaleX(m);
                const x2 = scaleX(m + 1);
                return (
                  <g key={`hdr-diag-${m}`}>
                    <line x1={x1} x2={x2} y1={30} y2={8} stroke="#888" strokeWidth="0.5" />
                    <line x1={x1} x2={x2} y1={52} y2={30} stroke="#888" strokeWidth="0.5" />
                  </g>
                );
              })}
            </g>

            {/* BARIS ANGKA MINGGU */}
            <g>
              <rect x={PADDING.left} y={52} width={WIDTH - PADDING.left - PADDING.right} height={WEEK_ROW_H} fill="#fff" stroke="#333" strokeWidth="0.8" />
              {weekList.map((m) => {
                const { xPos, anchor } = getWeekTextXAndAnchor(m);
                return (
                  <text key={`top-w-${m}`} x={xPos} y={62} textAnchor={anchor} fontSize="6.5" fill="#333" fontWeight="bold">
                    {m}
                  </text>
                );
              })}
            </g>

            {/* PANEL ATAS (DJJ & TFU) */}
            <rect x={PADDING.left} y={TFU_TOP_Y} width={WIDTH - PADDING.left - PADDING.right} height={TFU_H} fill="none" stroke="#333" strokeWidth="1" />

            {weekList.map((m) => {
              const isMajor = m % 5 === 0;
              return (
                <line key={`v-grid-${m}`} x1={scaleX(m)} x2={scaleX(m)} y1={TFU_TOP_Y} y2={TFU_TOP_Y + TFU_H} stroke="#333" strokeWidth={isMajor ? 1 : 0.4} />
              );
            })}

            {Array.from({ length: 40 }, (_, i) => i + 6).map((cm) => (
              <line key={`h-dots-${cm}`} x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleYTfu(cm)} y2={scaleYTfu(cm)} stroke="#666" strokeWidth="0.5" strokeDasharray="1 2.5" />
            ))}

            {[5, 10, 15, 20, 25, 30, 35, 40, 45].map((val) => (
              <g key={`tfu-lbl-${val}`}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleYTfu(val)} y2={scaleYTfu(val)} stroke="#333" strokeWidth="0.6" />
                <text x={WIDTH - PADDING.right + 3} y={scaleYTfu(val) + 2.5} fontSize="7.5" fontWeight="bold" fill="#333">{val}cm</text>
              </g>
            ))}

            {[30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170].map((val) => (
              <text key={`djj-lbl-${val}`} x={PADDING.left - 5} y={scaleYDjj(val) + 2.5} textAnchor="end" fontSize="7.5" fontWeight="600" fill="#333">{val}</text>
            ))}

            <text x={PADDING.left - 25} y={TFU_TOP_Y + TFU_H / 2 - 5} fontSize="8" fontWeight="bold" fill="#111" textAnchor="middle">DJJ</text>
            <text x={PADDING.left - 25} y={TFU_TOP_Y + TFU_H / 2 + 6} fontSize="8" fontWeight="bold" fill="#111" textAnchor="middle">X</text>
            <text x={WIDTH - PADDING.right + 22} y={TFU_TOP_Y + TFU_H / 2 + 6} fontSize="7.5" fontWeight="bold" fill="#111">TFU O</text>

            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleYDjj(160)} y2={scaleYDjj(160)} stroke="#ef4444" strokeWidth="2" />
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleYDjj(110)} y2={scaleYDjj(110)} stroke="#ef4444" strokeWidth="2" />

            {refInRange.length > 0 && (
              <g clipPath="url(#tfu-clip)">
                <path d={buildPath(refInRange, (d) => d.minggu, (d) => d.batasAtas, scaleX, scaleYTfu)} fill="none" stroke="#111" strokeWidth={1.2} strokeDasharray="3 2" />
                <path d={buildPath(refInRange, (d) => d.minggu, (d) => d.median, scaleX, scaleYTfu)} fill="none" stroke="#111" strokeWidth={1.6} />
                <path d={buildPath(refInRange, (d) => d.minggu, (d) => d.batasBawah, scaleX, scaleYTfu)} fill="none" stroke="#111" strokeWidth={1.2} strokeDasharray="3 2" />
              </g>
            )}

            <g transform={`translate(${scaleX(20)}, ${scaleYTfu(13)})`}>
              <path d="M 0 0 L 8 -3.5 L 8 -1.2 L 16 -1.2 L 16 1.2 L 8 1.2 L 8 3.5 Z" fill="#f97316" />
              <text x={20} y={2.5} fontSize="7" fontWeight="bold" fill="#111">Mulai ukur TFU</text>
            </g>

            <g clipPath="url(#tfu-clip)">
              {djjPath && <path d={djjPath} fill="none" stroke="#2563eb" strokeWidth={1.5} />}
              {djjData.map((d, i) => {
                const x = scaleX(d.minggu);
                const y = scaleYDjj(Number(d.djj!));
                return (
                  <g
                    key={`djj-pt-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, label: "Pemeriksaan DJJ", val: `${d.djj} bpm`, minggu: d.minggu, color: "#2563eb" })}
                    onMouseLeave={() => setHover(null)}
                  >
                    <text x={x} y={y + 2.5} textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#2563eb">X</text>
                    <circle cx={x} cy={y} r={6} fill="transparent" />
                  </g>
                );
              })}

              {ibuPath && <path d={ibuPath} fill="none" stroke="#9333ea" strokeWidth={1.6} />}
              {ibuData.map((d, i) => {
                const x = scaleX(d.minggu);
                const y = scaleYTfu(Number(d.tfu!));
                return (
                  <g key={`tfu-group-${i}`}>
                    <circle cx={x} cy={y} r={5.5} fill="#ffffff" stroke="#9333ea" strokeWidth="1" />
                    <circle
                      cx={x}
                      cy={y}
                      r={3.5}
                      fill="#9333ea"
                      className="cursor-pointer"
                      onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, label: "Tinggi Fundus Uteri (TFU)", val: `${d.tfu} cm`, minggu: d.minggu, color: "#9333ea" })}
                      onMouseLeave={() => setHover(null)}
                    />
                  </g>
                );
              })}
            </g>

            <rect x={PADDING.left} y={TFU_TOP_Y + TFU_H} width={WIDTH - PADDING.left - PADDING.right} height={12} fill="#fff" stroke="#333" strokeWidth="0.8" />
            {weekList.map((m) => {
              const { xPos, anchor } = getWeekTextXAndAnchor(m);
              return (
                <text key={`btm-w-${m}`} x={xPos} y={TFU_TOP_Y + TFU_H + 8.5} textAnchor={anchor} fontSize="6.5" fill="#333" fontWeight="bold">
                  {m}
                </text>
              );
            })}
            <text x={PADDING.left - 5} y={TFU_TOP_Y + TFU_H + 8.5} textAnchor="end" fontSize="7.5" fontWeight="bold" fill="#333">Usia Gestasi</text>

            {/* PANEL BAWAH (TEKANAN DARAH & NADI) */}
            <rect x={PADDING.left} y={TD_TOP_Y} width={WIDTH - PADDING.left - PADDING.right} height={TD_H} fill="none" stroke="#333" strokeWidth="1" />

            {weekList.map((m) => (
              <line key={`td-v-${m}`} x1={scaleX(m)} x2={scaleX(m)} y1={TD_TOP_Y} y2={TD_TOP_Y + TD_H} stroke="#444" strokeWidth={m % 5 === 0 ? 1 : 0.4} />
            ))}

            {[60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180].map((val) => (
              <g key={`td-h-${val}`}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleYTd(val)} y2={scaleYTd(val)} stroke="#ccc" strokeWidth="0.5" />
                <text x={PADDING.left - 4} y={scaleYTd(val) + 2.5} textAnchor="end" fontSize="6.5" fontWeight="600" fill="#333">{val}</text>
              </g>
            ))}

            <text x={PADDING.left - 28} y={scaleYTd(70) + 2.5} fontSize="6.5" fontWeight="bold" fill="#111" textAnchor="end">• Nadi</text>
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleYTd(130)} y2={scaleYTd(130)} stroke="#ef4444" strokeWidth="2" />
            <text x={WIDTH - PADDING.right + 3} y={scaleYTd(130) + 2.5} fontSize="7" fontWeight="bold" fill="#111">Sistole</text>
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={scaleYTd(80)} y2={scaleYTd(80)} stroke="#ef4444" strokeWidth="2" />
            <text x={WIDTH - PADDING.right + 3} y={scaleYTd(80) + 2.5} fontSize="7" fontWeight="bold" fill="#111">Diastole</text>

            <g clipPath="url(#td-clip)">
              {sistolPath && <path d={sistolPath} fill="none" stroke="#ef4444" strokeWidth={1.3} />}
              {sistolData.map((d, i) => {
                const x = scaleX(d.minggu);
                const y = scaleYTd(Number(d.sistol!));
                return (
                  <circle
                    key={`sis-pt-${i}`}
                    cx={x}
                    cy={y}
                    r={3}
                    fill="#ef4444"
                    className="cursor-pointer"
                    onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, label: "Tekanan Darah (Sistole)", val: `${d.sistol} mmHg`, minggu: d.minggu, color: "#ef4444" })}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}

              {diastolPath && <path d={diastolPath} fill="none" stroke="#1d4ed8" strokeWidth={1.3} />}
              {diastolData.map((d, i) => {
                const x = scaleX(d.minggu);
                const y = scaleYTd(Number(d.diastol!));
                return (
                  <circle
                    key={`dia-pt-${i}`}
                    cx={x}
                    cy={y}
                    r={3}
                    fill="#1d4ed8"
                    className="cursor-pointer"
                    onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, label: "Tekanan Darah (Diastole)", val: `${d.diastol} mmHg`, minggu: d.minggu, color: "#1d4ed8" })}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}

              {nadiPath && <path d={nadiPath} fill="none" stroke="#f97316" strokeWidth={1.3} strokeDasharray="2.5 2.5" />}
              {nadiData.map((d, i) => {
                const x = scaleX(d.minggu);
                const y = scaleYTd(Number(d.nadi!));
                return (
                  <circle
                    key={`nadi-pt-${i}`}
                    cx={x}
                    cy={y}
                    r={2.8}
                    fill="#f97316"
                    className="cursor-pointer"
                    onMouseEnter={() => setHover({ x, y, tanggal: d.tanggal, label: "Denyut Nadi Ibu", val: `${d.nadi} x/mnt`, minggu: d.minggu, color: "#f97316" })}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}
            </g>

            {/* PANEL CHECKLIST */}
            <g transform={`translate(0, ${CHECKLIST_Y})`}>
              <rect x={PADDING.left - LABEL_W} y={0} width={WIDTH - PADDING.left - PADDING.right + LABEL_W} height={CHECKLIST_H} fill="none" stroke="#333" strokeWidth="0.8" />
              {CHECKLIST_LABELS.map((label, idx) => {
                const rowY = idx * ROW_H;
                return (
                  <g key={`chk-row-${idx}`}>
                    <line x1={PADDING.left - LABEL_W} x2={WIDTH - PADDING.right} y1={rowY} y2={rowY} stroke="#333" strokeWidth="0.6" />
                    <text x={PADDING.left - LABEL_W + 5} y={rowY + 9} fontSize="6.5" fontWeight="bold" fill="#333">{label}</text>
                  </g>
                );
              })}
              <line x1={PADDING.left} x2={PADDING.left} y1={0} y2={CHECKLIST_H} stroke="#333" strokeWidth="0.8" />
              {weekList.map((m) => (
                <line key={`chk-v-${m}`} x1={scaleX(m)} x2={scaleX(m)} y1={0} y2={CHECKLIST_H} stroke="#333" strokeWidth={m % 5 === 0 ? 0.9 : 0.4} />
              ))}
            </g>

            {/* FOOTER LEGEND */}
            <g transform={`translate(${WIDTH - PADDING.right - 105}, ${FOOTER_LEGEND_Y})`}>
              <text x="0" y="0" fontSize="7" fontWeight="bold" fill="#111">DJJ : Denyut Jantung bayi</text>
              <text x="0" y="9" fontSize="7" fontWeight="bold" fill="#111">TFU : Tinggi Fundus Uteri</text>
            </g>

          </svg>

          {/* TOOLTIP INTERAKTIF */}
          {hover && (
            <div
              className="absolute bg-gray-900/95 text-white text-[8px] rounded px-1.5 py-1 shadow-lg pointer-events-none whitespace-nowrap z-30 border border-gray-700 backdrop-blur-sm"
              style={{
                left: `${(hover.x / WIDTH) * 100}%`,
                top: `${(hover.y / TOTAL_H) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="font-bold pb-0.5 border-b border-gray-700 mb-0.5" style={{ color: hover.color }}>
                {hover.label}
              </div>
              <div className="text-gray-200">
                <div>Tanggal: <span className="font-semibold text-white">{formatTanggal(hover.tanggal)}</span></div>
                <div>Usia: <span className="font-semibold text-white">{hover.minggu} minggu</span></div>
                <div>Hasil: <span className="font-bold text-yellow-400">{hover.val}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KOTAK ANALISIS & SARAN OTOMATIS (KEHAMILAN) */}
      {penjelasan ? (
        <div className="mt-2 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-gray-700 space-y-2">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span className="font-bold text-gray-900 text-sm">
              Analisis Evaluasi Kehamilan Terakhir
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${penjelasan.statusBg}`}>
              {penjelasan.statusPemeriksaan}
            </span>
          </div>

          <div className="space-y-1 pt-0.5 text-[11px]">
            <p>
              <strong className="text-gray-800">Pemeriksaan Usia Gestasi:</strong>{" "}
              Minggu ke-<strong className="text-emerald-700">{penjelasan.terakhir.minggu}</strong>
              {penjelasan.terakhir.tanggal && ` (${formatTanggal(penjelasan.terakhir.tanggal)})`}.
            </p>
            <div>
              <strong className="text-gray-800">Catatan Klinis:</strong>
              <ul className="list-disc list-inside pl-1 text-slate-700 space-y-0.5 mt-0.5">
                {penjelasan.catatanPenting.map((cat, idx) => (
                  <li key={idx}>{cat}</li>
                ))}
              </ul>
            </div>
            <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-200 mt-1 shadow-2xs">
              💡 <strong className="text-gray-900">Saran Bidan / Nakes:</strong>{" "}
              {penjelasan.saran}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-center text-xs text-gray-500">
          Belum ada data evaluasi kehamilan untuk menampilkan analisis dan saran otomatis.
        </div>
      )}
    </div>
  );
}