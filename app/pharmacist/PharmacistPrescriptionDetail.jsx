import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { User, Calendar, MapPin, Pill, Activity, Plus, ShieldCheck, Phone } from "lucide-react-native";
import { MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import PageHeader from "@/components/mobile/PageHeader";

export default function PharmacistPrescriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id) || MOCK_PRESCRIPTIONS[0];

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="تفاصيل الوصفة" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View className="mt-6 mb-4 items-center">
          <View className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${rx.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            {rx.status === 'completed' ? <ShieldCheck size={32} color="#059669" /> : <Activity size={32} color="#D97706" />}
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-1 text-center">
            {rx.status === 'completed' ? 'تم الصرف بنجاح' : 'جاهزة للصرف'}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            رقم الوصفة: {rx.id.toUpperCase()}
          </Text>
        </View>

        {/* Patient Info */}
        <View className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row items-center border-b border-gray-100 pb-4 mb-4">
            <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
              <User size={24} color="#0C6B58" />
            </View>
            <View className="flex-1 ml-4 justify-end">
              <Text className="text-base font-bold text-gray-900 text-left">{rx.patientName}</Text>
              <Text className="text-xs text-gray-500 text-left">رقم الملف: PAT-8492</Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center ml-2">
              <Phone size={18} color="#0C6B58" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="items-end block">
              <Text className="text-[10px] text-gray-400 mb-1">تاريخ الوصفة</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-bold text-gray-800">{rx.date}</Text>
                <Calendar size={12} color="#6B7280" />
              </View>
            </View>
            <View className="items-end block">
              <Text className="text-[10px] text-gray-400 mb-1">العيادة</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-bold text-gray-800">{rx.doctor}</Text>
                <MapPin size={12} color="#6B7280" />
              </View>
            </View>
          </View>
        </View>

        {/* Medications */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-lg font-bold text-gray-900">الأدوية الموصوفة ({rx.medications.length})</Text>
            {rx.status !== 'completed' && (
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => router.push("/pharmacist/NewPrescription")} 
                className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full"
              >
                <Plus size={14} color="#0C6B58" />
                <Text className="text-xs font-bold text-primary">إضافة دواء</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-3">
            {rx.medications.map((med, index) => (
              <View
                key={index}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center gap-3"
              >
                <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-100">
                  <Pill size={24} color="#4B5563" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-900 mb-0.5 text-left">{med.name}</Text>
                  <Text className="text-[10px] text-gray-500 mb-1 text-left">{med.instructions}</Text>
                  <Text className="text-[10px] font-bold text-primary text-left bg-primary/5 px-2 py-0.5 rounded self-start">
                    {med.duration}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button */}
        {rx.status !== 'completed' ? (
          <TouchableOpacity 
            className="w-full bg-primary h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-primary/30"
            activeOpacity={0.8}
            onPress={() => alert("تم تأكيد صرف الوصفة")}
          >
            <ShieldCheck size={20} color="#FFFFFF" />
            <Text className="font-bold text-white text-lg">تأكيد الصرف</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-full bg-emerald-50 h-14 rounded-2xl flex-row items-center justify-center gap-2 border border-emerald-100 opacity-80">
            <ShieldCheck size={20} color="#059669" />
            <Text className="font-bold text-emerald-700 text-base">تم صرف هذه الوصفة</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}