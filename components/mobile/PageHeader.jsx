import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeaderBackButton from "@/components/mobile/HeaderBackButton";

/**
 * PageHeader — reusable header for screens.
 * Back button is always explicitly positioned on the RIGHT using absolute positioning.
 * This is independent of flex-row direction and RTL/LTR auto-flipping.
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

  const shouldShowBack = showBackButton !== undefined ? showBackButton : (showBack !== undefined ? showBack : true);

  const bgColor = role === "pharmacist" ? "bg-pharmacist" : (role === "patient" ? "bg-patient" : "bg-primary");
  const iconColor = role === "pharmacist" ? "#05997F" : "#022451";
  const textColor = "#FFFFFF";

  const defaultFallback = backTo || (role === "pharmacist" ? "/pharmacist/PharmacistHome" : "/patient/PatientHome");

  return (
    <View className={`${bgColor} px-5 pt-4 pb-5`}>
      {/* Header Row */}
      <View className="min-h-[44px] justify-center">
        {/* Back button: absolute right, never depends on flex direction */}
        {shouldShowBack && (
          <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 10 }}>
            <HeaderBackButton fallback={defaultFallback} color={iconColor} onPress={onBack} />
          </View>
        )}

        {/* Left action (if any): absolute left */}
        {rightAction && (
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 10 }}>
            {rightAction}
          </View>
        )}
      </View>

      {title && (
        <Text
          style={{ color: textColor }}
          className="text-2xl font-extrabold mt-3 leading-9 text-right"
          numberOfLines={2}
        >
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          style={{ color: textColor, opacity: 0.8 }}
          className="text-sm mt-1 leading-5 text-right"
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
