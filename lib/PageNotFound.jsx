import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";

/**
 * PageNotFound component.
 * Can be used standalone or embedded in other screens.
 * The main 404 handler is app/+not-found.jsx (Expo Router).
 */
export default function PageNotFound() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="bg-gray-100 rounded-full p-5 mb-6">
        <Search size={48} color="#9CA3AF" />
      </View>

      <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
        الصفحة غير موجودة
      </Text>

      <Text className="text-base text-gray-500 text-center mb-8 leading-6">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="bg-primary w-full py-4 rounded-xl items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-base">
          العودة للرئيسية
        </Text>
      </TouchableOpacity>
    </View>
  );
}