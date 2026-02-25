// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  role?: string;
  success?: boolean;
}

// Login mutation
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      // 204 - Success no content
      if (response.status === 204) {
        return { success: true };
      }

      // Error holatida
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Email yoki parol noto'g'ri");
      }

      // Success with data
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Token va role ni saqlash
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${data.role || "user"}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.role || "user");
      }

      // Muvaffaqiyatli login
      toast.success("Xush kelibsiz! 🎉");
      
      // Dashboardga o'tish
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 500);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Logout mutation
export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Cookie va localStorage ni tozalash
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("updatedProfile");
      localStorage.removeItem("profileImage");
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Hayr! 👋");
      router.push("/");
    },
  });
}