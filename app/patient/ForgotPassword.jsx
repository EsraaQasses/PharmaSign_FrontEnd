import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { KeyRound, Phone, Lock, CheckCircle2 } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import { authApi } from "@/api/authApi";

const getArabicError = (code, fallback) => {
  const map = {
    passwords_do_not_match: "كلمتا المرور غير متطابقتين",
    password_too_weak: "كلمة المرور ضعيفة، يرجى اختيار كلمة أقوى",
    password_already_set: "تم تعيين كلمة المرور مسبقاً",
    invalid_otp: "رمز التحقق غير صحيح",
    otp_expired: "انتهت صلاحية رمز التحقق",
    otp_locked: "تم تجاوز عدد المحاولات المسموح بها، يرجى طلب رمز جديد لاحقاً"
  };
  return map[code] || fallback || "حدث خطأ، يرجى المحاولة مرة أخرى";
};

export default function ForgotPassword() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  
  const [step, setStep] = useState(0); // 0: phone, 1: reset, 2: success
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendLink = async () => {
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
    try {
      const res = await authApi.requestPasswordResetOTP(phoneDigits, "patient");
      if (res.success) {
        setStep(1);
      } else {
        setError(getArabicError(res.data?.code, res.message));
      }
    } catch (e) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!otp.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("يرجى تعبئة جميع الحقول");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await authApi.confirmPasswordReset(phone.trim(), "patient", otp.trim(), password, confirmPassword);
      if (res.success) {
        setMessage("تم تغيير كلمة المرور بنجاح");
        setStep(2);
        setTimeout(() => {
          router.replace("/patient/PatientLogin");
        }, 2000);
      } else {
        setError(getArabicError(res.data?.code, res.message));
      }
    } catch (e) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
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
                {step === 2 ? (
                  <CheckCircle2 size={32} color="#059669" />
                ) : (
                  <KeyRound size={32} color="#022451" />
                )}
              </View>
              <Text className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight text-right">
                استعادة الحساب
              </Text>
              <Text className="text-base text-gray-500 leading-relaxed text-right">
                {step === 0 && "أدخل رقم الجوال المرتبط بحسابك وسنرسل لك رمز التحقق عبر تيليغرام."}
                {step === 1 && "أدخل رمز التحقق الذي وصلك عبر تيليغرام، ثم قم بتعيين كلمة المرور الجديدة."}
                {step === 2 && "تم تغيير كلمة المرور بنجاح، سيتم توجيهك لتسجيل الدخول."}
              </Text>
            </View>

            {error ? (
              <View className="bg-red-50 border-red-100 border rounded-xl p-4 mb-5">
                <Text className="text-red-600 text-sm text-center font-bold">{error}</Text>
              </View>
            ) : null}

            {message ? (
              <View className="bg-emerald-50 border-emerald-100 border rounded-xl p-4 mb-5">
                <Text className="text-emerald-700 text-sm text-center font-bold">{message}</Text>
              </View>
            ) : null}

            {step === 0 && (
              <>
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
                    !phone.trim() || isLoading ? "bg-patient/50" : "bg-patient"
                  }`}
                  onPress={handleSendLink}
                  disabled={!phone.trim() || isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-bold text-lg">إرسال رمز التحقق</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {step === 1 && (
              <>
                <View className="mb-4">
                  <Text className="text-sm font-bold text-gray-700 mb-2 text-right">رمز التحقق</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4 h-14 justify-center">
                    <TextInput
                      placeholder="XXXXXX"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                      textAlign="center"
                      className="text-gray-900 font-bold text-lg tracking-widest"
                    />
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-bold text-gray-700 mb-2 text-right">كلمة المرور الجديدة</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4 h-14 justify-center">
                    <TextInput
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      textAlign="right"
                      className="text-gray-900 font-bold"
                    />
                  </View>
                </View>

                <View className="mb-8">
                  <Text className="text-sm font-bold text-gray-700 mb-2 text-right">تأكيد كلمة المرور</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4 h-14 justify-center">
                    <TextInput
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      textAlign="right"
                      className="text-gray-900 font-bold"
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  className={`h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-patient/30 gap-2 ${
                    isLoading ? "bg-patient/50" : "bg-patient"
                  }`}
                  onPress={handleConfirmReset}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-bold text-lg">إعادة تعيين كلمة المرور</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MobileShell>
  );
}
