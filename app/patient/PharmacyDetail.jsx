import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, MapPin, Clock, Navigation, Phone, Hand, Info } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_PHARMACIES } from "@/lib/mockData";

export default function PharmacyDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const pharmacy = MOCK_PHARMACIES.find((p) => p.id === id) || MOCK_PHARMACIES[0];

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="تفاصيل الصيدلية" showBackButton role="patient" backTo="/patient/PatientPharmacies" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <View className="relative">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=800&auto=format&fit=crop" }}
              className="w-full h-56 bg-gray-200"
            />
            <View className="absolute inset-0 bg-black/10" />
          </View>

          <View className="px-5 -mt-10">
            <View className="bg-white rounded-[2.5rem] p-6 border border-gray-50 shadow-xl">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl">
                  <Star size={14} color="#D97706" fill="#D97706" strokeWidth={2.5} />
                  <Text className="text-xs font-extrabold text-amber-700">{pharmacy.rating}</Text>
                </View>
                <Text className="text-2xl font-extrabold text-gray-900 flex-1 text-right">{pharmacy.name}</Text>
              </View>

              <View className="flex-row items-center gap-2 mb-6 justify-end">
                <Text className="text-sm font-bold text-gray-400">{pharmacy.address}</Text>
                <MapPin size={16} color="#9CA3AF" />
              </View>

              <View className="h-px bg-gray-50 w-full mb-6" />

              <View className="flex-row justify-around">
                <View className="items-center gap-1.5">
                  <View className="bg-patient/5 w-10 h-10 rounded-xl items-center justify-center">
                    <Clock size={20} color="#022451" strokeWidth={2.5} />
                  </View>
                  <Text className="text-[9px] font-extrabold text-gray-300 uppercase">ساعات العمل</Text>
                  <Text className="text-xs font-extrabold text-gray-900">{pharmacy.openHours}</Text>
                </View>
                <View className="items-center gap-1.5">
                  <View className="bg-blue-50 w-10 h-10 rounded-xl items-center justify-center">
                    <Navigation size={20} color="#3B82F6" strokeWidth={2.5} />
                  </View>
                  <Text className="text-[9px] font-extrabold text-gray-300 uppercase">المسافة</Text>
                  <Text className="text-xs font-extrabold text-gray-900">{pharmacy.distance}</Text>
                </View>
                <View className="items-center gap-1.5">
                  <View className="bg-emerald-50 w-10 h-10 rounded-xl items-center justify-center">
                    <Phone size={20} color="#10B981" strokeWidth={2.5} />
                  </View>
                  <Text className="text-[9px] font-extrabold text-gray-300 uppercase">التواصل</Text>
                  <Text className="text-xs font-extrabold text-gray-900">{pharmacy.phone}</Text>
                </View>
              </View>
            </View>

            {pharmacy.hasSignService && (
              <View className="bg-emerald-50 rounded-[2rem] p-6 mt-6 border border-emerald-100 flex-row items-start gap-5 shadow-sm shadow-emerald-900/5">
                <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                  <Hand size={30} color="#059669" strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-extrabold text-emerald-900 mb-1 text-right">صيدلية ميسرة</Text>
                  <Text className="text-xs font-bold text-emerald-600/80 text-right leading-relaxed">هذه الصيدلية تدعم التواصل بلغة الإشارة عبر التطبيق ومجهزة بكادر مدرب لخدمتكم بشكل كامل.</Text>
                </View>
              </View>
            )}

            <View className="bg-white rounded-[2rem] p-6 mt-6 border border-gray-50 shadow-sm mb-6">
              <View className="flex-row items-center gap-2 mb-4 justify-end">
                <Text className="text-lg font-extrabold text-gray-900">حول الصيدلية</Text>
                <Info size={20} color="#022451" strokeWidth={2.5} />
              </View>
              <Text className="text-sm font-medium text-gray-500 leading-relaxed text-right">
                {pharmacy.description || "توفر الصيدلية تشكيلة واسعة من الأدوية والمستلزمات الطبية. كادرنا الصيدلاني متواجد دائماً لتقديم المشورة الطبية والإجابة على استفساراتكم بأعلى معايير الجودة."}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Footer Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex-row gap-4"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <TouchableOpacity className="w-16 h-16 border border-gray-100 rounded-2xl items-center justify-center bg-gray-50">
          <Phone size={24} color="#6B7280" strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-patient h-16 rounded-2xl flex-row items-center justify-center gap-3 shadow-xl shadow-patient/30">
          <Navigation size={22} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-white font-extrabold text-lg">بدء التوجيه</Text>
        </TouchableOpacity>
      </View>
    </MobileShell>
  );
}
