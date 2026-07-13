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

      <main className="flex-1 p-6 md:p-8">

        <Header title="Edit Profil" />

        <div className="mt-6">

          <div className="bg-white rounded-[24px] shadow-sm p-6 w-full max-w-md">

            {/* Nama */}

            <div className="mb-4">

              <label
                style={{
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

          </div>

            {/* Username */}

            <div className="mb-4">

              <label
                style={{
                  color: "#374151",
                  fontWeight: 600,
                }}
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* Role */}

            <div className="mb-4">

              <label
                style={{
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Role
              </label>

              <input
                type="text"
                value={form.role}
                readOnly
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* No HP */}

            <div className="mb-4">

              <label
                style={{
                  color: "#374151",
                  fontWeight: 600,
                }}
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
                className="w-full mt-2 border border-green-200 rounded-2xl px-4 py-3 text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* Button */}

            <div className="flex gap-4">

              <button
                onClick={() =>
                  router.push("/profil")
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >

                <ArrowLeft size={18} />

                Batal

              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >

                <Save size={18} />

                Simpan

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}