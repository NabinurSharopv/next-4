"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Moon, Sun } from "lucide-react";   

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();

  // Mounted tekshiruvi (hydration xatoligi uchun)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.status === 204) {
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const role = data.role || "user";

        if (token) {
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`;
          localStorage.setItem("token", token);
          localStorage.setItem("user_role", role);
        }

        window.location.replace("/");
        return;
      }

      const data = await response.json().catch(() => ({}));
      setError(data.message || "Email yoki parol noto'g'ri");
      
    } catch (err) {
      setError("Server bilan aloqa yo'q");
    } finally {
      setLoading(false);
    }
  };

  // Dark mode toggle funksiyasi - bir bosgida o'zgaradi
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
      
      {/* DARK MODE TUGMASI - BIR BOSGINDA O'ZGARADI */}
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs font-medium text-center transition-colors">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg dark:shadow-white/5"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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