import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserProfile {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
}

// Cookie olish funksiyasi
function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

// Login mutation
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (response.status === 204) {
        return { success: true };
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Email yoki parol noto'g'ri");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${data.role || "user"}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.role || "user");
      }
      
      toast.success("Muvaffaqiyatli kirildi!");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Profil ma'lumotlarini olish query
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = getCookie("token");
      
      if (!token) {
        throw new Error("Token topilmadi");
      }

      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        
        // LocalStorage dan yangilangan ma'lumotlarni olish
        const localUpdates = JSON.parse(localStorage.getItem("updatedProfile") || "{}");
        const localImage = localStorage.getItem("profileImage") || "";
        
        return {
          _id: tokenData.id || "1",
          first_name: localUpdates.first_name || tokenData.first_name || "sardor",
          last_name: localUpdates.last_name || tokenData.last_name || "Olimov",
          email: tokenData.email || "usern88@mail.ru",
          role: tokenData.role || "manager",
          image: localImage || "",
          createdAt: tokenData.createdAt || "2025-06-04",
        };
      } catch (error) {
        throw new Error("Profni yuklab bo'lmadi");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
  });
}

// Profilni tahrirlash mutation
export function useEditProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { first_name: string; last_name: string; email: string }) => {
      const token = getCookie("token");
      
      const response = await fetch(`/api/auth/edit-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Profilni tahrirlashda xatolik");
      }

      // LocalStorage ga saqlash
      localStorage.setItem("updatedProfile", JSON.stringify(data));
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      window.dispatchEvent(new Event("profileUpdated"));
      toast.success("Profil muvaffaqiyatli yangilandi!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Rasm yuklash mutation
export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const token = getCookie("token");
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`/api/auth/edit-profile-img`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Rasm yuklashda xatolik");
      }

      // Rasmni localStorage ga saqlash (vaqtinchalik)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        localStorage.setItem("profileImage", reader.result as string);
      };

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      window.dispatchEvent(new Event("profileUpdated"));
      toast.success("Rasm muvaffaqiyatli yuklandi!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Parolni tahrirlash mutation
export function useEditPassword() {
  return useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      const token = getCookie("token");
      
      const response = await fetch(`/api/auth/edit-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Parolni o'zgartirishda xatolik");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Parol muvaffaqiyatli o'zgartirildi!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}