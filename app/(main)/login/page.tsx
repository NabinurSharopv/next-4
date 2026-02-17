"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/api/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const isApiSuccess = data.message?.toLowerCase().includes("succses") || data.message?.toLowerCase().includes("success");

      if (response.ok || isApiSuccess) {
        const token = data.token || `session_${Math.random().toString(36).substr(2, 9)}`;
        const role = data.role || "user";

        // Cookie va LocalStorage-ga saqlash
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("token", token);
        localStorage.setItem("user_role", role);

        try {
          onLoginSuccess();
        } catch (err) {
          console.error(err);
        }

        // Home-ga yo'naltirish
        window.location.replace("/");
        return;
      }

      setError(data.message || "Email yoki parol noto'g'ri");
    } catch (err) {
      setError("Server bilan aloqa yo'q. Iltimos keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      {/* Orqa fondagi yorug'lik effektlari */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full"></div>
      </div>

      <Card className="w-full max-w-[440px] bg-[#111111] border-zinc-800/50 text-white rounded-[2.5rem] shadow-2xl relative z-10 p-4 md:p-8">
        <CardHeader className="space-y-3 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight">Xush kelibsiz 👋</CardTitle>
          <CardDescription className="text-zinc-500 text-sm font-medium">
            Hisobingizga kirish uchun email va parolni kiriting
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email kiriting"
                className="h-12 bg-zinc-900/50 border-zinc-800 rounded-xl focus-visible:ring-zinc-700 text-zinc-200 placeholder:text-zinc-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                Parol
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol kiriting"
                  className="h-12 bg-zinc-900/50 border-zinc-800 rounded-xl focus-visible:ring-zinc-700 text-zinc-200 placeholder:text-zinc-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-white/5"
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