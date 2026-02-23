"use client";


export default function profileLayout({ children }) {
 
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  );
}
