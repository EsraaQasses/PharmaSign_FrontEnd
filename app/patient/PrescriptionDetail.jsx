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
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { prescriptionApi } from "@/api/prescriptionApi";

const getPharmacyName = (prescription) => {
  const nestedName = prescription?.pharmacy?.name;
  const flatName = prescription?.pharmacy_name;
  const name = nestedName || flatName;
  if (!name) return "";
  const clean = String(name).trim();
  if (!clean || clean === "صيدلية غير محددة" || clean === "غير محدد" || clean === "null" || clean === "undefined") {
    return "";
  }
  return clean;
};

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

  const getItemPrice = (item) => parseFloat(item.price || 0);
  const getItemQuantity = (item) => parseInt(item.quantity || 1);
  const getItemSubtotal = (item) => getItemPrice(item) * getItemQuantity(item);
  const getPrescriptionTotal = (items) => (items || []).reduce((sum, item) => sum + getItemSubtotal(item), 0);
  const formatPrice = (val) => new Intl.NumberFormat('en-US').format(val);

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
              <View className="flex-row items-center gap-3 mb-5">
                <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                  <Thermometer size={22} color="#022451" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-gray-800 text-right">
                    {rx.doctor_name}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5 text-right">
                    {rx.doctor_specialty || "طبيب ممارس"}
                  </Text>
                </View>
              </View>
            )}

            {getPharmacyName(rx) ? (
              <>
                <View className="h-px bg-gray-50 w-full mb-5" />
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center border border-blue-100">
                    <MapPin size={22} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-extrabold text-gray-800 text-right">
                      {getPharmacyName(rx)}
                    </Text>
                    <Text className="text-[10px] text-gray-400 mt-1 text-right">
                      تم صرف الدواء من هذه الصيدلية
                    </Text>
                  </View>
                </View>
              </>
            ) : null}

             {/* Prescription Total (Subtle for patient) */}
             {rx.items && rx.items.length > 0 && getPrescriptionTotal(rx.items) > 0 && (
               <View className="mt-4 pt-4 border-t border-gray-50 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                     <Text className="text-lg font-extrabold text-gray-800">{formatPrice(getPrescriptionTotal(rx.items))}</Text>
                     <Text className="text-[10px] font-bold text-gray-400 mt-1">ل.س</Text>
                  </View>
                  <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">إجمالي الوصفة</Text>
               </View>
             )}
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
                        itemId: med.id,
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
                      <View className="w-12 h-12 bg-patient rounded-2xl items-center justify-center shadow-lg shadow-patient/20 overflow-hidden">
                        {med.image_url || med.medicine_image ? (
                          <Image 
                            source={{ uri: med.image_url || med.medicine_image }} 
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        ) : (
                          <Hand size={22} color="#FFFFFF" strokeWidth={2.5} />
                        )}
                      </View>
                    ) : (
                      <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100 overflow-hidden">
                        {med.image_url || med.medicine_image ? (
                          <Image 
                            source={{ uri: med.image_url || med.medicine_image }} 
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        ) : (
                          <Pill size={24} color="#D1D5DB" />
                        )}
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-gray-800 mb-1 text-right">
                        {med.medication_name || med.medicine_name || med.name || "دواء"}
                      </Text>
                      <View className="flex-row items-center gap-3 mt-0.5">
                        {shouldShowDosage ? (
                          <View className="flex-row items-center gap-1.5">
                            <Clock size={10} color="#9CA3AF" />
                            <Text className="text-[10px] text-gray-500 font-bold text-right">
                              {dosageText}
                            </Text>
                          </View>
                        ) : null}
                        <View className="flex-row items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                           <Text className="text-[10px] font-bold text-gray-600">{formatPrice(getItemSubtotal(med))}</Text>
                           <Text className="text-[8px] text-gray-400">ل.س</Text>
                        </View>
                      </View>
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
