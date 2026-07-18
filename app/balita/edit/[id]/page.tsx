"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Sidebar from "@/components/Sidebar";

import Header from "@/components/header";

interface BalitaForm {
  nik: string;

  nama: string;

  jk: string;

  umur: string;

  ibu: string;

  alamat: string;
}

export default function EditBalitaPage() {

  const router = useRouter();

  const params = useParams();

  const id = params.id as string;

  // FORM
  const [form, setForm] =
    useState<BalitaForm>({
      nik: "",
      nama: "",
      jk: "",
      umur: "",
      ibu: "",
      alamat: "",
    });

  const [loading, setLoading] =
    useState(true);

  // GET DETAIL
  const getDetail = async () => {

    try {

      const docRef = doc(
        db,
        "balita",
        id
      );

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {

        const data = docSnap.data();

        setForm({
          nik:
            String(
              data.nik || ""
            ),

          nama:
            String(
              data.nama || ""
            ),

          jk:
            String(
              data.jk || ""
            ),

          umur:
            String(
              data.umur || ""
            ),

          ibu:
            String(
              data.ibu || ""
            ),

          alamat:
            String(
              data.alamat || ""
            ),
        });
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

  // UPDATE
  const handleUpdate = async () => {
    if (!/^\d{16}$/.test(form.nik)) {
  alert("NIK harus terdiri dari 16 digit angka.");
  return;
}
    try {

      await updateDoc(
        doc(db, "balita", id),
        {
          nik:
            form.nik || "",

          nama:
            form.nama || "",

          jk:
            form.jk || "",

          umur:
            form.umur || "",

          ibu:
            form.ibu || "",

          alamat:
            form.alamat || "",
        }
      );

      alert(
        "Data berhasil diupdate"
      );

      router.push("/balita");

    } catch (error) {

      console.log(error);
    }
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FFF8] flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 px-4 py-3">

        <Header title="Edit Data Balita" />

        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm max-w-3xl">


          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {/* NIK */}
<div>

<label className="text-xs font-semibold text-gray-700">
NIK
</label>

<input
type="text"
value={form.nik}
  onChange={(e) =>
setForm({
...form,
      nik: e.target.value.replace(/\D/g, ""),
})
}
placeholder="Masukkan NIK"
maxLength={16}
className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
/>

</div>

            {/* NAMA */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Nama Balita
              </label>

              <input
                type="text"
                value={
                  form.nama || ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama:
                      e.target.value,
                  })
                }
                placeholder="Nama balita"
className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* JK */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Jenis Kelamin
              </label>

              <select
                value={
                  form.jk || ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    jk:
                      e.target.value,
                  })
                }
              className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800"
              >

                <option value="">
                  Pilih Jenis Kelamin
                </option>

                <option value="Laki-laki">
                  Laki-laki
                </option>

                <option value="Perempuan">
                  Perempuan
                </option>

              </select>

            </div>

            {/* UMUR */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Umur
              </label>

              <input
                type="text"
                value={
                  form.umur || ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    umur:
                      e.target.value,
                  })
                }
                placeholder="2 Tahun"
className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* IBU */}
            <div>

              <label className="text-xs font-semibold text-gray-700">
                Nama Ibu
              </label>

              <input
                type="text"
                value={
                  form.ibu || ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    ibu:
                      e.target.value,
                  })
                }
                placeholder="Nama ibu"
className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

            {/* ALAMAT */}
            <div className="md:col-span-2">

              <label className="text-xs font-semibold text-gray-700">
                Alamat
              </label>

              <textarea
                value={
                  form.alamat || ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat:
                      e.target.value,
                  })
                }
                rows={2}
                placeholder="Alamat lengkap"
                className="w-full mt-2 border border-green-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
              />

            </div>

          </div>

          {/* BUTTON */}
          <div className="flex justify-end mt-6">

            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition"
            >
              Update Data
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}