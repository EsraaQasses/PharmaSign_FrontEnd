import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

/**
 * PageHeader — reusable header for screens.
 * Supports both `showBackButton` (original prop) and `showBack` (alias) for compatibility.
 */
export default function PageHeader({
  title,
  subtitle,
  showBackButton,
  showBack,
  rightAction,
  role,
  onBack,
  backTo,
}) {
  const router = useRouter();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      router.replace(backTo);
    } else if (role === "patient") {
      router.replace("/patient/PatientHome");
    } else {
      router.back();
    }
  };

  const shouldShowBack = showBackButton !== undefined ? showBackButton : (showBack !== undefined ? showBack : true);

  const bgColor = role === "pharmacist" ? "bg-pharmacist" : (role === "patient" ? "bg-patient" : "bg-primary");
  const textColor = "#FFFFFF";

  return (
    <View className={`${bgColor} px-5 pt-4 pb-5`}>
      <View className="flex-row items-center justify-between min-h-[40px]">
        {shouldShowBack ? (
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center py-2 -ml-2"
            activeOpacity={0.7}
          >
            <ChevronRight size={22} color={textColor} />
            <Text style={{ color: textColor }} className="text-sm font-bold mr-1">
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
          className="text-2xl font-extrabold mt-3 leading-9"
          numberOfLines={2}
        >
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          style={{ color: textColor, opacity: 0.8 }}
          className="text-sm mt-1 leading-5"
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
