import { authApi } from "@/api/authApi";
import { pharmacyApi } from "@/api/pharmacyApi";
import LogoCard from "@/components/mobile/LogoCard";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import MobileShell from "@/components/mobile/MobileShell";
import { normalizePhoneNumber } from "@/utils/phoneUtils";
import { useRouter } from "expo-router";
import { AlertCircle, Building2, Lock, MessageSquare, Phone, ShieldCheck, User } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, ChevronDown, Check } from "lucide-react-native";


const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = "default", error, onBlur }) => (
  <View>
    <Text className="text-gray-700 text-sm font-bold mb-2 ml-1 text-right">{label}</Text>
    <View className="relative">
        <TextInput
          className={`bg-white border rounded-xl px-4 py-4 text-gray-800 text-base pl-12 ${error ? "border-red-500" : "border-gray-100"}`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        textAlign="right"
        onBlur={onBlur}
      />
      <View className="absolute left-4 top-4">
        <Icon size={20} color={error ? "#EF4444" : "#9CA3AF"} />
      </View>
    </View>
    {error ? (
      <View className="flex-row items-center justify-end mt-1.5 mr-1 gap-1">
        <Text className="text-red-500 text-[11px] font-bold text-right">{error}</Text>
        <AlertCircle size={12} color="#EF4444" />
      </View>
    ) : null}
  </View>
);

export default function PharmacistRegister() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [step, setStep] = useState(0); // 0: data entry, 1: OTP
  const [formData, setFormData] = useState({
    name: "",
    selectedPharmacy: null,
    license_number: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Real Pharmacy Data State
  const [pharmacies, setPharmacies] = useState([]);
  const [isPharmaciesLoading, setIsPharmaciesLoading] = useState(true);
  const [pharmaciesError, setPharmaciesError] = useState(null);

  const loadPharmacies = async () => {
    setIsPharmaciesLoading(true);
    setPharmaciesError(null);
    try {
      const res = await pharmacyApi.getContractedPharmacies();
      if (res.success) {
        setPharmacies(res.data || []);
      } else {
        setPharmaciesError(res.message || "تعذر تحميل الصيدليات المتعاقدة");
      }
    } catch (err) {
      setPharmaciesError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsPharmaciesLoading(false);
    }
  };

  React.useEffect(() => {
    loadPharmacies();
  }, []);

  const validateStep1 = () => {
    const newErrors = {};

    // 1. Full Name Validation
    const nameTrimmed = formData.name.trim();
    const arabicWords = nameTrimmed.split(/\s+/).filter(word => /^[\u0600-\u06FF]{2,}$/.test(word));
    if (!nameTrimmed) {
      newErrors.name = "يرجى إدخال الاسم الثلاثي";
    } else if (arabicWords.length < 3) {
      newErrors.name = "الاسم الثلاثي يجب أن يحتوي على ثلاث كلمات عربية صحيحة على الأقل";
    }

    // 2. Pharmacy Selection Validation
    if (!formData.selectedPharmacy) {
      newErrors.selectedPharmacy = "يرجى اختيار الصيدلية المتعاقدة التي تعمل بها";
    }

    // 3. License Number Validation
    const licenseTrimmed = formData.license_number.trim();
    const hasDigit = /\d/.test(licenseTrimmed);
    const validChars = /^[a-zA-Z0-9\/\-\u0600-\u06FF\s]+$/.test(licenseTrimmed);
    if (!licenseTrimmed) {
      newErrors.license_number = "رقم رخصة الصيدلي مطلوب للتحقق من الحساب";
    } else if (licenseTrimmed.length < 5 || !hasDigit || !validChars) {
      newErrors.license_number = "رقم رخصة الصيدلي غير صالح";
    }

    // 4. Phone Number Validation
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = "يرجى إدخال رقم الجوال";
    } else if (!/^09\d{8}$/.test(phoneTrimmed)) {
      newErrors.phone = "رقم الجوال يجب أن يبدأ بـ 09 ويتكون من 10 أرقام";
    }

    // 5. Password Validation
    if (!formData.password) {
      newErrors.password = "يرجى إدخال كلمة المرور";
    } else if (formData.password.length < 8 || !(/[a-zA-Z\u0600-\u06FF]/.test(formData.password) && /\d/.test(formData.password))) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على رقم وحرف";
    }

    // 6. Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور وتأكيدها غير متطابقين";
    }

    // 7. Terms
    if (!acceptedTerms) {
      newErrors.terms = "يجب الموافقة على سياسة الخدمة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterStep1 = async () => {
    if (!validateStep1()) return;

    setErrors({});
    setIsLoading(true);

    const normalizedPhone = normalizePhoneNumber(formData.phone);
    const res = await authApi.requestPharmacistOTP(normalizedPhone);
    setIsLoading(false);

    if (res.success) {
      if (res.data?.debug_otp) {
        setDebugOtp(res.data.debug_otp);
      } else {
        setDebugOtp("");
      }
      setStep(1);
    } else {
      setErrors({ phone: res.message });
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setErrors({ otp: "يرجى إدخال رمز التحقق" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    const payload = {
      full_name: formData.name.trim(),
      phone_number: normalizePhoneNumber(formData.phone),
      password: formData.password,
      license_number: formData.license_number.trim(),
      // Backend now supports pharmacy_id; legacy pharmacy_name/address fallback removed.
      pharmacy_id: formData.selectedPharmacy.id,
      otp: otp.trim()
    };

    console.log("Pharmacist registration payload prepared");

    const res = await authApi.registerPharmacist(payload);
    setIsLoading(false);

    if (res.success) {
      setShowSuccessModal(true);
    } else {
      setErrors({ otp: res.message });
    }
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <MobileShell className="bg-primary" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1 bg-background"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="bg-pharmacist px-5 pt-4 pb-8 rounded-b-[2rem]">
            <View className="mb-4" style={{ position: 'relative', minHeight: 44 }}>
              <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
                <HeaderBackButton 
                  onPress={step === 1 ? () => { setStep(0); setErrors({}); } : undefined}
                  fallback={step === 0 ? "/pharmacist/PharmacistLogin" : undefined} 
                  color="#05997F" 
                />
              </View>
            </View>

            <View className="items-center">
              <LogoCard size={80} borderRadius={24} padding={16} style={{ marginBottom: 16 }} />
              <Text className="text-white text-2xl font-extrabold text-center">
                {step === 0 ? "إنشاء حساب جديد" : "التحقق من الرقم"}
              </Text>
              <Text className="text-white/70 text-sm mt-1 text-center font-bold">
                {step === 0 ? "انضم إلى شبكة الصيادلة في فارماساين" : "تم إرسال رمز تحقق إلى رقم جوالك"}
              </Text>
            </View>
          </View>

          {/* Form Content */}
          <View className="px-6 pt-8 pb-10 gap-5">
            {step === 0 ? (
              <>
                <View className="gap-5 flex-1">
                <InputField 
                  icon={User} 
                  label="الاسم الثلاثي" 
                  value={formData.name} 
                  onChangeText={(t) => { setFormData({...formData, name: t}); clearFieldError("name"); }} 
                  placeholder="أدخل اسمك الكامل" 
                  error={errors.name}
                />

                <View className="mt-4 mb-2">
                  <Text className="text-gray-900 text-lg font-extrabold text-right">بيانات الصيدلية</Text>
                  <Text className="text-gray-400 text-[10px] font-bold text-right leading-relaxed mb-4">
                    اختر الصيدلية المتعاقدة التي تعمل بها.
                  </Text>
                </View>

                {/* Pharmacy Selector */}
                <View>
                  <Text className="text-gray-700 text-sm font-bold mb-2 ml-1 text-right">الصيدلية</Text>
                  <TouchableOpacity
                    onPress={() => setShowPharmacyModal(true)}
                    activeOpacity={0.7}
                    className={`bg-white border rounded-xl px-4 py-4 flex-row items-center justify-between ${errors.selectedPharmacy ? "border-red-500" : "border-gray-100"}`}
                  >
                    <ChevronDown size={20} color="#9CA3AF" />
                    <Text 
                      className={`text-base flex-1 text-right mr-2 ${formData.selectedPharmacy ? "text-gray-800" : "text-gray-400"}`}
                      numberOfLines={1}
                    >
                      {formData.selectedPharmacy 
                        ? `${formData.selectedPharmacy.name}${
                            formData.selectedPharmacy.city || formData.selectedPharmacy.region 
                              ? ` — ${[formData.selectedPharmacy.city, formData.selectedPharmacy.region].filter(Boolean).join(" / ")}`
                              : ""
                          }` 
                        : isPharmaciesLoading 
                          ? "جاري تحميل الصيدليات..." 
                          : "اختر الصيدلية"}
                    </Text>
                    <Building2 size={20} color={errors.selectedPharmacy ? "#EF4444" : "#9CA3AF"} />
                  </TouchableOpacity>
                  {errors.selectedPharmacy ? (
                    <View className="flex-row items-center justify-end mt-1.5 mr-1 gap-1">
                      <Text className="text-red-500 text-[11px] font-bold text-right">{errors.selectedPharmacy}</Text>
                      <AlertCircle size={12} color="#EF4444" />
                    </View>
                  ) : null}
                </View>

                {/* Read-only Pharmacy Details Card */}
                {formData.selectedPharmacy && (
                  <View className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mt-2">
                    <View className="flex-row justify-end mb-2">
                      <Text className="text-primary font-bold text-[10px]">تفاصيل الفرع</Text>
                    </View>
                    <View className="gap-2">
                      {(() => {
                        const city = String(formData.selectedPharmacy.city || "").trim();
                        const hidden = ["غير محدد", "غير محددة", "none", "null", "undefined", ".", "-", ""];
                        if (!city || hidden.includes(city.toLowerCase())) return null;
                        return (
                          <View className="flex-row justify-between items-center">
                            <Text className="text-gray-800 font-bold text-sm text-right flex-1">{city}</Text>
                            <Text className="text-gray-400 text-xs font-bold w-16 text-left">المدينة:</Text>
                          </View>
                        );
                      })()}
                      
                      {(() => {
                        const region = String(formData.selectedPharmacy.region || "").trim();
                        const hidden = ["غير محدد", "غير محددة", "none", "null", "undefined", ".", "-", ""];
                        if (!region || hidden.includes(region.toLowerCase())) return null;
                        return (
                          <View className="flex-row justify-between items-center">
                            <Text className="text-gray-800 font-bold text-sm text-right flex-1">{region}</Text>
                            <Text className="text-gray-400 text-xs font-bold w-16 text-left">المنطقة:</Text>
                          </View>
                        );
                      })()}

                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-800 font-bold text-sm text-right flex-1">{formData.selectedPharmacy.address}</Text>
                        <Text className="text-gray-400 text-xs font-bold w-16 text-left">العنوان:</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View className="mt-6 mb-2">
                  <Text className="text-gray-900 text-lg font-extrabold text-right">معلومات الحساب</Text>
                </View>

                <InputField 
                  icon={ShieldCheck} 
                  label="رقم رخصة الصيدلي" 
                  value={formData.license_number} 
                  onChangeText={(t) => { setFormData({...formData, license_number: t}); clearFieldError("license_number"); }} 
                  placeholder="أدخل رقم الرخصة المهنية" 
                  error={errors.license_number}
                />
                <InputField 
                  icon={Phone} 
                  label="رقم الجوال" 
                  value={formData.phone} 
                  onChangeText={(t) => { setFormData({...formData, phone: t}); clearFieldError("phone"); }} 
                  placeholder="09XXXXXXXX" 
                  keyboardType="number-pad" 
                  error={errors.phone}
                />
                <InputField 
                  icon={Lock} 
                  label="كلمة المرور" 
                  value={formData.password} 
                  onChangeText={(t) => { setFormData({...formData, password: t}); clearFieldError("password"); }} 
                  placeholder="اختر كلمة مرور قوية" 
                  secureTextEntry 
                  error={errors.password}
                />
                <InputField 
                  icon={Lock} 
                  label="تأكيد كلمة المرور" 
                  value={formData.confirmPassword} 
                  onChangeText={(t) => { setFormData({...formData, confirmPassword: t}); clearFieldError("confirmPassword"); }} 
                  placeholder="أعد إدخال كلمة المرور" 
                  secureTextEntry 
                  error={errors.confirmPassword}
                />
                
                <View className="mb-8">
                  <TouchableOpacity 
                    onPress={() => { setAcceptedTerms(!acceptedTerms); clearFieldError("terms"); }}
                    className="flex-row items-start gap-3 mt-3"
                    activeOpacity={0.8}
                  >
                    <View className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${acceptedTerms ? 'border-primary bg-primary' : errors.terms ? 'border-red-500 bg-red-50' : 'border-primary/20 bg-primary/5'}`}>
                      {acceptedTerms && <View className="w-3 h-3 bg-white rounded-sm" />}
                    </View>
                    <Text className="text-xs text-gray-400 font-bold flex-1 leading-relaxed text-right">
                      أقر بصحة جميع البيانات المدخلة وموافقتي على <Text className="text-primary font-extrabold underline">سياسة الخدمة</Text>
                    </Text>
                  </TouchableOpacity>
                  {errors.terms ? (
                    <Text className="text-red-500 text-[11px] font-bold text-right mt-2 mr-1">{errors.terms}</Text>
                  ) : null}
                </View>

                <TouchableOpacity 
                  className={`w-full py-4 rounded-xl items-center mt-2 shadow-sm flex-row justify-center gap-2 ${
                    isLoading ? "bg-primary/50" : "bg-primary"
                  }`}
                  onPress={handleRegisterStep1} 
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text className="text-white font-bold text-base">جاري المعالجة...</Text>
                    </>
                  ) : (
                    <Text className="text-white font-bold text-base">تقديم طلب التسجيل</Text>
                  )}
                </TouchableOpacity>

                <View className="flex-row items-center justify-center mt-8 gap-1.5">
                  <TouchableOpacity onPress={() => router.replace("/pharmacist/PharmacistLogin")}>
                    <Text className="text-primary font-extrabold text-base">تسجيل الدخول</Text>
                  </TouchableOpacity>
                  <Text className="text-gray-400 font-bold text-base">لديك حساب بالفعل؟</Text>
                </View>
                </View>
              </>
          ) : (
            <View className="flex-1">
              <View className="items-center mb-10">
                <View className="w-20 h-20 bg-primary/5 rounded-full items-center justify-center mb-6">
                  <MessageSquare size={40} color="#05997F" />
                </View>
                <Text className="text-2xl font-extrabold text-gray-900 mb-2">التحقق من رقم الجوال</Text>
                <Text className="text-base text-gray-500 font-bold text-center leading-relaxed">
                  تم إرسال رمز تحقق إلى رقم الجوال عبر تيليغرام.
                </Text>
              </View>

              <View className="mb-8">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">رمز التحقق</Text>
                <TextInput
                  className={`bg-white border rounded-2xl px-6 h-16 text-center text-2xl font-bold text-gray-900 shadow-sm ${errors.otp ? "border-red-500" : "border-gray-100"}`}
                  value={otp}
                  onChangeText={(t) => { setOtp(t); clearFieldError("otp"); }}
                  placeholder="أدخل رمز التحقق"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {errors.otp ? (
                  <Text className="text-red-500 text-[11px] font-bold text-center mt-2">{errors.otp}</Text>
                ) : debugOtp ? (
                  <Text className="text-[10px] text-gray-400 font-bold text-center mt-4 leading-relaxed">
                    لأغراض العرض، استخدم الرمز <Text className="text-primary font-extrabold">{debugOtp}</Text>
                  </Text>
                ) : (
                  <View className="mt-4" />
                )}
              </View>

              <TouchableOpacity 
                className={`w-full py-4 rounded-xl items-center mt-2 shadow-sm flex-row justify-center gap-2 ${
                  isLoading ? "bg-primary/50" : "bg-primary"
                }`}
                onPress={handleVerifyOTP}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text className="text-white font-bold text-base">جاري التحقق من الرمز...</Text>
                  </>
                ) : (
                  <Text className="text-white font-bold text-base">تأكيد الرمز</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="mt-8 self-center">
                <Text className="text-primary font-extrabold text-base">إعادة إرسال الرمز</Text>
              </TouchableOpacity>
            </View>
          )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[2.5rem] p-8 items-center shadow-2xl">
            <View className="w-20 h-20 bg-emerald-50 rounded-full items-center justify-center mb-6 border-8 border-emerald-100/50">
               <ShieldCheck size={40} color="#059669" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 mb-4 text-center">
              تم إرسال طلب التسجيل
            </Text>
            <Text className="text-base text-gray-500 font-bold text-center leading-relaxed mb-8 px-2">
              تم التحقق من رقم الجوال بنجاح. تم إرسال طلبك إلى المنظمة لمراجعته، وسيتم تفعيل الحساب بعد الموافقة.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/pharmacist/PharmacistLogin")}
              className="bg-primary w-full h-15 rounded-2xl items-center justify-center shadow-xl shadow-primary/20"
            >
              <Text className="text-white font-extrabold text-lg">العودة إلى تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pharmacy Selection Modal */}
      <Modal
        visible={showPharmacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPharmacyModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[2.5rem] h-[85%] shadow-2xl">
            {/* Modal Header */}
            <View className="px-6 pt-8 pb-4 flex-row items-center justify-between border-b border-gray-50">
              <TouchableOpacity 
                onPress={() => setShowPharmacyModal(false)}
                className="p-2"
              >
                <Text className="text-primary font-extrabold">إغلاق</Text>
              </TouchableOpacity>
              <Text className="text-lg font-extrabold text-gray-900">اختر الصيدلية</Text>
              <View className="w-10" />
            </View>

            {/* Search Bar */}
            <View className="px-6 py-4">
              <View className="relative">
                <TextInput
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 text-right pl-10"
                  placeholder="ابحث عن الصيدلية بالاسم أو المنطقة..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  textAlign="right"
                />
                <View className="absolute left-3 top-3.5">
                  <Search size={18} color="#9CA3AF" />
                </View>
              </View>
            </View>

            {/* Pharmacy List */}
            {isPharmaciesLoading ? (
              <View className="items-center justify-center py-20">
                <ActivityIndicator size="large" color="#05997F" />
                <Text className="text-gray-400 font-bold mt-4">جاري تحميل الصيدليات...</Text>
              </View>
            ) : pharmaciesError ? (
              <View className="items-center justify-center py-20 px-10">
                <AlertCircle size={48} color="#EF4444" />
                <Text className="text-red-500 font-bold mt-4 text-center">{pharmaciesError}</Text>
                <TouchableOpacity 
                  onPress={loadPharmacies}
                  className="mt-6 bg-primary px-8 py-3 rounded-xl shadow-sm"
                >
                  <Text className="text-white font-bold">إعادة المحاولة</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={pharmacies.filter(p => 
                  p.name.includes(searchQuery) || 
                  (p.city && p.city.includes(searchQuery)) || 
                  (p.region && p.region.includes(searchQuery))
                )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
              renderItem={({ item }) => {
                const isSelected = formData.selectedPharmacy?.id === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setFormData({ ...formData, selectedPharmacy: item });
                      clearFieldError("selectedPharmacy");
                      setShowPharmacyModal(false);
                      setSearchQuery("");
                    }}
                    activeOpacity={0.7}
                    className={`py-4 border-b border-gray-50 flex-row items-center justify-between ${isSelected ? "bg-primary/5 -mx-6 px-6" : ""}`}
                  >
                    {isSelected ? (
                      <Check size={20} color="#05997F" />
                    ) : (
                      <View className="w-5" />
                    )}
                    <View className="items-end flex-1 ml-4">
                      <Text className={`text-base font-bold ${isSelected ? "text-primary" : "text-gray-900"}`}>{item.name}</Text>
                      {item.city || item.region ? (
                        <Text className="text-gray-400 text-xs mt-0.5">
                          {[item.city, item.region].filter(Boolean).join(" — ")}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => (
                <View className="items-center justify-center py-20">
                  <Building2 size={48} color="#E5E7EB" />
                  <Text className="text-gray-400 font-bold mt-4 text-center px-10">
                    {pharmacies.length === 0 
                      ? "لا توجد صيدليات متعاقدة حالياً" 
                      : "لا توجد صيدليات تطابق البحث"}
                  </Text>
                </View>
              )}
            />
          )}
          </View>
        </View>
      </Modal>
    </MobileShell>
  );
}