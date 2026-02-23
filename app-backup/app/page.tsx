// app/(main)/page.tsx (yoki Asosiy/page.tsx)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  X,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Clock
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const role = document.cookie.replace(/(?:(?:^|.*;\s*)role\s*=\s*([^;]*).*$)|^.*$/, "$1");
    
    if (!token) {
      router.push("/auth/login");
    } else {
      const userRole = localStorage.getItem("user_role");
      console.log("User role:", userRole || role);
      setUser({ 
        role: userRole || role,
        token: token 
      });
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Asosiy menu itemlari - barcha itemlar
// Asosiy menu itemlari
const mainMenuItems = [
  { icon: LayoutDashboard, label: "Asosiy", href: "/asosiy", roles: ["admin", "manager", "developer"] },
  { icon: Users, label: "Managerlar", href: "/Managerlar", roles: ["admin", "manager", "developer"] }, // <-- manager qo'shildi
  { icon: UserCog, label: "Adminlar", href: "/Administr", roles: ["admin", "manager", "developer"] },   // <-- manager qo'shildi
  { icon: GraduationCap, label: "Ustozlar", href: "/Ustozlar", roles: ["admin", "manager"] },
  { icon: Users, label: "Studentlar", href: "/Studentlar", roles: ["admin", "manager", "teacher"] },
  { icon: BookOpen, label: "Guruhlar", href: "/Guruhlar", roles: ["admin", "manager", "teacher"] },
  { icon: BookOpen, label: "Kurslar", href: "/Kurslar", roles: ["admin", "manager"] },
  { icon: CreditCard, label: "Payment", href: "/Payment", roles: ["admin", "manager"] },
];

  // Boshqalar menu itemlari
  const otherMenuItems = [
    { icon: Settings, label: "Sozlamalar", href: "/Sozlamalar", roles: ["admin", "developer"] },
    { icon: User, label: "Profile", href: "/Profile", roles: ["admin", "manager", "developer", "teacher"] },
    { icon: LogOut, label: "Chiqish", href: "/auth/logout", roles: ["admin", "manager", "developer", "teacher"] },
  ];

  // Role bo'yicha filter
  const filteredMainMenu = mainMenuItems.filter(item => 
    item.roles.includes(user.role)
  );

  const filteredOtherMenu = otherMenuItems.filter(item => 
    item.roles.includes(user.role)
  );

  const handleLogout = (e: React.MouseEvent, href: string) => {
    if (href === "/auth/logout") {
      e.preventDefault();
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        flex flex-col h-screen
      `}>
        {/* Logo */}
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

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {/* MENU sarlavhasi */}
            {sidebarOpen && (
              <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                MENU
              </li>
            )}
            
            {/* Asosiy menu itemlari */}
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

            {/* BOSHQALAR sarlavhasi */}
            {sidebarOpen && filteredOtherMenu.length > 0 && (
              <li className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                BOSHQALAR
              </li>
            )}
            
            {/* Boshqalar menu itemlari */}
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

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Asosiy &gt; Boshqaruv Paneli
              </h1>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  SYSTEM STATUS: ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* DASHBOARD */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">DASHBOARD</h2>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">TALABALAR</h3>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">245</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12% o'tgan oy</p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">GURUHLAR</h3>
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">18</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+3 ta yangi</p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">QARZDORLAR</h3>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">23</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">8.3 mln so'm</p>
            </div>

            <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">OYLIK TUSHUM</h3>
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">47.2M</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+5% budget</p>
            </div>
          </div>

          {/* OQIM ANALITIKASI */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">OQIM ANALITIKASI</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Chart card */}
            <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Talabalar oqimi</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="h-48 flex items-end justify-between">
                {[65, 45, 75, 50, 80, 55, 70].map((height, i) => (
                  <div key={i} className="w-12">
                    <div 
                      className="bg-blue-500 rounded-t-lg" 
                      style={{ height: `${height}px` }}
                    ></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                      {['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Y'][i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Statistika</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Yangi talabalar</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">45</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Faol guruhlar</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">18</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TIZIM JURNALI */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">TIZIM JURNALI</h2>
          
          <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400 w-16">09:41</span>
                <span className="text-sm text-gray-900 dark:text-white">Yangi guruh yaratildi</span>
              </div>
              
              <div className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400 w-16">08:30</span>
                <span className="text-sm text-gray-900 dark:text-white">To'lov qabul qilindi</span>
              </div>
              
              <div className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400 w-16">07:15</span>
                <span className="text-sm text-gray-900 dark:text-white">Qarzdorlik xabari yuborildi</span>
              </div>
              
              <div className="flex items-center gap-4 py-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400 w-16">06:45</span>
                <span className="text-sm text-gray-900 dark:text-white">Yangi ustoz tizimga qo'shildi</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}