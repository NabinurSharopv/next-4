"use client";

import { useEffect, useState, useRef } from "react";
import { Edit, Trash2, X, Search, UserPlus, MoreHorizontal, RefreshCw, Info, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface Admin {
  id?: number | string;
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter va qidiruv
  const [statusFilter, setStatusFilter] = useState<string>("Hammasi");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Dropdown menyu uchun
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | "return" | "vacation" | "info" | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  
  // Form
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "admin",
    status: "faol",
    password: "",
  });

  // Ta'til uchun qo'shimcha state
  const [vacationData, setVacationData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const API_BASE_URL = "https://admin-crm.onrender.com/api/staff";

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

  // Ma'lumotlarni yuklash
  const fetchAdmins = async (showToast = false) => {
    try {
      const token = getCookie("token");
      if (!token) {
        setError("Token topilmadi. Iltimos, qayta login qiling.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/all-admins`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setError("Ruxsat berilmadi. Iltimos, qayta login qiling.");
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error(data.message || "Ma'lumotlarni olishda xatolik");

      const adminsData = data.data || data;
      setAdmins(adminsData);
      setFilteredAdmins(adminsData);
      
      if (showToast) {
        toast.success("Ma'lumotlar yangilandi!", {
          duration: 2000,
          icon: "✅",
        });
      }
    } catch (err: any) {
      setError(err.message || "Serverga ulanishda xatolik");
      toast.error(err.message || "Serverga ulanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter va qidiruv
  useEffect(() => {
    let result = admins;

    if (statusFilter !== "Hammasi") {
      result = result.filter((admin) => admin.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (admin) =>
          admin.first_name.toLowerCase().includes(query) ||
          admin.last_name.toLowerCase().includes(query) ||
          admin.email.toLowerCase().includes(query)
      );
    }

    setFilteredAdmins(result);
  }, [statusFilter, searchQuery, admins]);

  // Modal funksiyalari
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

  // YANGI ADMIN QO'SHISH
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

    try {
      const token = getCookie("token");
      
      const requestBody = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        role: form.role,
        status: form.status,
        password: form.password,
        work_date: new Date().toISOString().split("T")[0],
        is_deleted: false,
      };

      console.log("Yuborilayotgan ma'lumotlar:", requestBody);

      const response = await fetch(`${API_BASE_URL}/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Server javobi:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Qo'shishda xatolik!");
      }

      setIsModalOpen(false);
      toast.success("Yangi admin muvaffaqiyatli qo'shildi!", {
        duration: 3000,
        icon: "🎉",
      });
      
      fetchAdmins(true);
    } catch (err: any) {
      console.error("Xatolik:", err);
      toast.error(err.message);
    }
  };

  // TAHRIRLASHNI SAQLASH
  const handleSaveEdit = async () => {
    if (!selectedAdmin) return;
    const targetId = selectedAdmin.id || selectedAdmin._id;
    if (!targetId) return toast.error("Admin ID topilmadi!");

    if (!form.first_name || !form.last_name || !form.email) {
      toast.error("Ism, familiya va email to'ldirilishi shart!");
      return;
    }

    try {
      const token = getCookie("token");
      
      const requestBody = {
        _id: targetId,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        status: form.status,
      };

      console.log("Tahrirlash ma'lumotlari:", requestBody);

      const response = await fetch(`${API_BASE_URL}/edited-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Tahrirlash javobi:", data);

      if (!response.ok) throw new Error(data.message || "Tahrirlash xatosi!");

      setAdmins(prev => prev.map(admin => 
        (admin.id || admin._id) === targetId
          ? { ...admin, ...requestBody }
          : admin
      ));
      
      setFilteredAdmins(prev => prev.map(admin => 
        (admin.id || admin._id) === targetId
          ? { ...admin, ...requestBody }
          : admin
      ));

      setIsModalOpen(false);
      toast.success("Muvaffaqiyatli tahrirlandi!", {
        duration: 3000,
        icon: "✅",
      });
      
      fetchAdmins(true);
    } catch (err: any) {
      console.error("Xatolik:", err);
      toast.error(err.message);
    }
  };

  // TA'TILGA CHIQARISH (leave-staff)
  const handleVacation = async () => {
    if (!selectedAdmin) return;
    const targetId = selectedAdmin.id || selectedAdmin._id;
    if (!targetId) return toast.error("Admin ID topilmadi!");

    if (!vacationData.start_date || !vacationData.end_date || !vacationData.reason) {
      toast.error("Barcha ta'til ma'lumotlarini to'ldiring!");
      return;
    }

    try {
      const token = getCookie("token");
      
      const requestBody = {
        _id: targetId,
        start_date: vacationData.start_date,
        end_date: vacationData.end_date,
        reason: vacationData.reason,
      };

      console.log("Ta'tilga chiqarish:", requestBody);

      const response = await fetch(`${API_BASE_URL}/leave-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (response.ok) {
        setAdmins(prev => prev.map(admin => 
          (admin.id || admin._id) === targetId 
            ? { ...admin, status: "ta'tilda" } 
            : admin
        ));
        
        setFilteredAdmins(prev => prev.map(admin => 
          (admin.id || admin._id) === targetId 
            ? { ...admin, status: "ta'tilda" } 
            : admin
        ));

        setIsModalOpen(false);
        toast.success("Admin ta'tilga chiqarildi!", {
          duration: 3000,
          icon: "🌴",
        });
        
        fetchAdmins(true);
      } else {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || "Ta'tilga chiqarish xatosi!");
      }
    } catch (err: any) {
      console.error("Xatolik:", err);
      toast.error(err.message);
    }
  };

const handleReturn = async () => {
  if (!selectedAdmin) return;
  const targetId = selectedAdmin.id || selectedAdmin._id;
  if (!targetId) return toast.error("Admin ID topilmadi!");

  console.log("Admin statusi (frontend):", selectedAdmin.status);
  
  try {
    const token = getCookie("token");
    
    const requestBody = {
      _id: targetId,
    };

    console.log("Ishga qaytarish so'rovi:", requestBody);

    // ✅ TO'G'RI ENDPOINT: leave-exit-staff
    const response = await fetch(`${API_BASE_URL}/leave-exit-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Response text:", responseText);

    if (response.ok) {
      await fetchAdmins(true);
      setIsModalOpen(false);
      toast.success("Admin muvaffaqiyatli ishga qaytarildi!");
    } else {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.message || "Ishga qaytarish xatosi!");
    }
  } catch (err: any) {
    console.error("Xatolik:", err);
    toast.error(err.message);
  }
};

  // O'CHIRISHNI TASDIQLASH (deleted-admin)
  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;
    const targetId = selectedAdmin.id || selectedAdmin._id;
    if (!targetId) return toast.error("Admin ID topilmadi!");

    try {
      const token = getCookie("token");

      const requestBody = {
        _id: targetId,
      };

      console.log("O'chirish:", requestBody);

      const response = await fetch(`${API_BASE_URL}/deleted-admin`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log("Server javobi:", responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || "O'chirish xatosi!");
      }

      setAdmins(admins.filter((a) => (a.id || a._id) !== targetId));
      setIsModalOpen(false);
      setSelectedAdmin(null);

      toast.success("Muvaffaqiyatli o'chirildi!", {
        duration: 3000,
        icon: "🗑️",
      });
    } catch (err: any) {
      console.error("Xatolik:", err);
      toast.error(err.message || "Xatolik yuz berdi");
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        <p>Xatolik: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Adminlar</h1>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Qidiruv */}
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

          {/* Qo'shish */}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Qo'shish
          </button>

          {/* Filter */}
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

      {/* TABLE */}
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? "Bunday ma'lumot topilmadi" : "Adminlar topilmadi"}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id || admin._id}
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
                          admin.status
                        )}`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === (admin.id || admin._id) ? null : (admin.id || admin._id))}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {openMenuId === (admin.id || admin._id) && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 divide-y divide-gray-200 dark:divide-gray-800"
                        >
                          <button
                            onClick={() => handleEditClick(admin)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                            <span>Tahrirlash</span>
                          </button>

                          {admin.status === "faol" && (
                            <>
                              <button
                                onClick={() => handleVacationClick(admin)}
                                className="w-full text-left px-4 py-3 text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-3 transition-colors"
                              >
                                <Calendar className="w-4 h-4" />
                                <span>Ta'tilga chiqarish</span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(admin)}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>O'chirish</span>
                              </button>
                            </>
                          )}

                          {(admin.status === "ishdan bo'shatilgan" || admin.status === "ta'tilda") && (
                            <button
                              onClick={() => handleReturnClick(admin)}
                              className="w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-3 transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Ishga qaytarish</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleInfoClick(admin)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                          >
                            <Info className="w-4 h-4" />
                            <span>Info</span>
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

      {/* MODAL */}
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
                        placeholder="Ismni kiriting"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Familiya</label>
                      <input
                        type="text"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Familiyani kiriting"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Email manzilini kiriting"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Parol</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Parolni kiriting"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Rol</label>
                      <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="teacher">Ustoz</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Holat</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="faol">Faol</option>
                        <option value="ta'tilda">Ta'tilda</option>
                        <option value="ishdan bo'shatilgan">Ishdan bo'shatilgan</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "edit" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ism</label>
                      <input
                        type="text"
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Familiya</label>
                      <input
                        type="text"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Holat</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="faol">Faol</option>
                      <option value="ta'tilda">Ta'tilda</option>
                      <option value="ishdan bo'shatilgan">Ishdan bo'shatilgan</option>
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
                    />
                  </div>
                </div>
              )}

              {modalType === "info" && selectedAdmin && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ism</p>
                      <p className="font-medium">{selectedAdmin.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Familiya</p>
                      <p className="font-medium">{selectedAdmin.last_name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{selectedAdmin.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rol</p>
                    <p className="font-medium capitalize">{selectedAdmin.role}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Holat</p>
                    <p className={`font-medium ${getStatusBadge(selectedAdmin.status)}`}>
                      {selectedAdmin.status}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                    <p className="font-mono text-xs break-all">{selectedAdmin._id}</p>
                  </div>
                </div>
              )}

              {(modalType === "delete" || modalType === "return") && (
                <div className="text-center py-4">
                  <p className="text-lg">
                    <span className="font-semibold text-red-500">
                      {selectedAdmin?.first_name} {selectedAdmin?.last_name}
                    </span>{" "}
                    {modalType === "delete" ? "ni o'chirmoqchimisiz?" : "ni ishga qaytarmoqchimisiz?"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {modalType === "delete" 
                      ? "Bu jarayonni orqaga qaytarib bo'lmaydi." 
                      : "Admin faol holatga o'tkaziladi."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all"
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
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all ${
                    modalType === "add" || modalType === "edit"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : modalType === "return"
                      ? "bg-green-600 hover:bg-green-700"
                      : modalType === "vacation"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
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