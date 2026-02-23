// app/(main)/auth/login/page.tsx
"use client";

import Login from "@/components/login/page";
import { useRouter } from "next/navigation";

export default function AuthLoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    console.log("Login muvaffaqiyatli!");
    router.push("/");
  };

  return <Login onLoginSuccess={handleLoginSuccess} />; // <-- return qilish kerak!
}