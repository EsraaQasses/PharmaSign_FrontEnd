import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { User, Mail, Phone, Lock, Hash, ArrowRight, Building2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PharmacistRegister() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    name: "",
    licenseId: "",
    pharmacyName: "",
    phone: "",
    password: "",
  });

  const handleRegister = () => {
    alert("تم تقديم طلب إنشاء حساب صيدلي بنجاح. سيتم مراجعة طلبك.");
    router.replace("/pharmacist/PharmacistLogin");
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: top + 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-8">
          <View className="w-10" />
          <Text className="text-xl font-bold text-gray-900">إنشاء حساب صيدلي</Text>
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100 shadow-sm">
            <ArrowRight size={20} color="#0C6B58" />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-2xl font-extrabold text-primary mb-2 text-left">انضم إلى شبكة فارماساين</Text>
          <Text className="text-base text-gray-500 text-left">يرجى تعبئة بياناتك المهنية للتحقق من هويتك</Text>
        </View>

        <View className="flex-1">
          <InputField icon={User} label="الاسم الكامل" value={formData.name} onChangeText={(t) => setFormData({...formData, name: t})} placeholder="الاسم كما في رخصة مزاولة المهنة" />
          <InputField icon={Hash} label="رقم رخصة مزاولة المهنة" value={formData.licenseId} onChangeText={(t) => setFormData({...formData, licenseId: t})} placeholder="أدخل رقم الرخصة" keyboardType="number-pad"/>
          <InputField icon={Building2} label="اسم الصيدلية" value={formData.pharmacyName} onChangeText={(t) => setFormData({...formData, pharmacyName: t})} placeholder="الصيدلية التي تعمل بها حالياً" />
          <InputField icon={Phone} label="رقم الجوال" value={formData.phone} onChangeText={(t) => setFormData({...formData, phone: t})} placeholder="05XXXXXXXX" keyboardType="number-pad" />
          <InputField icon={Lock} label="كلمة المرور" value={formData.password} onChangeText={(t) => setFormData({...formData, password: t})} placeholder="أدخل كلمة مرور قوية" secureTextEntry />
          
          <View className="flex-row items-start gap-2 mt-2 mb-6">
            <View className="w-5 h-5 rounded border border-gray-300 mt-0.5 bg-white items-center justify-center"><View className="w-3 h-3 bg-primary rounded-sm" /></View>
            <Text className="text-xs text-gray-500 flex-1 leading-relaxed text-left">أقر بصحة جميع البيانات المدخلة وموافقتي على <Text className="text-primary font-bold">شروط استخدام المنصة للصيادلة</Text></Text>
          </View>

          <TouchableOpacity className="bg-primary h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/30 w-full" onPress={handleRegister} activeOpacity={0.8}>
            <Text className="text-white font-bold text-lg">تقديم طلب التسجيل</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-6 gap-1">
            <TouchableOpacity onPress={() => router.replace("/pharmacist/PharmacistLogin")}>
              <Text className="text-primary font-bold text-sm">تسجيل الدخول</Text>
            </TouchableOpacity>
            <Text className="text-gray-500 text-sm">لديك حساب بالفعل؟</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}