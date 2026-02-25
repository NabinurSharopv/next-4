// hooks/useStudent.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface Student {
  id?: number | string;
  _id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: string;
  groups_count?: number;
}

export interface Group {
  _id: string;
  name?: string;
  title?: string;
  course_name?: string;
}

export interface CreateStudentData {
  first_name: string;
  last_name: string;
  phone: string;
  groups: Array<{ group: string }>;
}

export interface VacationData {
  _id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface ReturnData {
  _id: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const API_BASE_URL = "https://admin-crm.onrender.com/api";

// Query kalitlari
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters: string) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

export const groupKeys = {
  all: ["groups"] as const,
};

// Studentlarni olish
async function fetchStudents(): Promise<Student[]> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi. Iltimos, qayta login qiling.");
  }

  const response = await fetch(`${API_BASE_URL}/student/get-all-students`, {
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

// Guruhlarni olish
async function fetchGroups(): Promise<Group[]> {
  const token = getCookie("token");

  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/group/get-all-group`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const result = await response.json();
  
  if (result?.data && Array.isArray(result.data)) {
    return result.data;
  } else if (Array.isArray(result)) {
    return result;
  }
  
  return [];
}

// Yangi student qo'shish
async function createStudent(data: CreateStudentData): Promise<Student> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/student/create-student`, {
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

// Studentni ta'tilga chiqarish
async function leaveStudent(data: VacationData): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/student/leave-student`, {
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
}

// Studentni qaytarish (faollashtirish)
async function returnStudent(data: ReturnData): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/student/return-student`, {
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
    if (errorData.message === "Xodim allaqachon ishlamoqda") {
      throw new Error("Bu student allaqachon faol holatda!");
    }
    throw new Error(errorData.message || "Qaytarish xatosi!");
  }
}

// Studentni o'chirish
async function deleteStudent(id: string): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/student/delete-student`, {
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

// HOOKS

// Studentlarni olish query
export function useStudents() {
  return useQuery({
    queryKey: studentKeys.all,
    queryFn: fetchStudents,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Guruhlarni olish query
export function useGroups() {
  return useQuery({
    queryKey: groupKeys.all,
    queryFn: fetchGroups,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Student qo'shish mutation
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success("Yangi student muvaffaqiyatli qo'shildi! 🎉", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Studentni ta'tilga chiqarish mutation
export function useLeaveStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveStudent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: studentKeys.detail(variables._id) 
      });
      
      toast.success("Student ta'tilga chiqarildi! 🌴", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Studentni qaytarish mutation
export function useReturnStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnStudent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: studentKeys.detail(variables._id) 
      });
      
      toast.success("Student muvaffaqiyatli faollashtirildi! 🔄", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      if (error.message === "Bu student allaqachon faol holatda!") {
        toast.error(error.message);
      } else {
        toast.error(error.message);
      }
    },
  });
}

// Studentni o'chirish mutation
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.removeQueries({ 
        queryKey: studentKeys.detail(id) 
      });
      
      toast.success("Student muvaffaqiyatli o'chirildi! 🗑️", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}