import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { normalizePhoneNumber } from "@/utils/phoneUtils";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";
import LogoCard from "@/components/mobile/LogoCard";
import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";

export default function PharmacistLogin() {
  const router = useRouter();
  const { loginAsPharmacist, isLoadingAuth } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // 1. Check if empty
    if (!phone.trim()) {
      setError("يرجى إدخال رقم الجوال");
      return;
    }
    if (!password.trim()) {
      setError("يرجى إدخال كلمة المرور");
      return;
    }
    
    // 2. Validate phone format
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone || normalizedPhone.length < 10) {
      setError("رقم الجوال يجب أن يبدأ بـ 09 ويتكون من 10 أرقام");
      return;
    }

    setError("");

    // 3. Authenticate
    const result = await loginAsPharmacist(normalizedPhone, password);
    if (result.success) {
      router.replace("/pharmacist/PharmacistHome");
    } else {
      if (result.status === 403) {
        if (result.approval_status === "pending") {
          setError("حسابك قيد مراجعة المنظمة. سيتم تفعيله بعد الموافقة.");
        } else if (result.approval_status === "rejected") {
          setError(`تم رفض طلب إنشاء الحساب. يرجى مراجعة المنظمة.\n${result.rejection_reason || ""}`);
        } else {
          setError(result.message || "لا تملك صلاحية الدخول");
        }
      } else {
        setError(result.message || "رقم الجوال أو كلمة المرور غير صحيحة");
      }
    }
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
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
                <HeaderBackButton fallback="/RoleSelect" color="#05997F" />
              </View>
            </View>

            <View className="items-center">
              <LogoCard size={80} borderRadius={24} padding={16} style={{ marginBottom: 16 }} />
              <Text className="text-white text-2xl font-extrabold">
                تسجيل الدخول
              </Text>
              <Text className="text-white/70 text-sm mt-1 text-center font-bold">
                الدخول كـ صيدلي للمتابعة
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="px-6 pt-8 pb-10 gap-5">
            {error ? (
              <View className="bg-red-50 border border-red-100 rounded-xl p-4">
                <Text className="text-red-600 text-sm text-center font-bold">{error}</Text>
              </View>
            ) : null}

            <View>
              <Text className="text-gray-700 text-sm font-bold mb-2 ml-1">
                رقم الجوال
              </Text>
              <View className="flex-row gap-2">
                <View className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 items-center justify-center">
                  <Text className="text-gray-500 font-bold text-base">+963</Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="9XXXXXXXX"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 text-base"
                  style={{ textAlign: "right" }}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-gray-700 text-sm font-bold mb-2 ml-1">
                كلمة المرور
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="أدخل كلمة المرور"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  className="bg-white border border-gray-100 rounded-xl px-4 py-4 text-gray-800 text-base pr-12"
                  style={{ textAlign: "right" }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-4"
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push("/pharmacist/PharmacistForgotPassword")}
              activeOpacity={0.7}
              className="py-1"
            >
              <Text className="text-pharmacist text-sm font-bold text-right">
                نسيت كلمة المرور؟
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoadingAuth}
              className={`w-full py-4 rounded-xl items-center mt-2 shadow-sm flex-row justify-center gap-2 ${
                isLoadingAuth ? "bg-pharmacist/50" : "bg-pharmacist"
              }`}
              activeOpacity={0.8}
            >
              {isLoadingAuth ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text className="text-white font-bold text-base">
                    جاري تسجيل الدخول...
                  </Text>
                </>
              ) : (
                <Text className="text-white font-bold text-base">
                  تسجيل الدخول
                </Text>
              )}
            </TouchableOpacity>

            {/* Register */}
            <View className="flex-row items-center justify-center gap-1 mt-4">
              <Text className="text-gray-500 text-sm font-medium">ليس لديك حساب؟</Text>
              <TouchableOpacity
                onPress={() => router.push("/pharmacist/PharmacistRegister")}
                activeOpacity={0.7}
              >
                <Text className="text-pharmacist font-bold text-sm">
                  سجل الآن
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MobileShell>
  );
}