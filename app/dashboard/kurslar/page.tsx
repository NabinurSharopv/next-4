"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Snowflake, X, Save, ThermometerSnowflake, ThermometerSun, Loader2 } from "lucide-react";
import { 
  useCourses, 
  useCreateCategory, 
  useCreateCourse, 
  useEditCourse, 
  useFreezeCourse, 
  useUnfreezeCourse, 
  useDeleteCourse,
  type Course 
} from "@/hooks/useCourse";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

function AddCategoryModal({ isOpen, onClose, onSuccess, mutation }: any) {
  const [categoryName, setCategoryName] = useState("");

  if (!isOpen) return null;

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Kategoriya nomini kiriting!");
      return;
    }

    mutation.mutate({ name: categoryName.trim() });
    setCategoryName("");
    onClose();
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
              disabled={mutation.isPending}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            Bekor qilish
          </button>
          <button
            onClick={handleAddCategory}
            disabled={mutation.isPending || !categoryName.trim()}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 flex items-center gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {mutation.isPending ? "Qo'shilmoqda..." : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCourseModal({ isOpen, onClose, onSuccess, mutation }: any) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });

  if (!isOpen) return null;

  const handleAddCourse = async () => {
    if (!formData.name.trim()) {
      toast.error("Kurs nomini kiriting!");
      return;
    }

    mutation.mutate({
      name: formData.name.trim(),
      description: formData.description || "Yangi kurs",
      duration: formData.duration || "2 yil",
      price: formData.price ? Number(formData.price) : 1000000,
    });

    setFormData({ name: "", description: "", duration: "", price: "" });
    onClose();
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
              disabled={mutation.isPending}
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
              disabled={mutation.isPending}
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
              disabled={mutation.isPending}
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
              disabled={mutation.isPending}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            Bekor qilish
          </button>
          <button
            onClick={handleAddCourse}
            disabled={mutation.isPending || !formData.name.trim()}
            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 flex items-center gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {mutation.isPending ? "Qo'shilmoqda..." : "Kurs qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCourseModal({ isOpen, onClose, onSuccess, course, mutation }: any) {
  const [formData, setFormData] = useState({
    duration: "",
    price: "",
  });

  if (course && isOpen && !formData.duration) {
    setFormData({
      duration: course.duration || "",
      price: course.price?.toString() || "",
    });
  }

  if (!isOpen) return null;

  const handleEditCourse = async () => {
    if (!formData.duration || !formData.price) {
      toast.error("Duration va price ni kiriting!");
      return;
    }

    mutation.mutate({
      course_id: course._id,
      duration: formData.duration,
      price: Number(formData.price),
    });

    onClose();
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

          {course?.description && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <p className="font-medium">{course.description}</p>
            </div>
          )}

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
              disabled={mutation.isPending}
            />
          </div>

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
              disabled={mutation.isPending}
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
            disabled={mutation.isPending || !formData.duration || !formData.price}
            className="px-5 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-xl disabled:opacity-50 flex items-center gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {mutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [showFrozen, setShowFrozen] = useState<boolean | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { 
    data: courses = [], 
    isLoading, 
    error, 
    refetch 
  } = useCourses(showFrozen === null ? undefined : showFrozen);
  
  const createCategory = useCreateCategory();
  const createCourse = useCreateCourse();
  const editCourse = useEditCourse();
  const freezeCourse = useFreezeCourse();
  const unfreezeCourse = useUnfreezeCourse();
  const deleteCourse = useDeleteCourse();

  const isPending = 
    createCategory.isPending || 
    createCourse.isPending || 
    editCourse.isPending || 
    freezeCourse.isPending || 
    unfreezeCourse.isPending || 
    deleteCourse.isPending;

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

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`"${getCourseName(course)}" kursini o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    deleteCourse.mutate({ course_id: course._id });
  };

  const handleFreezeCourse = async (course: Course) => {
    freezeCourse.mutate({ course_id: course._id });
  };

  const handleUnfreezeCourse = async (course: Course) => {
    unfreezeCourse.mutate({ course_id: course._id });
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 dark:text-gray-400">Kurslar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Xatolik: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Qayta yuklash
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kurslar Ro'yxati</h1>
          <p className="text-gray-600 dark:text-gray-400">Jami {courses.length} ta kurs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Kategoriya qo'shish
          </button>
          <button
            onClick={() => setIsCourseModalOpen(true)}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Kurs qo'shish
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowFrozen(null)}
          disabled={isPending}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFrozen === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          } disabled:opacity-50`}
        >
          Barcha kurslar
        </button>
        <button
          onClick={() => setShowFrozen(false)}
          disabled={isPending}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFrozen === false 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          } disabled:opacity-50`}
        >
          Faol kurslar
        </button>
        <button
          onClick={() => setShowFrozen(true)}
          disabled={isPending}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFrozen === true 
              ? 'bg-blue-400 text-white' 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          } disabled:opacity-50`}
        >
          Muzlatilgan kurslar
        </button>
      </div>

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
                
                {/* Tugmalar */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => handleEditClick(course)}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors disabled:opacity-50"
                  >
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCourse(course)}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    O'chirish
                  </button>
                  
                  {course.is_freeze ? (
                    <button
                      onClick={() => handleUnfreezeCourse(course)}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors disabled:opacity-50"
                    >
                      <ThermometerSun className="w-4 h-4" />
                      Eritish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFreezeCourse(course)}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors disabled:opacity-50"
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

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {}}
        mutation={createCategory}
      />

      <AddCourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={() => {}}
        mutation={createCourse}
      />

      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCourse(null);
        }}
        onSuccess={() => {}}
        course={selectedCourse}
        mutation={editCourse}
      />
    </div>
  );
}