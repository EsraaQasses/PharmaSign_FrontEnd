import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { MOCK_PRESCRIPTIONS, STATUS_MAP } from "@/lib/mockData";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Hand,
  MapPin,
  Pill,
  Thermometer,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrescriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Find the prescription
  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id);

  if (!rx) {
    return (
      <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
        <PageHeader title="تفاصيل الوصفة" showBackButton role="patient" backTo="/patient/PatientPrescriptions" />
        <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 items-center justify-center p-8">
          <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
            <AlertCircle size={40} color="#D1D5DB" />
          </View>
          <Text className="text-gray-500 font-bold text-center">
            الوصفة غير موجودة أو تم حذفها
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/patient/PatientPrescriptions")}
            className="mt-8 bg-patient px-8 py-4 rounded-2xl w-full items-center"
          >
            <Text className="text-white font-extrabold">العودة للرئيسية</Text>
          </TouchableOpacity>
        </View>
      </MobileShell>
    );
  }

  const statusConfig = STATUS_MAP[rx.status] || STATUS_MAP.draft;

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="تفاصيل الوصفة" showBackButton role="patient" backTo="/patient/PatientPrescriptions" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Card */}
          <View className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 mb-1 uppercase tracking-wider">حالة الوصفة</Text>
                <View className="flex-row items-center gap-2">
                  <View className={`w-8 h-8 rounded-lg items-center justify-center ${statusConfig.bgColor} bg-opacity-20`}>
                    <CheckCircle2 size={16} color={statusConfig.textColor.replace('text-', '')} />
                  </View>
                  <Text className={`text-base font-extrabold ${statusConfig.textColor}`}>
                    {statusConfig.label}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-[10px] font-extrabold text-gray-400 mb-1 uppercase tracking-wider">تاريخ الإصدار</Text>
                <View className="flex-row items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Calendar size={14} color="#6B7280" />
                  <Text className="text-sm font-bold text-gray-700">
                    {rx.date}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Doctor & Pharmacy Info */}
          <View className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm mt-5">
            <Text className="text-sm font-extrabold text-gray-900 mb-5">
              معلومات الطبيب والصيدلية
            </Text>

            <View className="flex-row items-center justify-end gap-3 mb-5">
              <View className="items-end">
                <Text className="text-base font-extrabold text-gray-800">
                  {rx.doctorName}
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5">
                  {rx.doctorSpecialty}
                </Text>
              </View>
              <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                <Thermometer size={22} color="#022451" />
              </View>
            </View>

            <View className="h-px bg-gray-50 w-full mb-5" />

            <View className="flex-row items-center justify-end gap-3">
              <View className="items-end">
                <Text className="text-base font-extrabold text-gray-800">
                  {rx.pharmacyName}
                </Text>
                <Text className="text-[10px] text-gray-400 mt-1">
                  تم صرف الدواء من هذه الصيدلية
                </Text>
              </View>
              <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center border border-blue-100">
                <MapPin size={22} color="#3B82F6" />
              </View>
            </View>
          </View>

          {/* Medications List */}
          <View className="mt-8 mb-4">
            <Text className="text-lg font-extrabold text-gray-900 mb-4 px-1">
              الأدوية الموصوفة ({rx.medications.length})
            </Text>

            <View className="gap-4">
              {rx.medications.map((med, index) => (
                <View
                  key={med.id || index}
                  className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm flex-row items-center gap-4"
                >
                  {rx.signLanguageReady ? (
                    <TouchableOpacity
                      onPress={() => router.push(`/patient/MedicationView?id=${rx.id}&medIndex=${index}`)}
                      className="w-12 h-12 bg-patient rounded-2xl items-center justify-center shadow-lg shadow-patient/20"
                    >
                      <Hand size={22} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>
                  ) : (
                    <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                      <Pill size={24} color="#D1D5DB" />
                    </View>
                  )}

                  <View className="flex-1">
                    <Text className="text-base font-extrabold text-gray-800 mb-1">
                      {med.name}
                    </Text>
                    <View className="flex-row items-center justify-end gap-3 mt-1">
                      <Text className="text-xs text-gray-500 font-bold">
                        {med.dosage}
                      </Text>
                      <Clock size={12} color="#9CA3AF" />
                    </View>
                    <Text className="text-xs text-gray-400 mt-2 leading-relaxed text-right" numberOfLines={2}>
                      {med.instructions}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Notes from Doctor */}
          {rx.notes ? (
            <View className="bg-amber-50 rounded-3xl p-5 mt-4 border border-amber-100 shadow-sm">
              <View className="flex-row items-center gap-2 mb-3">
                <FileText size={18} color="#D97706" />
                <Text className="text-sm font-extrabold text-amber-900">
                  ملاحظات الطبيب الهامة
                </Text>
              </View>
              <Text className="text-xs text-amber-700 leading-relaxed font-medium">
                {rx.notes}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </MobileShell>
  );
}
