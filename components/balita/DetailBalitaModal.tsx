"use client";

export default function DetailBalitaModal({
  openDetail,
  setOpenDetail,
  detailData,
}: any) {

  if (!openDetail || !detailData)
    return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              Detail Balita
            </h2>

            <p className="text-sm text-gray-500">
              Informasi lengkap balita
            </p>

          </div>

          <button
            onClick={() =>
              setOpenDetail(false)
            }
            className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>

        </div>

        {/* CONTENT */}
        <div className="space-y-5">

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Nama Balita
            </p>

            <h3 className="text-lg font-semibold text-gray-800">
              {detailData.nama}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">
                Umur
              </p>

              <h3 className="font-semibold text-gray-800">
                {detailData.umur} Tahun
              </h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">
                Jenis Kelamin
              </p>

              <h3 className="font-semibold text-gray-800">
                {detailData.jenisKelamin}
              </h3>
            </div>

          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Alamat
            </p>

            <h3 className="font-semibold text-gray-800">
              {detailData.alamat}
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
}