"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  GraduationCap, 
  BookOpen, 
  CreditCard,
  Settings,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  userRole: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ userRole, sidebarOpen, setSidebarOpen }: SidebarProps) {
  // Asosiy menu itemlari – barcha linklar dashboard ichiga yo‘naltirilgan
  const mainMenuItems = [
    { icon: LayoutDashboard, label: "Asosiy", href: "/dashboard", roles: ["admin", "manager", "developer"] },
    { icon: Users, label: "Managerlar", href: "/dashboard/manager", roles: ["admin", "manager", "developer"] },
    { icon: UserCog, label: "Adminlar", href: "/dashboard/admin", roles: ["admin", "manager", "developer"] },
    { icon: GraduationCap, label: "Ustozlar", href: "/dashboard/ustozlar", roles: ["admin", "manager"] },
    { icon: Users, label: "Studentlar", href: "/dashboard/studentlar", roles: ["admin", "manager", "teacher"] },
    { icon: BookOpen, label: "Guruhlar", href: "/dashboard/guruhlar", roles: ["admin", "manager", "teacher"] },
    { icon: BookOpen, label: "Kurslar", href: "/dashboard/kurslar", roles: ["admin", "manager"] },
    { icon: CreditCard, label: "Payment", href: "/dashboard/payment", roles: ["admin", "manager"] },
  ];

  const otherMenuItems = [
    { icon: Settings, label: "Sozlamalar", href: "/dashboard/sozlamalar", roles: ["admin", "developer"] },
    { icon: User, label: "Profile", href: "/dashboard/profile", roles: ["admin", "manager", "developer", "teacher"] },
    { icon: LogOut, label: "Chiqish", href: "/auth/logout", roles: ["admin", "manager", "developer", "teacher"] },
  ];

  const filteredMainMenu = mainMenuItems.filter(item => item.roles.includes(userRole));
  const filteredOtherMenu = otherMenuItems.filter(item => item.roles.includes(userRole));

  const handleLogout = (e: React.MouseEvent, href: string) => {
    if (href === "/auth/logout") {
      e.preventDefault();
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      window.location.href = "/auth/login";
    }
  };

  if (!userRole) return null;

  return (
    <aside className={`
      ${sidebarOpen ? 'w-64' : 'w-20'} 
      bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-gray-800
      transition-all duration-300 ease-in-out
      flex flex-col h-screen
    `}>
      {/* Logo va menyu tugmasi */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {sidebarOpen ? (
          <span className="text-xl font-bold text-blue-600">Admin CRM</span>
        ) : (
          <span className="text-xl font-bold text-blue-600 mx-auto">A</span>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {sidebarOpen && (
            <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              MENU
            </li>
          )}
          
          {filteredMainMenu.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`
                  flex items-center ${sidebarOpen ? 'px-4' : 'px-2 justify-center'} 
                  py-3 text-gray-700 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 
                  rounded-lg transition-colors
                  group relative
                `}
              >
                <item.icon className={`${sidebarOpen ? 'mr-3' : ''} w-5 h-5`} />
                {sidebarOpen && <span>{item.label}</span>}
                {!sidebarOpen && (
                  <span className="absolute left-16 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}

          {sidebarOpen && filteredOtherMenu.length > 0 && (
            <li className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              BOSHQALAR
            </li>
          )}
          
          {filteredOtherMenu.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                onClick={(e) => handleLogout(e, item.href)}
                className={`
                  flex items-center ${sidebarOpen ? 'px-4' : 'px-2 justify-center'} 
                  py-3 text-gray-700 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 
                  rounded-lg transition-colors
                  group relative
                  ${item.label === "Chiqish" ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" : ""}
                `}
              >
                <item.icon className={`${sidebarOpen ? 'mr-3' : ''} w-5 h-5`} />
                {sidebarOpen && <span>{item.label}</span>}
                {!sidebarOpen && (
                  <span className="absolute left-16 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}