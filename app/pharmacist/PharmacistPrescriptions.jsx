import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Search, SlidersHorizontal, Calendar, Pill, FileText, UserCheck, ChevronLeft } from "lucide-react-native";
import { MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import { useRouter } from "expo-router";
import PageHeader from "@/components/mobile/PageHeader";

export default function PharmacistPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  const filters = [
    { id: "all", label: "جميع الوصفات" },
    { id: "pending", label: "قيد الانتظار" },
    { id: "completed", label: "تم الصرف" },
  ];

  const filteredPrescriptions = MOCK_PRESCRIPTIONS.filter((rx) => {
    const matchesSearch =
      rx.patientName.includes(searchQuery) ||
      rx.medications.some((m) => m.name.includes(searchQuery));
    
    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && rx.status === activeFilter;
  });

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="سجل الوصفات" showBackButton />

      <View className="px-5 pt-4 pb-2 bg-white border-b border-gray-100 z-10">
        {/* Search Bar */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-12 relative">
            <TextInput
              className="flex-1 text-sm text-gray-900 h-full"
              placeholder="ابحث عن مريض، دواء، أو رقم الوصفة..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
            <View className="mr-2">
              <Search size={20} color="#9CA3AF" />
            </View>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl items-center justify-center">
            <SlidersHorizontal size={20} color="#0C6B58" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <View className="flex-row gap-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full border ${
                  activeFilter === filter.id
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-200"
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-bold ${
                    activeFilter === filter.id ? "text-white" : "text-gray-600"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-bold text-gray-800 mb-4 text-left">
          {filteredPrescriptions.length} وصفة طبية
        </Text>

        <View className="gap-4">
          {filteredPrescriptions.map((rx) => (
            <TouchableOpacity
              key={rx.id}
              onPress={() => router.push(`/pharmacist/PharmacistPrescriptionDetail?id=${rx.id}`)}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              activeOpacity={0.7}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between mb-3 border-b border-gray-50 pb-3">
                <View className="flex-row items-center gap-2">
                  <View className={`p-2 rounded-xl ${rx.status === 'completed' ? 'bg-emerald-50' : 'bg-primary/10'}`}>
                    {rx.status === 'completed' ? <UserCheck size={20} color="#059669" /> : <FileText size={20} color="#0C6B58" />}
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-gray-900">{rx.patientName}</Text>
                    <Text className="text-xs text-gray-500">{rx.date}</Text>
                  </View>
                </View>
                <View className={`px-2.5 py-1 rounded-full ${rx.status === 'completed' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Text className={`text-[10px] font-bold ${rx.status === 'completed' ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {rx.status === 'completed' ? 'تم الصرف' : 'قيد الانتظار'}
                  </Text>
                </View>
              </View>

              {/* Meds snippet */}
              <View className="mb-3">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <Pill size={14} color="#6B7280" />
                  <Text className="text-xs font-bold text-gray-700 pr-1 truncate text-left">
                    {rx.medications.map((m) => m.name).join("، ")}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-bold text-primary">المزيد من التفاصيل</Text>
                  <ChevronLeft size={16} color="#0C6B58" />
                </View>
                <Text className="text-[10px] text-gray-400">رقم: {rx.id.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredPrescriptions.length === 0 && (
            <View className="items-center justify-center py-10 opacity-50">
              <FileText size={48} color="#9CA3AF" />
              <Text className="text-base font-bold text-gray-500 mt-4">لا توجد وصفات طبية تطابق بحثك</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}