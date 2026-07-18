"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import {
  Save,
  ArrowLeft,
} from "lucide-react";

import {
  
  db,
} from "@/lib/firebase";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";



interface ProfileData {
  nama: string;
  username: string;
  role: string;
  noHp: string;
}

export default function EditProfilePage() {

  const router = useRouter();

  const [uid, setUid] = useState("");

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ProfileData>({
    nama: "",
    username: "",
    role: "",
    noHp: "",
  });

  useEffect(() => {

  const getProfile = async () => {

    try {
        

      // =====================
      // ADMIN
      // =====================
     // =====================


const admin = localStorage.getItem("admin");

if (admin) {

  router.replace("/profil");

  return;

}

// =====================
// USER
// =====================

const uid = localStorage.getItem("uid");

if (!uid) {

  router.replace("/");

  return;

}

setUid(uid);

const docRef = doc(db, "users", uid);

const docSnap = await getDoc(docRef);

if (docSnap.exists()) {

  const data = docSnap.data();

  setForm({
    nama: data.nama || "",
    username: data.username || "",
    role: data.role || "",
    noHp: data.noHp || "",
  });

}
    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  getProfile();

}, []);

  const handleSave = async () => {

    try {

      if (!uid) return;

      await updateDoc(
        doc(db, "users", uid),
        {
          nama: form.nama,
          username: form.username,
          noHp: form.noHp,
        }
      );

      alert("Profil berhasil diperbarui");

      router.push("/profil");

    } catch (error) {

      console.log(error);

      alert("Gagal menyimpan data");

    }

  };

  return (

    <div className="min-h-screen bg-[#F5FFF8] flex">

      <Sidebar />

      <main className="flex-1 p-3 sm:p-4 lg:p-5 overflow-hidden">

        <Header title="Edit Profil" />

        <div className="mt-3">

          <div className="bg-white rounded-2xl shadow-sm p-4 w-full max-w-sm">

            {/* Nama */}

            <div className="mb-3">

              <label
               className="text-xs font-semibold text-gray-700">
              
                Nama
              </label>

              <input
                type="text"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
                className="w-full mt-1 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

          </div>

            {/* Username */}

            <div className="mb-3">

              <label
               className="text-xs font-semibold text-gray-700"
              >
                Username
              </label>

              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                className="w-full mt-1 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* Role */}

            <div className="mb-3">

              <label
                 className="text-xs font-semibold text-gray-700"
              >
                Role
              </label>

              <input
                type="text"
                value={form.role}
                readOnly
                className="w-full mt-1 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* No HP */}

            <div className="mb-3">

              <label
               className="text-xs font-semibold text-gray-700"
              >
                No HP
              </label>

              <input
                type="text"
                value={form.noHp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    noHp: e.target.value,
                  })
                }
                className="w-full mt-1 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* Button */}

            <div className="flex gap-2 mt-4">

              <button
                onClick={() =>
                  router.push("/profil")
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition"
              >

                <ArrowLeft size={16} />

                Batal

              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition"
              >

                <Save size={16} />

                Simpan

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}