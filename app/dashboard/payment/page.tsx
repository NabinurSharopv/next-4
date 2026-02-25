"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X, Calendar, DollarSign, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface Group {
  _id: string;
  name: string;
  price?: number;
}

interface Payment {
  _id?: string;
  student_id: string;
  group_id: string;
  payment_price: number;
  method: "naqd" | "click" | "payme" | "bank";
  month: string;
  paidAt: string;
}

interface Debtor {
  student_id: string;
  student_name: string;
  group_id: string;
  group_name: string;
  debt_amount: number;
  last_payment?: string;
  month: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

function AddPaymentModal({ isOpen, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [debug, setDebug] = useState<any>({});
  const [formData, setFormData] = useState({
    student_id: "",
    student_name: "",
    student_phone: "",
    group_id: "",
    group_name: "",
    group_price: "",
    payment_price: "",
    method: "naqd" as "naqd" | "click" | "payme" | "bank",
    month: "",
    paidAt: "",
  });

  const API_BASE_URL = "https://admin-crm.onrender.com/api";

const fetchStudents = async () => {
  try {
    const token = getCookie("token");
    console.log("📦 Studentlarni yuklash...");
    const response = await fetch(`${API_BASE_URL}/student/get-all-students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const studentsData = data.data || data;
    console.log("📦 Yuklangan studentlar soni:", studentsData.length);
    
    // Har bir student ID sini tekshirish
    studentsData.forEach((s: Student, i: number) => {
      console.log(`Student ${i + 1}:`, {
        id: s._id,
        name: `${s.first_name} ${s.last_name}`,
        id_length: s._id.length,
        is_valid: isValidObjectId(s._id)
      });
    });
    
    setStudents(studentsData);
  } catch (error) {
    console.error("❌ Studentlarni yuklashda xatolik:", error);
  }
};

const fetchGroups = async () => {
  try {
    const token = getCookie("token");
    console.log("📦 Guruhlarni yuklash...");
    const response = await fetch(`${API_BASE_URL}/group/get-all-group`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const groupsData = data.data || data;
    console.log("📦 Yuklangan guruhlar soni:", groupsData.length);
    
    // Har bir guruh ID sini tekshirish
    groupsData.forEach((g: Group, i: number) => {
      console.log(`Guruh ${i + 1}:`, {
        id: g._id,
        name: g.name,
        id_length: g._id.length,
        is_valid: isValidObjectId(g._id)
      });
    });
    
    setGroups(groupsData);
  } catch (error) {
    console.error("❌ Guruhlarni yuklashda xatolik:", error);
  }
};


  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      fetchGroups();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.student-dropdown') && !target.closest('.student-input')) {
        setShowStudentDropdown(false);
      }
      if (!target.closest('.group-dropdown') && !target.closest('.group-input')) {
        setShowGroupDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleAddPayment = async () => {
    const errors = [];
    if (!formData.student_id) errors.push("Student tanlanmagan");
    if (!formData.group_id) errors.push("Guruh tanlanmagan");
    if (!formData.payment_price) errors.push("To'lov miqdori kiritilmagan");
    if (!formData.month) errors.push("Oy tanlanmagan");
    if (!formData.paidAt) errors.push("Sana tanlanmagan");

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    if (!isValidObjectId(formData.student_id)) {
      toast.error(`Student ID noto'g'ri format: ${formData.student_id}`);
      console.error("❌ Student ID xato:", formData.student_id);
      return;
    }

    if (!isValidObjectId(formData.group_id)) {
      toast.error(`Guruh ID noto'g'ri format: ${formData.group_id}`);
      console.error("❌ Guruh ID xato:", formData.group_id);
      return;
    }

    setLoading(true);
    setDebug({});
    
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Token topilmadi!");
        return;
      }

      const requestBody = {
        student_id: formData.student_id.trim(),
        group_id: formData.group_id.trim(),
        payment_price: Number(formData.payment_price),
        method: formData.method,
        month: formData.month,
        paidAt: formData.paidAt,
      };

      console.log("📤 Yuborilayotgan ma'lumotlar:", {
        ...requestBody,
        student_id_length: requestBody.student_id.length,
        group_id_length: requestBody.group_id.length,
        student_id_valid: isValidObjectId(requestBody.student_id),
        group_id_valid: isValidObjectId(requestBody.group_id),
      });

      setDebug({ request: requestBody });

      const response = await fetch(`${API_BASE_URL}/payment/payment-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log("📥 Server javobi (raw):", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("📥 Server javobi (JSON):", data);
        setDebug((prev: any) => ({ ...prev, response: data }));
      } catch (e) {
        data = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(data.message || `Xatolik: ${response.status}`);
      }

      toast.success(`✅ To'lov muvaffaqiyatli qo'shildi!`);
      
      setFormData({
        student_id: "",
        student_name: "",
        student_phone: "",
        group_id: "",
        group_name: "",
        group_price: "",
        payment_price: "",
        method: "naqd",
        month: "",
        paidAt: "",
      });
      
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error("❌ Xatolik:", err);
      setDebug((prev: any) => ({ ...prev, error: err.message }));
      toast.error(err.message || "To'lov qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (student: Student) => {
    console.log("✅ Tanlangan student:", {
      _id: student._id,
      name: `${student.first_name} ${student.last_name}`,
      id_length: student._id.length,
      is_valid: isValidObjectId(student._id)
    });
    
    setFormData({
      ...formData,
      student_id: student._id,
      student_name: `${student.first_name} ${student.last_name}`,
      student_phone: student.phone || "",
    });
    setShowStudentDropdown(false);
    setSearchStudent("");
    toast.success(`${student.first_name} ${student.last_name} tanlandi`);
  };

  const handleSelectGroup = (group: Group) => {
    console.log("✅ Tanlangan guruh:", {
      _id: group._id,
      name: group.name,
      id_length: group._id.length,
      is_valid: isValidObjectId(group._id)
    });
    
    setFormData({
      ...formData,
      group_id: group._id,
      group_name: group.name,
      group_price: group.price?.toString() || "",
    });
    setShowGroupDropdown(false);
    setSearchGroup("");
    toast.success(`${group.name} guruhi tanlandi`);
  };

  const handleClearStudent = () => {
    setFormData({
      ...formData,
      student_id: "",
      student_name: "",
      student_phone: "",
    });
  };

  const handleClearGroup = () => {
    setFormData({
      ...formData,
      group_id: "",
      group_name: "",
      group_price: "",
    });
  };

  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.phone?.includes(searchStudent)
  );

  const filteredGroups = groups.filter(g => 
    g.name?.toLowerCase().includes(searchGroup.toLowerCase())
  );

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const currentDate = today.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111111] rounded-2xl w-full max-w-4xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#111111] z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Yangi to'lov qo'shish</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {Object.keys(debug).length > 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-xs">
              <pre>{JSON.stringify(debug, null, 2)}</pre>
            </div>
          )}

          {/* Talaba qidirish */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Talaba <span className="text-red-500">*</span>
            </label>
            
            <div className="relative student-input">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1a1a1a]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.student_name || searchStudent}
                  onChange={(e) => {
                    setSearchStudent(e.target.value);
                    setShowStudentDropdown(true);
                    if (formData.student_name) {
                      handleClearStudent();
                    }
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                  placeholder="Ism yoki telefon bo'yicha qidirish..."
                  className="w-full pl-9 pr-10 py-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                />
                {formData.student_name && (
                  <button
                    onClick={handleClearStudent}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {showStudentDropdown && (
                <div className="absolute z-20 w-full mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#111111] shadow-lg max-h-60 overflow-y-auto student-dropdown">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        onClick={() => handleSelectStudent(student)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-sm text-gray-500">{student.phone || 'Telefon yo\'q'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Student topilmadi
                    </div>
                  )}
                </div>
              )}
            </div>
            {formData.student_id && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Student ID: {formData.student_id} ({formData.student_id.length} belgi)
              </p>
            )}
          </div>

          {/* Guruh qidirish */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Guruh <span className="text-red-500">*</span>
            </label>
            
            <div className="relative group-input">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1a1a1a]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.group_name || searchGroup}
                  onChange={(e) => {
                    setSearchGroup(e.target.value);
                    setShowGroupDropdown(true);
                    if (formData.group_name) {
                      handleClearGroup();
                    }
                  }}
                  onFocus={() => setShowGroupDropdown(true)}
                  placeholder="Guruh nomi bo'yicha qidirish..."
                  className="w-full pl-9 pr-10 py-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                />
                {formData.group_name && (
                  <button
                    onClick={handleClearGroup}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {showGroupDropdown && (
                <div className="absolute z-20 w-full mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#111111] shadow-lg max-h-60 overflow-y-auto group-dropdown">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <div
                        key={group._id}
                        onClick={() => handleSelectGroup(group)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-gray-500">
                          {group.price?.toLocaleString() || 'Narxi yo\'q'} so'm
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Guruh topilmadi
                    </div>
                  )}
                </div>
              )}
            </div>
            {formData.group_id && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Guruh ID: {formData.group_id} ({formData.group_id.length} belgi)
              </p>
            )}
          </div>

          {/* Tanlangan ma'lumotlar */}
          {formData.student_name && formData.group_name && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Talaba:</span> {formData.student_name} {formData.student_phone && `(${formData.student_phone})`}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                <span className="font-medium">Guruh:</span> {formData.group_name}
              </p>
            </div>
          )}

          {/* To'lov usuli */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To'lov usuli <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "naqd", label: "Naqd", icon: "💵" },
                { value: "click", label: "Click", icon: "💰" },
                { value: "payme", label: "Payme", icon: "💳" },
                { value: "bank", label: "Bank", icon: "🏦" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, method: option.value as any })}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-xl transition-colors ${
                    formData.method === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* To'lov miqdori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To'lov miqdori (UZS) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.payment_price}
              onChange={(e) => setFormData({ ...formData, payment_price: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="20000"
              min="0"
            />
            {formData.group_price && (
              <p className="text-xs text-gray-500 mt-1">
                Guruh narxi: {Number(formData.group_price).toLocaleString()} so'm
              </p>
            )}
          </div>

          {/* Oy va Sana */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Oy <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={formData.month || currentMonth}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sana <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.paidAt || currentDate}
                onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            Bekor qilish
          </button>
          <button
            onClick={handleAddPayment}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            {loading ? "Qo'shilmoqda..." : "To'lov qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 ASOSIY PAYMENT PAGE
export default function PaymentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">To'lovlar</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi to'lov
        </button>
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          console.log("To'lov qo'shildi");
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}