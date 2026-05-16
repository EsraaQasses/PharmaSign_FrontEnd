import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, Search, MapPin, Hand, SlidersHorizontal, LocateFixed, Star, Navigation, Phone, Globe } from "lucide-react-native";
import { pharmacyApi } from "@/api/pharmacyApi";
import MobileShell from "@/components/mobile/MobileShell";
import PatientMap from "@/components/mobile/PatientMap";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";

export default function PatientPharmacies() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
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

  const damascusRegion = {
    latitude: 33.5138,
    longitude: 36.2765,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const openInGoogleMaps = (lat, lng) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const callPharmacy = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleMarkerPress = (pharmacy) => {
    setSelectedId(pharmacy.id);
  };

  return (
    <MobileShell className="bg-white" edges={["left", "right"]}>
      {/* Search Header over Map */}
      <View
        className="absolute top-0 w-full z-10 px-6"
        style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
      >
        <View className="mb-5" style={{ position: 'relative', minHeight: 44 }}>
          <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
            <HeaderBackButton fallback="/patient/PatientHome" color="#022451" />
          </View>
          <View className="items-center justify-center" style={{ minHeight: 44 }}>
            <View className="bg-patient px-6 py-2 rounded-full shadow-lg border border-white/20">
              <Text className="text-sm font-extrabold text-white text-center">
                صيدليات دمشق
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-2xl p-2 shadow-2xl border border-gray-100">
          <TouchableOpacity className="bg-patient w-12 h-12 rounded-xl items-center justify-center shadow-lg">
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

      {/* Map Content */}
      <View className="absolute inset-0 z-0 bg-gray-200">
        <PatientMap 
          region={damascusRegion}
          pharmacies={filteredPharmacies.map(p => ({
            ...p,
            lat: p.latitude,
            lng: p.longitude,
            hasSignService: p.is_contracted_with_organization
          }))}
          selectedId={selectedId}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {/* Floating GPS Button */}
      <TouchableOpacity
        className="absolute left-6 w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-2xl z-10 border border-gray-50"
        style={{ bottom: "46%" }}
        activeOpacity={0.8}
      >
        <LocateFixed size={24} color="#022451" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Bottom Sheet List */}
      <View
        className="absolute bottom-0 w-full bg-white rounded-t-[3rem] shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-20 px-6 pt-4"
        style={{ height: "44%", paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-5" />

        <View className="flex-row items-center justify-between mb-5">
           <View className="flex-row items-center gap-1.5 bg-background px-3 py-1.5 rounded-full">
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
          contentContainerStyle={{ paddingBottom: 20 }}
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
                className={`p-5 rounded-3xl border shadow-sm mb-4 ${selectedId === pharmacy.id ? 'bg-blue-50/50 border-patient/20' : 'bg-white border-gray-100'}`}
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
                     className="flex-1 bg-patient h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-patient/20"
                  >
                    <Text className="text-sm font-extrabold text-white">توجيه الخريطة</Text>
                    <Navigation size={16} color="#FFFFFF" strokeWidth={2.5} stroke={2.5} />
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

