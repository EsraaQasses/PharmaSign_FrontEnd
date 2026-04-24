import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";

/**
 * Error screen shown when a user is not registered for the app.
 * Offers options to retry or go back.
 */
export default function UserNotRegisteredError() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="bg-red-50 rounded-full p-5 mb-6">
        <AlertTriangle size={48} color="#EF4444" />
      </View>

      <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
        المستخدم غير مسجل
      </Text>

      <Text className="text-base text-gray-500 text-center mb-8 leading-6">
        عذراً، حسابك غير مسجل في هذا التطبيق. يرجى التواصل مع مدير التطبيق
        للحصول على صلاحية الوصول.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/RoleSelect")}
        className="bg-primary w-full py-4 rounded-xl items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-base">
          العودة لاختيار الدور
        </Text>
      </TouchableOpacity>
    </View>
  );
}
