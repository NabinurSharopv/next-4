"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Users, LogOut, Loader2 } from "lucide-react";
import { useProfile, useInvalidateProfile } from "@/hooks/useProfile";
import { useLogout } from "@/hooks/useAuth";

const Header = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: profile, isLoading, error } = useProfile();
  const invalidateProfile = useInvalidateProfile();
  const logoutMutation = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      invalidateProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [invalidateProfile]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    if (confirm("Chiqishni tasdiqlaysizmi?")) {
      logoutMutation.mutate();
    }
  };

  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return "Asosiy";

    if (pathname.includes("/manager")) return "Managerlar";
    if (pathname.includes("/admin")) return "Adminlar";
    if (pathname.includes("/teacher") || pathname.includes("/ustoz"))
      return "Ustozlar";
    if (pathname.includes("/student") || pathname.includes("/oquvchi"))
      return "Studentlar";
    if (pathname.includes("/group") || pathname.includes("/guruh"))
      return "Guruhlar";
    if (pathname.includes("/course") || pathname.includes("/kurs"))
      return "Kurslar";
    if (pathname.includes("/payment") || pathname.includes("/tolov"))
      return "To'lovlar";
    if (pathname.includes("/settings") || pathname.includes("/sozlamalar"))
      return "Sozlamalar";
    if (pathname.includes("/profile")) return "Profile";
    if (pathname.includes("/staff") || pathname.includes("/hodim"))
      return "Hodimlar";

    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment || lastSegment.toLowerCase() === "dashboard")
      return "Asosiy";

    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  if (!mounted) {
    return (
      <header className="w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="flex items-center gap-5">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#222] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">
          {getPageTitle()}
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#222] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto" />
              </div>
              <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              Profil yuklanmadi
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[15px] font-semibold text-gray-900 dark:text-white leading-tight">
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div className="flex items-center justify-end gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                  <span className="capitalize">{profile?.role}</span>
                </div>
              </div>

              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-[#222] border border-gray-300 dark:border-[#333] overflow-hidden flex items-center justify-center">
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">
                      {profile?.first_name?.[0]}
                      {profile?.last_name?.[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
