import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { KeyRound, Phone, Lock, CheckCircle2 } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import MobileShell from "@/components/mobile/MobileShell";

export default function PharmacistForgotPassword() {
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

    setError("");
    setIsLoading(true);

    // Simulate sending link
    setTimeout(() => {
      setIsLoading(false);
      setStep(1);
    }, 1500);
  };

  const handleResetPassword = () => {
    if (!password.trim()) {
      setError("يرجى إدخال كلمة المرور الجديدة");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (!confirmPassword.trim()) {
      setError("يرجى تأكيد كلمة المرور");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate password save
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
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
              <HeaderBackButton fallback="/pharmacist/PharmacistLogin" color="#05997F" />
            </View>
          </View>

          {step === 0 && (
            <View className="flex-1">
              <View className="mb-8">
                <View className="w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-6">
                  <KeyRound size={32} color="#05997F" />
                </View>
                <Text className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight text-right">
                  استعادة حساب الصيدلي
                </Text>
                <Text className="text-base text-gray-500 leading-relaxed text-right">
                  أدخل رقم الجوال المرتبط بحسابك كصيدلي وسنرسل لك رابط إعادة تعيين كلمة المرور عبر واتساب.
                </Text>
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                  <Text className="text-red-600 text-sm text-center font-bold">{error}</Text>
                </View>
              ) : null}

              <View className="mb-6">
                <Text className="text-sm font-bold text-gray-700 mb-2 text-right">رقم الجوال</Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-4 h-14 relative focus:border-primary">
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
                className={`h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/30 mt-4 gap-2 ${
                  (isLoading || !phone.trim()) ? "bg-primary/50" : "bg-primary"
                }`}
                onPress={handleSendLink}
                disabled={isLoading || !phone.trim()}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator color="#FFFFFF" />
                    <Text className="text-white font-bold text-lg">جاري إرسال الرابط...</Text>
                  </>
                ) : (
                  <Text className="text-white font-bold text-lg">إرسال رابط إعادة التعيين</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 1 && (
            <View className="flex-1">
              <View className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8">
                <Text className="text-emerald-800 font-bold text-base text-right leading-relaxed">
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى رقمك عبر واتساب.
                </Text>
                <Text className="text-emerald-600 text-xs mt-2 text-right font-medium">
                  لأغراض العرض، يمكنك تعيين كلمة مرور جديدة مباشرة من هنا.
                </Text>
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                  <Text className="text-red-600 text-sm text-center font-bold">{error}</Text>
                </View>
              ) : null}

              <View className="gap-5">
                <View>
                  <Text className="text-sm font-bold text-gray-700 mb-2 text-right">كلمة المرور الجديدة</Text>
                  <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-4 h-14 relative focus:border-primary">
                    <TextInput
                      className="flex-1 text-base text-gray-900 h-full"
                      value={password}
                      onChangeText={setPassword}
                      placeholder="أدخل كلمة المرور الجديدة"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      textAlign="right"
                    />
                    <View className="mr-3">
                      <Lock size={20} color="#9CA3AF" />
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-bold text-gray-700 mb-2 text-right">تأكيد كلمة المرور</Text>
                  <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-4 h-14 relative focus:border-primary">
                    <TextInput
                      className="flex-1 text-base text-gray-900 h-full"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="أعد إدخال كلمة المرور"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      textAlign="right"
                    />
                    <View className="mr-3">
                      <Lock size={20} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                className={`h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/30 mt-8 gap-2 ${
                  isLoading ? "bg-primary/50" : "bg-primary"
                }`}
                onPress={handleResetPassword}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator color="#FFFFFF" />
                    <Text className="text-white font-bold text-lg">جاري حفظ كلمة المرور...</Text>
                  </>
                ) : (
                  <Text className="text-white font-bold text-lg">حفظ كلمة المرور الجديدة</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View className="flex-1 items-center justify-center py-10">
              <View className="w-24 h-24 bg-emerald-50 rounded-full items-center justify-center mb-6 border-8 border-emerald-100/50">
                <CheckCircle2 size={40} color="#059669" />
              </View>
              <Text className="text-2xl font-extrabold text-gray-900 mb-3 text-center">
                تم تغيير كلمة المرور بنجاح!
              </Text>
              <Text className="text-base text-gray-500 text-center leading-relaxed px-4 mb-10">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
              </Text>
              
              <TouchableOpacity 
                className="w-full bg-primary h-14 rounded-xl flex-row items-center justify-center shadow-sm"
                onPress={() => router.replace("/pharmacist/PharmacistLogin")}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-lg">العودة لتسجيل الدخول</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </MobileShell>
  );
}