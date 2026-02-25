"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, X, Search, UserPlus, RefreshCw, MoreHorizontal, Info, Calendar, Loader2 } from "lucide-react";
import { 
  useStudents, 
  useGroups, 
  useCreateStudent, 
  useDeleteStudent, 
  useReturnStudent, 
  useLeaveStudent,
  type Student,
  type Group
} from "@/hooks/useStudent";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function StudentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("Hammasi");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "delete" | "return" | "info" | "vacation" | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    status: "faol",
    group_id: "",
  });

  const [vacationData, setVacationData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  // TanStack Query hooks
  const { 
    data: students = [], 
    isLoading: studentsLoading, 
    error: studentsError,
    refetch: refetchStudents
  } = useStudents();
  
  const { 
    data: groups = [], 
    isLoading: groupsLoading 
  } = useGroups();
  
  const createStudent = useCreateStudent();
  const deleteStudent = useDeleteStudent();
  const returnStudent = useReturnStudent();
  const leaveStudent = useLeaveStudent();

  const isLoading = studentsLoading || groupsLoading;
  const isPending = createStudent.isPending || deleteStudent.isPending || returnStudent.isPending || leaveStudent.isPending;

  // Tashqariga bosilganda menyuni yopish
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter va qidiruv
  const filteredStudents = students.filter((student) => {
    const matchesStatus = statusFilter === "Hammasi" || 
      student.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesSearch = searchQuery === "" || 
      student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Modal funksiyalari
  const handleAddClick = () => {
    setForm({
      first_name: "",
      last_name: "",
      phone: "",
      status: "faol",
      group_id: "",
    });
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setModalType("delete");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleReturnClick = (student: Student) => {
    setSelectedStudent(student);
    setModalType("return");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleVacationClick = (student: Student) => {
    setSelectedStudent(student);
    setVacationData({
      start_date: "",
      end_date: "",
      reason: "",
    });
    setModalType("vacation");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleInfoClick = (student: Student) => {
    setSelectedStudent(student);
    setModalType("info");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // YANGI STUDENT QO'SHISH
  const handleSaveAdd = async () => {
    if (!form.first_name || !form.last_name || !form.phone || !form.group_id) {
      toast.error("Ism, familiya, telefon va guruhni to'ldiring!");
      return;
    }

    createStudent.mutate({
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      groups: [{ group: form.group_id }]
    });

    setIsModalOpen(false);
  };

  // TA'TILGA CHIQARISH
  const handleVacation = async () => {
    if (!selectedStudent) return;
    const targetId = selectedStudent.id || selectedStudent._id;
    if (!targetId) return toast.error("Student ID topilmadi!");

    if (!vacationData.start_date || !vacationData.end_date || !vacationData.reason) {
      toast.error("Barcha ta'til ma'lumotlarini to'ldiring!");
      return;
    }

    leaveStudent.mutate({
      _id: targetId as string,
      ...vacationData,
    });

    setIsModalOpen(false);
  };

  // QAYTARISH (faollashtirish)
  const handleReturn = async () => {
    if (!selectedStudent) return;
    const targetId = selectedStudent.id || selectedStudent._id;
    if (!targetId) return toast.error("Student ID topilmadi!");

    returnStudent.mutate({
      _id: targetId as string,
    });

    setIsModalOpen(false);
  };

  // O'CHIRISHNI TASDIQLASH
  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    const targetId = selectedStudent.id || selectedStudent._id;
    if (!targetId) return toast.error("Student ID topilmadi!");

    deleteStudent.mutate(targetId as string);
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "faol":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "ta'tilda":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "yakunladi":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 dark:text-gray-400">Studentlar yuklanmoqda...</p>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        <p>Xatolik: {studentsError.message}</p>
        <button 
          onClick={() => refetchStudents()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Studentlar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Jami {filteredStudents.length} ta student
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            onClick={handleAddClick}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            Qo'shish
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
          >
            <option value="Hammasi">Hammasi</option>
            <option value="faol">Faol</option>
            <option value="ta'tilda">Ta'tilda</option>
            <option value="yakunladi">Yakunladi</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ism</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Familiya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guruhlar soni</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? "Bunday ma'lumot topilmadi" : "Studentlar topilmadi"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentId = student.id || student._id;
                  return (
                    <tr
                      key={studentId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.first_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.phone || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.groups_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full uppercase tracking-wider ${getStatusBadge(student.status)}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === studentId ? null : studentId)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          disabled={isPending}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {openMenuId === studentId && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50"
                          >
                            {student.status === "faol" && (
                              <>
                                <button
                                  onClick={() => handleVacationClick(student)}
                                  className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-2"
                                  disabled={isPending}
                                >
                                  <Calendar className="w-4 h-4" />
                                  Ta'tilga chiqarish
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(student)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                  disabled={isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  O'chirish
                                </button>
                              </>
                            )}

                            {student.status === "ta'tilda" && (
                              <button
                                onClick={() => handleReturnClick(student)}
                                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                                disabled={isPending}
                              >
                                <RefreshCw className="w-4 h-4" />
                                Qaytarish
                              </button>
                            )}

                            {student.status === "yakunladi" && (
                              <button
                                onClick={() => handleDeleteClick(student)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                disabled={isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                                O'chirish
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleInfoClick(student)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                              disabled={isPending}
                            >
                              <Info className="w-4 h-4" />
                              Info
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111111] rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">
                {modalType === "add" && "Yangi student qo'shish"}
                {modalType === "delete" && "Studentni o'chirish"}
                {modalType === "return" && "Studentni qaytarish"}
                {modalType === "vacation" && "Studentni ta'tilga chiqarish"}
                {modalType === "info" && "Student ma'lumotlari"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                disabled={isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {modalType === "add" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ism</label>
                      <input
                        type="text"
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                        disabled={isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Familiya</label>
                      <input
                        type="text"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="+998901234567"
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Guruh</label>
                    <select
                      value={form.group_id}
                      onChange={(e) => setForm({ ...form, group_id: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      disabled={isPending || groupsLoading}
                    >
                      <option value="">Guruhni tanlang</option>
                      {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.name || group.title || group.course_name || "Guruh"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Holat</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      disabled={isPending}
                    >
                      <option value="faol">Faol</option>
                      <option value="ta'tilda">Ta'tilda</option>
                      <option value="yakunladi">Yakunladi</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === "vacation" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Boshlanish sanasi</label>
                    <input
                      type="date"
                      value={vacationData.start_date}
                      onChange={(e) => setVacationData({ ...vacationData, start_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tugash sanasi</label>
                    <input
                      type="date"
                      value={vacationData.end_date}
                      onChange={(e) => setVacationData({ ...vacationData, end_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sabab</label>
                    <textarea
                      value={vacationData.reason}
                      onChange={(e) => setVacationData({ ...vacationData, reason: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={3}
                      placeholder="Ta'til sababini kiriting"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>
              )}

              {modalType === "info" && selectedStudent && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ism</p>
                      <p className="font-medium">{selectedStudent.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Familiya</p>
                      <p className="font-medium">{selectedStudent.last_name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                    <p className="font-medium">{selectedStudent.phone || "—"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Guruhlar soni</p>
                    <p className="font-medium">{selectedStudent.groups_count || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Holat</p>
                    <p className={`font-medium ${getStatusBadge(selectedStudent.status)}`}>
                      {selectedStudent.status}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                    <p className="font-mono text-xs break-all">{selectedStudent._id}</p>
                  </div>
                </div>
              )}

              {(modalType === "delete" || modalType === "return") && (
                <div className="text-center py-4">
                  <p className="text-lg">
                    <span className="font-semibold text-red-500">
                      {selectedStudent?.first_name} {selectedStudent?.last_name}
                    </span>{" "}
                    {modalType === "delete" ? "ni o'chirmoqchimisiz?" : "ni qaytarmoqchimisiz?"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {modalType === "delete" 
                      ? "Bu jarayonni orqaga qaytarib bo'lmaydi." 
                      : "Student faol holatga o'tkaziladi."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all"
                disabled={isPending}
              >
                Bekor qilish
              </button>
              
              {modalType !== "info" && (
                <button
                  onClick={
                    modalType === "add" 
                      ? handleSaveAdd 
                      : modalType === "delete" 
                      ? handleConfirmDelete 
                      : modalType === "return"
                      ? handleReturn
                      : handleVacation
                  }
                  disabled={isPending}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all flex items-center gap-2 ${
                    modalType === "add"
                      ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                      : modalType === "return"
                      ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                      : modalType === "vacation"
                      ? "bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400"
                      : "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  }`}
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalType === "add" && "Qo'shish"}
                  {modalType === "delete" && "O'chirish"}
                  {modalType === "return" && "Qaytarish"}
                  {modalType === "vacation" && "Ta'tilga chiqarish"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}