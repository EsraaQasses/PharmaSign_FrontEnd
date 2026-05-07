import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { KeyRound, Phone, Lock, CheckCircle2 } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";

export default function ForgotPassword() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  
  const [step, setStep] = useState(0); // 0: phone, 1: reset, 2: success
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendLink = () => {
    if (!phone.trim()) {
      setError("يرجى إدخال رقم الجوال");
      return;
    }
    
    const phoneDigits = phone.trim();
    if (!/^\d+$/.test(phoneDigits) || phoneDigits.length < 9) {
      setError("يرجى إدخال رقم جوال صحيح");
      return;
    }

    setError("ميزة استعادة الحساب عبر واتساب ستتوفر قريباً. يرجى التواصل مع المنظمة لاستعادة الحساب حالياً.");
  };

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView 
        className="flex-1 bg-background"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8" style={{ position: 'relative', minHeight: 44 }}>
            <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
              <HeaderBackButton fallback="/patient/PatientLogin" color="#022451" />
            </View>
          </View>

          <View className="flex-1">
            <View className="mb-8">
              <View className="w-16 h-16 bg-patient/10 rounded-2xl items-center justify-center mb-6">
                <KeyRound size={32} color="#022451" />
              </View>
              <Text className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight text-right">
                استعادة الحساب
              </Text>
              <Text className="text-base text-gray-500 leading-relaxed text-right">
                أدخل رقم الجوال المرتبط بحسابك وسنرسل لك رابط إعادة تعيين كلمة المرور عبر واتساب.
              </Text>
            </View>

            {error ? (
              <View className={`${error.includes("قريباً") ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"} border rounded-xl p-4 mb-5`}>
                <Text className={`${error.includes("قريباً") ? "text-amber-700" : "text-red-600"} text-sm text-center font-bold`}>{error}</Text>
              </View>
            ) : null}

            <View className="mb-6">
              <Text className="text-sm font-bold text-gray-700 mb-2 text-right">رقم الجوال</Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-4 h-14 relative focus:border-patient">
                <TextInput
                  className="flex-1 text-base text-gray-900 h-full"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="9XXXXXXXX"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  textAlign="right"
                />
                <View className="mr-3">
                  <Phone size={20} color="#9CA3AF" />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              className={`h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-patient/30 mt-4 gap-2 ${
                !phone.trim() ? "bg-patient/50" : "bg-patient"
              }`}
              onPress={handleSendLink}
              disabled={!phone.trim()}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">إرسال رابط إعادة التعيين</Text>
            </TouchableOpacity>

            <View className="mt-10 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Text className="text-[10px] text-gray-400 text-center font-bold leading-relaxed">
                سيتم تفعيل هذه الميزة بعد ربط خدمة التحقق من الهوية عبر الخادم.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MobileShell>
  );
}
