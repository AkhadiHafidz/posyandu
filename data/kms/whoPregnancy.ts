export interface PregnancyPoint {
  bulan: number;
  bawah: number;
  hijau: number;
  kuning: number;
  merah: number;
}

const titikAwal = [
  { bulan: 1, bawah: 44, hijau: 46, kuning: 48, merah: 50 },
  { bulan: 2, bawah: 45, hijau: 48, kuning: 51, merah: 54 },
  { bulan: 3, bawah: 46, hijau: 50, kuning: 54, merah: 58 },
  { bulan: 4, bawah: 48, hijau: 53, kuning: 58, merah: 63 },
  { bulan: 5, bawah: 50, hijau: 56, kuning: 62, merah: 68 },
  { bulan: 6, bawah: 52, hijau: 60, kuning: 66, merah: 73 },
  { bulan: 7, bawah: 54, hijau: 63, kuning: 70, merah: 78 },
  { bulan: 8, bawah: 56, hijau: 66, kuning: 74, merah: 83 },
  { bulan: 9, bawah: 58, hijau: 69, kuning: 78, merah: 88 },
];

export const PregnancyChart: PregnancyPoint[] = [];

for (let i = 0; i < titikAwal.length - 1; i++) {
  const a = titikAwal[i];
  const b = titikAwal[i + 1];

  for (let j = 0; j < 10; j++) {
    const t = j / 10;

    PregnancyChart.push({
      bulan: Number((a.bulan + t).toFixed(1)),
      bawah: Number((a.bawah + (b.bawah - a.bawah) * t).toFixed(2)),
      hijau: Number((a.hijau + (b.hijau - a.hijau) * t).toFixed(2)),
      kuning: Number((a.kuning + (b.kuning - a.kuning) * t).toFixed(2)),
      merah: Number((a.merah + (b.merah - a.merah) * t).toFixed(2)),
    });
  }
}

PregnancyChart.push({
  bulan: 9,
  bawah: 58,
  hijau: 69,
  kuning: 78,
  merah: 88,
});