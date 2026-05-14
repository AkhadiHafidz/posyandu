import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

export default function PemeriksaanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <Header />

        {/* PAGE */}
        <main className="p-6 flex flex-col gap-4">

          {/* TITLE */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">
              Pemeriksaan Balita
            </h1>

            <p className="text-sm text-gray-500">
              Data pemeriksaan kesehatan balita posyandu
            </p>
          </div>

          {/* CONTENT */}
          {children}

        </main>

      </div>

    </div>
  );
}