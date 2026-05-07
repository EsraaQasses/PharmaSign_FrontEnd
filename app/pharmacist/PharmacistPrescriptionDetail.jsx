import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  ShieldCheck, 
  Activity, 
  Phone, 
  User, 
  MapPin, 
  Calendar, 
  Plus, 
  Pill,
  FileX,
  AlertCircle
} from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { prescriptionApi } from "@/api/prescriptionApi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";

export default function PharmacistPrescriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = React.useState(true);
  const [rx, setRx] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (id) {
      fetchDetail();
    } else {
      setIsLoading(false);
      setError("معرف الوصفة مفقود");
    }
  }, [id]);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await prescriptionApi.getPrescriptionDetail(id);
      if (res.success) {
        setRx(res.data);
      } else {
        setError(res.message || "تعذر تحميل تفاصيل الوصفة");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <PageHeader title="تفاصيل الوصفة" showBackButton role="pharmacist" backTo="/pharmacist/PharmacistPrescriptions" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40 + insets.bottom
          }}
          showsVerticalScrollIndicator={false}
        >


          {isLoading ? (
            <View className="items-center justify-center py-32">
               <ActivityIndicator size="large" color="#05997F" />
               <Text className="text-gray-500 font-bold mt-4">جاري تحميل تفاصيل الوصفة...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-32 bg-red-50 rounded-3xl border border-red-100">
              <AlertCircle size={40} color="#EF4444" />
              <Text className="text-red-500 font-bold mt-2">{error}</Text>
              <TouchableOpacity onPress={fetchDetail} className="mt-4 bg-red-500 px-4 py-2 rounded-xl">
                <Text className="text-white font-bold">إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          ) : !rx ? (
            <View className="items-center justify-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-4">
              <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-sm mb-4">
                 <FileX size={40} color="#D1D5DB" />
              </View>
              <Text className="text-lg font-extrabold text-gray-900 mb-2">الوصفة غير موجودة</Text>
              <Text className="text-sm font-bold text-gray-400">لا يمكن العثور على تفاصيل هذه الوصفة.</Text>
            </View>
          ) : (
            <>
              {/* Patient Info Card */}
              <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6">
                <View className="flex-row items-center justify-between mb-6 pb-6 border-b border-gray-50">
                  <TouchableOpacity className="w-12 h-12 bg-pharmacist/5 rounded-2xl items-center justify-center">
                    <Phone size={22} color="#05997F" strokeWidth={2.5} />
                  </TouchableOpacity>

                  <View className="items-end">
                    <Text className="text-lg font-extrabold text-gray-900">{rx.patient?.full_name || rx.patient_name || "مريض"}</Text>
                    <Text className="text-xs text-gray-400 font-bold mt-1 uppercase">ID: {String(rx.id).toUpperCase()}</Text>
                  </View>

                  <View className="w-14 h-14 bg-gray-50 rounded-2xl items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                    <User size={30} color="#9CA3AF" strokeWidth={1.5} />
                  </View>
                </View>

                <View className="flex-row items-center justify-between px-2">
                  <View className="items-end">
                    <Text className="text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider">العيادة / الطبيب</Text>
                    <View className="flex-row items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-xl">
                      <Text className="text-xs font-bold text-gray-800">
                        {rx.doctor_name || "طبيب غير محدد"}
                        {rx.doctor_specialty ? ` - ${rx.doctor_specialty}` : ""}
                      </Text>
                      <MapPin size={12} color="#05997F" />
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider">تاريخ الوصفة</Text>
                    <View className="flex-row items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                      <Text className="text-xs font-bold text-gray-800">{rx.created_at?.split('T')[0] || rx.date || "---"}</Text>
                      <Calendar size={12} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
              </View>

              {/* Medications */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-5 px-1">
                  <Text className="text-lg font-extrabold text-gray-900">الأدوية الموصوفة ({(rx.items || rx.medications || []).length})</Text>
                </View>

                <View className="gap-4">
                  {(rx.items || rx.medications || []).length === 0 ? (
                    <Text className="text-center font-bold text-gray-400 py-4">لا توجد أدوية في هذه الوصفة.</Text>
                  ) : (
                    (rx.items || rx.medications || []).map((med, index) => (
                      <View
                        key={index}
                        className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex-row items-center gap-4"
                      >
                        <View className="w-14 h-14 bg-pharmacist/5 rounded-2xl items-center justify-center border border-pharmacist/10">
                          <Pill size={28} color="#05997F" strokeWidth={2} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-extrabold text-gray-900 mb-1 text-right">{med.medicine_name || med.name || "دواء"}</Text>
                          <Text className="text-xs font-bold text-gray-400 mb-3 text-right leading-relaxed" numberOfLines={2}>
                            {med.instructions_text || med.dosage || med.instructions || "لا توجد تعليمات"}
                          </Text>
                          <View className="flex-row justify-end gap-2">
                             {med.duration && (
                                <View className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                  <Text className="text-[10px] font-extrabold text-emerald-700">
                                    {med.duration}
                                  </Text>
                                </View>
                             )}
                             {med.frequency && (
                                <View className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                  <Text className="text-[10px] font-extrabold text-blue-700">
                                    {med.frequency}
                                  </Text>
                                </View>
                             )}
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>


    </MobileShell>
  );
}