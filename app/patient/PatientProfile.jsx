import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Switch, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Bell, 
  Settings, 
  Smartphone, 
  Moon, 
  Globe, 
  ShieldAlert, 
  ArrowRight, 
  User, 
  Edit, 
  LogOut, 
  Shield, 
  Activity, 
  FileText, 
  HelpCircle, 
  ChevronLeft,
  X,
  Phone,
  Droplet,
  AlertTriangle,
  Lock,
  KeyRound,
  ShieldCheck,
  Calendar
} from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import BottomNav from "@/components/mobile/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profileApi } from "@/api/profileApi";

const BLOOD_TYPE_MAP = {
  "A+": "A_POS",
  "A-": "A_NEG",
  "B+": "B_POS",
  "B-": "B_NEG",
  "AB+": "AB_POS",
  "AB-": "AB_NEG",
  "O+": "O_POS",
  "O-": "O_NEG",
};

const REVERSE_BLOOD_TYPE_MAP = Object.fromEntries(
  Object.entries(BLOOD_TYPE_MAP).map(([k, v]) => [v, k])
);

/**
 * Normalizes user date input (DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, etc.)
 * to the backend-required YYYY-MM-DD format.
 */
const normalizeDate = (input) => {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();
  
  // Try DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    return formatValidDate(dmyMatch[3], dmyMatch[2], dmyMatch[1]);
  }
  
  // Try YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymdMatch) {
    return formatValidDate(ymdMatch[1], ymdMatch[2], ymdMatch[3]);
  }
  
  return null;
};

const formatValidDate = (year, month, day) => {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  
  if (y < 1900 || y > 2100) return null;
  if (m < 1 || m > 12) return null;
  
  const dateObj = new Date(y, m - 1, d);
  if (
    dateObj.getFullYear() === y &&
    dateObj.getMonth() === m - 1 &&
    dateObj.getDate() === d
  ) {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }
  return null;
};

// Sub-components moved outside to avoid re-creation on every render (fixes input lag)
const ModalHeader = ({ title, onClose }) => (
  <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-gray-50">
    <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-xl">
      <X size={20} color="#6B7280" />
    </TouchableOpacity>
    <Text className="text-xl font-extrabold text-gray-900">{title}</Text>
    <View className="w-10" />
  </View>
);

const FormInput = ({ label, value, onChangeText, placeholder, icon: Icon, multiline = false, secureTextEntry = false, editable = true }) => (
  <View className="mb-4">
    <Text className="text-sm font-extrabold text-gray-700 mb-2 text-right">{label}</Text>
    <View className={`flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 ${multiline ? 'h-24 py-2' : 'h-14'} ${!editable ? 'opacity-60' : ''}`}>
      <TextInput
        className="flex-1 text-base text-gray-900 h-full font-bold"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        textAlign="right"
        secureTextEntry={secureTextEntry}
        textAlignVertical={multiline ? "top" : "center"}
        editable={editable}
      />
      {Icon && (
        <View className="ml-3">
          <Icon size={18} color="#9CA3AF" />
        </View>
      )}
    </View>
  </View>
);

const SettingRow = ({ icon: Icon, title, description, value, onValueChange, showDivider = true }) => (
  <View className={`flex-row items-center justify-between py-4 ${showDivider ? 'border-b border-gray-50' : ''}`}>
    <View className="flex-1 flex-row items-center gap-4">
      <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
        <Icon size={22} color="#022451" strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-extrabold text-gray-900 text-right">{title}</Text>
        {description && <Text className="text-[10px] font-bold text-gray-400 mt-0.5 text-right leading-relaxed">{description}</Text>}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#E5E7EB", true: "#022451" }}
      thumbColor={"#FFFFFF"}
      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
    />
  </View>
);

const MenuLink = ({ icon: Icon, title, subtitle, onPress, color }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between p-5 bg-white border-b border-gray-50"
    activeOpacity={0.7}
  >
    <View className="flex-1 flex-row items-center gap-4">
      <View 
        style={{ backgroundColor: color }}
        className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
      >
        <Icon size={18} color="#FFFFFF" strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-extrabold text-gray-900 text-right">{title}</Text>
        {subtitle && (
          <Text className="text-[10px] font-bold text-gray-400 mt-0.5 text-right">{subtitle}</Text>
        )}
      </View>
    </View>
    <ChevronLeft size={18} color="#D1D5DB" />
  </TouchableOpacity>
);

export default function PatientProfile() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [activeModal, setActiveModal] = useState(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    bloodType: "",
    allergies: "",
    chronic: "",
    birthDate: "",
  });

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    prescriptionReminders: true,
  });

  // Security state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError("");
    
    const [profileRes, settingsRes] = await Promise.all([
      profileApi.getPatientProfile(),
      profileApi.getPatientSettings()
    ]);

    if (profileRes.success) {
      const p = profileRes.data;
      // Backend contract uses 'phone' in profile and 'phone_number' in user
      const updatedName = p.full_name || user?.full_name || user?.name || "";
      const updatedPhone = p.phone || p.phone_number || user?.phone_number || user?.phone || "";
      
      setProfileData({
        name: updatedName,
        phone: updatedPhone,
        bloodType: REVERSE_BLOOD_TYPE_MAP[p.blood_type] || p.blood_type || "",
        allergies: p.allergies || "",
        chronic: p.chronic_conditions || "",
        birthDate: p.date_of_birth || "",
      });

      // Sync back to AuthContext to ensure other screens (like Home) are updated
      if (setUser && user && (updatedName !== user.name || updatedPhone !== (user.phone_number || user.phone))) {
        setUser({ 
          ...user, 
          name: updatedName, 
          full_name: updatedName,
          phone: updatedPhone, 
          phone_number: updatedPhone 
        });
      }
    } else {
      // Fallback to AuthContext if profile fails
      setProfileData(prev => ({
        ...prev,
        name: user?.full_name || user?.name || "",
        phone: user?.phone_number || user?.phone || "",
      }));
    }

    if (settingsRes.success) {
      setSettings(settingsRes.data);
    }

    if (!profileRes.success && profileRes.status !== 401) {
      setError("تعذر تحميل البيانات. حاول مرة أخرى.");
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/RoleSelect");
  };

  const toggleSetting = async (key) => {
    const newVal = !settings[key];
    const prevSettings = { ...settings };
    
    // Optimistic update
    setSettings((prev) => ({ ...prev, [key]: newVal }));

    const res = await profileApi.updatePatientSettings({ [key]: newVal });
    if (!res.success) {
      // Revert on failure
      setSettings(prevSettings);
      Alert.alert("خطأ", "تعذر تحديث الإعدادات");
    }
  };

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      setProfileError("يرجى تعبئة الحقول الأساسية (الاسم)");
      return;
    }
    
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (profileData.bloodType && !validBloodTypes.includes(profileData.bloodType.trim().toUpperCase())) {
      setProfileError("يرجى اختيار زمرة دم صحيحة");
      return;
    }

    // Normalize and validate date
    const bDateInput = profileData.birthDate.trim();
    let normalizedBDate = null;
    if (bDateInput) {
      normalizedBDate = normalizeDate(bDateInput);
      if (!normalizedBDate) {
        setProfileError("أدخل تاريخ الميلاد بصيغة صحيحة (مثال: 2002-09-15 أو 15-09-2002)");
        return;
      }
    }

    setProfileError("");
    setIsSavingProfile(true);
    
    // TODO: Backend currently does not persist blood_type despite accepting PATCH. Re-test after backend fix.
    const payload = {
      full_name: profileData.name.trim(),
      phone: profileData.phone.trim(),
      date_of_birth: normalizedBDate,
      blood_type: BLOOD_TYPE_MAP[profileData.bloodType.trim()] || profileData.bloodType.trim(),
      allergies: profileData.allergies.trim(),
      chronic_conditions: profileData.chronic.trim(),
    };

    const res = await profileApi.updatePatientProfile(payload);
    
    if (res.success) {
      // Refresh all data from server
      const verifyRes = await profileApi.getPatientProfile();
      await fetchInitialData();
      
      // Verify if blood type actually persisted
      const backendBloodType = verifyRes.data?.blood_type;
      const sentBloodType = payload.blood_type;
      
      if (sentBloodType && (backendBloodType !== sentBloodType)) {
        // Backend didn't persist it - show warning as requested
        setProfileError("تنبيه: لم يتم حفظ فصيلة الدم على الخادم.");
      } else {
        Alert.alert("تم", "تم حفظ البيانات بنجاح");
        setActiveModal(null);
      }
    } else {
      setProfileError(res.message || "تعذر حفظ التعديلات، يرجى التحقق من البيانات المدخلة");
    }
    setIsSavingProfile(false);
  };

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError("يرجى تعبئة كافة الحقول");
      return;
    }
    if (passwords.new.length < 6) {
      setPasswordError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordError("كلمة المرور الجديدة غير متطابقة");
      return;
    }
    setPasswordError("");
    setIsUpdatingPassword(true);
    
    const res = await profileApi.updatePatientProfile({
      current_password: passwords.current,
      password: passwords.new
    });
    
    setIsUpdatingPassword(false);
    
    if (res.success) {
      Alert.alert("تم", "تم تحديث كلمة المرور بنجاح");
      setPasswords({ current: "", new: "", confirm: "" });
      setActiveModal(null);
    } else {
      setPasswordError(res.message || "كلمة المرور الحالية غير صحيحة");
    }
  };

  return (
    <MobileShell className="bg-patient" edges={["left", "right"]}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Fixed clipping with dynamic padding */}
        <View 
          className="bg-patient px-5 pb-8 rounded-b-[2rem] items-center shadow-xl"
          style={{ paddingTop: insets.top + 20 }}
        >
          <View className="relative">
            <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4 border-2 border-white/40">
              <User size={48} color="#FFFFFF" strokeWidth={1.5} />
            </View>
            <TouchableOpacity
              onPress={() => setActiveModal("editProfile")}
              className="absolute bottom-4 -right-2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
            >
              <Edit size={16} color="#022451" />
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-extrabold text-white mb-1">
            {profileData.name || (isLoading ? "جاري التحميل..." : "---")}
          </Text>
          <Text className="text-sm text-white/80">{profileData.phone || "---"}</Text>
          {profileData.birthDate ? (
            <Text className="text-xs text-white/60 mt-1">تاريخ الميلاد: {profileData.birthDate}</Text>
          ) : null}

          <View className="flex-row items-center gap-2 mt-4 bg-white/15 px-4 py-2 rounded-full">
            <Activity size={16} color="#FFFFFF" />
            <Text className="text-sm text-white font-bold">
              فصيلة الدم: {profileData.bloodType || "---"}
            </Text>
          </View>
        </View>

        <View className="px-5 -mt-4">
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <MenuLink
              icon={User}
              title="تعديل الملف الشخصي"
              subtitle="تحديث بياناتك الشخصية والصحية"
              onPress={() => setActiveModal("editProfile")}
              color="#022451"
            />
            <MenuLink
              icon={Settings}
              title="الإعدادات"
              subtitle="خيارات التنبيهات والتطبيق"
              onPress={() => setActiveModal("settings")}
              color="#0FAE9B"
            />
            <MenuLink
              icon={Shield}
              title="الأمان والخصوصية"
              subtitle="كلمة المرور والأجهزة المتصلة"
              onPress={() => setActiveModal("security")}
              color="#4C8FB5"
            />
            <MenuLink
              icon={FileText}
              title="الشروط والأحكام"
              subtitle="سياسة الخصوصية واستخدام التطبيق"
              onPress={() => setActiveModal("privacy")}
              color="#6E7FA3"
            />
            <MenuLink
              icon={HelpCircle}
              title="المساعدة والدعم"
              subtitle="الأسئلة الشائعة وإرشادات الاستخدام"
              onPress={() => setActiveModal("help")}
              color="#94A3B8"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 mt-8 mb-8 bg-red-50 py-4 rounded-2xl border border-red-100"
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="text-red-500 font-bold text-base">تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODALS */}
      <Modal visible={!!activeModal} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          className="flex-1 bg-black/50 justify-end"
        >
          <View 
            className="bg-white rounded-t-[3.5rem] p-8 shadow-2xl max-h-[90%]"
            style={{ paddingBottom: Math.max(insets.bottom, 40) }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* EDIT PROFILE MODAL */}
              {activeModal === "editProfile" && (
                <View>
                  <ModalHeader title="تعديل الملف الشخصي" onClose={() => setActiveModal(null)} />
                  
                  {profileError ? (
                    <View className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                      <Text className="text-red-600 text-xs text-center font-bold">{profileError}</Text>
                    </View>
                  ) : null}

                  <Text className="text-base font-bold text-patient mb-4 text-right">البيانات الشخصية</Text>
                  <FormInput
                    label="الاسم الكامل"
                    value={profileData.name}
                    onChangeText={(t) => setProfileData({ ...profileData, name: t })}
                    icon={User}
                  />
                  <FormInput
                    label="رقم الجوال"
                    value={profileData.phone}
                    onChangeText={(t) => setProfileData({ ...profileData, phone: t })}
                    icon={Phone}
                    editable={false}
                  />
                  <FormInput
                    label="تاريخ الميلاد"
                    value={profileData.birthDate}
                    onChangeText={(t) => setProfileData({ ...profileData, birthDate: t })}
                    placeholder="مثال: 2002-09-15 أو 15-09-2002"
                    icon={Calendar}
                  />

                  <View className="h-px bg-gray-100 my-6" />
                  <Text className="text-base font-bold text-patient mb-4 text-right">البيانات الصحية</Text>

                  <FormInput
                    label="فصيلة الدم"
                    value={profileData.bloodType}
                    onChangeText={(t) => setProfileData({ ...profileData, bloodType: t })}
                    icon={Droplet}
                  />
                  <FormInput
                    label="الحساسية (افصل بينها بفاصلة)"
                    value={profileData.allergies}
                    onChangeText={(t) => setProfileData({ ...profileData, allergies: t })}
                    icon={AlertTriangle}
                    multiline
                  />
                  <FormInput
                    label="الأمراض المزمنة (افصل بينها بفاصلة)"
                    value={profileData.chronic}
                    onChangeText={(t) => setProfileData({ ...profileData, chronic: t })}
                    icon={AlertTriangle}
                    multiline
                  />

                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    disabled={isSavingProfile || !profileData.name.trim()}
                    className={`h-16 rounded-2xl items-center justify-center mt-6 flex-row gap-2 ${
                      (isSavingProfile || !profileData.name.trim()) ? "bg-patient/50" : "bg-patient"
                    }`}
                  >
                    {isSavingProfile ? (
                      <>
                        <ActivityIndicator color="#FFFFFF" />
                        <Text className="text-white font-extrabold text-lg">جاري الحفظ...</Text>
                      </>
                    ) : (
                      <Text className="text-white font-extrabold text-lg">حفظ التغييرات</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* SETTINGS MODAL */}
              {activeModal === "settings" && (
                <View>
                  <ModalHeader title="الإعدادات" onClose={() => setActiveModal(null)} />
                  
                  <View className="mb-6">
                    <Text className="text-sm text-gray-500 text-center font-bold">لا توجد إعدادات إضافية حالياً.</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setActiveModal(null)}
                    className="bg-patient h-16 rounded-2xl items-center justify-center mt-4"
                  >
                    <Text className="text-white font-extrabold text-lg">إغلاق</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* SECURITY & PRIVACY MODAL */}
              {activeModal === "security" && (
                <View>
                  <ModalHeader title="الأمان والخصوصية" onClose={() => setActiveModal(null)} />
                  
                  <View className="mb-8">
                    <View className="flex-row items-center justify-end gap-2 mb-4">
                      <Text className="text-lg font-bold text-patient">تغيير كلمة المرور</Text>
                      <Lock size={20} color="#022451" />
                    </View>
                    
                    {passwordError ? (
                      <View className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                        <Text className="text-red-600 text-xs text-center font-bold">{passwordError}</Text>
                      </View>
                    ) : null}
                    
                    <FormInput
                      label="كلمة المرور الحالية"
                      secureTextEntry
                      value={passwords.current}
                      onChangeText={(t) => setPasswords({ ...passwords, current: t })}
                      icon={KeyRound}
                    />
                    <FormInput
                      label="كلمة المرور الجديدة"
                      secureTextEntry
                      value={passwords.new}
                      onChangeText={(t) => setPasswords({ ...passwords, new: t })}
                      icon={KeyRound}
                    />
                    <FormInput
                      label="تأكيد كلمة المرور الجديدة"
                      secureTextEntry
                      value={passwords.confirm}
                      onChangeText={(t) => setPasswords({ ...passwords, confirm: t })}
                      icon={KeyRound}
                    />
                    
                    <TouchableOpacity 
                      className={`h-14 rounded-xl flex-row items-center justify-center mt-2 gap-2 ${
                        (isUpdatingPassword || !passwords.current || !passwords.new || !passwords.confirm) ? "bg-patient/50" : "bg-patient"
                      }`}
                      onPress={handleUpdatePassword}
                      disabled={isUpdatingPassword || !passwords.current || !passwords.new || !passwords.confirm}
                      activeOpacity={0.8}
                    >
                      {isUpdatingPassword ? (
                        <>
                          <ActivityIndicator color="#FFFFFF" />
                          <Text className="text-white font-bold text-base">جاري التحديث...</Text>
                        </>
                      ) : (
                        <Text className="text-white font-bold text-base">تحديث كلمة المرور</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View className="mb-8">
                    <View className="flex-row items-center justify-end gap-2 mb-4">
                      <Text className="text-lg font-bold text-patient">الأجهزة المتصلة</Text>
                      <Smartphone size={20} color="#022451" />
                    </View>
                    
                    <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex-row items-center justify-between">
                      <View className="bg-emerald-100 px-2 py-1 rounded">
                        <Text className="text-[10px] font-bold text-emerald-700">هذا الجهاز</Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <View>
                          <Text className="text-sm font-bold text-gray-900 text-right">iPhone 13 Pro</Text>
                          <Text className="text-[10px] text-gray-500 mt-0.5 text-right">الرياض، السعودية • نشط الآن</Text>
                        </View>
                        <View className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
                          <Smartphone size={20} color="#022451" />
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="bg-red-50 rounded-2xl p-4 border border-red-100 flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-red-700 mb-1 text-right">حذف الحساب</Text>
                      <Text className="text-xs text-red-600 text-right mb-3 leading-relaxed">سيؤدي هذا إلى حذف جميع بياناتك وسجلك الطبي نهائياً.</Text>
                      <TouchableOpacity 
                        onPress={() => Alert.alert("تنبيه", "سيتم توجيهك لطلب حذف الحساب")}
                        className="bg-red-100 self-end px-4 py-2 rounded-lg"
                      >
                        <Text className="text-xs font-bold text-red-700">طلب حذف الحساب</Text>
                      </TouchableOpacity>
                    </View>
                    <AlertTriangle size={24} color="#EF4444" />
                  </View>
                </View>
              )}

              {/* PRIVACY POLICY MODAL */}
              {activeModal === "privacy" && (
                <View>
                  <ModalHeader title="الشروط وسياسة الخصوصية" onClose={() => setActiveModal(null)} />
                  
                  <View className="items-center mb-8">
                    <View className="w-20 h-20 bg-patient/10 rounded-3xl items-center justify-center mb-4">
                      <ShieldCheck size={40} color="#022451" />
                    </View>
                    <Text className="text-xl font-extrabold text-gray-900 mb-2">سياسة الخصوصية</Text>
                    <Text className="text-sm text-gray-500 text-center leading-relaxed">نحن في فارماساين نلتزم بحماية خصوصيتك وبياناتك الطبية بأعلى معايير الأمان المتاحة.</Text>
                  </View>

                  <View className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
                    <View className="mb-6">
                      <View className="flex-row items-center justify-end gap-2 mb-3">
                        <Text className="text-base font-bold text-patient text-right">جمع البيانات</Text>
                        <FileText size={18} color="#022451" />
                      </View>
                      <Text className="text-sm text-gray-600 leading-relaxed text-right">نجمع البيانات الأساسية اللازمة لتقديم الخدمة فقط، وتشمل الاسم ورقم الجوال والتاريخ الطبي المتعلق بالوصفات المصروفة.</Text>
                    </View>
                    
                    <View className="mb-6">
                      <View className="flex-row items-center justify-end gap-2 mb-3">
                        <Text className="text-base font-bold text-patient text-right">حماية البيانات</Text>
                        <Lock size={18} color="#022451" />
                      </View>
                      <Text className="text-sm text-gray-600 leading-relaxed text-right">جميع بياناتك الطبية والشخصية مشفرة بالكامل ولا يمكن لأي طرف ثالث الوصول إليها دون إذنك الصريح.</Text>
                    </View>
                    
                    <View className="mb-4">
                      <View className="flex-row items-center justify-end gap-2 mb-3">
                        <Text className="text-base font-bold text-patient text-right">مشاركة المعلومات</Text>
                        <ShieldCheck size={18} color="#022451" />
                      </View>
                      <Text className="text-sm text-gray-600 leading-relaxed text-right">عند تقديم رمز الاستجابة السريعة للصيدلي، فإنك توافق على إعطائه صلاحية مؤقتة لعرض الوصفات الطبية.</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* HELP & SUPPORT MODAL */}
              {activeModal === "help" && (
                <View>
                  <ModalHeader title="المساعدة والدعم" onClose={() => setActiveModal(null)} />
                  
                  <View className="bg-patient/10 rounded-2xl p-5 mb-6 border border-patient/20 flex-row items-center gap-4">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-patient mb-1 text-right">كيف يمكننا مساعدتك؟</Text>
                      <Text className="text-xs text-patient/80 text-right leading-relaxed">فريق الدعم الفني متواجد لمساعدتك عبر الاتصال المباشر.</Text>
                    </View>
                    <View className="w-14 h-14 bg-patient/20 rounded-full items-center justify-center">
                      <HelpCircle size={32} color="#022451" />
                    </View>
                  </View>

                  <View className="bg-white p-6 rounded-2xl border border-gray-100 items-center justify-center gap-4 shadow-sm mb-8">
                    <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center border border-blue-100">
                      <ShieldCheck size={32} color="#3B82F6" />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-gray-900 text-center mb-1">تحتاج للمساعدة؟</Text>
                      <Text className="text-sm text-gray-500 text-center leading-relaxed">للمساعدة، يرجى التواصل مع إدارة المنظمة أو الصيدلية المسؤولة.</Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
                    <Text className="text-lg font-extrabold text-gray-900 mb-4 text-right">الأسئلة الشائعة</Text>
                    
                    {[
                      {
                        q: "كيف يمكنني عرض الوصفة الطبية بلغة الإشارة؟",
                        a: "افتح الوصفة من سجل الوصفات، ثم اختر الدواء لعرض التعليمات والنص الداعم."
                      },
                      {
                        q: "هل يمكن للصيدلي رؤية جميع وصفاتي السابقة؟",
                        a: "يمكن للصيدلي رؤية المعلومات المرتبطة بالجلسة والوصفة عند وجود صلاحية مناسبة."
                      },
                      {
                        q: "ماذا أفعل في حال فقدت رمز الاستجابة السريعة؟",
                        a: "يرجى التواصل مع إدارة المنظمة لإعادة إصدار رمز جديد."
                      },
                      {
                        q: "كيف يمكنني تحديث بياناتي الصحية؟",
                        a: "يمكنك تعديل بياناتك من صفحة الملف الشخصي ثم حفظ التغييرات."
                      }
                    ].map((item, idx) => (
                      <View key={idx} className="border-b border-gray-100">
                        <TouchableOpacity 
                          onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="flex-row items-center justify-between py-5"
                          activeOpacity={0.7}
                        >
                          <ChevronLeft 
                            size={18} 
                            color="#9CA3AF" 
                            style={{ transform: [{ rotate: expandedFaq === idx ? '-90deg' : '0deg' }] }}
                          />
                          <Text className="text-sm font-bold text-gray-800 text-right flex-1 pr-4">{item.q}</Text>
                        </TouchableOpacity>
                        {expandedFaq === idx && (
                          <View className="pb-5 pr-4 pl-8">
                            <Text className="text-xs text-gray-500 text-right leading-relaxed font-bold">
                              {item.a}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav role="patient" />
      </View>
    </MobileShell>
  );
}
