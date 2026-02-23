"use client";
import { Toaster } from "react-hot-toast";



export default function adminLayout({ children }) {
 
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-[#0a0a0a]">
          {children}
                  <Toaster position="top-right" />
        </main>
      </div>
    </div>
  );
}
