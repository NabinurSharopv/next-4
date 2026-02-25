// hooks/useManager.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface Manager {
  id?: number | string;
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const API_BASE_URL = "https://admin-crm.onrender.com/api/staff";

// Query kalitlari
export const managerKeys = {
  all: ["managers"] as const,
  lists: () => [...managerKeys.all, "list"] as const,
  list: (filters: string) => [...managerKeys.lists(), filters] as const,
  details: () => [...managerKeys.all, "detail"] as const,
  detail: (id: string) => [...managerKeys.details(), id] as const,
};

// Managerlarni olish
async function fetchManagers(): Promise<Manager[]> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi. Iltimos, qayta login qiling.");
  }

  const response = await fetch(`${API_BASE_URL}/all-managers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (response.status === 401 || response.status === 403) {
    throw new Error("Ruxsat berilmadi. Iltimos, qayta login qiling.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Ma'lumotlarni olishda xatolik");
  }

  return data.data || data;
}

// Managerni tahrirlash
async function updateManager(manager: Partial<Manager> & { _id: string }): Promise<Manager> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/edited-manager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(manager),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Tahrirlash uchun huquqingiz yetarli emas!");
  }

  return data;
}

// Managerni o'chirish
async function deleteManager(id: string): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "O'chirish uchun huquqingiz yetarli emas!");
  }
}

// HOOKS

// Managerlarni olish query
export function useManagers() {
  return useQuery({
    queryKey: managerKeys.all,
    queryFn: fetchManagers,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Managerni tahrirlash mutation
export function useUpdateManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateManager,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: managerKeys.all });
      
      if (variables._id) {
        queryClient.invalidateQueries({ 
          queryKey: managerKeys.detail(variables._id) 
        });
      }
      
      toast.success("Manager muvaffaqiyatli tahrirlandi! ✅");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Managerni o'chirish mutation
export function useDeleteManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteManager,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: managerKeys.all });
      queryClient.removeQueries({ 
        queryKey: managerKeys.detail(id) 
      });
      
      toast.success("Manager muvaffaqiyatli o'chirildi! 🗑️");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}