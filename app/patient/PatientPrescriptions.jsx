import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
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
import { MOCK_PRESCRIPTIONS, STATUS_MAP } from "@/lib/mockData";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/mobile/PageHeader";
import BrandLogo from "@/components/mobile/BrandLogo";

const FILTERS = ["الكل", "q", "draft", "viewed", "sent", "cancelled"];

import MobileShell from "@/components/mobile/MobileShell";


export default function PatientPrescriptions() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const patientId = user?.id || "p1"; // Fallback to p1
  
  const prescriptions = MOCK_PRESCRIPTIONS.filter(
    (p) => p.patientId === patientId
  );

  const filtered = prescriptions.filter((p) => {
    let matchFilter = true;
    if (activeFilter !== "الكل") {
      // In a real app we would map this properly
      // For now just allow search to do the work
    }
    const matchSearch =
      searchQuery === "" ||
      (p.doctorName || "").includes(searchQuery) ||
      (p.pharmacyName || "").includes(searchQuery) ||
      (p.medications || []).some((m) => (m.name || "").includes(searchQuery));

    return matchFilter && matchSearch;
  });

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
          {/* Search */}
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

        {/* List */}
        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View className="items-center justify-center py-20">
              <View className="w-10 h-10 items-center justify-center mb-4">
                {/* Use a simple text or an activity indicator for loading */}
                <Text className="text-patient text-2xl font-bold">...</Text>
              </View>
              <Text className="text-gray-500 font-bold mt-2">
                جاري تحميل الوصفات...
              </Text>
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
                const statusConfig = STATUS_MAP[p.status] || STATUS_MAP.draft;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => router.push(`/patient/PrescriptionDetail?id=${p.id}`)}
                    activeOpacity={0.8}
                    className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.03,
                      shadowRadius: 5,
                      elevation: 1,
                    }}
                  >
                    {/* Status & Date */}
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="text-xs font-bold text-gray-400">{p.date || "تاريخ غير محدد"}</Text>
                      <View
                        className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bgColor}`}
                      >
                        <Text
                          className={`text-[10px] font-extrabold ${statusConfig.textColor}`}
                        >
                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>

                    {/* Doctor & Pharmacy */}
                    <View className="space-y-2 mb-5">
                      <View className="flex-row items-center justify-end gap-2">
                        <Text className="text-base font-extrabold text-gray-900">
                          {p.doctorName || "طبيب غير محدد"}
                        </Text>
                        <View className="bg-blue-50 p-1.5 rounded-lg">
                           <Thermometer size={14} color="#3B82F6" />
                        </View>
                      </View>
                      <Text className="text-xs text-gray-400 text-right mr-9">
                        {p.doctorSpecialty || "تخصص غير محدد"}
                      </Text>
                      <View className="flex-row items-center justify-end gap-2">
                        <Text className="text-xs text-gray-500 font-medium">
                          {p.pharmacyName || "صيدلية غير محددة"}
                        </Text>
                        <MapPin size={14} color="#9CA3AF" />
                      </View>
                    </View>

                    {/* Medications */}
                    <View className="flex-row flex-wrap justify-end gap-2 mb-5">
                      {(p.medications || []).map((med, index) => (
                        <View
                          key={med.id || index}
                          className="bg-patient/5 rounded-lg px-3 py-1.5 border border-patient/5"
                        >
                          <Text className="text-[11px] text-patient font-extrabold">
                            {med.name || "دواء غير محدد"}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-3 pt-4 border-t border-gray-50">
                      <TouchableOpacity
                        onPress={() =>
                          router.push(`/patient/PrescriptionDetail?id=${p.id}`)
                        }
                        className="flex-1 bg-gray-50 rounded-xl py-3.5 items-center justify-center"
                      >
                        <Text className="text-xs font-bold text-gray-600">
                          عرض التفاصيل
                        </Text>
                      </TouchableOpacity>
                      {p.signLanguageReady && (
                        <TouchableOpacity
                          onPress={() =>
                            router.push(`/patient/SignTutorial?id=${p.id}`)
                          }
                          className="flex-1 bg-patient rounded-xl py-3.5 flex-row items-center justify-center gap-2"
                        >
                          <Hand size={16} color="#FFFFFF" strokeWidth={2.5} />
                          <Text className="text-xs font-extrabold text-white">
                            لغة الإشارة
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
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
