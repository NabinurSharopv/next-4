"use client";

import { useLogout } from "@/hooks/useAuth";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?: "icon" | "text" | "full";
}

export default function LogoutButton({ className = "", variant = "full" }: LogoutButtonProps) {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (confirm("Chiqishni tasdiqlaysizmi?")) {
      logoutMutation.mutate();
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className={`p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ${className}`}
        title="Chiqish"
      >
        {logoutMutation.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <LogOut className="w-5 h-5" />
        )}
      </button>
    );
  }

  if (variant === "text") {
    return (
      <button
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className={`text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ${className}`}
      >
        {logoutMutation.isPending ? "Chiqilmoqda..." : "Chiqish"}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {logoutMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>Chiqish</span>
    </button>
  );
}