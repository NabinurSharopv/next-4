// hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface Admin {
  id?: number | string;
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}

export interface VacationData {
  start_date: string;
  end_date: string;
  reason: string;
}

export interface CreateAdminData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  password: string;
  work_date: string;
  is_deleted: boolean;
}

export interface UpdateAdminData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
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
export const adminKeys = {
  all: ["admins"] as const,
  lists: () => [...adminKeys.all, "list"] as const,
  list: (filters: string) => [...adminKeys.lists(), filters] as const,
  details: () => [...adminKeys.all, "detail"] as const,
  detail: (id: string) => [...adminKeys.details(), id] as const,
};

// Adminlarni olish
async function fetchAdmins(): Promise<Admin[]> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi. Iltimos, qayta login qiling.");
  }

  const response = await fetch(`${API_BASE_URL}/all-admins`, {
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

// Yangi admin qo'shish
async function createAdmin(data: CreateAdminData): Promise<Admin> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/create-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Admin qo'shishda xatolik!");
  }

  return result;
}

// Adminni tahrirlash
async function updateAdmin(data: UpdateAdminData): Promise<Admin> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/edited-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Tahrirlash xatosi!");
  }

  return result;
}

// Adminni ta'tilga chiqarish
async function leaveAdmin(data: { _id: string } & VacationData): Promise<any> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/leave-staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    const errorData = JSON.parse(responseText);
    throw new Error(errorData.message || "Ta'tilga chiqarish xatosi!");
  }

  return JSON.parse(responseText);
}

// Adminni ishga qaytarish
async function returnAdmin(id: string): Promise<any> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/leave-exit-staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ _id: id }),
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    const errorData = JSON.parse(responseText);
    throw new Error(errorData.message || "Ishga qaytarish xatosi!");
  }

  return JSON.parse(responseText);
}

// Adminni o'chirish
async function deleteAdmin(id: string): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/deleted-admin`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ _id: id }),
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    const errorData = JSON.parse(responseText);
    throw new Error(errorData.message || "O'chirish xatosi!");
  }
}

// HOOKS

// Adminlarni olish query
export function useAdmins() {
  return useQuery({
    queryKey: adminKeys.all,
    queryFn: fetchAdmins,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Admin qo'shish mutation
export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success("Yangi admin muvaffaqiyatli qo'shildi! 🎉", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Admin tahrirlash mutation
export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      
      if (variables._id) {
        queryClient.invalidateQueries({ 
          queryKey: adminKeys.detail(variables._id) 
        });
      }
      
      toast.success("Admin muvaffaqiyatli tahrirlandi! ✅", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Adminni ta'tilga chiqarish mutation
export function useLeaveAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveAdmin,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminKeys.detail(variables._id) 
      });
      
      toast.success("Admin ta'tilga chiqarildi! 🌴", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Adminni ishga qaytarish mutation
export function useReturnAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnAdmin,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminKeys.detail(id) 
      });
      
      toast.success("Admin ishga qaytarildi! 🔄", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Adminni o'chirish mutation
export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.removeQueries({ 
        queryKey: adminKeys.detail(id) 
      });
      
      toast.success("Admin o'chirildi! 🗑️", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}