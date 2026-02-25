"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2, X, Loader2 } from "lucide-react";
import { useManagers, useUpdateManager, useDeleteManager, type Manager } from "@/hooks/useManager";

export default function ManagerPage() {
  const [statusFilter, setStatusFilter] = useState<string>("Hammasi");
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    status: "",
  });

  const { 
    data: managers = [], 
    isLoading, 
    error, 
    refetch 
  } = useManagers();
  
  const updateManager = useUpdateManager();
  const deleteManager = useDeleteManager();

  const filteredManagers = statusFilter === "Hammasi"
    ? managers
    : managers.filter((manager) => manager.status === statusFilter);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openMenuIndex !== null) {
        const menuRef = menuRefs.current[openMenuIndex];
        if (menuRef && !menuRef.contains(event.target as Node)) {
          setOpenMenuIndex(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuIndex]);

  const handleEditClick = (manager: Manager) => {
    setSelectedManager(manager);
    setEditForm({
      first_name: manager.first_name,
      last_name: manager.last_name,
      email: manager.email,
      role: manager.role,
      status: manager.status,
    });
    setModalType("edit");
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleDeleteClick = (manager: Manager) => {
    setSelectedManager(manager);
    setModalType("delete");
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedManager) return;
    
    const targetId = selectedManager.id || selectedManager._id;
    
    if (!targetId) {
      toast.error("Manager identifikatori (ID) topilmadi!");
      return;
    }

    updateManager.mutate({
      _id: targetId as string,
      first_name: editForm.first_name,
      last_name: editForm.last_name,
      email: editForm.email,
      status: editForm.status,
      role: editForm.role,
    });

    setIsModalOpen(false);
    setSelectedManager(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedManager) return;
    
    const targetId = selectedManager.id || selectedManager._id;
    
    if (!targetId) {
      toast.error("Manager identifikatori (ID) topilmadi!");
      return;
    }

    deleteManager.mutate(targetId as string);
    setIsModalOpen(false);
    setSelectedManager(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "faol":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "ta'tilda":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "ishdan bo'shatilgan":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-500 dark:text-gray-400">Managerlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        <p>Xatolik: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">Managerlar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Jami {filteredManagers.length} ta manager
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Hammasi">Hammasi</option>
            <option value="faol">Faol</option>
            <option value="ishdan bo'shatilgan">Ishdan bo'shatilgan</option>
            <option value="ta'tilda">Ta'tilda</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ism</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Familiya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Managerlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager, index) => (
                  <tr key={manager.id || manager._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {manager.first_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {manager.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {manager.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {manager.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(manager.status)}`}>
                        {manager.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 relative">
                      <button 
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setOpenMenuIndex(openMenuIndex === index ? null : index);
                        }}
                        disabled={updateManager.isPending || deleteManager.isPending}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {openMenuIndex === index && (
                        <div 
                          ref={(el) => {
                            menuRefs.current[index] = el;
                          }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(manager);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-lg flex items-center gap-2"
                            disabled={updateManager.isPending}
                          >
                            <Edit className="w-4 h-4" />
                            Tahrirlash
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(manager);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg flex items-center gap-2"
                            disabled={deleteManager.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                            O'chirish
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] transition-opacity duration-300">
          <div className="bg-white dark:bg-[#111111] rounded-2xl max-w-md w-full mx-4 shadow-2xl shadow-black/50 border border-gray-200 dark:border-gray-800 transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">
                {modalType === "edit" ? "Manager tahrirlash" : "Manager o'chirish"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                disabled={updateManager.isPending || deleteManager.isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {modalType === "edit" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ism</label>
                    <input
                      type="text"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      disabled={updateManager.isPending}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Familiya</label>
                    <input
                      type="text"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      disabled={updateManager.isPending}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      disabled={updateManager.isPending}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Rol</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      disabled={updateManager.isPending}
                    >
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Ustoz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Holat</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      disabled={updateManager.isPending}
                    >
                      <option value="faol">Faol</option>
                      <option value="ta'tilda">Ta'tilda</option>
                      <option value="ishdan bo'shatilgan">Ishdan bo'shatilgan</option>
                    </select>
                  </div>
                </div>
              ) : (
                <p className="text-center text-lg py-4">
                  <span className="font-semibold">{selectedManager?.first_name} {selectedManager?.last_name}</span> ni o'chirmoqchimisiz?
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20 rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all"
                disabled={updateManager.isPending || deleteManager.isPending}
              >
                Bekor qilish
              </button>
              <button
                onClick={modalType === "edit" ? handleSaveEdit : handleConfirmDelete}
                disabled={updateManager.isPending || deleteManager.isPending}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                  modalType === "edit" 
                    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 disabled:bg-blue-400" 
                    : "bg-red-600 hover:bg-red-700 shadow-red-500/30 disabled:bg-red-400"
                }`}
              >
                {(updateManager.isPending || deleteManager.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {modalType === "edit" ? "Saqlash" : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}