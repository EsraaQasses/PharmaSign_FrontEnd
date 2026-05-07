import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import {
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  XCircle,
  FileText,
  Thermometer,
  MapPin,
  Hand,
} from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/mobile/PageHeader";
import BrandLogo from "@/components/mobile/BrandLogo";
import MobileShell from "@/components/mobile/MobileShell";

const FILTERS = ["الكل", "q", "draft", "viewed", "sent", "cancelled"];

import { prescriptionApi } from "@/api/prescriptionApi";

export default function PatientPrescriptions() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState(null);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await prescriptionApi.getPatientPrescriptions();
      if (res.success) {
        const data = res.data?.results || res.data?.prescriptions || res.data || [];
        setPrescriptions(Array.isArray(data) ? data : []);
      } else {
        setError(res.message || "تعذر تحميل الوصفات");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPrescriptions();
    }, [])
  );

  const filtered = prescriptions.filter((p) => {
    const matchSearch =
      searchQuery === "" ||
      (p.doctor_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.pharmacy_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.items || []).some((m) => (m.medication_name || "").toLowerCase().includes(searchQuery.toLowerCase()));

    return matchSearch;
  });


  const formatDate = (dateStr) => {
    if (!dateStr) return "تاريخ غير محدد";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB"); 
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader 
        title="وصفاتي الطبية" 
        showBackButton 
        role="patient" 
        backTo="/patient/PatientHome"
      />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <View className="px-5 py-6">
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-4 border border-gray-100 shadow-sm gap-2">
            <Search size={22} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-base text-gray-800 font-medium"
              placeholder="ابحث عن دواء أو طبيب..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#4F46E5" />
            </View>
          ) : filtered.length === 0 ? (
            <View className="items-center justify-center py-20 px-8">
              <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6 border border-gray-100">
                 <FileText size={48} color="#D1D5DB" />
              </View>
              <Text className="text-lg font-extrabold text-gray-900 mb-2 text-center">
                {searchQuery ? "لا توجد نتائج مطابقة للبحث" : "لا توجد وصفات محفوظة بعد"}
              </Text>
              <Text className="text-sm text-gray-400 text-center leading-relaxed font-bold">
                {searchQuery ? "جرب البحث بكلمات مختلفة أو تأكد من الإملاء الصحيح." : "بمجرد قيام الطبيب بإضافة وصفة جديدة، ستظهر هنا مباشرة."}
              </Text>
            </View>
          ) : (
            <View className="gap-5">
              {filtered.map((p) => {
                const hasSignVideo = (p.items || []).some(item => item.sign_status === "completed" || item.video_url);
                
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => router.push(`/patient/PrescriptionDetail?id=${p.id}`)}
                    activeOpacity={0.8}
                    className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm"
                  >
                    {/* Top Row: Date & Sign Status Badge */}
                    <View className="flex-row items-center justify-between mb-4">
                      {hasSignVideo ? (
                        <View className="flex-row items-center gap-1.5 bg-patient/10 px-2.5 py-1 rounded-lg">
                          <Hand size={12} color="#022451" />
                          <Text className="text-[10px] font-extrabold text-patient">لغة الإشارة متاحة</Text>
                        </View>
                      ) : (
                        <View />
                      )}
                      <Text className="text-[11px] font-bold text-gray-400">{formatDate(p.created_at)}</Text>
                    </View>

                    {/* Doctor & Pharmacy Info */}
                    <View className="space-y-1.5 mb-5">
                      <View className="flex-row items-center justify-end gap-2">
                        <Text className="text-base font-extrabold text-gray-900">
                          {p.doctor_name || "طبيب غير محدد"}
                        </Text>
                        <View className="bg-blue-50 p-1.5 rounded-lg">
                           <Thermometer size={14} color="#3B82F6" />
                        </View>
                      </View>
                      <Text className="text-xs text-gray-400 text-right mr-9">
                        {p.doctor_specialty || "تخصص غير محدد"}
                      </Text>
                      
                      {p.pharmacy_name && !["صيدلية غير محددة", "none", "null"].includes(p.pharmacy_name.trim()) && (
                        <View className="flex-row items-center justify-end gap-2 mt-1">
                          <Text className="text-xs text-gray-500 font-medium">
                            {p.pharmacy_name}
                          </Text>
                          <MapPin size={14} color="#9CA3AF" />
                        </View>
                      )}
                    </View>

                    {/* Medications Summary */}
                    <View className="flex-row flex-wrap justify-end gap-2 mb-6">
                      {(p.items || []).map((med, idx) => (
                        <View
                          key={med.id || idx}
                          className="bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100"
                        >
                          <Text className="text-[10px] text-gray-600 font-bold">
                            {med.medication_name || "دواء"}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Single Action Button */}
                    <TouchableOpacity
                      onPress={() => router.push(`/patient/PrescriptionDetail?id=${p.id}`)}
                      className="w-full bg-patient/5 border border-patient/10 rounded-2xl py-4 items-center justify-center"
                    >
                      <Text className="text-sm font-extrabold text-patient">
                        عرض التفاصيل
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </MobileShell>
  );
}
