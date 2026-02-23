"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page";  // Sidebar komponenti
import HeaderControl from "@/components/HeaderControl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = document.cookie.replace(/(?:(?:^|.*;\s*)role\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const localRole = localStorage.getItem("user_role");
    setUserRole(localRole || role);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar - HomePage EMAS! */}
      <Sidebar 
        userRole={userRole} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* O'NG TOMON */}
      <div className="flex flex-col flex-1">
        {/* Header - bu ishlaydi */}
        <HeaderControl />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}