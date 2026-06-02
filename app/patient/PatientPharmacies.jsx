import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, Search, MapPin, Hand, SlidersHorizontal, Star, Navigation, Phone, Globe } from "lucide-react-native";
import { pharmacyApi } from "@/api/pharmacyApi";
import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";

export default function PatientPharmacies() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPharmacies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await pharmacyApi.getPatientPharmacies();
      if (res.success) {
        setPharmacies(res.data || []);
      } else {
        setError(res.message || "تعذر تحميل الصيدليات");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPharmacies();
  }, []);

  const filteredPharmacies = pharmacies.filter(
    (p) =>
      searchQuery === "" ||
      (p.name && p.name.includes(searchQuery)) ||
      (p.address && p.address.includes(searchQuery)) ||
      (p.city && p.city.includes(searchQuery)) ||
      (p.region && p.region.includes(searchQuery))
  );

  const openInGoogleMaps = (lat, lng) => {
    const latitude = Number(lat);
    const longitude = Number(lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const callPharmacy = (phone) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const isValidLocation = (lat, lng) => {
    const latitude = Number(lat);
    const longitude = Number(lng);
    return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  };

  return (
    <MobileShell className="bg-gray-50" edges={["top", "left", "right"]}>
      {/* Header & Search */}
      <View
        className="bg-white px-6 pb-5 shadow-sm z-10"
        style={{ paddingTop: insets.top || 20 }}
      >
        <View className="mb-5 flex-row items-center relative" style={{ minHeight: 44 }}>
          <View style={{ position: 'absolute', right: 0, zIndex: 10 }}>
            <HeaderBackButton fallback="/patient/PatientHome" color="#022451" />
          </View>
          <View className="flex-1 items-center justify-center">
            <View className="bg-patient px-6 py-2 rounded-full shadow-sm border border-gray-100">
              <Text className="text-sm font-extrabold text-white text-center">
                صيدليات دمشق
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 rounded-2xl p-2 border border-gray-200">
          <TouchableOpacity className="bg-patient w-12 h-12 rounded-xl items-center justify-center shadow-sm">
            <SlidersHorizontal size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 text-base font-bold text-gray-900"
            placeholder="ابحث في دمشق (المزة، الميدان...)"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
          <View className="px-3">
            <Search size={22} color="#022451" strokeWidth={2.5} />
          </View>
        </View>
      </View>

      {/* List Content */}
      <View className="flex-1 px-6 pt-4">

        <View className="flex-row items-center justify-between mb-5">
           <View className="flex-row items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100">
            <Globe size={14} color="#022451" />
            <Text className="text-[10px] font-bold text-patient">نطاق دمشق</Text>
          </View>
          <Text className="text-lg font-extrabold text-gray-900">
            الصيدليات الميسرة ({filteredPharmacies.length})
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 20 }}
          className="gap-4"
        >
          {isLoading ? (
            <View className="items-center justify-center py-10">
               <Text className="text-patient text-2xl font-bold mb-2">...</Text>
               <Text className="text-gray-500 font-bold">جاري تحميل الصيدليات...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-10 px-6">
              <Text className="text-red-500 font-bold mb-4">{error}</Text>
              <TouchableOpacity 
                onPress={fetchPharmacies}
                className="bg-patient px-6 py-2 rounded-xl"
              >
                <Text className="text-white font-bold">إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          ) : filteredPharmacies.length === 0 ? (
            <View className="items-center justify-center py-10 px-6">
              <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4 border border-gray-100">
                <MapPin size={40} color="#D1D5DB" />
              </View>
              <Text className="text-lg font-extrabold text-gray-900 mb-2 text-center">
                {searchQuery ? "لا توجد نتائج مطابقة للبحث" : "لا توجد صيدليات متعاقدة حالياً"}
              </Text>
              <Text className="text-sm text-gray-400 text-center font-bold">
                {searchQuery ? "جرب البحث باسم حي آخر أو تأكد من إملاء اسم الصيدلية." : "لم نتمكن من العثور على صيدليات متعاقدة في الوقت الحالي."}
              </Text>
            </View>
          ) : (
            filteredPharmacies.map((pharmacy) => (
              <TouchableOpacity
                key={pharmacy.id}
                onPress={() => router.push(`/patient/PharmacyDetail?id=${pharmacy.id}`)}
                activeOpacity={0.7}
                className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm mb-4"
              >
                <View className="flex-row justify-between items-start mb-5">
                  <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md self-start">
                    <Star size={10} color="#D97706" fill="#D97706" />
                    <Text className="text-[9px] font-extrabold text-amber-700">
                      5.0
                    </Text>
                  </View>

                  <View className="flex-1 items-end pr-4">
                    <Text className="text-base font-extrabold text-gray-900 mb-1">
                      {pharmacy.name}
                    </Text>
                    <Text className="text-[10px] text-gray-400 mb-2 font-medium">
                      {[pharmacy.city, pharmacy.region, pharmacy.address].filter(v => v && !["غير محدد", "غير محددة", "none", "null", "undefined", ".", "-"].includes(String(v).toLowerCase())).join(" — ")}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      {pharmacy.is_contracted_with_organization && (
                        <View className="bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex-row items-center gap-1">
                          <Hand size={10} color="#059669" />
                          <Text className="text-[8px] font-extrabold text-emerald-700">
                             خدمة لغة الإشارة
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View className={`w-12 h-12 rounded-xl items-center justify-center ${pharmacy.is_contracted_with_organization ? 'bg-emerald-50' : 'bg-patient/5'}`}>
                     <MapPin size={24} color={pharmacy.is_contracted_with_organization ? "#059669" : "#022451"} />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity 
                     onPress={() => openInGoogleMaps(pharmacy.latitude, pharmacy.longitude)}
                     disabled={!isValidLocation(pharmacy.latitude, pharmacy.longitude)}
                     className={`flex-1 h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${!isValidLocation(pharmacy.latitude, pharmacy.longitude) ? 'bg-gray-100' : 'bg-patient'}`}
                  >
                    <Text className={`text-[11px] font-extrabold ${!isValidLocation(pharmacy.latitude, pharmacy.longitude) ? 'text-gray-400' : 'text-white'}`}>
                      {!isValidLocation(pharmacy.latitude, pharmacy.longitude) ? 'الموقع غير متوفر حالياً' : 'فتح الموقع على الخريطة'}
                    </Text>
                    {isValidLocation(pharmacy.latitude, pharmacy.longitude) && <Navigation size={16} color="#FFFFFF" strokeWidth={2.5} stroke={2.5} />}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => callPharmacy(pharmacy.phone_number)}
                    disabled={!pharmacy.phone_number}
                    className={`w-12 h-12 bg-white rounded-xl items-center justify-center border border-gray-100 ${!pharmacy.phone_number ? 'opacity-30' : ''}`}
                  >
                    <Phone size={20} color="#022451" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
          )))}
        </ScrollView>
      </View>
    </MobileShell>
  );
}

