export interface RentangBerat {
  min: number;
  max: number;
}

export interface BeratHamilData {
  minggu: number;
  kurus: RentangBerat;      // IMT < 18.5
  normal: RentangBerat;     // IMT 18.5 - 24.9
  gemuk: RentangBerat;      // IMT 25 - 29.9
  obesitas: RentangBerat;   // IMT >= 30
}

// Kenaikan berat kumulatif (kg) dari berat pra-kehamilan, per minggu gestasi.
// Model: trimester 1 (0-13 minggu) kenaikan awal kecil, lalu linear sampai minggu 40.
function buatData(
  gain1Min: number, gain1Max: number, // kenaikan di akhir minggu ke-13
  totalMin: number, totalMax: number  // kenaikan total di minggu ke-40
): RentangBerat[] {
  const hasil: RentangBerat[] = [];
  for (let minggu = 0; minggu <= 40; minggu++) {
    if (minggu <= 13) {
      const rasio = minggu / 13;
      hasil.push({ min: gain1Min * rasio, max: gain1Max * rasio });
    } else {
      const rasio = (minggu - 13) / (40 - 13);
      hasil.push({
        min: gain1Min + (totalMin - gain1Min) * rasio,
        max: gain1Max + (totalMax - gain1Max) * rasio,
      });
    }
  }
  return hasil;
}

const kurusArr = buatData(0.5, 2, 12.5, 18);
const normalArr = buatData(0.5, 2, 11.5, 16);
const gemukArr = buatData(0.2, 1, 7, 11.5);
const obesitasArr = buatData(0, 0.5, 5, 9);

export const beratHamil: BeratHamilData[] = Array.from({ length: 41 }, (_, minggu) => ({
  minggu,
  kurus: kurusArr[minggu],
  normal: normalArr[minggu],
  gemuk: gemukArr[minggu],
  obesitas: obesitasArr[minggu],
}));