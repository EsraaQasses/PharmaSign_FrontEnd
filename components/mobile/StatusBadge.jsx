import React from "react";
import { View, Text } from "react-native";
import { STATUS_MAP } from "@/lib/mockData";

/**
 * StatusBadge — displays a prescription status label with colored background.
 */
export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status];
  
  if (!config) {
    return (
      <View className="bg-gray-100 px-3 py-1 rounded-full">
        <Text className="text-gray-600 text-xs font-semibold">{status}</Text>
      </View>
    );
  }

  return (
    <View className={`${config.bgColor} px-3 py-1 rounded-full`}>
      <Text className={`${config.textColor} text-xs font-semibold`}>
        {config.label}
      </Text>
    </View>
  );
}