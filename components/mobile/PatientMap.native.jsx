import React from "react";
import { View, Text } from "react-native";
import { MapPin } from "lucide-react-native";

export default function PatientMap() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-50">
      <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4 border border-gray-100 shadow-sm">
        <MapPin size={40} color="#D1D5DB" />
      </View>
      <Text className="text-gray-500 font-bold text-center">
        الخريطة التفاعلية غير متاحة حالياً، يمكن فتح موقع الصيدلية من الزر المخصص
      </Text>
    </View>
  );
}
