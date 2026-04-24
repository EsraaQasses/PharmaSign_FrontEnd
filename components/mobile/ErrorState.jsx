import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle, WifiOff } from "lucide-react-native";

/**
 * ErrorState — shown when an error occurs.
 */
export function ErrorState({ message = "حدث خطأ", onRetry }) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <View className="bg-red-50 rounded-full p-5 mb-4">
        <AlertTriangle size={40} color="#EF4444" />
      </View>
      <Text className="text-lg font-bold text-gray-700 mb-2 text-center">
        خطأ
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-6">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary px-6 py-3 rounded-xl"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">إعادة المحاولة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * NoInternetScreen — shown when there's no internet connection.
 */
export function NoInternetScreen({ onRetry }) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <View className="bg-gray-100 rounded-full p-5 mb-4">
        <WifiOff size={40} color="#6B7280" />
      </View>
      <Text className="text-lg font-bold text-gray-700 mb-2 text-center">
        لا يوجد اتصال بالإنترنت
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-6">
        يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary px-6 py-3 rounded-xl"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">إعادة المحاولة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ErrorState;