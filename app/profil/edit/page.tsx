"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

import { Save, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
  const [submitting, setSubmitting] = useState(false);

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
  }, [router]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (!uid) return;

      setSubmitting(true);

      await updateDoc(doc(db, "users", uid), {
        nama: form.nama,
        username: form.username,
        noHp: form.noHp,
      });

      alert("Profil berhasil diperbarui");
      router.push("/profil");
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan data");
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
        <Header title="Edit Profil" />

        <div className="mt-4 sm:mt-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 w-full max-w-md mx-auto md:mx-0">
            <form onSubmit={handleSave}>
              {/* Nama */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-700">
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
                  className={inputStyle}
                  placeholder="Masukkan nama"
                />
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-700">
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
                  className={inputStyle}
                  placeholder="Masukkan username"
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={form.role}
                  readOnly
                  className={readOnlyStyle}
                />
              </div>

              {/* No HP */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-700">
                  No HP
                </label>
                <input
                  type="text"
                  value={form.noHp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      noHp: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={inputStyle}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Button */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/profil")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <ArrowLeft size={16} />
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  <Save size={16} />
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}