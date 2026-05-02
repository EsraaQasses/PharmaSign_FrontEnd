import React, { useState } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal 
} from "react-native";
import { useRouter } from "expo-router";
import { User, Phone, Lock, ShieldCheck, MessageSquare } from "lucide-react-native";
import BrandLogo from "@/components/mobile/BrandLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import { ActivityIndicator } from "react-native";

export default function PatientRegister() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [step, setStep] = useState(0); // 0: data entry, 1: OTP
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegisterStep1 = async () => {
    if (!formData.name.trim()) {
      setError("يرجى إدخال الاسم الثلاثي");
      return;
    }
    if (!formData.phone.trim()) {
      setError("يرجى إدخال رقم جوال صحيح");
      return;
    }
    
    const phoneDigits = formData.phone.trim();
    if (!/^\d+$/.test(phoneDigits) || phoneDigits.length < 9) {
      setError("يرجى إدخال رقم جوال صحيح");
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
    if (!acceptedTerms) {
      setError("يرجى الموافقة على الشروط وسياسة الخصوصية");
      return;
    }

    setError("");
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep(1);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("يرجى إدخال رمز التحقق");
      return;
    }

    if (otp !== "123456") {
      setError("رمز التحقق غير صحيح");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate registration submission
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = "default" }) => (
    <View className="mb-5">
      <Text className="text-sm font-extrabold text-gray-700 mb-2 mr-1 text-right">{label}</Text>
      <View className="flex-row items-center border border-gray-100 rounded-2xl bg-white px-4 h-15 shadow-sm focus:border-patient">
        <TextInput
          className="flex-1 text-base text-gray-900 h-full font-medium"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          textAlign="right"
        />
        <View className="ml-3">
          <Icon size={20} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8" style={{ position: 'relative', minHeight: 44 }}>
            <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
              <HeaderBackButton 
                onPress={step === 1 ? () => { setStep(0); setError(""); } : undefined}
                fallback={step === 0 ? "/patient/PatientLogin" : undefined} 
                color="#022451" 
              />
            </View>
            <View className="items-center justify-center" style={{ minHeight: 44 }}>
              <Text className="text-2xl font-extrabold text-gray-900">
                {step === 0 ? "إنشاء حساب جديد" : "التحقق من الرقم"}
              </Text>
            </View>
          </View>

          {step === 0 ? (
            <>
              <View className="mb-10">
                <View className="w-16 h-16 bg-white rounded-3xl p-3 shadow-sm border border-gray-50 items-center justify-center mb-6">
                   <BrandLogo width={40} height={40} />
                </View>
                <Text className="text-3xl font-extrabold text-patient mb-2 text-right">أهلاً بك</Text>
                <Text className="text-base text-gray-400 font-bold text-right leading-relaxed">يرجى تعبئة بياناتك الشخصية للتمتع بخدمات فارماساين</Text>
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                  <Text className="text-red-600 text-sm text-center font-bold">{error}</Text>
                </View>
              ) : null}

              <View className="flex-1">
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
                  className={`h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-patient/20 w-full gap-2 ${
                    isLoading ? "bg-patient/50" : "bg-patient"
                  }`}
                  onPress={handleRegisterStep1}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator color="#FFFFFF" />
                      <Text className="text-white font-extrabold text-lg">جاري إرسال رمز التحقق...</Text>
                    </>
                  ) : (
                    <Text className="text-white font-extrabold text-lg">إنشاء حساب</Text>
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
                  تم إرسال رمز تحقق إلى رقم الجوال عبر واتساب.
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
                <Text className="text-[10px] text-gray-400 font-bold text-center mt-4 leading-relaxed">
                  لأغراض العرض، استخدم الرمز <Text className="text-patient font-extrabold">123456</Text>
                </Text>
              </View>

              <TouchableOpacity 
                className={`h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-patient/20 w-full gap-2 ${
                  isLoading ? "bg-patient/50" : "bg-patient"
                }`}
                onPress={handleVerifyOTP}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator color="#FFFFFF" />
                    <Text className="text-white font-extrabold text-lg">جاري التحقق من الرمز...</Text>
                  </>
                ) : (
                  <Text className="text-white font-extrabold text-lg">تأكيد الرمز</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="mt-8 self-center">
                <Text className="text-patient font-extrabold text-base">إعادة إرسال الرمز</Text>
              </TouchableOpacity>
            </View>
          )}
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
