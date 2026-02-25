// hooks/useCourse.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface Course {
  _id: string;
  name: string | { id?: string; [key: string]: any };
  price?: number;
  duration?: string;
  description?: string;
  students_count?: number;
  is_freeze?: boolean;
}

export interface CreateCategoryData {
  name: string;
}

export interface CreateCourseData {
  name: string;
  description?: string;
  duration?: string;
  price?: number;
}

export interface EditCourseData {
  course_id: string;
  duration: string;
  price: number;
}

export interface FreezeCourseData {
  course_id: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const API_BASE_URL = "https://admin-crm.onrender.com/api";

// Query kalitlari
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: string) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  frozen: () => [...courseKeys.all, "frozen"] as const,
  active: () => [...courseKeys.all, "active"] as const,
};

// Kurslarni olish (filter bilan)
async function fetchCourses(is_freeze?: boolean): Promise<Course[]> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi");
  }

  let url = `${API_BASE_URL}/course/get-courses`;
  if (is_freeze !== undefined) {
    url += `?is_freeze=${is_freeze}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Xatolik yuz berdi");
  }

  return data.data || data.courses || data.results || data;
}

// Kategoriya yaratish
async function createCategory(data: CreateCategoryData): Promise<any> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi!");
  }

  const response = await fetch(`${API_BASE_URL}/course/create-category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kategoriya yaratishda xatolik");
  }

  return result;
}

// Kurs yaratish
async function createCourse(data: CreateCourseData): Promise<any> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi!");
  }

  const response = await fetch(`${API_BASE_URL}/course/create-course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kurs yaratishda xatolik");
  }

  return result;
}

// Kursni tahrirlash
async function editCourse(data: EditCourseData): Promise<any> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi!");
  }

  const response = await fetch(`${API_BASE_URL}/course/edit-course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kursni tahrirlashda xatolik");
  }

  return result;
}

// Kursni muzlatish
async function freezeCourse(data: FreezeCourseData): Promise<any> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi!");
  }

  const response = await fetch(`${API_BASE_URL}/course/freeze-course`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kursni muzlatishda xatolik");
  }

  return result;
}

// Kursni eritish
async function unfreezeCourse(data: FreezeCourseData): Promise<any> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi!");
  }

  const response = await fetch(`${API_BASE_URL}/course/unfreeze-course`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kursni eritishda xatolik");
  }

  return result;
}

// Kursni o'chirish
async function deleteCourse(data: FreezeCourseData): Promise<any> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi!");
  }

  const response = await fetch(`${API_BASE_URL}/course/delete-course`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Kursni o'chirishda xatolik");
  }

  return result;
}

// HOOKS

// Kurslarni olish query
export function useCourses(is_freeze?: boolean) {
  return useQuery({
    queryKey: is_freeze === undefined 
      ? courseKeys.all 
      : is_freeze 
        ? courseKeys.frozen() 
        : courseKeys.active(),
    queryFn: () => fetchCourses(is_freeze),
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Kategoriya yaratish mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success("Kategoriya muvaffaqiyatli qo'shildi! ✅", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Kategoriya yaratishda xatolik");
    },
  });
}

// Kurs yaratish mutation
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success("Kurs muvaffaqiyatli qo'shildi! 🎉", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Kurs yaratishda xatolik");
    },
  });
}

// Kurs tahrirlash mutation
export function useEditCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: courseKeys.detail(variables.course_id) 
      });
      toast.success("Kurs muvaffaqiyatli tahrirlandi! ✏️", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Kursni tahrirlashda xatolik");
    },
  });
}

// Kursni muzlatish mutation
export function useFreezeCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: freezeCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: courseKeys.detail(variables.course_id) 
      });
      toast.success("Kurs muvaffaqiyatli muzlatildi! ❄️", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Kursni muzlatishda xatolik");
    },
  });
}

// Kursni eritish mutation
export function useUnfreezeCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfreezeCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: courseKeys.detail(variables.course_id) 
      });
      toast.success("Kurs muvaffaqiyatli eritildi! 🌞", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Kursni eritishda xatolik");
    },
  });
}

// Kursni o'chirish mutation
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.removeQueries({ 
        queryKey: courseKeys.detail(variables.course_id) 
      });
      toast.success("Kurs muvaffaqiyatli o'chirildi! 🗑️", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Kursni o'chirishda xatolik");
    },
  });
}