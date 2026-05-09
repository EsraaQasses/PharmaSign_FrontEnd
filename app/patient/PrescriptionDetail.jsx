import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
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

import { prescriptionApi } from "@/api/prescriptionApi";

export default function PrescriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [rx, setRx] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await prescriptionApi.getPatientPrescriptionDetail(id);
      if (res.success) {
        setRx(res.data);
      } else {
        setError(res.message || "تعذر تحميل تفاصيل الوصفة");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDetail();
  }, [id]);


  const formatDate = (dateStr) => {
    if (!dateStr) return "تاريخ غير محدد";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB");
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
        <PageHeader title="تفاصيل الوصفة" showBackButton role="patient" backTo="/patient/PatientPrescriptions" />
        <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 items-center justify-center p-8">
          <Text className="text-gray-500 font-bold">جاري تحميل البيانات...</Text>
        </View>
      </MobileShell>
    );
  }

  if (error || !rx) {
    return (
      <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
        <PageHeader title="تفاصيل الوصفة" showBackButton role="patient" backTo="/patient/PatientPrescriptions" />
        <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 items-center justify-center p-8">
          <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
            <AlertCircle size={40} color="#D1D5DB" />
          </View>
          <Text className="text-gray-500 font-bold text-center">
            {error || "الوصفة غير موجودة أو تم حذفها"}
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
          {/* Date Row (Replacing Status Card) */}
          <View className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-sm font-bold text-gray-700">
                {formatDate(rx.created_at)}
              </Text>
            </View>
            <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">تاريخ الإصدار</Text>
          </View>

          {/* Doctor & Pharmacy Info */}
          <View className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm mt-5">
            <Text className="text-sm font-extrabold text-gray-900 mb-5">
              معلومات الطبيب والصيدلية
            </Text>

            {rx.doctor_name && (
              <View className="flex-row items-center justify-end gap-3 mb-5">
                <View className="items-end">
                  <Text className="text-base font-extrabold text-gray-800">
                    {rx.doctor_name}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5">
                    {rx.doctor_specialty || "طبيب ممارس"}
                  </Text>
                </View>
                <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                  <Thermometer size={22} color="#022451" />
                </View>
              </View>
            )}

            {Boolean(rx.pharmacy_name && rx.pharmacy_name !== "صيدلية غير محددة") ? (
              <>
                <View className="h-px bg-gray-50 w-full mb-5" />
                <View className="flex-row items-center justify-end gap-3">
                  <View className="items-end">
                    <Text className="text-base font-extrabold text-gray-800">
                      {rx.pharmacy_name}
                    </Text>
                    <Text className="text-[10px] text-gray-400 mt-1">
                      تم صرف الدواء من هذه الصيدلية
                    </Text>
                  </View>
                  <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center border border-blue-100">
                    <MapPin size={22} color="#3B82F6" />
                  </View>
                </View>
              </>
            ) : null}
          </View>

          <View className="mt-8 mb-4">
            <Text className="text-lg font-extrabold text-gray-900 mb-4 px-1">
              الأدوية الموصوفة ({(rx.items || []).length})
            </Text>

            <View className="gap-4">
              {(rx.items || []).map((med, index) => {
                const hasSignVideo = med.sign_status === "completed" || med.video_url;
                const instructions = med.approved_instruction_text || med.instructions || med.raw_transcript || "لا توجد تعليمات متوفرة";
                
                const dosageText = typeof med.dosage === "string" ? med.dosage.trim() : "";
                const hiddenValues = ["غير محدد", "غير محددة", "undefined", "null", "none", ".", "-"];
                const shouldShowDosage = Boolean(dosageText && !hiddenValues.includes(dosageText));

                return (
                  <TouchableOpacity
                    key={med.id || index}
                    onPress={() => router.push({
                      pathname: "/patient/MedicationView",
                      params: { 
                        id: rx.id, 
                        medIndex: index,
                        medication_name: med.medication_name,
                        approved_instruction_text: med.approved_instruction_text,
                        instructions: med.instructions,
                        raw_transcript: med.raw_transcript,
                        video_url: med.video_url,
                        dosage: med.dosage,
                        duration: med.duration,
                        frequency: med.frequency
                      }
                    })}
                    className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm flex-row items-center gap-4"
                  >
                    {hasSignVideo ? (
                      <View className="w-12 h-12 bg-patient rounded-2xl items-center justify-center shadow-lg shadow-patient/20">
                        <Hand size={22} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                    ) : (
                      <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                        <Pill size={24} color="#D1D5DB" />
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-gray-800 mb-1 text-right">
                        {med.medication_name}
                      </Text>
                      {shouldShowDosage ? (
                        <View className="flex-row items-center justify-end gap-3 mt-1">
                          <Text className="text-xs text-gray-500 font-bold">
                            {dosageText}
                          </Text>
                          <Clock size={12} color="#9CA3AF" />
                        </View>
                      ) : null}
                      <Text className="text-xs text-gray-400 mt-2 leading-relaxed text-right" numberOfLines={2}>
                        {instructions}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </MobileShell>
  );
}
