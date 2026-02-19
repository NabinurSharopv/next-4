// components/HeaderControl.tsx
"use client"; // Bu juda muhim!

import { usePathname } from "next/navigation";
import Header from "@/components/header/index"; // O'zingizning eski Headeringiz

export default function HeaderControl() {
  const pathname = usePathname();

  // Agar sahifa manzili "/login" bo'lsa, hech narsa chiqarmaymiz
  if (pathname === "/login") {
    return null;
  }

  // Boshqa barcha sahifalarda Header chiqadi
  return <Header />;
}