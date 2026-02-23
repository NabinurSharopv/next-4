// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import HeaderControl from "@/components/HeaderControl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState("admin");

  return (
    <div className="flex h-screen">
      <Sidebar 
        userRole={userRole} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="flex flex-col flex-1">
        <HeaderControl />
        <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}