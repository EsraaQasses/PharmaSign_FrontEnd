import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Thermometer,
  MapPin,
  Calendar,
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Hand,
} from "lucide-react-native";
import { MOCK_PRESCRIPTIONS, STATUS_MAP } from "@/lib/mockData";
import PageHeader from "@/components/mobile/PageHeader";

export default function PrescriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the prescription
  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id);

  if (!rx) {
    return (
      <View className="flex-1 bg-background">
        <PageHeader title="تفاصيل الوصفة" showBackButton />
        <View className="flex-1 items-center justify-center p-5">
          <AlertCircle size={48} color="#D1D5DB" />
          <Text className="text-gray-500 font-medium mt-4 text-center">
            الوصفة غير موجودة أو تم حذفها
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">العودة</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusConfig = STATUS_MAP[rx.status] || STATUS_MAP.draft;

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="تفاصيل الوصفة" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-gray-500 mb-1">حالة الوصفة</Text>
              <View className="flex-row items-center gap-2">
                <CheckCircle2 size={18} color="#0C6B58" />
                <Text className="text-base font-bold text-gray-900">
                  {statusConfig.label}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-500 mb-1">تاريخ الإصدار</Text>
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color="#6B7280" />
                <Text className="text-sm font-semibold text-gray-700">
                  {rx.date}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Doctor & Pharmacy Info */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mt-4">
          <Text className="text-sm font-bold text-gray-900 mb-4">
            معلومات الطبيب والصيدلية
          </Text>

          <View className="flex-row items-start gap-3 mb-4">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Thermometer size={20} color="#0C6B58" />
            </View>
            <View>
              <Text className="text-sm font-bold text-gray-800">
                {rx.doctorName}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                {rx.doctorSpecialty}
              </Text>
            </View>
          </View>

          <View className="h-px bg-gray-50 w-full mb-4" />

          <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
              <MapPin size={20} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-sm font-bold text-gray-800">
                {rx.pharmacyName}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                تم صرف الدواء من هذه الصيدلية
              </Text>
            </View>
          </View>
        </View>

        {/* Medications List */}
        <View className="mt-6 mb-4">
          <Text className="text-base font-bold text-gray-900 mb-3">
            الأدوية الموصوفة ({rx.medications.length})
          </Text>

          <View className="gap-3">
            {rx.medications.map((med, index) => (
              <View
                key={med.id || index}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center gap-3"
              >
                <View className="w-12 h-12 bg-primary/5 rounded-xl items-center justify-center">
                  <Pill size={24} color="#0C6B58" />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-800 mb-1">
                    {med.name}
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                      <Clock size={12} color="#6B7280" />
                      <Text className="text-xs text-gray-500">
                        {med.dosage}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[10px] text-gray-400 mt-1" numberOfLines={1}>
                    {med.instructions}
                  </Text>
                </View>

                {rx.signLanguageReady && (
                  <TouchableOpacity
                    onPress={() => router.push(`/patient/MedicationView?id=${rx.id}&medIndex=${index}`)}
                    className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center"
                  >
                    <Hand size={18} color="#0C6B58" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Notes from Doctor */}
        {rx.notes ? (
          <View className="bg-amber-50 rounded-2xl p-4 mt-2 mb-4 border border-amber-100">
            <View className="flex-row items-center gap-2 mb-2">
              <FileText size={16} color="#D97706" />
              <Text className="text-sm font-bold text-amber-800">
                ملاحظات الطبيب
              </Text>
            </View>
            <Text className="text-xs text-amber-700 leading-relaxed">
              {rx.notes}
            </Text>
          </View>
        ) : null}

      </ScrollView>

      {/* Fixed bottom action if sign language is ready */}
      {rx.signLanguageReady && (
        <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={() => router.push(`/patient/SignTutorial?id=${rx.id}`)}
            className="w-full bg-primary py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
          >
            <Hand size={20} color="#FFFFFF" />
            <Text className="text-white font-bold text-base">
              عرض لغة الإشارة للوصفة
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
