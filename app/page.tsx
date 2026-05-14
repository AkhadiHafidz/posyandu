import Image from "next/image";



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans">
    
      


      {/* HERO */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-800 max-w-2xl">
           Posyandu Cempaka
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          Membantu pencatatan data balita, pemeriksaan kesehatan, dan laporan
          posyandu secara cepat, mudah, dan terintegrasi.
        </p>

        <div className="mt-6 flex gap-4">
          <a
            href="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700"
          >
            Masuk 
          </a>
          <a
            href="#fitur"
            className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50"
          >
            Lihat Fitur
          </a>
        </div>

        <div className="mt-10">
          <Image
            src="/posyandu.png" // tambahin gambar sendiri di public/
            alt="Posyandu"
            width={200}
            height={100}
          />
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="bg-white py-16 px-10">
        <h2 className="text-2xl text-gray-600 text-center mb-10">
          Fitur Utama
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800">Data Balita</h3>
            <p className="text-sm text-gray-600 mt-2">
              Kelola data balita lengkap dengan identitas dan riwayat kesehatan.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800">Pemeriksaan</h3>
            <p className="text-sm text-gray-600 mt-2">
              Catat berat badan, tinggi badan, dan imunisasi setiap bulan.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800">Laporan Excel</h3>
            <p className="text-sm text-gray-600 mt-2">
              Download laporan posyandu dalam format Excel secara otomatis.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2026 Posyandu SI - Sistem Informasi Posyandu
      </footer>

    </div>
  );
}