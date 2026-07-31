"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditIbuHamilPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [usiaKehamilan, setUsiaKehamilan] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [noHp, setNoHp] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [alamat, setAlamat] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // GET DATA
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, "ibu_hamil", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setNik(data.nik || "");
          setNama(data.nama || "");
          setUmur(data.umur || "");
          setUsiaKehamilan(data.usiaKehamilan || "");
          setTanggalLahir(data.tanggalLahir || "");
          setNoHp(data.noHp || "");
          setRt(data.rt || "");
          setRw(data.rw || "");
          setAlamat(data.alamat || "");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getData();
    }
  }, [id]);

  // UPDATE DATA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{16}$/.test(nik)) {
      alert("NIK harus terdiri dari 16 digit angka.");
      return;
    }

    try {
      setSubmitting(true);

      await updateDoc(doc(db, "ibu_hamil", id), {
        nik,
        nama,
        umur,
        usiaKehamilan,
        tanggalLahir,
        noHp,
        rt,
        rw,
        alamat,
      });

      alert("Data berhasil diperbarui");
      router.push("/ibu-hamil");
    } catch (error) {
      console.log(error);
      alert("Gagal memperbarui data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FFF8]">
        <div className="text-gray-600 font-medium">Loading...</div>
      </div>
    );
  }

  // Class styling universal persis seperti pada halaman Balita (efek focus Hitam)
  const inputStyle =
    "w-full mt-1.5 sm:mt-2 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition duration-200";

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        <Header title="Edit Data Ibu Hamil" />

        <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm max-w-3xl mx-auto md:mx-0">
          <form onSubmit={handleSubmit}>
            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-2">
              {/* NIK */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  NIK
                </label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) =>
                    setNik(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Masukkan NIK"
                  maxLength={16}
                  className={inputStyle}
                />
              </div>

              {/* Nama */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Nama Ibu
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Ibu"
                  className={inputStyle}
                />
              </div>

              {/* Umur */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Umur
                </label>
                <input
                  type="number"
                  value={umur}
                  onChange={(e) => setUmur(e.target.value)}
                  placeholder="Umur"
                  className={inputStyle}
                />
              </div>

              {/* Usia Kehamilan */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Usia Kehamilan (Bulan)
                </label>
                <input
                  type="number"
                  value={usiaKehamilan}
                  onChange={(e) => setUsiaKehamilan(e.target.value)}
                  placeholder="Usia Kehamilan"
                  className={inputStyle}
                />
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className={`${inputStyle} bg-white cursor-pointer`}
                />
              </div>

              {/* No HP */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  No HP
                </label>
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) =>
                    setNoHp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="08xxxxxxxxxx"
                  className={inputStyle}
                />
              </div>

              {/* RT */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  RT
                </label>
                <input
                  type="text"
                  value={rt}
                  onChange={(e) =>
                    setRt(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="001"
                  className={inputStyle}
                />
              </div>

              {/* RW */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  RW
                </label>
                <input
                  type="text"
                  value={rw}
                  onChange={(e) =>
                    setRw(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="002"
                  className={inputStyle}
                />
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-700">
                  Alamat
                </label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Alamat Lengkap"
                  className={inputStyle}
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Update Data"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}