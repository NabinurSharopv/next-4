"use client";

import { useEffect, useState, useRef } from "react";
import { X, UserPlus, MoreHorizontal, Clock, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { 
  useGroups, 
  useTeachers, 
  useCreateGroup, 
  useEndGroup,
  type Group,
  type Teacher 
} from "@/hooks/useGroup";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function GroupsPage() {
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "setEndDate" | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  // Dropdown menyu uchun
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Form
  const [form, setForm] = useState({
    teacher_id: "",
    started_group: "",
    end_date: "",
  });

  // TanStack Query hooks
  const { 
    data: groups = [], 
    isLoading: groupsLoading, 
    error: groupsError,
    refetch: refetchGroups
  } = useGroups();
  
  const { 
    data: teachers = [], 
    isLoading: teachersLoading 
  } = useTeachers();
  
  const createGroup = useCreateGroup();
  const endGroup = useEndGroup();

  const isLoading = groupsLoading || teachersLoading;
  const isPending = createGroup.isPending || endGroup.isPending;

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

  // Modal funksiyalari
  const handleAddClick = () => {
    setForm({
      teacher_id: "",
      started_group: "",
      end_date: "",
    });
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleSetEndDateClick = (group: Group) => {
    setSelectedGroup(group);
    let initialDate = "";
    if (group.end_group) {
      const date = new Date(group.end_group);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      initialDate = `${year}-${month}-${day}`;
    }
    
    setForm({
      ...form,
      end_date: initialDate,
    });
    setModalType("setEndDate");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // GURUHNI TUGATISH (HOZIRGI KUN BILAN)
  const handleEndGroupNow = async (group: Group) => {
    if (!group) return;
    
    const targetId = group.id || group._id;
    if (!targetId) {
      toast.error("Guruh ID topilmadi!");
      return;
    }

    if (!confirm(`"${group.name}" guruhini hozir tugatishni tasdiqlaysizmi?`)) {
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    endGroup.mutate({
      _id: targetId as string,
      date: dateStr,
    });

    setOpenMenuId(null);
  };

  // YANGI GURUH QO'SHISH
  const handleSaveAdd = async () => {
    if (!form.teacher_id || !form.started_group) {
      toast.error("Ustoz va boshlanish vaqtini to'ldiring!");
      return;
    }

    createGroup.mutate({
      teacher: form.teacher_id,
      started_group: new Date(form.started_group).toISOString(),
      course_id: "681dcb7444fa70421ae9fb9d", // Postmandagi course_id
    });

    setIsModalOpen(false);
  };

  // TUGASH VAQTINI BELGILASH (FAQAT SANA)
  const handleSaveEndDate = async () => {
    if (!selectedGroup) return;
    
    const targetId = selectedGroup.id || selectedGroup._id;
    if (!targetId) {
      toast.error("Guruh ID topilmadi!");
      return;
    }

    if (!form.end_date) {
      toast.error("Tugash sanasini kiriting!");
      return;
    }

    endGroup.mutate({
      _id: targetId as string,
      date: form.end_date,
    });

    setIsModalOpen(false);
  };

  // Vaqtni formatlash
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "—";
      
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'Asia/Tashkent'
      };
      
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      return "—";
    }
  };

  const getTeacherName = (teacher: any) => {
    if (!teacher) return "—";
    if (typeof teacher === 'object') {
      return `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || "—";
    }
    return teacher;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 dark:text-gray-400">Guruhlar yuklanmoqda...</p>
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        <p>Xatolik: {groupsError.message}</p>
        <button 
          onClick={() => refetchGroups()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Guruhlar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Jami {groups.length} ta guruh
          </p>
        </div>
        <button
          onClick={handleAddClick}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          Yangi guruh
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guruh nomi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ustoz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">O'quvchilar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Boshlangan vaqt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tugagan vaqt</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {groups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Guruhlar topilmadi
                  </td>
                </tr>
              ) : (
                groups.map((group, index) => {
                  const groupId = group.id || group._id;
                  return (
                    <tr
                      key={groupId || index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {group.name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {getTeacherName(group.teacher)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {group.students?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(group.started_group)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(group.end_group)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === groupId ? null : groupId)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          disabled={isPending}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {openMenuId === groupId && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 py-1"
                          >
                            <button
                              onClick={() => handleSetEndDateClick(group)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                              disabled={isPending}
                            >
                              <Clock className="w-4 h-4" />
                              Tugash vaqtini belgilash
                            </button>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                            
                            <button
                              onClick={() => handleEndGroupNow(group)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                              disabled={isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-medium">Guruhni hozir tugatish</span>
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

      {/* QO'SHISH MODALI */}
      {isModalOpen && modalType === "add" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111111] rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">Yangi guruh qo'shish</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                disabled={isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ustoz</label>
                  <select
                    value={form.teacher_id}
                    onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                    disabled={isPending || teachersLoading}
                  >
                    <option value="">Ustozni tanlang</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.first_name} {teacher.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Boshlanish vaqti</label>
                  <input
                    type="datetime-local"
                    value={form.started_group}
                    onChange={(e) => setForm({ ...form, started_group: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                    disabled={isPending}
                  />
                </div>
                
                <p className="text-xs text-blue-500 mt-2">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Guruh nomi avtomatik yaratiladi
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all"
                disabled={isPending}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveAdd}
                disabled={isPending}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TUGASH VAQTINI BELGILASH MODALI */}
      {isModalOpen && modalType === "setEndDate" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111111] rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">Tugash vaqtini belgilash</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                disabled={isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="font-medium">{selectedGroup?.name}</span> guruhi uchun tugash sanasini belgilang
              </p>
              <div>
                <label className="block text-sm font-medium mb-1">Tugash sanasi</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  disabled={isPending}
                />
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Faqat sana qabul qilinadi, vaqt hisobga olinmaydi!
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all"
                disabled={isPending}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveEndDate}
                disabled={isPending}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Belgilash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}