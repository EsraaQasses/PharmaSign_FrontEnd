import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Navigation,
  Phone,
  Star,
  Hand,
  LocateFixed,
} from "lucide-react-native";
import { MOCK_PHARMACIES } from "@/lib/mockData";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PatientPharmacies() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPharmacies = MOCK_PHARMACIES.filter(
    (p) =>
      searchQuery === "" ||
      p.name.includes(searchQuery) ||
      p.address.includes(searchQuery)
  );

  return (
    <View className="flex-1 bg-background relative">
      {/* Search Header over Map */}
      <View
        className="absolute top-0 w-full z-10 px-5"
        style={{ paddingTop: top > 0 ? top + 10 : 40 }}
      >
        {/* Back Button & Title */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="w-10" />
          <Text
            className="text-xl font-bold text-primary text-center"
            style={{
              textShadowColor: "rgba(255,255,255,0.8)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            الصيدليات الميسرة
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
          >
            <MapPin size={20} color="#0C6B58" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/95 rounded-2xl p-2 shadow-sm">
          <TouchableOpacity className="bg-primary p-3 rounded-xl">
            <SlidersHorizontal size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 text-sm font-medium text-gray-800"
            placeholder="ابحث حسب المدينة أو المنطقة"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
          <View className="px-3">
            <Search size={22} color="#9CA3AF" />
          </View>
        </View>
      </View>

      {/* Background Map Image (Mock) */}
      <View className="absolute inset-0 z-0">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop",
          }}
          className="w-full h-full opacity-60"
        />

        {/* Mock Map Pins - Just decorative for the placeholder map */}
        <View className="absolute top-[30%] right-[25%] items-center">
          <View className="bg-primary p-3 rounded-2xl shadow-sm">
            <MapPin size={24} color="#FFFFFF" />
          </View>
          <View className="bg-white px-2 py-1 rounded-lg border border-gray-100 mt-1">
            <Text className="text-[10px] font-bold text-gray-900">
              صيدلية الشفاء
            </Text>
          </View>
        </View>

        <View className="absolute top-[55%] left-[35%] items-center">
          <View className="bg-emerald-500 p-3 rounded-2xl shadow-sm">
            <Hand size={24} color="#FFFFFF" />
          </View>
          <View className="bg-white px-2 py-1 rounded-lg border border-gray-100 mt-1 items-center">
            <Text className="text-[10px] font-bold text-gray-900">
              النهدي (لغة إشارة)
            </Text>
          </View>
        </View>
      </View>

      {/* Floating GPS Button */}
      <TouchableOpacity
        className="absolute left-6 w-14 h-14 bg-primary rounded-2xl items-center justify-center shadow-lg z-10"
        style={{ bottom: "45%" }}
        activeOpacity={0.8}
      >
        <LocateFixed size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Bottom Sheet List */}
      <View
        className="absolute bottom-0 w-full bg-white rounded-t-[36px] shadow-xl z-20 px-5 pt-3"
        style={{ height: "45%", paddingBottom: bottom > 0 ? bottom : 20 }}
      >
        <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-5" />

        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity>
            <Text className="text-sm font-bold text-primary">عرض الكل</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            الصيدليات القريبة ({filteredPharmacies.length})
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, gap: 16 }}
        >
          {filteredPharmacies.map((pharmacy) => (
            <View
              key={pharmacy.id}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center gap-1">
                  <Star size={14} color="#D97706" fill="#D97706" />
                  <Text className="text-xs font-bold text-amber-700">
                    {pharmacy.rating}
                  </Text>
                </View>

                <View className="flex-1 items-end pr-4">
                  <Text className="text-base font-bold text-gray-900 mb-2">
                    {pharmacy.name}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    {pharmacy.hasSignService ? (
                      <View className="bg-emerald-100 px-2.5 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-emerald-700">
                          تدعم لغة الإشارة
                        </Text>
                      </View>
                    ) : (
                      <View className="bg-blue-100 px-2.5 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-blue-700">
                          مفتوح الآن
                        </Text>
                      </View>
                    )}
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs text-gray-500">
                        {pharmacy.distance}
                      </Text>
                      <Navigation size={12} color="#6B7280" />
                    </View>
                  </View>
                </View>

                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${
                    pharmacy.hasSignService ? "bg-emerald-50" : "bg-primary/5"
                  }`}
                >
                  {pharmacy.hasSignService ? (
                    <Hand
                      size={28}
                      color="#059669"
                    />
                  ) : (
                    <MapPin size={28} color="#0C6B58" />
                  )}
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-primary py-3 rounded-2xl flex-row items-center justify-center gap-2">
                  <Text className="text-sm font-bold text-white">
                    الاتجاهات
                  </Text>
                  <Navigation size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity className="w-[50px] h-[50px] border border-gray-200 rounded-2xl items-center justify-center">
                  <Phone size={20} color="#0C6B58" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
