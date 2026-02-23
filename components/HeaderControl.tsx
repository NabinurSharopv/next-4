// components/HeaderControl.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/page";

export default function HeaderControl() {
  const pathname = usePathname();

  // Login sahifasida Header ko'rinmasligi uchun
  if (pathname === "/auth/login") {
    return null;
  }

  return <Header />;
}