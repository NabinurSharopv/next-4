// hooks/useTeacher.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface Teacher {
  id?: number | string;
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: string;
}

export interface Course {
  _id: string;
  name: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  } | string;
  description: string;
  duration: string;
  price: number;
  is_freeze: boolean;
}

export interface CreateTeacherData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  course_id: string;
  work_date: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const API_BASE_URL = "https://admin-crm.onrender.com/api";

// Query kalitlari
export const teacherKeys = {
  all: ["teachers"] as const,
  lists: () => [...teacherKeys.all, "list"] as const,
  list: (filters: string) => [...teacherKeys.lists(), filters] as const,
  details: () => [...teacherKeys.all, "detail"] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
};

export const courseKeys = {
  all: ["courses"] as const,
};

// Ustozlarni olish
async function fetchTeachers(): Promise<Teacher[]> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi. Iltimos, qayta login qiling.");
  }

  const response = await fetch(`${API_BASE_URL}/teacher/get-all-teachers`, {
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

// Kurslarni olish
async function fetchCourses(): Promise<Course[]> {
  const token = getCookie("token");

  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/group/search-course`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const result = await response.json();
  
  if (result?.data && Array.isArray(result.data)) {
    return result.data;
  }
  
  return [];
}

// Yangi ustoz qo'shish
async function createTeacher(data: CreateTeacherData): Promise<Teacher> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/teacher/create-teacher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Qo'shishda xatolik!");
  }

  return result;
}

// Ustozni o'chirish (ishdan bo'shatish)
async function deleteTeacher(id: string): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/teacher/fire-teacher`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ _id: id }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Xatolik: ${response.status}`);
  }
}

// Ustozni ishga qaytarish
async function returnTeacher(id: string): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/teacher/return-teacher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ _id: id }),
  });

  const result = await response.json();

  if (!response.ok) {
    if (result.message === "Xodim allaqachon ishlamoqda") {
      throw new Error("Bu ustoz allaqachon faol holatda!");
    }
    throw new Error(result.message || "Ishga qaytarish xatosi!");
  }
}

// HOOKS

// Ustozlarni olish query
export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.all,
    queryFn: fetchTeachers,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Kurslarni olish query
export function useCourses() {
  return useQuery({
    queryKey: courseKeys.all,
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Ustoz qo'shish mutation
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      toast.success("Yangi ustoz muvaffaqiyatli qo'shildi! 🎉", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Ustozni o'chirish mutation
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.removeQueries({ 
        queryKey: teacherKeys.detail(id) 
      });
      
      toast.success("Ustoz muvaffaqiyatli o'chirildi! 🗑️", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Ustozni ishga qaytarish mutation
export function useReturnTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnTeacher,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: teacherKeys.detail(id) 
      });
      
      toast.success("Ustoz muvaffaqiyatli ishga qaytarildi! 🔄", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      if (error.message === "Bu ustoz allaqachon faol holatda!") {
        toast.error(error.message);
      } else {
        toast.error(error.message);
      }
    },
  });
}