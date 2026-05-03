import BottomNav from "@/components/mobile/BottomNav";
import MobileShell from "@/components/mobile/MobileShell";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Bell,
  FileText,
  Globe,
  HelpCircle,
  Home,
  Lock,
  LogOut,
  MapPin,
  Settings,
  User,
  X,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profileApi } from "@/api/profileApi";
import { useAuth } from "@/lib/AuthContext";

// Sub-components moved outside to avoid re-creation on every render (fixes input lag)
const ModalHeader = ({ title, onClose }) => (
  <View className="flex-row items-center justify-between mb-8 pb-4 border-b border-gray-50">
    <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-xl">
      <X size={20} color="#6B7280" />
    </TouchableOpacity>
    <Text className="text-xl font-extrabold text-gray-900">{title}</Text>
    <View className="w-10" />
  </View>
);

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
}) => (
  <View className="mb-5">
    <Text className="text-sm font-extrabold text-gray-700 mb-2 text-right">
      {label}
    </Text>
    <TextInput
      className="bg-gray-50 border border-gray-100 h-14 rounded-2xl px-5 text-right font-bold text-gray-900"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const SettingRow = ({
  icon: Icon,
  title,
  description,
  value,
  onValueChange,
  showDivider = true,
}) => (
  <View
    className={`flex-row items-center justify-between py-4 ${
      showDivider ? "border-b border-gray-50" : ""
    }`}
  >
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#E5E7EB", true: "#05997F" }}
      thumbColor="#FFFFFF"
      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
    />
    <View className="flex-1 flex-row items-center gap-4 justify-end">
      <View className="flex-1">
        <Text className="text-base font-extrabold text-gray-900 text-right">
          {title}
        </Text>
        {description && (
          <Text className="text-[10px] font-bold text-gray-400 mt-0.5 text-right leading-relaxed">
            {description}
          </Text>
        )}
      </View>
      <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
        <Icon size={22} color="#05997F" strokeWidth={2.5} />
      </View>
    </View>
  </View>
);

const ClickableRow = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  showDivider = true,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center justify-between py-4 ${
      showDivider ? "border-b border-gray-50" : ""
    }`}
    activeOpacity={0.6}
  >
    <ArrowRight
      size={16}
      color="#D1D5DB"
      style={{ transform: [{ rotate: "180deg" }] }}
    />
    <View className="flex-1 flex-row items-center gap-4 justify-end">
      <View className="flex-1">
        <Text className="text-base font-extrabold text-gray-900 text-right">
          {title}
        </Text>
        <Text className="text-[10px] font-bold text-gray-400 mt-0.5 text-right leading-relaxed">
          {subtitle}
        </Text>
      </View>
      <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
        <Icon size={22} color="#05997F" strokeWidth={2.5} />
      </View>
    </View>
  </TouchableOpacity>
);

export default function PharmacistSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, setUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [settings, setSettings] = useState({
    notifications: true,
    autoAccept: false,
    darkMode: false,
    useBiometrics: true,
  });

  const [accountData, setAccountData] = useState({
    name: "",
    phone: "",
  });

  const [pharmacyData, setPharmacyData] = useState({
    name: "",
    address: "",
    contact: "",
  });

  const [activeModal, setActiveModal] = useState(null);
  const [tempProfile, setTempProfile] = useState({ name: "", phone: "" });
  const [tempPharmacy, setTempPharmacy] = useState({ name: "", address: "", contact: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError("");

    const [profileRes, pharmacyRes] = await Promise.all([
      profileApi.getPharmacistProfile(),
      profileApi.getPharmacyData(),
    ]);

    if (profileRes.success) {
      const p = profileRes.data;
      const data = {
        name: p.full_name || "",
        phone: p.phone_number || "",
      };
      setAccountData(data);
      // Only set temp if modal not open (prevents resetting while typing)
      if (!activeModal) setTempProfile(data);
    }

    if (pharmacyRes.success) {
      const ph = pharmacyRes.data;
      const data = {
        name: ph.name || "",
        address: ph.address || "",
        contact: ph.contact_number || "",
      };
      setPharmacyData(data);
      if (!activeModal) setTempPharmacy(data);
    }

    if (!profileRes.success && profileRes.status !== 401) {
      setError("تعذر تحميل البيانات. حاول مرة أخرى.");
    }

    setIsLoading(false);
  };

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = async () => {
    await logout();
    router.replace("/pharmacist/PharmacistLogin");
  };

  const saveProfile = async () => {
    if (!tempProfile.name.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم الصيدلي");
      return;
    }
    
    setIsSaving(true);
    const res = await profileApi.updatePharmacistProfile({
      full_name: tempProfile.name.trim(),
      phone_number: tempProfile.phone.trim(),
    });
    setIsSaving(false);

    if (res.success) {
      const updatedData = { ...tempProfile };
      setAccountData(updatedData);
      if (setUser && user) {
        setUser({ ...user, name: updatedData.name, phone: updatedData.phone });
      }
      setActiveModal(null);
      Alert.alert("تم", "تم حفظ البيانات بنجاح");
    } else {
      Alert.alert("خطأ", "تعذر حفظ البيانات. حاول مرة أخرى.");
    }
  };

  const savePharmacy = async () => {
    setIsSaving(true);
    const res = await profileApi.updatePharmacyData({
      name: tempPharmacy.name,
      address: tempPharmacy.address,
      contact_number: tempPharmacy.contact,
    });
    setIsSaving(false);

    if (res.success) {
      setPharmacyData({ ...tempPharmacy });
      setActiveModal(null);
      Alert.alert("تم", "تم حفظ البيانات بنجاح");
    } else {
      Alert.alert("خطأ", "تعذر حفظ البيانات. حاول مرة أخرى.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.new || !passwords.confirm || !passwords.current) {
      Alert.alert("خطأ", "يرجى تعبئة كافة الحقول");
      return;
    }

    if (passwords.new.length < 6) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      Alert.alert("خطأ", "كلمة المرور الجديدة غير متطابقة");
      return;
    }

    setIsUpdatingPassword(true);
    const res = await profileApi.updatePharmacistProfile({
      current_password: passwords.current,
      password: passwords.new,
    });
    setIsUpdatingPassword(false);

    if (res.success) {
      setActiveModal(null);
      setPasswords({ current: "", new: "", confirm: "" });
      Alert.alert("تم", "تم تحديث كلمة المرور بنجاح");
    } else {
      Alert.alert("خطأ", res.message || "كلمة المرور الحالية غير صحيحة");
    }
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          {/* Unified Profile Hero Section */}
          <View className="bg-pharmacist pt-8 pb-14 px-6 rounded-b-[4rem] shadow-2xl shadow-pharmacist/30 relative overflow-hidden">
            <View className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />

            <View className="items-center">
              <View className="relative">
                <View className="w-32 h-32 bg-white/20 rounded-[3rem] items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden p-1">
                  <View className="w-full h-full bg-white/10 rounded-[2.5rem] items-center justify-center">
                    <User size={64} color="#FFFFFF" strokeWidth={1.5} />
                  </View>
                </View>

                <View className="absolute -bottom-1 -right-1 bg-emerald-500 px-4 py-2 rounded-2xl border-4 border-pharmacist shadow-lg">
                  <Text className="text-[10px] font-extrabold text-white uppercase tracking-tighter">
                    صيدلي معتمد
                  </Text>
                </View>
              </View>

              <Text className="text-2xl font-extrabold text-white mt-8 mb-1.5 tracking-tight">
                {accountData.name || (isLoading ? "جاري التحميل..." : "---")}
              </Text>

              <View className="flex-row items-center gap-2 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 mt-3">
                <Text className="text-sm font-bold text-white/90">
                  {pharmacyData.name || "صيدلية فارماساين"}
                </Text>

                <View className="w-1.5 h-1.5 bg-white/40 rounded-full" />

                <MapPin size={14} color="rgba(255,255,255,0.8)" />

                <Text className="text-xs font-bold text-white/70">
                  {pharmacyData.address ? (pharmacyData.address.split("،")[1] || pharmacyData.address) : "الرياض"}
                </Text>
              </View>
            </View>
          </View>

          <View className="px-5 -mt-6">
            {/* Account & Pharmacy Section */}
            <View className="bg-white rounded-[2.5rem] p-7 mb-6 border border-gray-100 shadow-sm">
              <View className="flex-row items-center justify-end mb-6 gap-2">
                <Text className="text-lg font-extrabold text-gray-900">
                  الحساب والصيدلية
                </Text>
                <View className="w-1 h-6 bg-primary rounded-full" />
              </View>

              <ClickableRow
                icon={Settings}
                title="بياناتي"
                subtitle="تعديل الاسم ورقم الهاتف"
                onPress={() => {
                  setTempProfile({ ...accountData });
                  setActiveModal("profile");
                }}
              />

              <ClickableRow
                icon={Lock}
                title="تغيير كلمة المرور"
                subtitle="تحديث كلمة مرور الحساب"
                onPress={() => setActiveModal("password")}
              />

              <ClickableRow
                icon={Home}
                title="بيانات الصيدلية"
                subtitle="اسم الصيدلية، العنوان، ورقم التواصل"
                onPress={() => {
                  setTempPharmacy({ ...pharmacyData });
                  setActiveModal("pharmacy");
                }}
                showDivider={false}
              />
            </View>

            {/* Workflow Section */}
            <View className="bg-white rounded-[2.5rem] p-7 mb-6 border border-gray-100 shadow-sm">
              <View className="flex-row items-center justify-end mb-6 gap-2">
                <Text className="text-lg font-extrabold text-gray-900">
                  سير العمل
                </Text>
                <View className="w-1 h-6 bg-primary rounded-full" />
              </View>

              <SettingRow
                icon={Bell}
                title="تنبيهات الوصفات"
                description="تلقي إشعار فور مسح رمز مريض جديد"
                value={settings.notifications}
                onValueChange={() => toggleSetting("notifications")}
              />

              <SettingRow
                icon={FileText}
                title="الأرشفة التلقائية"
                description="أرشفة الوصفات المكتملة تلقائياً بعد الصرف"
                value={settings.autoAccept}
                onValueChange={() => toggleSetting("autoAccept")}
                showDivider={false}
              />
            </View>

            {/* Support & System Section */}
            <View className="bg-white rounded-[2.5rem] p-6 mb-5 border border-gray-50 shadow-sm">
              <View className="flex-row items-center justify-end mb-6 gap-2">
                <Text className="text-lg font-extrabold text-gray-900">
                  النظام والدعم
                </Text>
                <View className="w-1 h-6 bg-primary rounded-full" />
              </View>

              <TouchableOpacity
                onPress={() => Alert.alert("اللغة", "اللغة العربية مفعلة حالياً")}
                className="flex-row items-center justify-between py-4 border-b border-gray-50"
              >
                <Text className="text-sm font-extrabold text-primary">
                  العربية
                </Text>

                <View className="flex-row items-center gap-4">
                  <Text className="text-base font-extrabold text-gray-900">
                    لغة التطبيق
                  </Text>

                  <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
                    <Globe size={22} color="#05997F" strokeWidth={2.5} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert("الدعم", "للمساعدة، تواصل مع إدارة PharmaSign")
                }
                className="flex-row items-center justify-between py-4 border-b border-gray-50"
              >
                <ArrowRight
                  size={16}
                  color="#D1D5DB"
                  style={{ transform: [{ rotate: "180deg" }] }}
                />

                <View className="flex-row items-center gap-4">
                  <Text className="text-base font-extrabold text-gray-900">
                    مساعدة ودعم
                  </Text>

                  <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
                    <HelpCircle size={22} color="#05997F" strokeWidth={2.5} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.85}
                className="mt-5 bg-red-50 border border-red-100 rounded-3xl h-16 flex-row items-center justify-center gap-3"
              >
                <Text className="text-lg font-extrabold text-red-500">
                  تسجيل الخروج
                </Text>

                <LogOut size={24} color="#EF4444" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-center text-[10px] font-extrabold text-gray-300 mt-8 mb-4 uppercase tracking-widest">
            PharmaSign v1.0.0 (GRADUATION_PROJECT)
          </Text>
        </ScrollView>
      </View>

      {/* MODALS */}
      <Modal visible={!!activeModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-white rounded-t-[3.5rem] p-8 shadow-2xl"
            style={{ paddingBottom: Math.max(insets.bottom, 40) }}
          >
            {activeModal === "profile" && (
              <View>
                <ModalHeader
                  title="تحرير البيانات"
                  onClose={() => setActiveModal(null)}
                />

                <FormInput
                  label="اسم الصيدلي"
                  value={tempProfile.name}
                  onChangeText={(t) =>
                    setTempProfile({ ...tempProfile, name: t })
                  }
                />

                <FormInput
                  label="رقم الهاتف"
                  value={tempProfile.phone}
                  onChangeText={(t) =>
                    setTempProfile({ ...tempProfile, phone: t })
                  }
                />

                <TouchableOpacity
                  onPress={saveProfile}
                  disabled={isSaving}
                  className={`h-16 rounded-2xl items-center justify-center mt-4 ${isSaving ? "bg-primary/50" : "bg-pharmacist"}`}
                >
                  <Text className="text-white font-extrabold text-lg">
                    {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {activeModal === "password" && (
              <View>
                <ModalHeader
                  title="تغيير كلمة المرور"
                  onClose={() => setActiveModal(null)}
                />

                <FormInput
                  label="كلمة المرور الحالية"
                  secureTextEntry
                  value={passwords.current}
                  onChangeText={(t) =>
                    setPasswords({ ...passwords, current: t })
                  }
                />

                <FormInput
                  label="كلمة المرور الجديدة"
                  secureTextEntry
                  value={passwords.new}
                  onChangeText={(t) => setPasswords({ ...passwords, new: t })}
                />

                <FormInput
                  label="تأكيد كلمة المرور"
                  secureTextEntry
                  value={passwords.confirm}
                  onChangeText={(t) =>
                    setPasswords({ ...passwords, confirm: t })
                  }
                />

                <TouchableOpacity
                  onPress={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                  className={`h-16 rounded-2xl items-center justify-center mt-4 ${isUpdatingPassword ? "bg-primary/50" : "bg-pharmacist"}`}
                >
                  <Text className="text-white font-extrabold text-lg">
                    {isUpdatingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {activeModal === "pharmacy" && (
              <View>
                <ModalHeader
                  title="بيانات الصيدلية"
                  onClose={() => setActiveModal(null)}
                />

                <FormInput
                  label="اسم الصيدلية"
                  value={tempPharmacy.name}
                  onChangeText={(t) =>
                    setTempPharmacy({ ...tempPharmacy, name: t })
                  }
                />

                <FormInput
                  label="العنوان / المنطقة"
                  value={tempPharmacy.address}
                  onChangeText={(t) =>
                    setTempPharmacy({ ...tempPharmacy, address: t })
                  }
                />

                <FormInput
                  label="رقم تواصل الصيدلية"
                  value={tempPharmacy.contact}
                  onChangeText={(t) =>
                    setTempPharmacy({ ...tempPharmacy, contact: t })
                  }
                />

                <TouchableOpacity
                  onPress={savePharmacy}
                  disabled={isSaving}
                  className={`h-16 rounded-2xl items-center justify-center mt-4 ${isSaving ? "bg-primary/50" : "bg-pharmacist"}`}
                >
                  <Text className="text-white font-extrabold text-lg">
                    {isSaving ? "جاري الحفظ..." : "حفظ بيانات الصيدلية"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav role="pharmacist" />
      </View>
    </MobileShell>
  );
}