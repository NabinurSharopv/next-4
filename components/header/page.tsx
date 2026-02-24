"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Users } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState({
    first_name: "sardor",
    last_name: "Olimov",
    role: "manager",
    image: "",
  });

  // Mounted ni tekshirish (hydration xatoliklarini oldini olish)
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchHeaderData = () => {
    if (typeof window === "undefined") return;

    const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
    let tokenData: any = {};
    if (token) {
      try {
        tokenData = JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        console.error("Token parse xatoligi", e);
      }
    }

    const localUpdates = JSON.parse(localStorage.getItem("updatedProfile") || "{}");
    const localImage = localStorage.getItem("profileImage") || "";

    setProfile({
      first_name: localUpdates.first_name || tokenData.first_name || "sardor",
      last_name: localUpdates.last_name || tokenData.last_name || "Olimov",
      role: tokenData.role || "Manager",
      image: localImage || "",
    });
  };

  useEffect(() => {
    fetchHeaderData();
    window.addEventListener("profileUpdated", fetchHeaderData);
    return () => {
      window.removeEventListener("profileUpdated", fetchHeaderData);
    };
  }, []);

  // Dark mode toggle funksiyasi
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // URL ga qarab sahifa nomini qaytaruvchi funksiya
  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return "Asosiy";
    
    if (pathname.includes("/manager")) return "Managerlar";
    if (pathname.includes("/admin")) return "Adminlar";
    if (pathname.includes("/teacher") || pathname.includes("/ustoz")) return "Ustozlar";
    if (pathname.includes("/student") || pathname.includes("/oquvchi")) return "Studentlar";
    if (pathname.includes("/group") || pathname.includes("/guruh")) return "Guruhlar";
    if (pathname.includes("/course") || pathname.includes("/kurs")) return "Kurslar";
    if (pathname.includes("/payment") || pathname.includes("/tolov")) return "To'lovlar";
    if (pathname.includes("/settings") || pathname.includes("/sozlamalar")) return "Sozlamalar";
    if (pathname.includes("/profile")) return "Profile";
    if (pathname.includes("/staff") || pathname.includes("/hodim")) return "Hodimlar";
    
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    if (!lastSegment || lastSegment.toLowerCase() === "dashboard") return "Asosiy";
    
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  // Mounted bo'lmaganda iconlarni ko'rsatmaslik (hydration xatoligi uchun)
  if (!mounted) {
    return (
      <header className="w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">
            {getPageTitle()}
          </div>
          <div className="w-10 h-10" /> {/* Placeholder */}
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#222] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Chap qism: Dinamik Sahifa Nomi */}
        <div className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">
          {getPageTitle()}
        </div>

        {/* O'ng qism: Foydalanuvchi ma'lumotlari */}
        <div className="flex items-center gap-5">
          
          {/* Dark mode toggle - LOGIN DAGIDEK */}
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

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[15px] font-semibold text-gray-900 dark:text-white leading-tight">
                {profile.first_name} {profile.last_name}
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                <Users className="w-3.5 h-3.5" />
                <span className="capitalize">{profile.role}</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-[#222] border border-gray-300 dark:border-[#333] overflow-hidden flex items-center justify-center">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;