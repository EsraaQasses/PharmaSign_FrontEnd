import React, { useState } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import { User, Phone, Lock, ShieldCheck, MessageSquare, Calendar } from "lucide-react-native";
import LogoCard from "@/components/mobile/LogoCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import PageHeader from "@/components/mobile/PageHeader";
import { authApi } from "@/api/authApi";
import { normalizePhoneNumber } from "@/utils/phoneUtils";
import { normalizeArabicNumerals, parseAndNormalizeDate } from "@/utils/formatters";

export default function PatientRegister() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [step, setStep] = useState(0); // 0: data entry, 1: OTP
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: ""
  });
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mapBackendError = (message, resData = null, defaultMessage = "تعذر إرسال طلب إنشاء الحساب، يرجى المحاولة مرة أخرى") => {
    let msgToMap = message;
    
    if (resData) {
      const fieldsToCheck = ["birth_date", "password", "confirm_password", "phone_number", "full_name", "otp", "non_field_errors"];
      const errorsToSearch = resData.fields ? { ...resData, ...resData.fields } : resData;
      
      for (const field of fieldsToCheck) {
        if (errorsToSearch[field]) {
          msgToMap = Array.isArray(errorsToSearch[field]) ? errorsToSearch[field][0] : errorsToSearch[field];
          break;
        }
      }
    }

    if (!msgToMap) return defaultMessage;
    const msgLower = msgToMap.toLowerCase();
    
    if (msgLower.includes("missing or invalid required fields") || msgLower.includes("missing_required_fields")) return "يرجى التأكد من تعبئة جميع الحقول المطلوبة";
    if (msgLower.includes("invalid otp") || msgLower.includes("invalid_otp")) return "رمز التحقق غير صحيح";
    if (msgLower.includes("otp_expired") || msgLower.includes("expired")) return "انتهت صلاحية رمز التحقق";
    if (msgLower.includes("otp_locked") || msgLower.includes("too many") || msgLower.includes("otp_max_attempts_exceeded")) return "تم تجاوز عدد المحاولات المسموح بها، يرجى طلب رمز جديد لاحقاً";
    if (msgLower.includes("duplicate phone") || msgLower.includes("duplicate_phone") || msgLower.includes("phone already exists")) return "رقم الجوال مستخدم مسبقاً";
    if (msgLower.includes("password_too_weak") || msgLower.includes("password is too") || msgLower.includes("common")) return "كلمة المرور ضعيفة، يرجى اختيار كلمة أقوى";
    if (msgLower.includes("passwords do not match") || msgLower.includes("passwords_do_not_match")) return "كلمتا المرور غير متطابقتين";
    if (msgLower.includes("date has wrong format") || msgLower.includes("birth_date") || msgLower.includes("تاريخ ميلاد")) return "يرجى إدخال تاريخ ميلاد صحيح أو ترك الحقل فارغاً";
    if (msgLower.includes("phone_number") || msgLower.includes("رقم جوال")) return "يرجى إدخال رقم جوال صحيح";

    return defaultMessage;
  };

  const handleRegisterStep1 = async () => {
    if (!formData.name.trim()) {
      setError("يرجى إدخال الاسم الثلاثي");
      return;
    }
    if (!formData.phone.trim()) {
      setError("يرجى إدخال رقم جوال صحيح");
      return;
    }
    
    const normalizedPhone = normalizePhoneNumber(normalizeArabicNumerals(formData.phone));
    if (!normalizedPhone || normalizedPhone.length < 10) {
      setError("رقم الجوال يجب أن يبدأ بـ 09 ويتكون من 10 أرقام");
      return;
    }

    if (!formData.password.trim()) {
      setError("يرجى إدخال كلمة المرور");
      return;
    }
    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    
    let normalizedBirthDate = null;
    if (formData.birthDate && formData.birthDate.trim() !== "") {
      normalizedBirthDate = parseAndNormalizeDate(formData.birthDate);
      if (!normalizedBirthDate) {
        setError("يرجى إدخال تاريخ ميلاد صحيح أو ترك الحقل فارغاً");
        return;
      }
    }

    if (!acceptedTerms) {
      setError("يرجى الموافقة على الشروط وسياسة الخصوصية");
      return;
    }

    setError("");
    setIsLoading(true);
    
    const res = await authApi.requestPatientOTP(normalizedPhone);
    setIsLoading(false);

    if (res.success) {
      if (res.data?.debug_otp) {
        setDebugOtp(res.data.debug_otp);
      } else {
        setDebugOtp("");
      }
      setStep(1);
    } else {
      setError(mapBackendError(res.message, res.data, "تعذر إرسال رمز التحقق، يرجى المحاولة مرة أخرى"));
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("يرجى إدخال رمز التحقق");
      return;
    }

    setError("");
    setIsLoading(true);

    const payload = {
      full_name: formData.name.trim(),
      phone_number: normalizePhoneNumber(normalizeArabicNumerals(formData.phone)),
      password: formData.password,
      confirm_password: formData.confirmPassword,
      otp: normalizeArabicNumerals(otp.trim())
    };

    if (formData.birthDate && formData.birthDate.trim() !== "") {
      const normalizedBirthDate = parseAndNormalizeDate(formData.birthDate);
      if (normalizedBirthDate) {
        payload.birth_date = normalizedBirthDate;
      }
    }

    const res = await authApi.registerPatient(payload);
    setIsLoading(false);

    if (res.success) {
      setShowSuccessModal(true);
    } else {
      const isOtpError = res.message?.toLowerCase().includes("otp") || 
                         res.data?.code?.toLowerCase().includes("otp") || 
                         res.data?.fields?.otp || res.data?.otp;
      
      const mappedError = mapBackendError(res.message, res.data);
      setError(mappedError);
      
      if (!isOtpError) {
        setStep(0);
      }
    }
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = "default" }) => (
    <View>
      <Text className="text-gray-700 text-sm font-bold mb-2 ml-1 text-right">{label}</Text>
      <View className="relative">
        <TextInput
          className="bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 text-base pl-12"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          textAlign="right"
        />
        <View className="absolute left-4 top-4">
          <Icon size={20} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView 
        className="flex-1 bg-background"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="bg-patient px-5 pt-4 pb-8 rounded-b-[2rem]">
            <View className="mb-4" style={{ position: 'relative', minHeight: 44 }}>
              <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
                <HeaderBackButton 
                  onPress={step === 1 ? () => { setStep(0); setError(""); } : undefined}
                  fallback={step === 0 ? "/patient/PatientLogin" : undefined} 
                  color="#022451" 
                />
              </View>
            </View>

            <View className="items-center">
              <LogoCard size={80} borderRadius={24} padding={16} style={{ marginBottom: 16 }} />
              <Text className="text-white text-2xl font-extrabold text-center">
                {step === 0 ? "إنشاء حساب جديد" : "التحقق من الرقم"}
              </Text>
              <Text className="text-white/70 text-sm mt-1 text-center font-bold">
                {step === 0 ? "أهلاً بك في فارماساين، يرجى تعبئة بياناتك" : "تم إرسال رمز تحقق إلى رقم جوالك"}
              </Text>
            </View>
          </View>

          {/* Form Content */}
          <View className="px-6 pt-8 pb-10 gap-5">
            {step === 0 ? (
              <>
                {error ? (
                  <View className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <Text className="text-red-600 text-sm text-center font-bold">{error}</Text>
                  </View>
                ) : null}

                <View className="gap-5 flex-1">
                <InputField 
                  icon={User} 
                  label="الاسم الثلاثي" 
                  value={formData.name} 
                  onChangeText={(t) => setFormData({...formData, name: t})} 
                  placeholder="الاسم الثلاثي كما في الهوية" 
                />
                <InputField 
                  icon={Phone} 
                  label="رقم الجوال" 
                  value={formData.phone} 
                  onChangeText={(t) => setFormData({...formData, phone: t})} 
                  placeholder="05XXXXXXXX" 
                  keyboardType="number-pad"
                />
                <InputField 
                  icon={Lock} 
                  label="كلمة المرور" 
                  value={formData.password} 
                  onChangeText={(t) => setFormData({...formData, password: t})} 
                  placeholder="اختر كلمة مرور قوية" 
                  secureTextEntry 
                />
                <InputField 
                  icon={Lock} 
                  label="تأكيد كلمة المرور" 
                  value={formData.confirmPassword} 
                  onChangeText={(t) => setFormData({...formData, confirmPassword: t})} 
                  placeholder="أعد إدخال كلمة المرور" 
                  secureTextEntry 
                />
                
                  <View>
                    <Text className="text-gray-700 text-sm font-bold mb-2 ml-1 text-right">تاريخ الميلاد (اختياري)</Text>
                    <View className="relative">
                      <TextInput
                        className="bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 text-base pr-12"
                        value={formData.birthDate}
                        onChangeText={(t) => setFormData({...formData, birthDate: t})}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        textAlign="right"
                      />
                      <View className="absolute left-4 top-4">
                        <Calendar size={20} color="#9CA3AF" />
                      </View>
                    </View>
                    <Text className="text-[10px] text-gray-400 font-bold mr-1 mt-1.5 text-right italic">
                      مثال: 1990-01-01
                    </Text>
                  </View>
                
                <TouchableOpacity 
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                  className="flex-row items-start gap-3 mt-3 mb-8"
                  activeOpacity={0.8}
                >
                  <View className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${acceptedTerms ? 'border-patient bg-patient' : 'border-patient/20 bg-patient/5'}`}>
                     {acceptedTerms && <View className="w-3 h-3 bg-white rounded-sm" />}
                  </View>
                  <Text className="text-xs text-gray-400 font-bold flex-1 leading-relaxed text-right">
                    بالتسجيل في التطبيق، أنت توافق على <Text className="text-patient font-extrabold underline">الشروط</Text> و <Text className="text-patient font-extrabold underline">سياسة الخصوصية</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className={`w-full py-4 rounded-xl items-center mt-2 shadow-sm flex-row justify-center gap-2 ${
                    isLoading ? "bg-patient/50" : "bg-patient"
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
                    <Text className="text-white font-bold text-base">إنشاء حساب</Text>
                  )}
                </TouchableOpacity>

                <View className="flex-row items-center justify-center mt-8 gap-1.5">
                  <TouchableOpacity onPress={() => router.push("/patient/PatientLogin")}>
                    <Text className="text-patient font-extrabold text-base">تسجيل الدخول</Text>
                  </TouchableOpacity>
                  <Text className="text-gray-400 font-bold text-base">لديك حساب بالفعل؟</Text>
                </View>
              </View>
            </>
          ) : (
            <View className="flex-1">
              <View className="items-center mb-10">
                <View className="w-20 h-20 bg-patient/5 rounded-full items-center justify-center mb-6">
                  <MessageSquare size={40} color="#022451" />
                </View>
                <Text className="text-2xl font-extrabold text-gray-900 mb-2">التحقق من رقم الجوال</Text>
                <Text className="text-base text-gray-500 font-bold text-center leading-relaxed">
                  تم إرسال رمز تحقق إلى رقم الجوال عبر تيليغرام.
                </Text>
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8">
                  <Text className="text-red-600 text-sm text-center font-bold">{error}</Text>
                </View>
              ) : null}

              <View className="mb-8">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">رمز التحقق</Text>
                <TextInput
                  className="bg-white border border-gray-100 rounded-2xl px-6 h-16 text-center text-2xl font-bold text-gray-900 shadow-sm"
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="أدخل رمز التحقق"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {debugOtp ? (
                  <Text className="text-[10px] text-gray-400 font-bold text-center mt-4 leading-relaxed">
                    لأغراض العرض، استخدم الرمز <Text className="text-patient font-extrabold">{debugOtp}</Text>
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity 
                className={`w-full py-4 rounded-xl items-center mt-2 shadow-sm flex-row justify-center gap-2 ${
                  isLoading ? "bg-patient/50" : "bg-patient"
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
                <Text className="text-patient font-extrabold text-base">إعادة إرسال الرمز</Text>
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
              تم إرسال طلب إنشاء الحساب إلى الإدارة للمراجعة
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/patient/PatientLogin")}
              className="bg-patient w-full h-15 rounded-2xl items-center justify-center shadow-xl shadow-patient/20"
            >
              <Text className="text-white font-extrabold text-lg">العودة إلى تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </MobileShell>
  );
}
