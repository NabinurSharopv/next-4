"use client";

import { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  X,
  Search,
  UserPlus,
  MoreHorizontal,
  RefreshCw,
  Info,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
  useLeaveAdmin,
  useReturnAdmin,
  type Admin,
} from "@/hooks/useAdmin";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function AdminPage() {
  const [statusFilter, setStatusFilter] = useState<string>("Hammasi");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "add" | "edit" | "delete" | "return" | "vacation" | "info" | null
  >(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "admin",
    status: "faol",
    password: "",
  });

  const [vacationData, setVacationData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const { data: admins = [], isLoading, error, refetch } = useAdmins();

  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const leaveAdmin = useLeaveAdmin();
  const returnAdmin = useReturnAdmin();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAdmins = admins.filter((admin) => {
    const matchesStatus =
      statusFilter === "Hammasi" ||
      admin.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      admin.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleAddClick = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      role: "admin",
      status: "faol",
      password: "",
    });
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleEditClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setForm({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      password: "",
    });
    setModalType("edit");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalType("delete");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleReturnClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalType("return");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleVacationClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setVacationData({
      start_date: "",
      end_date: "",
      reason: "",
    });
    setModalType("vacation");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleInfoClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalType("info");
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveAdd = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email noto'g'ri formatda!");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Parol kamida 6 belgidan iborat bo'lishi kerak!");
      return;
    }

    createAdmin.mutate({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      role: form.role,
      status: form.status,
      password: form.password,
      work_date: new Date().toISOString().split("T")[0],
      is_deleted: false,
    });

    setIsModalOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedAdmin) return;
    const targetId = selectedAdmin.id || selectedAdmin._id;
    if (!targetId) return toast.error("Admin ID topilmadi!");

    if (!form.first_name || !form.last_name || !form.email) {
      toast.error("Ism, familiya va email to'ldirilishi shart!");
      return;
    }

    updateAdmin.mutate({
      _id: targetId as string,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      status: form.status,
    });

    setIsModalOpen(false);
  };

  const handleVacation = async () => {
    if (!selectedAdmin) return;
    const targetId = selectedAdmin.id || selectedAdmin._id;
    if (!targetId) return toast.error("Admin ID topilmadi!");

    if (
      !vacationData.start_date ||
      !vacationData.end_date ||
      !vacationData.reason
    ) {
      toast.error("Barcha ta'til ma'lumotlarini to'ldiring!");
      return;
    }

    leaveAdmin.mutate({
      _id: targetId as string,
      ...vacationData,
    });

    setIsModalOpen(false);
  };

  const handleReturn = async () => {
    if (!selectedAdmin) return;
    const targetId = selectedAdmin.id || selectedAdmin._id;
    if (!targetId) return toast.error("Admin ID topilmadi!");

    returnAdmin.mutate(targetId as string);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;
    const targetId = selectedAdmin.id || selectedAdmin._id;
    if (!targetId) return toast.error("Admin ID topilmadi!");

    deleteAdmin.mutate(targetId as string);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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

  const isPending =
    createAdmin.isPending ||
    updateAdmin.isPending ||
    deleteAdmin.isPending ||
    leaveAdmin.isPending ||
    returnAdmin.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 dark:text-gray-400">
          Adminlar yuklanmoqda...
        </p>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Adminlar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Jami {filteredAdmins.length} ta admin
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  F.I.SH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchQuery
                      ? "Bunday ma'lumot topilmadi"
                      : "Adminlar topilmadi"}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => {
                  const adminId = admin.id || admin._id;
                  return (
                    <tr
                      key={adminId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {admin.first_name} {admin.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {admin.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full uppercase tracking-wider ${getStatusBadge(
                            admin.status,
                          )}`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === adminId ? null : adminId,
                            )
                          }
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          disabled={isPending}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {openMenuId === adminId && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 divide-y divide-gray-200 dark:divide-gray-800"
                          >
                            <button
                              onClick={() => handleEditClick(admin)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                              disabled={isPending}
                            >
                              <Edit className="w-4 h-4 text-blue-500" />
                              <span>Tahrirlash</span>
                            </button>

                            {admin.status === "faol" && (
                              <>
                                <button
                                  onClick={() => handleVacationClick(admin)}
                                  className="w-full text-left px-4 py-3 text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-3 transition-colors"
                                  disabled={isPending}
                                >
                                  <Calendar className="w-4 h-4" />
                                  <span>Ta'tilga chiqarish</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(admin)}
                                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                                  disabled={isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>O'chirish</span>
                                </button>
                              </>
                            )}

                            {(admin.status === "ishdan bo'shatilgan" ||
                              admin.status === "ta'tilda") && (
                              <button
                                onClick={() => handleReturnClick(admin)}
                                className="w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-3 transition-colors"
                                disabled={isPending}
                              >
                                <RefreshCw className="w-4 h-4" />
                                <span>Ishga qaytarish</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleInfoClick(admin)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                              disabled={isPending}
                            >
                              <Info className="w-4 h-4" />
                              <span>Info</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111111] rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">
                {modalType === "add" && "Yangi admin qo'shish"}
                {modalType === "edit" && "Adminni tahrirlash"}
                {modalType === "delete" && "Adminni o'chirish"}
                {modalType === "return" && "Adminni ishga qaytarish"}
                {modalType === "vacation" && "Adminni ta'tilga chiqarish"}
                {modalType === "info" && "Admin ma'lumotlari"}
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
                      : modalType === "edit"
                        ? handleSaveEdit
                        : modalType === "delete"
                          ? handleConfirmDelete
                          : modalType === "return"
                            ? handleReturn
                            : handleVacation
                  }
                  disabled={isPending}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all flex items-center gap-2 ${
                    modalType === "add" || modalType === "edit"
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
                  {modalType === "edit" && "Saqlash"}
                  {modalType === "delete" && "O'chirish"}
                  {modalType === "return" && "Ishga qaytarish"}
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
