import React, { useState } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal 
} from "react-native";
import { useRouter } from "expo-router";
import { User, Phone, Lock } from "lucide-react-native";
import BrandLogo from "@/components/mobile/BrandLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import { ActivityIndicator } from "react-native";

export default function PatientRegister() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!formData.name.trim()) {
      setError("يرجى إدخال الاسم الثلاثي");
      return;
    }
    if (!formData.phone.trim()) {
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
      setError("يرجى الموافقة على سياسة الخدمة");
      return;
    }

    setError("");
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = "default" }) => (
    <View className="mb-5">
      <Text className="text-sm font-extrabold text-gray-700 mb-2 mr-1 text-right">{label}</Text>
      <View className="flex-row items-center border border-gray-100 rounded-2xl bg-white px-4 h-15 shadow-sm">
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
              <HeaderBackButton fallback="/patient/PatientLogin" color="#022451" />
            </View>
            <View className="items-center justify-center" style={{ minHeight: 44 }}>
              <Text className="text-2xl font-extrabold text-gray-900">إنشاء حساب جديد</Text>
            </View>
          </View>

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
                (isLoading || !formData.name.trim() || !formData.phone.trim() || !formData.password.trim() || !formData.confirmPassword.trim() || !acceptedTerms) ? "bg-patient/50" : "bg-patient"
              }`}
              onPress={handleRegister}
              disabled={isLoading || !formData.name.trim() || !formData.phone.trim() || !formData.password.trim() || !formData.confirmPassword.trim() || !acceptedTerms}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text className="text-white font-extrabold text-lg">جاري إنشاء الحساب...</Text>
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
            <View className="w-20 h-20 bg-patient/10 rounded-full items-center justify-center mb-6">
              <ActivityIndicator size="large" color="#022451" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 mb-4 text-center">
              تم إرسال طلب التسجيل
            </Text>
            <Text className="text-base text-gray-500 font-bold text-center leading-relaxed mb-8">
              تم إرسال طلبك إلى المنظمة. سيتم مراجعة بياناتك وتفعيل الحساب بعد الموافقة.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/patient/PatientLogin")}
              className="bg-patient w-full h-14 rounded-2xl items-center justify-center shadow-xl shadow-patient/20"
            >
              <Text className="text-white font-extrabold text-lg">العودة إلى تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </MobileShell>
  );
}
