import React from "react";
import { View, Text } from "react-native";
import { Inbox } from "lucide-react-native";

/**
 * EmptyState — shown when a list has no items.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = "لا توجد بيانات",
  description = "لم يتم العثور على أي عناصر",
  iconColor = "#9CA3AF",
}) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <View className="bg-gray-100 rounded-full p-5 mb-4">
        <Icon size={40} color={iconColor} />
      </View>
      <Text className="text-lg font-bold text-gray-700 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-sm text-gray-400 text-center leading-5">
        {description}
      </Text>
    </View>
  );
}