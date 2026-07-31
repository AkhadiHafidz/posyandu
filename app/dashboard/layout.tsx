// app/(dashboard)/layout.tsx
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar untuk Desktop/Tablet */}
      <aside className="hidden md:block w-64 shrink-0 bg-white border-r border-gray-200">
        <Sidebar />
      </aside>

      {/* Area Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}