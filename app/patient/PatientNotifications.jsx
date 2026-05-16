import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Bell } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";

export default function PatientNotifications() {
  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="الإشعارات" showBackButton role="patient" backTo="/patient/PatientHome" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <View className="px-6 py-6 border-b border-gray-50 bg-white">
          <Text className="text-xl font-extrabold text-gray-900">التنبيهات</Text>
          <Text className="text-xs font-bold text-gray-400 mt-0.5">لا توجد إشعارات جديدة</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <View className="w-20 h-20 bg-white rounded-full shadow-sm items-center justify-center mb-4">
               <Bell size={32} color="#D1D5DB" />
            </View>
            <Text className="text-base font-extrabold text-gray-400">لا توجد إشعارات حالياً</Text>
          </View>
        </ScrollView>
      </View>
    </MobileShell>
  );
}
