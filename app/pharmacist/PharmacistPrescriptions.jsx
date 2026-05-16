import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal, FileText, UserCheck, Calendar, Pill, ChevronLeft, AlertCircle, MapPin } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { prescriptionApi } from "@/api/prescriptionApi";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function PharmacistPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      fetchPrescriptions();
    }, [])
  );

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await prescriptionApi.getPrescriptions();
      if (res.success) {
        // Defensive handling of response shapes: res.data, res.data.results, etc.
        const data = res.data?.results || res.data?.prescriptions || res.data || [];
        setPrescriptions(Array.isArray(data) ? data : []);
      } else {
        setError(res.message || "تعذر تحميل الوصفات");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  const getPharmacyName = (rx) => {
    const nestedName = rx?.pharmacy?.name;
    const flatName = rx?.pharmacy_name;
    const name = nestedName || flatName;
    if (!name) return "";
    const clean = String(name).trim();
    if (!clean || ["صيدلية غير محددة", "none", "null", "undefined"].includes(clean)) return "";
    return clean;
  };

  const getPatientDisplayName = (rx) => {
    const value =
      rx?.patient_name ||
      rx?.patient?.full_name ||
      rx?.patient?.name ||
      rx?.patient?.user?.full_name ||
      rx?.patient?.user?.name ||
      rx?.session?.patient?.full_name ||
      rx?.session?.patient?.name ||
      rx?.patient?.phone_number ||
      rx?.patient?.user?.phone_number;

    const clean = String(value || "").trim();

    if (
      !clean ||
      clean === "مريض" ||
      clean === "غير محدد" ||
      clean === "null" ||
      clean === "undefined" ||
      clean === "." ||
      clean === "-"
    ) {
      return "مريض غير محدد";
    }

    return clean;
  };

  const getItemPrice = (item) => parseFloat(item.price || 0);
  const getItemQuantity = (item) => parseInt(item.quantity || 1);
  const getItemSubtotal = (item) => getItemPrice(item) * getItemQuantity(item);
  const getPrescriptionTotal = (rx) => {
    const items = rx.items || rx.medications || [];
    return items.reduce((sum, item) => sum + getItemSubtotal(item), 0);
  };
  const formatPrice = (val) => new Intl.NumberFormat('en-US').format(val);

  const filteredPrescriptions = (prescriptions || []).filter((rx) => {
    // 1. Filter out draft-like prescriptions
    const status = String(rx.status || "").toLowerCase();
    const isDraft = ["draft", "pending_draft", "مسودة"].includes(status);
    if (isDraft) return false;

    // 2. Apply search query
    const pName = getPatientDisplayName(rx);
    const doctorName = rx.doctor_name || "";
    const items = rx.items || rx.medications || [];
    const query = searchQuery.toLowerCase();
    
    return (
      pName.toLowerCase().includes(query) ||
      doctorName.toLowerCase().includes(query) ||
      items.some((m) => (m.medicine_name || m.name || "").toLowerCase().includes(query))
    );
  });

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <PageHeader title="سجل الوصفات" showBackButton role="pharmacist" backTo="/pharmacist/PharmacistHome" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <View className="px-5 pt-6 pb-4 bg-white border-b border-gray-50 z-10">
          {/* Search Bar */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14 relative">
              <TextInput
                className="flex-1 text-base text-gray-900 h-full font-medium"
                placeholder="ابحث في سجل الوصفات..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
              <View className="ml-2">
                <Search size={22} color="#9CA3AF" />
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between mb-5 px-1">
             <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
              {filteredPrescriptions.length} وصفة موجودة
            </Text>
          </View>

          <View className="gap-5">
            {isLoading ? (
              <View className="items-center justify-center py-20">
                 <ActivityIndicator size="large" color="#05997F" />
                 <Text className="text-gray-500 font-bold mt-4">جاري تحميل الوصفات...</Text>
              </View>
            ) : error ? (
              <View className="items-center justify-center py-20 bg-red-50 rounded-3xl border border-red-100 px-6">
                <AlertCircle size={40} color="#EF4444" />
                <Text className="text-red-500 font-bold mt-2 text-center">{error}</Text>
                <TouchableOpacity onPress={fetchPrescriptions} className="mt-4 bg-red-500 px-6 py-2 rounded-xl">
                  <Text className="text-white font-bold">إعادة المحاولة</Text>
                </TouchableOpacity>
              </View>
            ) : filteredPrescriptions.length === 0 ? (
              <View className="items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <View className="w-20 h-20 bg-white rounded-full shadow-sm items-center justify-center mb-4">
                   {searchQuery ? <Search size={32} color="#D1D5DB" /> : <FileText size={32} color="#D1D5DB" />}
                </View>
                <Text className="text-lg font-extrabold text-gray-900 mb-2 text-center">
                   {searchQuery ? "لا توجد نتائج مطابقة للبحث" : "لا توجد وصفات حتى الآن"}
                </Text>
                <Text className="text-sm text-gray-400 font-bold text-center px-4">
                   {searchQuery ? "جرب البحث باسم مريض آخر أو دواء مختلف." : "لم تقم بصرف أي وصفات حتى الآن."}
                </Text>
              </View>
            ) : (
              filteredPrescriptions.map((rx) => (
                <TouchableOpacity
                  key={rx.id}
                  onPress={() => router.push(`/pharmacist/PharmacistPrescriptionDetail?id=${rx.id}`)}
                  className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm"
                  activeOpacity={0.8}
                >
                  {/* Header */}
                  <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-50">
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-12 rounded-2xl items-center justify-center bg-primary/5">
                        <FileText size={24} color="#05997F" strokeWidth={2.5} />
                      </View>
                      <View>
                        <Text className="text-base font-extrabold text-gray-900">{getPatientDisplayName(rx)}</Text>
                        <View className="flex-row items-center gap-1.5 mt-0.5">
                          <Calendar size={12} color="#9CA3AF" />
                          <Text className="text-[11px] font-bold text-gray-400">{(rx.prescribed_at || rx.created_at || rx.date || "").split('T')[0] || "---"}</Text>
                          <Text className="text-[11px] font-bold text-gray-400 mx-1">•</Text>
                          <Text className="text-[11px] font-bold text-pharmacist">{rx.doctor_name || "طبيب"}{rx.doctor_specialty ? ` (${rx.doctor_specialty})` : ""}</Text>
                        </View>
                      </View>
                    </View>

                    {getPrescriptionTotal(rx) > 0 && (
                      <View className="flex-row items-center gap-1 bg-pharmacist/5 px-3 py-1.5 rounded-xl border border-pharmacist/10">
                        <Text className="text-xs font-extrabold text-pharmacist">{formatPrice(getPrescriptionTotal(rx))}</Text>
                        <Text className="text-[9px] font-bold text-pharmacist mt-0.5">ل.س</Text>
                      </View>
                    )}
                  </View>

                  {/* Meds snippet */}
                  <View className="mb-4 pr-1">
                    <View className="flex-row items-start gap-2">
                      <View className="mt-1">
                        <Pill size={14} color="#05997F" />
                      </View>
                      <Text className="flex-1 text-sm font-bold text-gray-600 leading-relaxed text-right">
                        {(rx.items || rx.medications || []).map((m) => m.medication_name || m.medicine_name || m.name || "دواء").join("، ")}
                      </Text>
                    </View>
                    
                    {getPharmacyName(rx) ? (
                      <View className="flex-row items-center justify-end gap-1.5 mt-2">
                         <Text className="text-[11px] font-bold text-gray-400">{getPharmacyName(rx)}</Text>
                         <MapPin size={10} color="#9CA3AF" />
                      </View>
                    ) : null}
                  </View>

                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-50">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-xs font-extrabold text-pharmacist">عرض التفاصيل</Text>
                      <ChevronLeft size={16} color="#05997F" strokeWidth={2.5} />
                    </View>
                    <View className="flex-row items-center gap-2">
                       <Text className="text-[10px] font-extrabold text-gray-300 uppercase tracking-tighter">ID: {String(rx.id).toUpperCase()}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </MobileShell>
  );
}