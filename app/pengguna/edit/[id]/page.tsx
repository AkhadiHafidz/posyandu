"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";
import { Eye, EyeOff } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PenggunaForm {
  nama: string;
  username: string;
  password: string;
  konfirmasiPassword: string;
  noHp: string;
}

export default function EditPenggunaPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State untuk toggle visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<PenggunaForm>({
    nama: "",
    username: "",
    password: "",
    konfirmasiPassword: "",
    noHp: "",
  });

  // GET DATA
  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, "users", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            nama: data.nama || "",
            username: data.username || "",
            password: data.password || "",
            konfirmasiPassword: data.password || "",
            noHp: data.noHp || "",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFetching(false);
      }
    };

    if (params.id) {
      getData();
    }
  }, [params.id]);

  // UPDATE
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);

      if (form.password !== form.konfirmasiPassword) {
        alert("Konfirmasi password tidak sama.");
        setLoading(false);
        return;
      }

      await updateDoc(doc(db, "users", params.id as string), {
        nama: form.nama,
        username: form.username,
        password: form.password,
        noHp: form.noHp,
      });

      alert("Data berhasil diubah");
      router.push("/pengguna");
    } catch (error) {
      console.log(error);
      alert("Gagal mengubah data");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        <Header title="Edit Pengguna" />

        <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm max-w-3xl mx-auto md:mx-0">
          <form onSubmit={handleSubmit}>
            {/* FORM GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
              {/* NAMA */}
              <div>
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
                  placeholder="Nama pengguna"
                  className={inputStyle}
                />
              </div>

              {/* USERNAME */}
              <div>
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
                  placeholder="Username"
                  className={inputStyle}
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <div className="mt-1.5 sm:mt-2 flex items-center h-[38px] sm:h-[42px] rounded-xl border border-gray-300 px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 transition duration-200">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Password"
                    className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-500 hover:text-green-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* KONFIRMASI PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Konfirmasi Password
                </label>
                <div className="mt-1.5 sm:mt-2 flex items-center h-[38px] sm:h-[42px] rounded-xl border border-gray-300 px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 transition duration-200">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.konfirmasiPassword}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        konfirmasiPassword: e.target.value,
                      })
                    }
                    placeholder="Konfirmasi password"
                    className="flex-1 h-full bg-transparent border-none outline-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-gray-500 hover:text-green-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* NO HP */}
              <div>
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
                  placeholder="08xxxxxxxxxx"
                  className={inputStyle}
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}