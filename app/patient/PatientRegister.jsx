import React, { useState } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { User, Mail, Phone, Lock, Hash, ArrowRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PatientRegister() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegister = () => {
    // Basic validation
    if (!formData.name || !formData.nationalId || !formData.phone || !formData.password) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }
    
    // In a real app we'd save to DB, auto-login, etc.
    alert("تم إنشاء حسابك بنجاح!");
    router.replace("/patient");
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = "default" }) => (
    <View className="mb-4">
      <Text className="text-sm font-bold text-gray-700 mb-2">{label}</Text>
      <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-4 h-14 relative focus:border-primary">
        <TextInput
          className="flex-1 text-base text-gray-900 h-full"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          textAlign="right"
        />
        <View className="mr-3">
          <Icon size={20} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-8">
          <View className="w-10" />
          <Text className="text-xl font-bold text-gray-900">إنشاء حساب مريض</Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100 shadow-sm"
          >
            <ArrowRight size={20} color="#0C6B58" />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-2xl font-extrabold text-primary mb-2 text-left">مرحباً بك في فارماساين</Text>
          <Text className="text-base text-gray-500 text-left">يرجى تعبئة بياناتك الشخصية للمتابعة</Text>
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
            label="رقم الهوية الوطنية / الإقامة" 
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
            placeholder="أدخل كلمة مرور قوية" 
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
          
          <View className="flex-row items-start gap-2 mt-2 mb-6">
            <View className="w-5 h-5 rounded border border-gray-300 mt-0.5 bg-white items-center justify-center">
               <View className="w-3 h-3 bg-primary rounded-sm" />
            </View>
            <Text className="text-xs text-gray-500 flex-1 leading-relaxed text-left">
              بالتسجيل في التطبيق، أنت توافق على <Text className="text-primary font-bold">الشروط والأحكام</Text> و<Text className="text-primary font-bold">سياسة الخصوصية</Text>
            </Text>
          </View>

          <TouchableOpacity 
            className="bg-primary h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/30 w-full"
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">إنشاء حساب</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-6 gap-1">
            <TouchableOpacity onPress={() => router.push("/patient/PatientLogin")}>
              <Text className="text-primary font-bold text-sm">التسجيل</Text>
            </TouchableOpacity>
            <Text className="text-gray-500 text-sm">لديك حساب بالفعل؟</Text>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
