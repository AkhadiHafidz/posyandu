"use client";

export default function BalitaTable({
  dataBalita,
  handleDetail,
  handleEdit,
  handleDelete,
}: any) {

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">

      <table className="w-full">

        {/* HEADER */}
        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Nama
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Umur
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Jenis Kelamin
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Alamat
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
              Aksi
            </th>

          </tr>

        </thead>

        {/* BODY */}
        <tbody className="bg-white">

          {dataBalita.map((item: any) => (

            <tr
              key={item.id}
              className="border-t hover:bg-gray-50 transition"
            >

              <td className="px-6 py-4 font-medium text-gray-800">
                {item.nama}
              </td>

              <td className="px-6 py-4 text-gray-700">
                {item.umur} Tahun
              </td>

              <td className="px-6 py-4">

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  {item.jenisKelamin}
                </span>

              </td>

              <td className="px-6 py-4 text-gray-700">
                {item.alamat}
              </td>

              {/* AKSI */}
              <td className="px-6 py-4">

                <div className="flex justify-center gap-2">

                  {/* DETAIL */}
                  <button
                    onClick={() =>
                      handleDetail(item.id)
                    }
                    className="px-3 py-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 transition text-sm"
                  >
                    Detail
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={() =>
                      handleEdit(item.id)
                    }
                    className="px-3 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition text-sm"
                  >
                    Edit
                  </button>

                  {/* HAPUS */}
                  <button
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition text-sm"
                  >
                    Hapus
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}