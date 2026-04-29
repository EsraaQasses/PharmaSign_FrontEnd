import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal, FileText, UserCheck, Calendar, Pill, ChevronLeft } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { MOCK_PRESCRIPTIONS } from "@/lib/mockData";

export default function PharmacistPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  const filters = [
    { id: "all", label: "الكل" },
    { id: "pending", label: "قيد الانتظار" },
    { id: "completed", label: "تم الصرف" },
  ];

  const filteredPrescriptions = MOCK_PRESCRIPTIONS.filter((rx) => {
    return (
      rx.patientName.includes(searchQuery) ||
      rx.medications.some((m) => m.name.includes(searchQuery))
    );
  });

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <PageHeader title="سجل الوصفات" showBackButton role="pharmacist" backTo="/pharmacist/PharmacistHome" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <View className="px-5 pt-6 pb-4 bg-white border-b border-gray-50 z-10">
          {/* Search Bar */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14 relative">
              <TextInput
                className="flex-1 text-base text-gray-900 h-full font-medium"
                placeholder="ابحث في سجل الوصفات..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
              <View className="ml-2">
                <Search size={22} color="#9CA3AF" />
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between mb-5 px-1">
             <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
              {filteredPrescriptions.length} وصفة موجودة
            </Text>
          </View>

          <View className="gap-5">
            {filteredPrescriptions.map((rx) => (
              <TouchableOpacity
                key={rx.id}
                onPress={() => router.push(`/pharmacist/PharmacistPrescriptionDetail?id=${rx.id}`)}
                className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm"
                activeOpacity={0.8}
              >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-50">
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-2xl items-center justify-center bg-primary/5">
                      <FileText size={24} color="#05997F" strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text className="text-base font-extrabold text-gray-900">{rx.patientName}</Text>
                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <Calendar size={12} color="#9CA3AF" />
                        <Text className="text-[11px] font-bold text-gray-400">{rx.date}</Text>
                      </View>
                    </View>
                  </View>

                </View>

                {/* Meds snippet */}
                <View className="mb-4 pr-1">
                  <View className="flex-row items-start gap-2">
                    <View className="mt-1">
                      <Pill size={14} color="#05997F" />
                    </View>
                    <Text className="flex-1 text-sm font-bold text-gray-600 leading-relaxed text-right">
                      {rx.medications.map((m) => m.name).join("، ")}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between pt-3 border-t border-gray-50">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-xs font-extrabold text-pharmacist">عرض التفاصيل</Text>
                    <ChevronLeft size={16} color="#05997F" strokeWidth={2.5} />
                  </View>
                  <Text className="text-[10px] font-extrabold text-gray-300 uppercase letter-spacing-1">ID: {rx.id.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {filteredPrescriptions.length === 0 && (
              <View className="items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <View className="w-20 h-20 bg-white rounded-full shadow-sm items-center justify-center mb-4">
                   <Search size={32} color="#D1D5DB" />
                </View>
                <Text className="text-base font-extrabold text-gray-400">لا توجد نتائج مطابقة</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </MobileShell>
  );
}