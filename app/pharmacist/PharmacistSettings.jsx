import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { 
  Bell, 
  FileText, 
  ShieldAlert, 
  Moon, 
  ArrowRight, 
  Globe, 
  HelpCircle, 
  LogOut,
  User,
  MapPin,
  Settings,
  Lock,
  Home,
  CheckCircle,
  X
} from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import BottomNav from "@/components/mobile/BottomNav";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_PHARMACIST } from "@/lib/mockData";

export default function PharmacistSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Settings Toggles
  const [settings, setSettings] = useState({
    notifications: true,
    autoAccept: false,
    darkMode: false,
    useBiometrics: true,
  });

  // Account Data
  const [accountData, setAccountData] = useState({
    name: MOCK_PHARMACIST.name,
    phone: MOCK_PHARMACIST.phone || "055XXXXXXX",
    email: "pharmacist@pharmasign.sa"
  });

  // Pharmacy Data
  const [pharmacyData, setPharmacyData] = useState({
    name: MOCK_PHARMACIST.pharmacyName,
    address: MOCK_PHARMACIST.pharmacyAddress,
    contact: "92000XXXX"
  });

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'password' | 'pharmacy' | null
  const [tempProfile, setTempProfile] = useState({ ...accountData });
  const [tempPharmacy, setTempPharmacy] = useState({ ...pharmacyData });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const toggleSetting = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  // Handle Logout
  const handleLogout = () => {
    Alert.alert(
      "تسجيل الخروج",
      "هل أنت متأكد من رغبتك في تسجيل الخروج؟",
      [
        { text: "إلغاء", style: "cancel" },
        { 
          text: "خروج", 
          style: "destructive",
          onPress: () => router.replace("/pharmacist/PharmacistLogin") 
        }
      ]
    );
  };

  // Profile Update
  const saveProfile = () => {
    setAccountData({ ...tempProfile });
    setActiveModal(null);
    Alert.alert("تم", "تم تحديث البيانات الشخصية بنجاح");
  };

  // Pharmacy Update
  const savePharmacy = () => {
    setPharmacyData({ ...tempPharmacy });
    setActiveModal(null);
    Alert.alert("تم", "تم تحديث بيانات الصيدلية بنجاح");
  };

  // Password Update
  const handlePasswordUpdate = () => {
    if (!passwords.new || !passwords.confirm) {
      Alert.alert("خطأ", "يرجى تعبئة كافة الحقول");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      Alert.alert("خطأ", "كلمة المرور الجديدة غير متطابقة");
      return;
    }
    setActiveModal(null);
    setPasswords({ current: "", new: "", confirm: "" });
    Alert.alert("تم", "تم تحديث كلمة المرور بنجاح");
  };

  const SettingRow = ({ icon: Icon, title, description, value, onValueChange, showDivider = true }) => (
    <View className={`flex-row items-center justify-between py-4 ${showDivider ? 'border-b border-gray-50' : ''}`}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#05997F" }}
        thumbColor={"#FFFFFF"}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
      <View className="flex-1 flex-row items-center gap-4 justify-end">
        <View className="flex-1">
          <Text className="text-base font-extrabold text-gray-900 text-right">{title}</Text>
          {description && <Text className="text-[10px] font-bold text-gray-400 mt-0.5 text-right leading-relaxed">{description}</Text>}
        </View>
        <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
          <Icon size={22} color="#05997F" strokeWidth={2.5} />
        </View>
      </View>
    </View>
  );

  const ClickableRow = ({ icon: Icon, title, subtitle, onPress, showDivider = true }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 ${showDivider ? 'border-b border-gray-50' : ''}`}
      activeOpacity={0.6}
    >
      <ArrowRight size={16} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
      <View className="flex-1 flex-row items-center gap-4 justify-end">
        <View className="flex-1">
          <Text className="text-base font-extrabold text-gray-900 text-right">{title}</Text>
          <Text className="text-[10px] font-bold text-gray-400 mt-0.5 text-right leading-relaxed">{subtitle}</Text>
        </View>
        <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
          <Icon size={22} color="#05997F" strokeWidth={2.5} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const ModalHeader = ({ title, onClose }) => (
    <View className="flex-row items-center justify-between mb-8 pb-4 border-b border-gray-50">
       <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-xl">
         <X size={20} color="#6B7280" />
       </TouchableOpacity>
       <Text className="text-xl font-extrabold text-gray-900">{title}</Text>
       <View className="w-10" />
    </View>
  );

  const FormInput = ({ label, value, onChangeText, placeholder, secureTextEntry = false }) => (
    <View className="mb-5">
      <Text className="text-sm font-extrabold text-gray-700 mb-2 text-right">{label}</Text>
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
                  <Text className="text-[10px] font-extrabold text-white uppercase tracking-tighter">صيدلي معتمد</Text>
                </View>
              </View>
              <Text className="text-2xl font-extrabold text-white mt-8 mb-1.5 tracking-tight">{accountData.name}</Text>
              <View className="flex-row items-center gap-2 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 mt-3">
                <Text className="text-sm font-bold text-white/90">{pharmacyData.name}</Text>
                <View className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                <MapPin size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-xs font-bold text-white/70">{pharmacyData.address.split('،')[1] || "الرياض"}</Text>
              </View>
            </View>
          </View>

          <View className="px-5 -mt-6">
            {/* Account & Pharmacy Section */}
            <View className="bg-white rounded-[2.5rem] p-7 mb-6 border border-gray-100 shadow-sm">
              <View className="flex-row items-center justify-end mb-6 gap-2">
                <Text className="text-lg font-extrabold text-gray-900">الحساب والصيدلية</Text>
                <View className="w-1 h-6 bg-primary rounded-full" />
              </View>
              <ClickableRow
                icon={Settings}
                title="بياناتي"
                subtitle="تعديل الاسم ورقم الهاتف والبريد"
                onPress={() => {
                  setTempProfile({ ...accountData });
                  setActiveModal('profile');
                }}
              />
              <ClickableRow
                icon={Lock}
                title="تغيير كلمة المرور"
                subtitle="تحديث كلمة مرور الحساب"
                onPress={() => setActiveModal('password')}
              />
              <ClickableRow
                icon={Home}
                title="بيانات الصيدلية"
                subtitle="اسم الصيدلية، العنوان، ورقم التواصل"
                onPress={() => {
                  setTempPharmacy({ ...pharmacyData });
                  setActiveModal('pharmacy');
                }}
                showDivider={false}
              />
            </View>

            {/* Workflow Section */}
            <View className="bg-white rounded-[2.5rem] p-7 mb-6 border border-gray-100 shadow-sm">
              <View className="flex-row items-center justify-end mb-6 gap-2">
                <Text className="text-lg font-extrabold text-gray-900">سير العمل</Text>
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
                <Text className="text-lg font-extrabold text-gray-900">النظام والدعم</Text>
                <View className="w-1 h-6 bg-primary rounded-full" />
              </View>
              
              <TouchableOpacity 
                onPress={() => Alert.alert("اللغة", "اللغة العربية مفعلة حالياً")}
                className="flex-row items-center justify-between py-4 border-b border-gray-50"
              >
                <Text className="text-sm font-extrabold text-primary">العربية</Text>
                <View className="flex-row items-center gap-4">
                  <Text className="text-base font-extrabold text-gray-900">لغة التطبيق</Text>
                  <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
                    <Globe size={22} color="#05997F" strokeWidth={2.5} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => Alert.alert("الدعم", "للمساعدة، تواصل مع إدارة PharmaSign")}
                className="flex-row items-center justify-between py-4 border-b border-gray-50"
              >
                <ArrowRight size={16} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
                <View className="flex-row items-center gap-4">
                  <Text className="text-base font-extrabold text-gray-900">مساعدة ودعم</Text>
                  <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10">
                    <HelpCircle size={22} color="#05997F" strokeWidth={2.5} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center justify-between py-4"
                onPress={handleLogout}
              >
                <View className="w-6" />
                <View className="flex-row items-center gap-4">
                  <Text className="text-base font-extrabold text-red-500">تسجيل الخروج</Text>
                  <View className="w-12 h-12 bg-red-50 rounded-2xl items-center justify-center border border-red-100">
                    <LogOut size={22} color="#EF4444" strokeWidth={2.5} />
                  </View>
                </View>
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
            {activeModal === 'profile' && (
              <View>
                <ModalHeader title="تحرير البيانات" onClose={() => setActiveModal(null)} />
                <FormInput 
                  label="اسم الصيدلي" 
                  value={tempProfile.name} 
                  onChangeText={(t) => setTempProfile({...tempProfile, name: t})} 
                />
                <FormInput 
                  label="رقم الهاتف" 
                  value={tempProfile.phone} 
                  onChangeText={(t) => setTempProfile({...tempProfile, phone: t})} 
                />
                <FormInput 
                  label="البريد الإلكتروني" 
                  value={tempProfile.email} 
                  onChangeText={(t) => setTempProfile({...tempProfile, email: t})} 
                />
                <TouchableOpacity onPress={saveProfile} className="bg-pharmacist h-16 rounded-2xl items-center justify-center mt-4">
                  <Text className="text-white font-extrabold text-lg">حفظ التغييرات</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeModal === 'password' && (
              <View>
                <ModalHeader title="تغيير كلمة المرور" onClose={() => setActiveModal(null)} />
                <FormInput 
                  label="كلمة المرور الحالية" 
                  secureTextEntry 
                  value={passwords.current} 
                  onChangeText={(t) => setPasswords({...passwords, current: t})} 
                />
                <FormInput 
                  label="كلمة المرور الجديدة" 
                  secureTextEntry 
                  value={passwords.new} 
                  onChangeText={(t) => setPasswords({...passwords, new: t})} 
                />
                <FormInput 
                  label="تأكيد كلمة المرور" 
                  secureTextEntry 
                  value={passwords.confirm} 
                  onChangeText={(t) => setPasswords({...passwords, confirm: t})} 
                />
                <TouchableOpacity onPress={handlePasswordUpdate} className="bg-pharmacist h-16 rounded-2xl items-center justify-center mt-4">
                  <Text className="text-white font-extrabold text-lg">تحديث كلمة المرور</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeModal === 'pharmacy' && (
              <View>
                <ModalHeader title="بيانات الصيدلية" onClose={() => setActiveModal(null)} />
                <FormInput 
                  label="اسم الصيدلية" 
                  value={tempPharmacy.name} 
                  onChangeText={(t) => setTempPharmacy({...tempPharmacy, name: t})} 
                />
                <FormInput 
                  label="العنوان / المنطقة" 
                  value={tempPharmacy.address} 
                  onChangeText={(t) => setTempPharmacy({...tempPharmacy, address: t})} 
                />
                <FormInput 
                  label="رقم تواصل الصيدلية" 
                  value={tempPharmacy.contact} 
                  onChangeText={(t) => setTempPharmacy({...tempPharmacy, contact: t})} 
                />
                <TouchableOpacity onPress={savePharmacy} className="bg-pharmacist h-16 rounded-2xl items-center justify-center mt-4">
                  <Text className="text-white font-extrabold text-lg">حفظ بيانات الصيدلية</Text>
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