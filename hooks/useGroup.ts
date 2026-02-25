// hooks/useGroup.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface Group {
  id?: number | string;
  _id?: string;
  name: string;
  teacher: {
    _id: string;
    first_name: string;
    last_name: string;
  } | string;
  students_count?: number;
  started_group?: string;
  end_group?: string;
  course?: string;
  status?: string;
  price?: number;
  is_deleted?: boolean;
  disable?: boolean;
  students?: any[];
}

export interface Teacher {
  _id: string;
  first_name: string;
  last_name: string;
}

export interface CreateGroupData {
  teacher: string;
  started_group: string;
  course_id: string;
}

export interface EndGroupData {
  _id: string;
  date: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const API_BASE_URL = "https://admin-crm.onrender.com/api";

// Query kalitlari
export const groupKeys = {
  all: ["groups"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  list: (filters: string) => [...groupKeys.lists(), filters] as const,
  details: () => [...groupKeys.all, "detail"] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
};

export const teacherKeys = {
  all: ["teachers"] as const,
};

// Guruhlarni olish
async function fetchGroups(): Promise<Group[]> {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Token topilmadi. Iltimos, qayta login qiling.");
  }

  const response = await fetch(`${API_BASE_URL}/group/get-all-group`, {
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

// Ustozlarni olish
async function fetchTeachers(): Promise<Teacher[]> {
  const token = getCookie("token");

  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/teacher/get-all-teachers`, {
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

// Yangi guruh qo'shish
async function createGroup(data: CreateGroupData): Promise<Group> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/group/create-group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Xatolik: ${response.status}`);
  }

  return result;
}

// Guruh tugash vaqtini belgilash / guruhni tugatish
async function endGroup(data: EndGroupData): Promise<void> {
  const token = getCookie("token");

  const response = await fetch(`${API_BASE_URL}/group/edit-end-group`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Xatolik: ${response.status}`);
  }
}

// HOOKS

// Guruhlarni olish query
export function useGroups() {
  return useQuery({
    queryKey: groupKeys.all,
    queryFn: fetchGroups,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    gcTime: 10 * 60 * 1000, // 10 daqiqa
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Ustozlarni olish query
export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.all,
    queryFn: fetchTeachers,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Guruh qo'shish mutation
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      toast.success("Yangi guruh muvaffaqiyatli qo'shildi! 🎉", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Guruh qo'shishda xatolik yuz berdi!");
    },
  });
}

// Guruh tugatish mutation
export function useEndGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: endGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: groupKeys.detail(variables._id) 
      });
      
      toast.success("Guruh muvaffaqiyatli tugatildi! ✅", {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Guruhni tugatishda xatolik yuz berdi!");
    },
  });
}