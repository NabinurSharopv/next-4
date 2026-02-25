// hooks/useProfile.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Profile {
  first_name: string;
  last_name: string;
  role: string;
  image: string;
}

// Profile kalitlari
export const profileKeys = {
  all: ["profile"] as const,
};

// Profile ma'lumotlarini olish funksiyasi
async function fetchProfile(): Promise<Profile> {
  if (typeof window === "undefined") {
    return {
      first_name: "sardor",
      last_name: "Olimov",
      role: "manager",
      image: "",
    };
  }

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  let tokenData: any = {};
  if (token) {
    try {
      tokenData = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Token parse xatoligi", e);
    }
  }

  const localUpdates = JSON.parse(localStorage.getItem("updatedProfile") || "{}");
  const localImage = localStorage.getItem("profileImage") || "";

  return {
    first_name: localUpdates.first_name || tokenData.first_name || "sardor",
    last_name: localUpdates.last_name || tokenData.last_name || "Olimov",
    role: tokenData.role || "Manager",
    image: localImage || "",
  };
}

// Profile hook
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Profile yangilash funksiyasi
export function useInvalidateProfile() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: profileKeys.all });
  };
}