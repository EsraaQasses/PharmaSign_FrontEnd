import React from "react";
import { View, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "غير موجود" }} />
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-6xl mb-4">🔍</Text>
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          الصفحة غير موجودة
        </Text>
        <Text className="text-base text-gray-500 text-center mb-6">
          عذراً، الصفحة التي تبحث عنها غير موجودة
        </Text>
        <Link href="/" className="mt-4">
          <View className="bg-primary px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold text-base">
              العودة للرئيسية
            </Text>
          </View>
        </Link>
      </View>
    </>
  );
}
