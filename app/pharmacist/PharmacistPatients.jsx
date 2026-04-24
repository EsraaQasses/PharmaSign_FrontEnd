import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Search, UserCheck, ChevronLeft, Phone, Calendar } from "lucide-react-native";
import { useRouter } from "expo-router";
import PageHeader from "@/components/mobile/PageHeader";

export default function PharmacistPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Mock list of patients
  const mockPatients = [
    { id: "1", name: "خالد محمد الشهري", phone: "0551234567", rxCount: 3, lastVisit: "اليوم" },
    { id: "2", name: "سارة عبدالله فهد", phone: "0569876543", rxCount: 7, lastVisit: "قبل يومين" },
    { id: "3", name: "خالد صالح الغامدي", phone: "0501122334", rxCount: 1, lastVisit: "قبل أسبوع" },
    { id: "4", name: "نورة محمد العتيبي", phone: "0533344556", rxCount: 12, lastVisit: "أمس" },
  ];

  const filteredPatients = mockPatients.filter((p) =>
    p.name.includes(searchQuery) || p.phone.includes(searchQuery)
  );

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="سجل المرضى" showBackButton />

      <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-100 z-10">
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-12 relative">
          <TextInput
            className="flex-1 text-sm text-gray-900 h-full"
            placeholder="ابحث برقم الجوال، اسم المريض..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
          <View className="mr-2">
            <Search size={20} color="#9CA3AF" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-bold text-gray-800 mb-4 text-left">
          {filteredPatients.length} مريض
        </Text>

        <View className="gap-4">
          {filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              onPress={() => router.push(`/pharmacist/ScanPatient`)} // mock routing to scanner for now
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center gap-4"
              activeOpacity={0.7}
            >
              <View className="w-14 h-14 bg-primary/10 rounded-2xl items-center justify-center border border-primary/20">
                <UserCheck size={28} color="#0C6B58" />
              </View>
              
              <View className="flex-1 justify-center">
                <Text className="text-sm font-bold text-gray-900 text-left mb-1">{patient.name}</Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                     <Phone size={10} color="#6B7280" />
                     <Text className="text-[10px] text-gray-500">{patient.phone}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                     <Calendar size={10} color="#6B7280" />
                     <Text className="text-[10px] text-gray-500">آخر زيارة: {patient.lastVisit}</Text>
                  </View>
                </View>
              </View>

              <View className="items-end gap-2">
                <View className="bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <Text className="text-[10px] font-bold text-emerald-700">{patient.rxCount} وصفة</Text>
                </View>
                <ChevronLeft size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredPatients.length === 0 && (
            <View className="items-center justify-center py-10 opacity-50">
              <UserCheck size={48} color="#9CA3AF" />
              <Text className="text-base font-bold text-gray-500 mt-4">لا يوجد مرضىيطابقون بحثك</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}