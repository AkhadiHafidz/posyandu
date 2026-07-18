"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function EditPemeriksaanPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);

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
        const ref = doc(
          db,
          "pemeriksaan",
          params.id as string
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {

          const data = snap.data();

          console.log(data);

          setJenis(data.jenis || "");
          setNama(data.nama || "");
          setNik(data.nik || "");

          // BALITA
          setUmur(String(data.umur || ""));

          setBeratBadan(data.beratBadan || "");
          setTinggiBadan(data.tinggiBadan || "");
          setLingkarLengan(
            data.lingkarLengan || ""
          );
          setVitaminA(
            data.vitaminA || ""
          );
          setAsiEksklusif(
            data.asiEksklusif || ""
          );

          // IBU HAMIL
          setUsiaKehamilan(
            data.usiaKehamilan || ""
          );

          setTekananDarah(
            data.tekananDarah || ""
          );

          setTfu(
            data.tfu || ""
          );

          setDjj(
            data.djj || ""
          );

          setLetakJanin(
            data.letakJanin || ""
          );

          setTabletFe(
            data.tabletFe || ""
          );

          setImunisasiTT(
            data.imunisasiTT || ""
          );

          setKeluhan(
            data.keluhan || ""
          );

          // Umum
          setTanggal(
            data.tanggal || ""
          );

          setStatus(
            data.status || ""
          );

          setKeterangan(
            data.keterangan || ""
          );
        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    getData();

  }, [params.id]);

  // ==========================
  // Update Data
  // ==========================

  const handleUpdate = async () => {

      try {

      const ref = doc(
          db,
          "pemeriksaan",
          params.id as string
        );

      await updateDoc(ref, {

        nik,

        umur,
        

            usiaKehamilan,

            beratBadan,
            tinggiBadan,
        lingkarLengan,

        vitaminA,
        asiEksklusif,

        tekananDarah,
        tfu,
        djj,
        letakJanin,
        tabletFe,
        imunisasiTT,
        keluhan,

            tanggal,
            status,
            keterangan,

      });

      alert("Data berhasil diperbarui");

      router.push("/pemeriksaan");

    } catch (err) {

      console.log(err);

      alert("Gagal memperbarui data");

      }
    };

  if (loading) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">

        <Header title="Edit Pemeriksaan" />

      <div className="mt-4 bg-white rounded-2xl shadow-sm p-5 max-w-4xl">

        <div className="grid md:grid-cols-2 gap-4 mt-5">

          {/* Jenis */}
            <div>
            <label className="text-xs font-semibold text-gray-700">
              Jenis Pemeriksaan
              </label>

              <input
                type="text"
                value={jenis}
                readOnly
              className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
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
              className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* ================= BALITA ================= */}

          {jenis === "Balita" && (
            <>

              <div>
               <label className="text-xs font-semibold text-gray-700">
                  NIK
                </label>

                <input
                  type="text"
                  value={nik}
                  readOnly
                  onChange={(e)=>setNik(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Usia Balita (Bulan)
                </label>

             <input
                type="number"
                value={umur}
                onChange={(e) => setUmur(e.target.value)}
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800"
              />
            </div>

              <div>
               <label className="text-xs font-semibold text-gray-700">
                  Berat Badan (Kg)
                </label>

                <input
                  type="number"
                  value={beratBadan}
                  onChange={(e)=>setBeratBadan(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Tinggi Badan (Cm)
                </label>

                <input
                  type="number"
                  value={tinggiBadan}
                  onChange={(e)=>setTinggiBadan(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Lingkar Lengan (Cm)
                </label>

                <input
                  type="number"
                  value={lingkarLengan}
                  onChange={(e)=>setLingkarLengan(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
               <label className="text-xs font-semibold text-gray-700">
                  Vitamin A
                </label>

                <select
                  value={vitaminA}
                  onChange={(e)=>setVitaminA(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
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
                  onChange={(e)=>setAsiEksklusif(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
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
                  NIK
                </label>

                <input
                  type="text"
                  value={nik}
                  readOnly
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Usia Kehamilan (Bulan)
                </label>

                <input
                  type="number"
                  value={usiaKehamilan}
                  onChange={(e) => setUsiaKehamilan(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                />
              </div>

            <div>
                <label className="text-xs font-semibold text-gray-700">
                Berat Badan (Kg)
              </label>

              <input
                type="number"
                value={beratBadan}
                  onChange={(e) => setBeratBadan(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
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
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Lingkar Lengan (Cm)
              </label>

              <input
                type="number"
                  value={lingkarLengan}
                  onChange={(e) => setLingkarLengan(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div>
                <label className="text-xs font-semibold text-gray-700">
                  TFU (Cm)
                </label>

                <input
                  type="number"
                  value={tfu}
                  onChange={(e) => setTfu(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
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
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Letak Janin
                </label>

                <select
                  value={letakJanin}
                  onChange={(e) => setLetakJanin(e.target.value)}
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
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
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
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
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
                >
                  <option value="">Pilih</option>
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
                  className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                />
              </div>

            </>
          )}

          {/* ================= UMUM ================= */}

          <div>
            <label className="text-xs font-semibold text-gray-700">
                Tanggal Pemeriksaan
              </label>

              <input
                type="date"
                value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div>
            <label className="text-xs font-semibold text-gray-700">
                Status
              </label>

              <select
                value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm  text-gray-800 placeholder:text-gray-400"
              >
              <option value="">Pilih Status</option>
              <option value="Sehat">Sehat</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Perlu Tindakan">Perlu Tindakan</option>
              </select>
            </div>

            <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-700">
                Keterangan
              </label>

              <textarea
                rows={4}
                value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

          </div>

        {/* BUTTON */}

       <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={() => router.push("/pemeriksaan")}
            className="px-5 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Batal
          </button>

          <button
            onClick={handleUpdate}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
          >
            Simpan Perubahan
          </button>

        </div>

      </div>

      </main>

    </div>
  );
}