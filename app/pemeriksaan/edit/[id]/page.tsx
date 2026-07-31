"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditPemeriksaanPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // Data Umum
  // ==========================
  const [jenis, setJenis] = useState("");
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");

  // Balita
  const [umur, setUmur] = useState("");
  const [beratBadan, setBeratBadan] = useState("");
  const [tinggiBadan, setTinggiBadan] = useState("");
  const [lingkarLengan, setLingkarLengan] = useState("");
  const [vitaminA, setVitaminA] = useState("");
  const [asiEksklusif, setAsiEksklusif] = useState("");

  // Ibu Hamil
  const [usiaKehamilan, setUsiaKehamilan] = useState("");
  const [tekananDarah, setTekananDarah] = useState("");
  const [nadi, setNadi] = useState("");
  const [tfu, setTfu] = useState("");
  const [djj, setDjj] = useState("");
  const [letakJanin, setLetakJanin] = useState("");
  const [tabletFe, setTabletFe] = useState("");
  const [imunisasiTT, setImunisasiTT] = useState("");
  const [keluhan, setKeluhan] = useState("");

  // Umum
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // ==========================
  // Ambil Data
  // ==========================
  useEffect(() => {
    const getData = async () => {
      try {
        const ref = doc(db, "pemeriksaan", params.id as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setJenis(data.jenis || "");
          setNama(data.nama || "");
          setNik(data.nik || "");

          // BALITA
          setUmur(String(data.umur || ""));
          setBeratBadan(data.beratBadan || data.bb || "");
          setTinggiBadan(data.tinggiBadan || data.tb || "");
          setLingkarLengan(data.lingkarLengan || "");
          setVitaminA(data.vitaminA || "");
          setAsiEksklusif(data.asiEksklusif || "");

          // IBU HAMIL
          setUsiaKehamilan(data.usiaKehamilan || "");
          setTekananDarah(data.tekananDarah || "");
          setNadi(data.nadi || "");
          setTfu(data.tfu || "");
          setDjj(data.djj || "");
          setLetakJanin(data.letakJanin || "");
          setTabletFe(data.tabletFe || "");
          setImunisasiTT(data.imunisasiTT || "");
          setKeluhan(data.keluhan || "");

          // Umum
          setTanggal(data.tanggal || "");

          // Format status agar ramah pilihan "Naik", "Tetap", "Turun"
          let rawStatus = String(data.status || data.statusPertumbuhan || "");
          const sUpper = rawStatus.toUpperCase();
          if (sUpper === "N" || sUpper.includes("NAIK") || sUpper === "SEHAT") {
            setStatus("Naik");
          } else if (
            sUpper === "T" ||
            sUpper.includes("TETAP") ||
            sUpper === "MONITORING"
          ) {
            setStatus("Tetap");
          } else if (
            sUpper === "O" ||
            sUpper === "B" ||
            sUpper.includes("TURUN") ||
            sUpper === "RESIKO"
          ) {
            setStatus("Turun");
          } else {
            setStatus(rawStatus);
          }

          setKeterangan(data.keterangan || "");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      getData();
    }
  }, [params.id]);

  // ==========================
  // Update Data
  // ==========================
  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setSubmitting(true);
      const ref = doc(db, "pemeriksaan", params.id as string);

      const payload: any = {
        nik,
        tanggal,
        status, // "Naik" | "Tetap" | "Turun"
        keterangan,
      };

      if (jenis === "Balita") {
        payload.umur = umur;
        payload.beratBadan = beratBadan;
        payload.tinggiBadan = tinggiBadan;
        payload.lingkarLengan = lingkarLengan;
        payload.vitaminA = vitaminA;
        payload.asiEksklusif = asiEksklusif;
        payload.statusPertumbuhan = status;
      } else {
        payload.usiaKehamilan = usiaKehamilan;
        payload.beratBadan = beratBadan;
        payload.tekananDarah = tekananDarah;
        payload.nadi = nadi;
        payload.lingkarLengan = lingkarLengan;
        payload.tfu = tfu;
        payload.djj = djj;
        payload.letakJanin = letakJanin;
        payload.tabletFe = tabletFe;
        payload.imunisasiTT = imunisasiTT;
        payload.keluhan = keluhan;
      }

      await updateDoc(ref, payload);

      alert("Data berhasil diperbarui");
      router.push("/pemeriksaan");
    } catch (err) {
      console.log(err);
      alert("Gagal memperbarui data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center text-gray-500">
          Loading...
        </main>
      </div>
    );
  }

  // Class styling universal untuk input
  const inputStyle =
    "w-full mt-1.5 sm:mt-2 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition duration-200";

  const readOnlyStyle =
    "w-full mt-1.5 sm:mt-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-gray-50 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        <Header title="Edit Pemeriksaan" />

        <div className="mt-4 sm:mt-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto md:mx-0">
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
              {/* Jenis */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Jenis Pemeriksaan
                </label>
                <input
                  type="text"
                  value={jenis}
                  readOnly
                  className={readOnlyStyle}
                />
              </div>

              {/* Nama */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  value={nama}
                  readOnly
                  className={readOnlyStyle}
                />
              </div>

              {/* NIK */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  NIK
                </label>
                <input
                  type="text"
                  value={nik}
                  readOnly
                  className={readOnlyStyle}
                />
              </div>

              {/* TANGGAL PEMERIKSAAN */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Tanggal Pemeriksaan
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className={`${inputStyle} bg-white cursor-pointer`}
                />
              </div>

              {/* ================= BALITA ================= */}
              {jenis === "Balita" && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Usia Balita (Bulan)
                    </label>
                    <input
                      type="number"
                      value={umur}
                      onChange={(e) => setUmur(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Berat Badan (Kg)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={beratBadan}
                      onChange={(e) => setBeratBadan(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Tinggi Badan (Cm)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={tinggiBadan}
                      onChange={(e) => setTinggiBadan(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Lingkar Lengan (Cm)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={lingkarLengan}
                      onChange={(e) => setLingkarLengan(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Vitamin A
                    </label>
                    <select
                      value={vitaminA}
                      onChange={(e) => setVitaminA(e.target.value)}
                      className={`${inputStyle} bg-white cursor-pointer`}
                    >
                      <option value="">Pilih</option>
                      <option value="Biru">Biru</option>
                      <option value="Merah">Merah</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      ASI Eksklusif
                    </label>
                    <select
                      value={asiEksklusif}
                      onChange={(e) => setAsiEksklusif(e.target.value)}
                      className={`${inputStyle} bg-white cursor-pointer`}
                    >
                      <option value="">Pilih</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </div>
                </>
              )}

              {/* ================= IBU HAMIL ================= */}
              {jenis === "Ibu Hamil" && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Usia Kehamilan (Bulan)
                    </label>
                    <input
                      type="number"
                      value={usiaKehamilan}
                      onChange={(e) => setUsiaKehamilan(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Berat Badan (Kg)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={beratBadan}
                      onChange={(e) => setBeratBadan(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Tekanan Darah
                    </label>
                    <input
                      type="text"
                      value={tekananDarah}
                      onChange={(e) => setTekananDarah(e.target.value)}
                      placeholder="120/80"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Nadi (x/menit)
                    </label>
                    <input
                      type="number"
                      value={nadi}
                      onChange={(e) => setNadi(e.target.value)}
                      placeholder="Contoh : 82"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Lingkar Lengan (Cm)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={lingkarLengan}
                      onChange={(e) => setLingkarLengan(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      TFU (Cm)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={tfu}
                      onChange={(e) => setTfu(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      DJJ
                    </label>
                    <input
                      type="text"
                      value={djj}
                      onChange={(e) => setDjj(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Letak Janin
                    </label>
                    <select
                      value={letakJanin}
                      onChange={(e) => setLetakJanin(e.target.value)}
                      className={`${inputStyle} bg-white cursor-pointer`}
                    >
                      <option value="">Pilih</option>
                      <option value="Kepala">Kepala</option>
                      <option value="Sungsang">Sungsang</option>
                      <option value="Lintang">Lintang</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Tablet Fe
                    </label>
                    <select
                      value={tabletFe}
                      onChange={(e) => setTabletFe(e.target.value)}
                      className={`${inputStyle} bg-white cursor-pointer`}
                    >
                      <option value="">Pilih</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Imunisasi TT
                    </label>
                    <select
                      value={imunisasiTT}
                      onChange={(e) => setImunisasiTT(e.target.value)}
                      className={`${inputStyle} bg-white cursor-pointer`}
                    >
                      <option value="">Pilih</option>
                      <option value="Sudah">Sudah</option>
                      <option value="Belum">Belum</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700">
                      Keluhan
                    </label>
                    <textarea
                      rows={3}
                      value={keluhan}
                      onChange={(e) => setKeluhan(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                </>
              )}

              {/* STATUS PERTUMBUHAN */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Status Pertumbuhan
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`${inputStyle} bg-white cursor-pointer`}
                >
                  <option value="">Pilih Status</option>
                  <option value="Naik">Naik</option>
                  <option value="Tetap">Tetap</option>
                  <option value="Turun">Turun</option>
                </select>
              </div>

              {/* KETERANGAN */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700">
                  Keterangan
                </label>
                <textarea
                  rows={3}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Masukkan keterangan tambahan"
                  className={inputStyle}
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-3 mt-6">
              <button
                type="button"
                onClick={() => router.push("/pemeriksaan")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition active:scale-95"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}