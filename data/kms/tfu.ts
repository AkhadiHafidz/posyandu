export interface TFUReferensi {
  minggu: number;
  batasBawah: number;
  median: number;
  batasAtas: number;
}

// Aturan McDonald: TFU (cm) ≈ usia gestasi (minggu), mulai terukur minggu ke-20
export const tfuReferensi: TFUReferensi[] = Array.from({ length: 23 }, (_, i) => {
  const minggu = i + 20;
  return {
    minggu,
    batasBawah: minggu - 2,
    median: minggu,
    batasAtas: minggu + 2,
  };
});