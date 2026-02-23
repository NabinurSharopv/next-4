// app/dashboard/page.tsx
"use client";

import { Users, BookOpen, AlertCircle, DollarSign, TrendingUp, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
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
        <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Talabalar oqimi</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="h-48 flex items-end justify-between">
            {[65, 45, 75, 50, 80, 55, 70].map((height, i) => (
              <div key={i} className="w-12">
                <div className="bg-blue-500 rounded-t-lg" style={{ height: `${height}px` }}></div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  {['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Y'][i]}
                </p>
              </div>
            ))}
          </div>
        </div>

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
  );
}