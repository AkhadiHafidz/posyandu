"use client";

export default function TambahBalitaModal({
  openForm,
  setOpenForm,
  handleSubmit,
  nama,
  setNama,
  umur,
  setUmur,
  jenisKelamin,
  setJenisKelamin,
  alamat,
  setAlamat,
  editId,
}: any) {

  if (!openForm) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">

              {editId
                ? "Edit Balita"
                : "Tambah Balita"}

            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Lengkapi data balita
            </p>

          </div>

          <button
            onClick={() =>
              setOpenForm(false)
            }
            className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          {/* NAMA */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Balita
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) =>
                setNama(e.target.value)
              }
              placeholder="Masukkan nama"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* UMUR */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Umur
            </label>

            <input
              type="text"
              value={umur}
              onChange={(e) =>
                setUmur(e.target.value)
              }
              placeholder="Contoh: 2"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* JK */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kelamin
            </label>

            <select
              value={jenisKelamin}
              onChange={(e) =>
                setJenisKelamin(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
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

          {/* ALAMAT */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alamat
            </label>

            <input
              type="text"
              value={alamat}
              onChange={(e) =>
                setAlamat(e.target.value)
              }
              placeholder="Masukkan alamat"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-end pt-2">

            <button className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-medium transition">

              {editId
                ? "Update Data"
                : "Simpan Data"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}