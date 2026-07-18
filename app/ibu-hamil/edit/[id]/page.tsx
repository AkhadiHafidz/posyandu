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

export default function EditIbuHamilPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [usiaKehamilan, setUsiaKehamilan] =
    useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");

  const [loading, setLoading] =
    useState(false);

  // GET DATA
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(
          db,
          "ibu_hamil",
          id
        );

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setNik(data.nik || "");
          setNama(data.nama || "");
          setUmur(data.umur || "");
          setUsiaKehamilan(
            data.usiaKehamilan || ""
          );
          setNoHp(data.noHp || "");
          setAlamat(data.alamat || "");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      getData();
    }
  }, [id]);

  // UPDATE DATA
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!/^\d{16}$/.test(nik)) {
  alert("NIK harus terdiri dari 16 digit angka.");
  return;
}

    try {
      setLoading(true);

      await updateDoc(
        doc(
          db,
          "ibu_hamil",
          id
        ),
        {
          nik,
          nama,
          umur,
          usiaKehamilan,
          noHp,
          alamat,
        }
      );

      alert(
        "Data berhasil diperbarui"
      );

      router.push("/ibu-hamil");
    } catch (error) {
      console.log(error);
      alert(
        "Gagal memperbarui data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-hidden">
        <Header title="Edit Data Ibu Hamil" />

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm max-w-3xl">

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-3 mt-4"
          >

          {/* NIK */}
        <div>
          <label className="text-xs font-semibold text-gray-700">
            NIK
          </label>

          <input
            type="text"
            value={nik}
            onChange={(e) =>
              setNik(e.target.value)
            }
            placeholder="Masukkan NIK"
            maxLength={16}
            className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
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
                onChange={(e) =>
                  setNama(
                    e.target.value
                  )
                }
                placeholder="Nama Ibu"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
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
                onChange={(e) =>
                  setUmur(
                    e.target.value
                  )
                }
                placeholder="Umur"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800   placeholder:text-gray-400"
              />
            </div>

            {/* Usia Kehamilan */}
            <div>
              <label className="text-xs font-semibold text-gray-700">
                Usia Kehamilan
              </label>

              <input
                type="number"
                value={usiaKehamilan}
                onChange={(e) =>
                  setUsiaKehamilan(
                    e.target.value
                  )
                }
                placeholder="Usia Kehamilan"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
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
                  setNoHp(
                    e.target.value
                  )
                }
                placeholder="08xxxxxxxxxx"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
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
                onChange={(e) =>
                  setAlamat(
                    e.target.value
                  )
                }
                placeholder="Alamat Lengkap"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-md"
              >
                {loading
                  ? "Menyimpan..."
                  : "Update Data"}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}