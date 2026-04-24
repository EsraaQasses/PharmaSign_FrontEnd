import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, Star, Clock, Phone, Navigation, Hand, Info } from "lucide-react-native";
import { MOCK_PHARMACIES } from "@/lib/mockData";
import PageHeader from "@/components/mobile/PageHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PharmacyDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  
  // Provide default logic so placeholder won't crash if id not passed
  const pharmacy = MOCK_PHARMACIES.find((p) => p.id === id) || MOCK_PHARMACIES[0];

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="تفاصيل الصيدلية" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=800&auto=format&fit=crop" }}
          className="w-full h-48 bg-gray-200"
        />

        <View className="px-5 -mt-6">
          <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-xl font-bold text-gray-900 flex-1 text-left">{pharmacy.name}</Text>
              <View className="flex-row items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                <Star size={14} color="#D97706" fill="#D97706" />
                <Text className="text-xs font-bold text-amber-700">{pharmacy.rating}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2 mb-4">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600">{pharmacy.address}</Text>
            </View>

            <View className="h-px bg-gray-100 w-full mb-4" />

            <View className="flex-row gap-4">
              <View className="flex-1 items-center gap-1.5 border-r border-gray-100 pr-4">
                <Clock size={20} color="#0C6B58" />
                <Text className="text-[10px] text-gray-500">ساعات العمل</Text>
                <Text className="text-xs font-bold text-gray-900">{pharmacy.openHours}</Text>
              </View>
              <View className="flex-1 items-center gap-1.5 border-r border-gray-100 pr-4">
                <Navigation size={20} color="#3B82F6" />
                <Text className="text-[10px] text-gray-500">المسافة</Text>
                <Text className="text-xs font-bold text-gray-900">{pharmacy.distance}</Text>
              </View>
              <View className="flex-1 items-center gap-1.5">
                <Phone size={20} color="#10B981" />
                <Text className="text-[10px] text-gray-500">رقم التواصل</Text>
                <Text className="text-xs font-bold text-gray-900">{pharmacy.phone}</Text>
              </View>
            </View>
          </View>

          {pharmacy.hasSignService && (
            <View className="bg-emerald-50 rounded-3xl p-5 mt-4 border border-emerald-100 flex-row items-center gap-4">
              <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center">
                <Hand size={24} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-emerald-800 mb-1 text-left">متوفر لغة الإشارة</Text>
                <Text className="text-xs text-emerald-600 text-left">هذه الصيدلية تدعم التواصل بلغة الإشارة عبر التطبيق ومجهزة لخدمتك بشكل كامل.</Text>
              </View>
            </View>
          )}

          <View className="bg-white rounded-3xl p-5 mt-4 border border-gray-100 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Info size={18} color="#0C6B58" />
              <Text className="text-base font-bold text-gray-900">معلومات إضافية</Text>
            </View>
            <Text className="text-sm text-gray-600 leading-relaxed text-left">
              توفر الصيدلية تشكيلة واسعة من الأدوية والمستلزمات الطبية. كادرنا الصيدلاني متواجد دائماً لتقديم المشورة الطبية والإجابة على استفساراتكم.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pt-4 bg-white border-t border-gray-100 flex-row gap-3" style={{ paddingBottom: bottom > 0 ? bottom : 20 }}>
        <TouchableOpacity className="w-14 h-14 border border-primary/30 rounded-2xl items-center justify-center bg-primary/5">
          <Phone size={24} color="#0C6B58" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-primary h-14 rounded-2xl flex-row items-center justify-center gap-2">
          <Navigation size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-base">الاتجاهات</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
