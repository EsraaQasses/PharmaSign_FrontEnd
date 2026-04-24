import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * MobileShell — wraps screen content with SafeAreaView.
 * Provides consistent padding and background color.
 */
export default function MobileShell({ children, className = "" }) {
  return (
    <SafeAreaView className={`flex-1 bg-background ${className}`}>
      {children}
    </SafeAreaView>
  );
}