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
import { useRouter } from "expo-router";
import { ChevronRight, Pill, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";

export default function PharmacistLogin() {
  const router = useRouter();
  const { loginAsPharmacist, isLoadingAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    setError("");
    const result = await loginAsPharmacist(email, password);
    if (result.success) {
      router.replace("/pharmacist/PharmacistHome");
    } else {
      setError("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="bg-secondary px-5 pt-14 pb-8 rounded-b-3xl">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-6"
            activeOpacity={0.7}
          >
            <ChevronRight size={20} color="#FFFFFF" />
            <Text className="text-white text-sm mr-1">رجوع</Text>
          </TouchableOpacity>

          <View className="items-center">
            <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center mb-4">
              <Pill size={32} color="#FFFFFF" />
            </View>
            <Text className="text-white text-xl font-extrabold">
              تسجيل دخول الصيدلي
            </Text>
            <Text className="text-white/70 text-sm mt-1">
              أدخل بيانات حسابك للمتابعة
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 pt-8 gap-5">
          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3">
              <Text className="text-red-600 text-sm text-center">{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View>
            <Text className="text-gray-700 text-sm font-semibold mb-2">
              البريد الإلكتروني
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="pharmacist@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 text-sm"
              style={{ textAlign: "right" }}
            />
          </View>

          {/* Password */}
          <View>
            <Text className="text-gray-700 text-sm font-semibold mb-2">
              كلمة المرور
            </Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="أدخل كلمة المرور"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 text-sm pr-12"
                style={{ textAlign: "right" }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5"
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
          >
            <Text className="text-secondary text-sm font-semibold text-left">
              نسيت كلمة المرور؟
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoadingAuth}
            className={`w-full py-4 rounded-xl items-center mt-2 ${
              isLoadingAuth ? "bg-secondary/50" : "bg-secondary"
            }`}
            activeOpacity={0.8}
          >
            {isLoadingAuth ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-base">
                تسجيل الدخول
              </Text>
            )}
          </TouchableOpacity>

          {/* Register */}
          <View className="flex-row items-center justify-center gap-1 mt-4">
            <Text className="text-gray-500 text-sm">ليس لديك حساب؟</Text>
            <TouchableOpacity
              onPress={() => router.push("/pharmacist/PharmacistRegister")}
              activeOpacity={0.7}
            >
              <Text className="text-secondary font-bold text-sm">
                سجل الآن
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}