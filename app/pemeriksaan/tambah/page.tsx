"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Pasien {
  id: string;
  nama: string;
  nik?: string;
  umur?: string;
  usiaKehamilan?: string;
}

export default function TambahPemeriksaanPage() {
  const router = useRouter();

  const [jenis, setJenis] = useState("Balita");
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);

  const [usiaKehamilan, setUsiaKehamilan] = useState("");
  const [tekananDarah, setTekananDarah] = useState("");
  const [nadi, setNadi] = useState("");
  const [tfu, setTfu] = useState("");
  const [djj, setDjj] = useState("");
  const [letakJanin, setLetakJanin] = useState("");
  const [tabletFe, setTabletFe] = useState("");
  const [imunisasiTT, setImunisasiTT] = useState("");
  const [keluhan, setKeluhan] = useState("");

  const [beratBadan, setBeratBadan] = useState("");
  const [tinggiBadan, setTinggiBadan] = useState("");
  const [umur, setUmur] = useState("");

  const [vitaminA, setVitaminA] = useState("");
  const [lingkarLengan, setLingkarLengan] = useState("");
  const [asiEksklusif, setAsiEksklusif] = useState("");

  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // LOAD DATA PASIEN (BALITA / IBU HAMIL)
  useEffect(() => {
    const loadData = async () => {
      const result: Pasien[] = [];

      if (jenis === "Balita") {
        const snapshot = await getDocs(collection(db, "balita"));

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          result.push({
            id: docSnap.id,
            nama: data.nama || "",
            nik: data.nik || "",
            umur: data.umur || "",
          });
        });
      } else {
        const snapshot = await getDocs(collection(db, "ibu_hamil"));

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          result.push({
            id: docSnap.id,
            nama: data.nama || "",
            nik: data.nik || "",
            usiaKehamilan: data.usiaKehamilan || "",
          });
        });
      }

      setPasien(result);
      setSelectedPasien(null);
      setSearch("");
      setUmur("");
      setUsiaKehamilan("");
    };

    loadData();
  }, [jenis]);

  const filteredData = pasien.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedPasien) {
      alert("Pilih data pasien terlebih dahulu.");
      return;
    }

    try {
      // Menyiapkan Payload Dokument Pemeriksaan
      const payload: any = {
        jenis,
        pasienId: selectedPasien.id,
        nama: selectedPasien.nama,
        nik: selectedPasien.nik || "",
        beratBadan,
        lingkarLengan,
        tanggal,
        status, // Berisi "Naik" / "Tetap" / "Turun"
        keterangan,
        createdAt: new Date(),
      };

      // Simpan ID Relasi Spesifik agar terbaca otomatis di Laporan
      if (jenis === "Balita") {
        payload.balitaId = selectedPasien.id;
        payload.umur = umur;
        payload.tinggiBadan = tinggiBadan;
        payload.vitaminA = vitaminA;
        payload.asiEksklusif = asiEksklusif;
        payload.statusPertumbuhan = status;
      } else {
        payload.ibuHamilId = selectedPasien.id;
        payload.usiaKehamilan = usiaKehamilan;
        payload.tekananDarah = tekananDarah;
        payload.nadi = nadi;
        payload.tfu = tfu;
        payload.djj = djj;
        payload.letakJanin = letakJanin;
        payload.tabletFe = tabletFe;
        payload.imunisasiTT = imunisasiTT;
        payload.keluhan = keluhan;
      }

      await addDoc(collection(db, "pemeriksaan"), payload);

      alert("Data pemeriksaan berhasil ditambahkan");
      router.push("/pemeriksaan");
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
        <Header title="Tambah Pemeriksaan" />

        <div className="mt-4 bg-white rounded-xl p-5 shadow-sm max-w-4xl">
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {/* JENIS PEMERIKSAAN */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Jenis Pemeriksaan
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
              >
                <option value="Balita">Balita</option>
                <option value="Ibu Hamil">Ibu Hamil</option>
              </select>
            </div>

            {/* SEARCH / CARI PASIEN */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Cari Nama Pasien
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedPasien(null);

                  if (jenis === "Balita") {
                    setUmur("");
                  } else {
                    setUsiaKehamilan("");
                  }
                }}
                placeholder="Ketik nama untuk mencari..."
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

              {search && !selectedPasien && (
                <div className="w-full mt-2 border border-green-200 rounded-xl p-2 bg-white shadow-md max-h-48 overflow-y-auto">
                  {filteredData.length === 0 ? (
                    <p className="text-xs text-gray-500 p-2">
                      Nama tidak ditemukan
                    </p>
                  ) : (
                    filteredData.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedPasien(item);
                          setSearch(item.nama);

                          if (jenis === "Balita") {
                            setUmur(item.umur || "");
                            setUsiaKehamilan("");
                          } else {
                            setUsiaKehamilan(item.usiaKehamilan || "");
                            setUmur("");
                          }
                        }}
                        className="w-full text-left p-2 hover:bg-green-50 rounded-lg text-sm transition"
                      >
                        <div className="font-bold text-gray-800">
                          {item.nama}
                        </div>
                        {item.nik && (
                          <div className="text-xs text-gray-500">
                            NIK: {item.nik}
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* NAMA (READ ONLY) */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Nama Pasien
              </label>
              <input
                type="text"
                readOnly
                value={selectedPasien?.nama || ""}
                placeholder="Terisi otomatis setelah memilih"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-gray-50"
              />
            </div>

            {/* NIK (READ ONLY) */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                NIK
              </label>
              <input
                type="text"
                readOnly
                value={selectedPasien?.nik || ""}
                placeholder="Terisi otomatis setelah memilih"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-gray-50"
              />
            </div>

            {/* TANGGAL PEMERIKSAAN (Dipindahkan ke bawah NIK) */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Tanggal Pemeriksaan
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
              />
            </div>

            {/* USIA */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                {jenis === "Balita"
                  ? "Usia Balita (Bulan)"
                  : "Usia Kehamilan (Bulan)"}
              </label>
              <input
                type="number"
                value={jenis === "Balita" ? umur : usiaKehamilan}
                onChange={(e) => {
                  if (jenis === "Balita") {
                    setUmur(e.target.value);
                  } else {
                    setUsiaKehamilan(e.target.value);
                  }
                }}
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
              />
            </div>

            {/* FIELD UNTUK BALITA */}
            {jenis === "Balita" ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Berat Badan (Kg)
                  </label>
                  <input
                    type="number"
                    value={beratBadan}
                    onChange={(e) => setBeratBadan(e.target.value)}
                    placeholder="Contoh: 12"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Tinggi Badan (Cm)
                  </label>
                  <input
                    type="number"
                    value={tinggiBadan}
                    onChange={(e) => setTinggiBadan(e.target.value)}
                    placeholder="Contoh: 85"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Lingkar Lengan (cm)
                  </label>
                  <input
                    type="number"
                    value={lingkarLengan}
                    onChange={(e) => setLingkarLengan(e.target.value)}
                    placeholder="Contoh: 14"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Vitamin A
                  </label>
                  <select
                    value={vitaminA}
                    onChange={(e) => setVitaminA(e.target.value)}
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
                  >
                    <option value="">Pilih Vitamin A</option>
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
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
                  >
                    <option value="">Pilih</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
              </>
            ) : (
              /* FIELD UNTUK IBU HAMIL */
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Berat Badan (Kg)
                  </label>
                  <input
                    type="number"
                    value={beratBadan}
                    onChange={(e) => setBeratBadan(e.target.value)}
                    placeholder="Contoh: 60"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
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
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
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
                    placeholder="Contoh: 82"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Lingkar Lengan (cm)
                  </label>
                  <input
                    type="number"
                    value={lingkarLengan}
                    onChange={(e) => setLingkarLengan(e.target.value)}
                    placeholder="Masukkan Lingkar Lengan"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    TFU (cm)
                  </label>
                  <input
                    type="number"
                    value={tfu}
                    onChange={(e) => setTfu(e.target.value)}
                    placeholder="Masukkan TFU"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    DJJ (x/menit)
                  </label>
                  <input
                    type="text"
                    value={djj}
                    onChange={(e) => setDjj(e.target.value)}
                    placeholder="Masukkan DJJ"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Letak Janin
                  </label>
                  <select
                    value={letakJanin}
                    onChange={(e) => setLetakJanin(e.target.value)}
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
                  >
                    <option value="">Pilih Letak Janin</option>
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
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
                  >
                    <option value="">Pilih Tablet Fe</option>
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
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
                  >
                    <option value="">Pilih Imunisasi TT</option>
                    <option value="Sudah">Sudah</option>
                    <option value="Belum">Belum</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Keluhan
                  </label>
                  <textarea
                    rows={3}
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    placeholder="Masukkan keluhan ibu hamil"
                    className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </>
            )}

            {/* STATUS: NAIK / TETAP / TURUN */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Status Pertumbuhan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
              >
                <option value="">Pilih Status</option>
                <option value="Naik">Naik</option>
                <option value="Tetap">Tetap</option>
                <option value="Turun">Turun</option>
              </select>
            </div>

            {/* KETERANGAN */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Keterangan
              </label>
              <textarea
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan tambahan (opsional)"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            Simpan Data
          </button>
        </div>
      </main>
    </div>
  );
}