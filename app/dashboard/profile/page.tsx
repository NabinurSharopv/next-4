"use client";

import { useEffect, useState, useRef } from "react";
import { Calendar, Camera, X } from "lucide-react";
import toast from "react-hot-toast";

interface UserProfile {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image?: string;
  createdAt?: string;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

// 🟢 1. PROFILNI TAHRIRLASH MODALI
function EditProfileModal({ 
  isOpen, 
  onClose, 
  profile, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  profile: UserProfile | null; 
  onSuccess: (updatedData: any) => void // O'zgargan ma'lumotni qaytarish uchun
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const API_BASE_URL = "https://admin-crm.onrender.com/api";

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) throw new Error("Token topilmadi. Qayta login qiling!");

      const response = await fetch(`${API_BASE_URL}/auth/edit-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // Backenddan kelgan javobni o'qish (agar 403 yoki boshqa xato bersa aniqlash uchun)
      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Profilni yangilashda xatolik yuz berdi");
      }

      toast.success("✅ Profil muvaffaqiyatli yangilandi!");
      
      // 🚀 ZUDLIK BILAN YANGILASH: O'zgargan ma'lumotlarni asosiy sahifaga uzatamiz
      onSuccess(formData); 
      onClose(); 

    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
      console.error("Edit Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0f0f0f] border border-[#222] rounded-xl w-full max-w-[450px] mx-4 p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[1.15rem] font-semibold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">First Name</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Last Name</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-[#f2f2f2] text-black text-sm font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 2. PAROLNI TAHRIRLASH MODALI
function EditPasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const API_BASE_URL = "https://admin-crm.onrender.com/api";

  if (!isOpen) return null;

  const handleEditPassword = async () => {
    if (!formData.current_password || !formData.new_password) {
      return toast.error("Barcha maydonlarni to'ldiring!");
    }
    if (formData.new_password !== formData.confirm_password) {
      return toast.error("Yangi parol va tasdiqlash mos kelmadi!");
    }

    setLoading(true);
    try {
      const token = getCookie("token");
      const requestBody = {
        current_password: formData.current_password,
        new_password: formData.new_password,
      };

      const response = await fetch(`${API_BASE_URL}/auth/edit-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try { data = await response.json(); } catch(e) {}

      if (!response.ok) throw new Error(data?.message || "Parolni tahrirlashda xatolik yuz berdi");

      toast.success("✅ Parol muvaffaqiyatli o'zgartirildi!");
      setFormData({ current_password: "", new_password: "", confirm_password: "" });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] border border-[#222] rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-[#222]">
          <h2 className="text-xl font-semibold text-white">Parolni o'zgartirish</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Joriy parol</label>
            <input
              type="password"
              value={formData.current_password}
              onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#333] rounded-lg bg-[#0a0a0a] text-white focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Yangi parol</label>
            <input
              type="password"
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#333] rounded-lg bg-[#0a0a0a] text-white focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Yangi parolni tasdiqlang</label>
            <input
              type="password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#333] rounded-lg bg-[#0a0a0a] text-white focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-[#222]">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white">
            Bekor qilish
          </button>
          <button
            onClick={handleEditPassword}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-black bg-white hover:bg-gray-200 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🟢 ASOSIY SAHIFA
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = "https://admin-crm.onrender.com/api";

  const fetchProfile = async () => {
    try {
      const token = getCookie("token");
      if (!token) return setLoading(false);
      
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      
      // Agar foydalanuvchi ma'lumotlarini o'zgartirgan bo'lsa, token eskirib qolmasligi uchun LocalStorage dan ham o'qiymiz
      const localUpdates = JSON.parse(localStorage.getItem("updatedProfile") || "{}");
      
      const userData = {
        _id: tokenData.id || "1",
        first_name: localUpdates.first_name || tokenData.first_name || "Olimbek",
        last_name: localUpdates.last_name || tokenData.last_name || "Olimov",
        email: localUpdates.email || tokenData.email || "usern88@mail.ru",
        role: tokenData.role || "manager",
        image: localStorage.getItem("profileImage") || "", 
        createdAt: tokenData.createdAt || "2025-06-04",
      };

      setProfile(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 3. RASM YUKLASH (Zudlik bilan yangilanadi)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = getCookie("token");
      if (!token) return toast.error("Token topilmadi!");

      const formPayload = new FormData();
      formPayload.append("image", file);

      const toastId = toast.loading("Rasm yuklanmoqda...");

      const response = await fetch(`${API_BASE_URL}/auth/edit-profile-img`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Rasm yuklashda xatolik");

      toast.success("✅ Rasm yuklandi!", { id: toastId });

      // 🚀 ZUDLIK BILAN YANGILASH: Rasmni darhol ekranga chiqaramiz
      const newImageUrl = data?.data?.image || data?.image || data?.imageUrl || URL.createObjectURL(file);
      setProfile((prev: any) => (prev ? { ...prev, image: newImageUrl } : null));
      localStorage.setItem("profileImage", newImageUrl);

    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><span className="text-white">Yuklanmoqda...</span></div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-start justify-between mb-12">
          <div className="flex items-center gap-6">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#222] border border-[#333] overflow-hidden flex items-center justify-center">
                {profile?.image ? (
                  <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </span>
                )}
              </div>
              
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Asosiy ma'lumot (Avtomatik yangilanadi) */}
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-gray-400 mb-2">{profile?.email}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Qo'shilgan:{profile?.createdAt}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md">
              {profile?.role}
            </span>
          </div>
        </div>

        {/* Profil ma'lumotlari bo'limi (Avtomatik yangilanadi) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-1">Profil ma'lumotlari</h2>
          <p className="text-sm text-gray-500 mb-6">Shaxsiy ma'lumotlaringizni yangilashingiz mumkin.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Ism</label>
              <div className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white">
                {profile?.first_name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Familiya</label>
              <div className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white">
                {profile?.last_name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white">
                {profile?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Rol</label>
              <div className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-gray-500">
                {profile?.role}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-6 py-2.5 bg-transparent border border-white text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Parolni o'zgartirish
            </button>
            <button
              onClick={() => setIsEditProfileModalOpen(true)}
              className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              O'zgartirish
            </button>
          </div>
        </div>
      </div>

      {/*ZUDLIK BILAN YANGILANISH (onSuccess da React State'ni yangilash) */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profile={profile}
        onSuccess={(updatedData) => {
          // 1. Ekrandagi ma'lumotni darhol o'zgartiramiz
          setProfile((prev: any) => prev ? { ...prev, ...updatedData } : null);
          
          // 2. Sahifa yangilanganda o'chib ketmasligi uchun saqlab qo'yamiz
          localStorage.setItem("updatedProfile", JSON.stringify(updatedData));
        }}
      />

      <EditPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}