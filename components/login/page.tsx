"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const loginMutation = useLogin();

  // Mounted tekshiruvi (hydration xatoligi uchun)
  useEffect(() => {
    setMounted(true);
    
    // Agar token bo'lsa, dashboardga redirect
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
      
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  // Dark mode toggle funksiyasi
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Mounted bo'lmaganda icon ko'rsatmaslik
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4">
        <div className="w-full max-w-[440px] h-[500px] animate-pulse bg-gray-200 dark:bg-zinc-800 rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4 font-sans transition-colors duration-300">
      
      {/* DARK MODE TUGMASI */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-zinc-700" />
        )}
      </button>

      {/* Orqa fon effekti */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden dark:block">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full"></div>
      </div>

      <Card className="w-full max-w-[440px] bg-white dark:bg-[#111111] border-zinc-200 dark:border-zinc-800/50 text-zinc-950 dark:text-white rounded-[2.5rem] shadow-xl dark:shadow-2xl relative z-10 p-4 md:p-8 transition-colors duration-300">
        <CardHeader className="space-y-3 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight">Xush kelibsiz 👋</CardTitle>
          <CardDescription className="text-zinc-500 text-sm font-medium">
            Hisobingizga kirish uchun email va parolni kiriting
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ml-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email kiriting"
                className="h-12 bg-gray-50 border-zinc-200 focus-visible:ring-zinc-400 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800 dark:focus-visible:ring-zinc-700 dark:text-zinc-200 dark:placeholder:text-zinc-600 rounded-xl transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ml-1">
                Parol
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol kiriting"
                  className="h-12 bg-gray-50 border-zinc-200 focus-visible:ring-zinc-400 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800 dark:focus-visible:ring-zinc-700 dark:text-zinc-200 dark:placeholder:text-zinc-600 rounded-xl transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-white transition-colors"
                  disabled={loginMutation.isPending}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginMutation.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs font-medium text-center transition-colors">
                {(loginMutation.error as Error).message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg dark:shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Kirish...</span>
                </div>
              ) : (
                "Kirish"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;