import React, { useState } from "react";
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
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Bell, 
  Pill, 
  Calendar, 
  Info, 
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
  Save,
  Phone,
  Mail,
  Droplet,
  AlertTriangle,
  Lock,
  KeyRound,
  ShieldCheck
} from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import BottomNav from "@/components/mobile/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PatientProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Modal states
  const [activeModal, setActiveModal] = useState(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: user?.name || "أحمد محمد الشهري",
    phone: user?.phone || "0551234567",
    email: user?.email || "ahmed@email.com",
    bloodType: user?.bloodType || "A+",
    allergies: user?.allergies?.join("، ") || "بنسلين",
    chronic: user?.chronicConditions?.join("، ") || "سكري نوع 2، ضغط دم",
  });

  // Settings state (from PatientSettings.jsx)
  const [settings, setSettings] = useState({
    notifications: true,
    prescriptionReminders: true,
    darkMode: false,
    useBiometrics: true,
  });

  // Security state (from PatientSecurity.jsx)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleLogout = () => {
    logout();
    router.replace("/RoleSelect");
  };

  const toggleSetting = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSaveProfile = () => {
    Alert.alert("تم", "تم حفظ البيانات بنجاح");
    setActiveModal(null);
  };

  const handleUpdatePassword = () => {
    if (!passwords.new || !passwords.confirm) {
      Alert.alert("خطأ", "يرجى تعبئة كافة الحقول");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      Alert.alert("خطأ", "كلمة المرور الجديدة غير متطابقة");
      return;
    }
    Alert.alert("تم", "تم تحديث كلمة المرور بنجاح");
    setPasswords({ current: "", new: "", confirm: "" });
    setActiveModal(null);
  };

  // Helper Components
  const ModalHeader = ({ title, onClose }) => (
    <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-gray-50">
      <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-xl">
        <X size={20} color="#6B7280" />
      </TouchableOpacity>
      <Text className="text-xl font-extrabold text-gray-900">{title}</Text>
      <View className="w-10" />
    </View>
  );

  const FormInput = ({ label, value, onChangeText, placeholder, icon: Icon, multiline = false, secureTextEntry = false }) => (
    <View className="mb-4">
      <Text className="text-sm font-extrabold text-gray-700 mb-2 text-right">{label}</Text>
      <View className={`flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 ${multiline ? 'h-24 py-2' : 'h-14'}`}>
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
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#022451" }}
        thumbColor={"#FFFFFF"}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
      <View className="flex-1 flex-row items-center gap-4 justify-end">
        <View className="flex-1">
          <Text className="text-base font-extrabold text-gray-900 text-right">{title}</Text>
          {description && <Text className="text-[10px] font-bold text-gray-400 mt-0.5 text-right leading-relaxed">{description}</Text>}
        </View>
        <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
          <Icon size={22} color="#022451" strokeWidth={2.5} />
        </View>
      </View>
    </View>
  );

  const MenuLink = ({ icon: Icon, title, subtitle, modal, color }) => (
    <TouchableOpacity
      onPress={() => setActiveModal(modal)}
      className="flex-row items-center p-4 bg-white border-b border-gray-50"
      activeOpacity={0.7}
    >
      <View className={`w-10 h-10 rounded-full items-center justify-center ${color}`}>
        <Icon size={20} color="#FFFFFF" />
      </View>
      <View className="flex-1 px-4">
        <Text className="text-sm font-bold text-gray-900 text-right">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-gray-500 mt-0.5 text-right">{subtitle}</Text>
        )}
      </View>
      <ChevronLeft size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-patient px-5 pt-12 pb-8 rounded-b-[2rem] items-center">
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
            {profileData.name}
          </Text>
          <Text className="text-sm text-white/80">{profileData.phone}</Text>

          <View className="flex-row items-center gap-2 mt-4 bg-white/15 px-4 py-2 rounded-full">
            <Activity size={16} color="#FFFFFF" />
            <Text className="text-sm text-white font-bold">
              فصيلة الدم: {profileData.bloodType}
            </Text>
          </View>
        </View>

        <View className="px-5 -mt-4">
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <MenuLink
              icon={User}
              title="تعديل الملف الشخصي"
              subtitle="تحديث بياناتك الشخصية والصحية"
              modal="editProfile"
              color="bg-blue-500"
            />
            <MenuLink
              icon={Settings}
              title="الإعدادات"
              subtitle="التنبيهات، اللغة، والمظهر"
              modal="settings"
              color="bg-patient"
            />
            <MenuLink
              icon={Shield}
              title="الأمان والخصوصية"
              subtitle="كلمة المرور والأجهزة المتصلة"
              modal="security"
              color="bg-emerald-500"
            />
            <MenuLink
              icon={FileText}
              title="الشروط والأحكام"
              subtitle="سياسة الخصوصية واستخدام التطبيق"
              modal="privacy"
              color="bg-amber-500"
            />
            <MenuLink
              icon={HelpCircle}
              title="المساعدة والدعم"
              subtitle="الأسئلة الشائعة والتواصل معنا"
              modal="help"
              color="bg-violet-500"
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
                  />
                  <FormInput
                    label="البريد الإلكتروني"
                    value={profileData.email}
                    onChangeText={(t) => setProfileData({ ...profileData, email: t })}
                    icon={Mail}
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
                    className="bg-patient h-16 rounded-2xl items-center justify-center mt-6"
                  >
                    <Text className="text-white font-extrabold text-lg">حفظ التغييرات</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* SETTINGS MODAL */}
              {activeModal === "settings" && (
                <View>
                  <ModalHeader title="الإعدادات" onClose={() => setActiveModal(null)} />
                  
                  <View className="mb-6">
                    <View className="flex-row items-center justify-end mb-4 gap-2">
                       <Text className="text-lg font-extrabold text-gray-900">التنبيهات</Text>
                       <View className="w-1 h-6 bg-patient rounded-full" />
                    </View>
                    <SettingRow
                      icon={Bell}
                      title="إشعارات التطبيق"
                      description="السماح للتطبيق بإرسال تنبيهات عامة"
                      value={settings.notifications}
                      onValueChange={() => toggleSetting("notifications")}
                    />
                    <SettingRow
                      icon={Smartphone}
                      title="تنبيهات الأدوية"
                      description="تذكير بمواعيد الأدوية واستلام الوصفات"
                      value={settings.prescriptionReminders}
                      onValueChange={() => toggleSetting("prescriptionReminders")}
                      showDivider={false}
                    />
                  </View>

                  <View className="mb-6">
                    <View className="flex-row items-center justify-end mb-4 gap-2">
                       <Text className="text-lg font-extrabold text-gray-900">المظهر واللغة</Text>
                       <View className="w-1 h-6 bg-patient rounded-full" />
                    </View>
                    <SettingRow
                      icon={Moon}
                      title="الوضع الداكن"
                      description="تغيير مظهر التطبيق إلى الألوان الليلية"
                      value={settings.darkMode}
                      onValueChange={() => toggleSetting("darkMode")}
                    />
                    <TouchableOpacity 
                      onPress={() => Alert.alert("اللغة", "اللغة العربية مفعلة حالياً")}
                      className="flex-row items-center justify-between py-5"
                    >
                      <View className="flex-row items-center gap-2">
                         <Text className="text-sm font-extrabold text-patient">العربية</Text>
                         <ArrowRight size={14} color="#022451" style={{ transform: [{ rotate: '180deg' }] }} />
                      </View>
                      <View className="flex-row items-center gap-4">
                        <View className="flex-1">
                           <Text className="text-base font-extrabold text-gray-900 text-right">لغة التطبيق</Text>
                           <Text className="text-[10px] font-bold text-gray-400 mt-1 text-right">تغيير لغة واجهة المستخدم</Text>
                        </View>
                        <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                          <Globe size={22} color="#022451" strokeWidth={2.5} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View className="mb-6">
                    <View className="flex-row items-center justify-end mb-4 gap-2">
                       <Text className="text-lg font-extrabold text-gray-900">الأمان</Text>
                       <View className="w-1 h-6 bg-patient rounded-full" />
                    </View>
                    <SettingRow
                      icon={ShieldAlert}
                      title="قفل التطبيق"
                      description="استخدام البصمة لتعزيز سرية بياناتك"
                      value={settings.useBiometrics}
                      onValueChange={() => toggleSetting("useBiometrics")}
                      showDivider={false}
                    />
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
                      className="bg-patient h-14 rounded-xl flex-row items-center justify-center mt-2"
                      onPress={handleUpdatePassword}
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-bold text-base">تحديث كلمة المرور</Text>
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

                  <TouchableOpacity 
                    onPress={() => Alert.alert("اتصال", "جاري الاتصال بـ 920000000")}
                    className="bg-white p-6 rounded-2xl border border-gray-100 items-center justify-center gap-2 shadow-sm mb-8"
                  >
                    <View className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center">
                      <Phone size={28} color="#3B82F6" />
                    </View>
                    <Text className="text-base font-bold text-gray-900 mt-2">اتصل بنا</Text>
                    <Text className="text-sm text-gray-500">920000000</Text>
                  </TouchableOpacity>

                  <View className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
                    <Text className="text-lg font-extrabold text-gray-900 mb-4 text-right">الأسئلة الشائعة</Text>
                    
                    {[
                      "كيف يمكنني عرض الوصفة الطبية بلغة الإشارة؟",
                      "هل يمكن للصيدلي رؤية جميع وصفاتي السابقة؟",
                      "ماذا أفعل في حال فقدت رمز الاستجابة السريعة؟",
                      "كيف يمكنني تحديث بياناتي الصحية؟"
                    ].map((q, idx) => (
                      <TouchableOpacity key={idx} className="flex-row items-center justify-between py-4 border-b border-gray-100">
                        <ChevronLeft size={18} color="#9CA3AF" />
                        <Text className="text-sm font-bold text-gray-800 text-right flex-1 pr-4">{q}</Text>
                      </TouchableOpacity>
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
