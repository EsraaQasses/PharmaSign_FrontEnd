import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, FileText, Home, ArrowLeft, ArrowRight, User, Stethoscope, Pill, Hash } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrescriptionSuccess() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { prescription_id, doctor_name, medication_count, patient_name: rawPatientName, total_price } = useLocalSearchParams();
  
  const getPatientName = () => {
    const val = String(rawPatientName || "").trim();
    const hidden = ["مريض", "غير محدد", "null", "undefined", ".", "-", ""];
    if (!val || hidden.includes(val)) return "مريض غير محدد";
    return val;
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        {/* Rounded Integrated Header Overlay */}
        <View className="bg-pharmacist pt-8 pb-16 px-6 rounded-b-[4rem] shadow-2xl shadow-pharmacist/30 relative overflow-hidden">
          <View className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          
          <View className="items-center justify-center mt-4">
             <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4 border border-white/20">
                <CheckCircle size={40} color="#FFFFFF" strokeWidth={2.5} />
             </View>
             <Text className="text-white text-3xl font-extrabold text-center mb-2">
                تم الإرسال بنجاح
             </Text>
             <Text className="text-white/70 text-base text-center font-medium px-10">
                تم حفظ وإرسال الوصفة الطبية إلى المريض بنجاح.
             </Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1 -mt-8 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: insets.bottom + 40,
            paddingTop: 8 
          }}
        >
          <View className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 mb-8">
            <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-widest text-center mb-8">تفاصيل العملية</Text>
            
            <View className="gap-6">
              <View className="flex-row items-center justify-between border-b border-gray-50 pb-4">
                <Text className="text-base font-extrabold text-gray-900">{prescription_id || "---"}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-bold text-gray-500">رقم الوصفة</Text>
                  <Hash size={16} color="#9CA3AF" />
                </View>
              </View>

              <View className="flex-row items-center justify-between border-b border-gray-50 pb-4">
                <Text className="text-base font-extrabold text-gray-900 text-right flex-1 ml-4" numberOfLines={1}>{getPatientName()}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-bold text-gray-500">المريض</Text>
                  <User size={16} color="#9CA3AF" />
                </View>
              </View>

              <View className="flex-row items-center justify-between border-b border-gray-50 pb-4">
                <Text className="text-base font-extrabold text-gray-900 text-right flex-1 ml-4" numberOfLines={1}>{doctor_name || "---"}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-bold text-gray-500">الطبيب</Text>
                  <Stethoscope size={16} color="#9CA3AF" />
                </View>
              </View>

              <View className="flex-row items-center justify-between border-b border-gray-50 pb-4">
                <Text className="text-base font-extrabold text-gray-900">{medication_count || "0"}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-bold text-gray-500">عدد الأدوية</Text>
                  <Pill size={16} color="#9CA3AF" />
                </View>
              </View>

              {parseFloat(total_price || 0) > 0 && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xl font-extrabold text-pharmacist">{new Intl.NumberFormat('en-US').format(total_price)}</Text>
                    <Text className="text-[10px] font-bold text-pharmacist mt-1">ل.س</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-bold text-gray-500">إجمالي الوصفة</Text>
                    <FileText size={16} color="#05997F" />
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="gap-4 mb-10">
            <TouchableOpacity
              onPress={() => router.replace("/pharmacist/PharmacistPrescriptions")}
              className="w-full bg-pharmacist h-16 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg shadow-pharmacist/20"
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text className="text-white text-lg font-extrabold">عرض سجل الوصفات</Text>
              <FileText size={22} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/pharmacist/PharmacistHome")}
              className="w-full bg-white border-2 border-gray-100 h-16 rounded-2xl flex-row items-center justify-center gap-3"
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color="#6B7280" strokeWidth={2.5} />
              <Text className="text-gray-600 text-lg font-extrabold">العودة للرئيسية</Text>
              <Home size={22} color="#6B7280" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </MobileShell>
  );
}
