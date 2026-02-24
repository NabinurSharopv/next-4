"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Snowflake, X, Save, ThermometerSnowflake, ThermometerSun } from "lucide-react";
import toast from "react-hot-toast";

interface Course {
  _id: string;
  name: string | { id?: string; [key: string]: any };
  price?: number;
  duration?: string;
  description?: string;
  students_count?: number;
  is_freeze?: boolean;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

// 🟢 KATEGORIYA QO'SHISH MODALI
function AddCategoryModal({ isOpen, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const API_BASE_URL = "https://admin-crm.onrender.com/api";

  if (!isOpen) return null;

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Kategoriya nomini kiriting!");
      return;
    }

    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Token topilmadi!");
        return;
      }

      const requestBody = {
        name: categoryName.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/course/create-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kategoriya yaratishda xatolik");
      }

      toast.success("Kategoriya muvaffaqiyatli qo'shildi!");
      setCategoryName("");
      onSuccess();
      onClose();
      
    } catch (err: any) {
      toast.error(err.message || "Kategoriya yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111111] rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Kategoriya qo'shish</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategoriya nomi
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Backend dasturlash"
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            Bekor qilish
          </button>
          <button
            onClick={handleAddCategory}
            disabled={loading || !categoryName.trim()}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
          >
            {loading ? "Qo'shilmoqda..." : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 KURS QO'SHISH MODALI
function AddCourseModal({ isOpen, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });

  const API_BASE_URL = "https://admin-crm.onrender.com/api";

  if (!isOpen) return null;

  const handleAddCourse = async () => {
    if (!formData.name.trim()) {
      toast.error("Kurs nomini kiriting!");
      return;
    }

    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Token topilmadi!");
        return;
      }

      const requestBody = {
        name: formData.name.trim(),
        description: formData.description || "Yangi kurs",
        duration: formData.duration || "2 yil",
        price: formData.price ? Number(formData.price) : 1000000,
      };

      const response = await fetch(`${API_BASE_URL}/course/create-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kurs yaratishda xatolik");
      }

      toast.success("Kurs muvaffaqiyatli qo'shildi!");
      setFormData({ name: "", description: "", duration: "", price: "" });
      onSuccess();
      onClose();
      
    } catch (err: any) {
      toast.error(err.message || "Kurs yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111111] rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Kurs qo'shish</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kurs nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Backend dasturlash"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Yangi kurs"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="2 yil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (UZS)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="1000000"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            Bekor qilish
          </button>
          <button
            onClick={handleAddCourse}
            disabled={loading || !formData.name.trim()}
            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50"
          >
            {loading ? "Qo'shilmoqda..." : "Kurs qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 KURS TAHRIRLASH MODALI (POSTMANDAGI KABI)
function EditCourseModal({ isOpen, onClose, onSuccess, course }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    duration: "",
    price: "",
  });

  const API_BASE_URL = "https://admin-crm.onrender.com/api";

  useEffect(() => {
    if (course) {
      setFormData({
        duration: course.duration || "",
        price: course.price?.toString() || "",
      });
    }
  }, [course]);

  if (!isOpen) return null;

  const handleEditCourse = async () => {
    if (!formData.duration || !formData.price) {
      toast.error("Duration va price ni kiriting!");
      return;
    }

    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Token topilmadi!");
        return;
      }

      // 🟢 POSTMANDAGI TO'G'RI FORMAT (faqat course_id, duration, price)
      const requestBody = {
        course_id: course._id,
        duration: formData.duration,
        price: Number(formData.price),
      };

      console.log("📤 Kurs tahrirlash:", requestBody);

      const response = await fetch(`${API_BASE_URL}/course/edit-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("📥 Server javobi:", data);

      if (!response.ok) {
        throw new Error(data.message || "Kursni tahrirlashda xatolik");
      }

      toast.success("Kurs muvaffaqiyatli tahrirlandi!");
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error("❌ Xatolik:", err);
      toast.error(err.message || "Kursni tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111111] rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Kursni tahrirlash: {course?.name ? (typeof course.name === 'string' ? course.name : course.name?.name || '') : ''}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Kurs nomi (faqat ko'rsatish uchun, tahrirlanmaydi) */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Kurs nomi</p>
            <p className="font-medium">
              {course?.name ? (typeof course.name === 'string' ? course.name : course.name?.name || '') : ''}
            </p>
          </div>

          {/* Description (faqat ko'rsatish uchun, tahrirlanmaydi) */}
          {course?.description && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <p className="font-medium">{course.description}</p>
            </div>
          )}

          {/* Duration - tahrirlanadi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="2 yil"
            />
          </div>

          {/* Price - tahrirlanadi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (UZS) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="1000000"
              min="0"
            />
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ Faqat Duration va Price tahrirlanadi. Kurs nomi va description o'zgarmaydi.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            Bekor qilish
          </button>
          <button
            onClick={handleEditCourse}
            disabled={loading || !formData.duration || !formData.price}
            className="px-5 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-xl disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 ASOSIY SAHIFA
export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showFrozen, setShowFrozen] = useState<boolean | null>(null);

  const API_BASE_URL = "https://admin-crm.onrender.com/api";

  const fetchCourses = async (is_freeze?: boolean) => {
    try {
      const token = getCookie("token");
      if (!token) {
        setError("Token topilmadi");
        setLoading(false);
        return;
      }

      // 🟢 is_freeze parametri bilan filterlash
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

      if (!response.ok) throw new Error(data.message || "Xatolik yuz berdi");

      let coursesData = data.data || data.courses || data.results || data;
      
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else {
        setCourses([]);
      }
      
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 KURSNI O'CHIRISH
  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`"${getCourseName(course)}" kursini o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Token topilmadi!");
        return;
      }

      // 🟢 TO'G'RI FORMAT: course_id
      const requestBody = {
        course_id: course._id,
      };

      const response = await fetch(`${API_BASE_URL}/course/delete-course`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kursni o'chirishda xatolik");
      }

      toast.success("Kurs muvaffaqiyatli o'chirildi!");
      fetchCourses(showFrozen);
      
    } catch (err: any) {
      toast.error(err.message || "Kursni o'chirishda xatolik");
    }
  };

  // 🟢 KURSNI MUZLATISH
  const handleFreezeCourse = async (course: Course) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Token topilmadi!");
        return;
      }

      const requestBody = {
        course_id: course._id,
      };

      const response = await fetch(`${API_BASE_URL}/course/freeze-course`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kursni muzlatishda xatolik");
      }

      toast.success("Kurs muvaffaqiyatli muzlatildi!");
      fetchCourses(showFrozen);
      
    } catch (err: any) {
      toast.error(err.message || "Kursni muzlatishda xatolik");
    }
  };

  // 🟢 KURSNI ERITISH
  const handleUnfreezeCourse = async (course: Course) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Token topilmadi!");
        return;
      }

      const requestBody = {
        course_id: course._id,
      };

      const response = await fetch(`${API_BASE_URL}/course/unfreeze-course`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kursni eritishda xatolik");
      }

      toast.success("Kurs muvaffaqiyatli eritildi!");
      fetchCourses(showFrozen);
      
    } catch (err: any) {
      toast.error(err.message || "Kursni eritishda xatolik");
    }
  };

  // 🟢 KURSNI TAXRIRLASH UCHUN MODALNI OCHISH
  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const getCourseName = (course: Course): string => {
    if (!course.name) return "Nomsiz kurs";
    if (typeof course.name === 'string') return course.name;
    if (typeof course.name === 'object') {
      if (course.name.name) return course.name.name;
      if (course.name.title) return course.name.title;
      if (course.name.id) return `Kurs-${course.name.id.slice(-4)}`;
    }
    return "Nomsiz kurs";
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Narxi yo'q";
    return price.toLocaleString('uz-UZ') + " UZS";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Xatolik: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Qayta yuklash
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kurslar Ro'yxati</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Kategoriya qo'shish
          </button>
          <button
            onClick={() => setIsCourseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Kurs qo'shish
          </button>
        </div>
      </div>

      {/* Filter tugmalari */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setShowFrozen(null);
            fetchCourses();
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFrozen === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Barcha kurslar
        </button>
        <button
          onClick={() => {
            setShowFrozen(false);
            fetchCourses(false);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFrozen === false 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Faol kurslar
        </button>
        <button
          onClick={() => {
            setShowFrozen(true);
            fetchCourses(true);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFrozen === true 
              ? 'bg-blue-400 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Muzlatilgan kurslar
        </button>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-[#111111] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Jami kurslar</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
        </div>
        <div className="bg-white dark:bg-[#111111] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Jami o'quvchilar</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {courses.reduce((sum, c) => sum + (c.students_count || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-[#111111] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">O'rtacha narx</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {courses.length > 0
              ? Math.round(courses.reduce((sum, c) => sum + (c.price || 0), 0) / courses.length).toLocaleString()
              : 0} UZS
          </p>
        </div>
      </div>

      {/* Kurslar grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            Hech qanday kurs topilmadi
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className={`bg-white dark:bg-[#111111] rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                course.is_freeze 
                  ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10' 
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getCourseName(course)}
                  </h3>
                  {course.is_freeze && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <Snowflake className="w-3 h-3" />
                      Muzlatilgan
                    </span>
                  )}
                </div>
                
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {formatPrice(course.price)}
                </p>
                
                {course.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {course.description}
                  </p>
                )}
                
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
                  <span>⏱️ {course.duration || "2 yil"}</span>
                  <span>👥 {course.students_count || 0} students</span>
                </div>
                
                {/* 🟢 BARCHA TUGMALAR ISHLAYDI */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => handleEditClick(course)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCourse(course)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    O'chirish
                  </button>
                  
                  {course.is_freeze ? (
                    <button
                      onClick={() => handleUnfreezeCourse(course)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      <ThermometerSun className="w-4 h-4" />
                      Eritish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFreezeCourse(course)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      <ThermometerSnowflake className="w-4 h-4" />
                      Muzlatish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modallar */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => fetchCourses(showFrozen)}
      />

      <AddCourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={() => fetchCourses(showFrozen)}
      />

      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCourse(null);
        }}
        onSuccess={() => {
          fetchCourses(showFrozen);
          setIsEditModalOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
      />
    </div>
  );
}