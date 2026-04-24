import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

/**
 * Placeholder screen — will be replaced with full implementation in Phase 5.
 */
export default function PlaceholderScreen({ title = "قيد الإنشاء", screenName }) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary px-5 pt-14 pb-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <ChevronRight size={20} color="#FFFFFF" />
          <Text className="text-white text-sm mr-1">رجوع</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl mb-4">🚧</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
          {title}
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          هذه الصفحة قيد التطوير
        </Text>
        {screenName && (
          <Text className="text-xs text-gray-400 mt-2">{screenName}</Text>
        )}
      </View>
    </View>
  );
}
