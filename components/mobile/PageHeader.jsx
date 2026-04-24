import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

/**
 * PageHeader — reusable header for screens.
 */
export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  rightAction,
  bgColor = "bg-primary",
  textColor = "#FFFFFF",
}) {
  const router = useRouter();

  return (
    <View className={`${bgColor} px-5 pt-14 pb-5`}>
      <View className="flex-row items-center justify-between">
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <ChevronRight size={20} color={textColor} />
            <Text style={{ color: textColor }} className="text-sm mr-1">
              رجوع
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {rightAction || <View />}
      </View>

      {title && (
        <Text
          style={{ color: textColor }}
          className="text-xl font-extrabold mt-3"
        >
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          style={{ color: textColor, opacity: 0.7 }}
          className="text-sm mt-1"
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}