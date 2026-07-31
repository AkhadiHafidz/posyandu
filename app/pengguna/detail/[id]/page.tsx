"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

export default function DetailPenggunaPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getDetail = async () => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        console.log("Data tidak ditemukan");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id]);

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

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
        <Header title="Detail Pengguna" />

        <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm max-w-3xl w-full mx-auto md:mx-0">
          {data ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-1">
                {/* Nama */}
                <div>
                  <p className="text-xs text-gray-500">Nama</p>
                  <h2 className="mt-1 text-sm font-semibold text-gray-800 break-words">
                    {data.nama || "-"}
                  </h2>
                </div>

                {/* Username */}
                <div>
                  <p className="text-xs text-gray-500">Username</p>
                  <h2 className="mt-1 text-sm font-semibold text-gray-800 break-words">
                    {data.username || "-"}
                  </h2>
                </div>

                {/* Role */}
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <h2 className="mt-1 text-sm font-semibold text-gray-800 capitalize">
                    {data.role || "-"}
                  </h2>
                </div>

                {/* No HP */}
                <div>
                  <p className="text-xs text-gray-500">No HP</p>
                  <h2 className="mt-1 text-sm font-semibold text-gray-800 break-words">
                    {data.noHp || "-"}
                  </h2>
                </div>
              </div>

              {/* Button Kembali */}
              <div className="mt-6 sm:mt-8 pt-2">
                <button
                  onClick={() => router.push("/pengguna")}
                  className="w-full sm:w-32 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  Kembali
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-red-500 font-medium text-sm">
                Data pengguna tidak ditemukan
              </p>
              <button
                onClick={() => router.push("/pengguna")}
                className="mt-4 w-full sm:w-32 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2 rounded-xl transition shadow-md"
              >
                Kembali
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}