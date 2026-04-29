import React, { useState } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { User, Mail, Phone, Lock, Hash, ArrowRight } from "lucide-react-native";
import BrandLogo from "@/components/mobile/BrandLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MobileShell from "@/components/mobile/MobileShell";

export default function PatientRegister() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegister = () => {
    if (!formData.name || !formData.nationalId || !formData.phone || !formData.password) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }
    alert("تم إنشاء حسابك بنجاح!");
    router.replace("/patient");
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
          <View className="flex-row items-center justify-between mb-8">
            <View className="w-10" />
            <Text className="text-2xl font-extrabold text-gray-900">إنشاء حساب جديد</Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-2xl items-center justify-center border border-gray-50 shadow-sm"
            >
              <ArrowRight size={22} color="#022451" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View className="mb-10">
            <View className="w-16 h-16 bg-white rounded-3xl p-3 shadow-sm border border-gray-50 items-center justify-center mb-6">
               <BrandLogo width={40} height={40} />
            </View>
            <Text className="text-3xl font-extrabold text-patient mb-2 text-left">أهلاً بك</Text>
            <Text className="text-base text-gray-400 font-bold text-left leading-relaxed">يرجى تعبئة بياناتك الشخصية للتمتع بخدمات فارماساين</Text>
          </View>

          <View className="flex-1">
            <InputField 
              icon={User} 
              label="الاسم الكامل" 
              value={formData.name} 
              onChangeText={(t) => setFormData({...formData, name: t})} 
              placeholder="الاسم الرباعي كما في الهوية" 
            />
            <InputField 
              icon={Hash} 
              label="رقم الهوية الوطنية" 
              value={formData.nationalId} 
              onChangeText={(t) => setFormData({...formData, nationalId: t})} 
              placeholder="10XXXXXXXX" 
              keyboardType="number-pad"
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
            
            <View className="flex-row items-start gap-3 mt-3 mb-8">
              <View className="w-6 h-6 rounded-lg border-2 border-patient/20 bg-patient/5 items-center justify-center">
                 <View className="w-3 h-3 bg-patient rounded-sm" />
              </View>
              <Text className="text-xs text-gray-400 font-bold flex-1 leading-relaxed text-right">
                بالتسجيل في التطبيق، أنت توافق على <Text className="text-patient font-extrabold underline">الشروط</Text> و <Text className="text-patient font-extrabold underline">سياسة الخصوصية</Text>
              </Text>
            </View>

            <TouchableOpacity 
              className="bg-patient h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-patient/20 w-full"
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text className="text-white font-extrabold text-lg">إنشاء حساب</Text>
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
    </MobileShell>
  );
}
