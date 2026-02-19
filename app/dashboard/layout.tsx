import { Sidebar } from "@/components/Sidebar"; // Sidebar komponentingiz

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> {/* Chap tomonda menyu */}
      <main className="flex-1 p-4 bg-muted/40">
        {children}
      </main>
    </div>
  );
}