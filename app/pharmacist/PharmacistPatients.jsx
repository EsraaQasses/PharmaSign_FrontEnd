import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Search, UserCheck, Calendar, Phone } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import BrandLogo from "@/components/mobile/BrandLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PharmacistPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const mockPatients = [
    { id: "1", name: "خالد محمد الشهري", phone: "0551234567", rxCount: 3, lastVisit: "2026-03-20" },
    { id: "2", name: "سارة عبدالله فهد", phone: "0569876543", rxCount: 7, lastVisit: "2025-11-01" },
    { id: "3", name: "خالد صالح الغامدي", phone: "0501122334", rxCount: 1, lastVisit: "2026-01-25" },
    { id: "4", name: "نورة محمد العتيبي", phone: "0533344556", rxCount: 12, lastVisit: "2025-11-20" },
  ];

  const filteredPatients = mockPatients.filter((p) =>
    (p.name || "").includes(searchQuery) || (p.phone || "").includes(searchQuery)
  );

  return (
    <MobileShell className="bg-primary" edges={["top", "left", "right"]}>
      <PageHeader title="سجل المرضى" showBackButton backTo="/pharmacist/PharmacistHome" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <View className="px-6 py-6 border-b border-gray-50 bg-white shadow-sm shadow-gray-900/5">
          <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
            <TextInput
              className="flex-1 text-base font-bold text-gray-900 h-full"
              placeholder="ابحث برقم الجوال أو اسم المريض..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
            <View className="ml-3">
              <Search size={22} color="#05997F" strokeWidth={2.5} />
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between mb-6 px-2">
            <View className="bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              <Text className="text-xs font-extrabold text-primary">المجموع: {filteredPatients.length}</Text>
            </View>
            <Text className="text-lg font-extrabold text-gray-800">قائمة المرضى</Text>
          </View>

          <View className="gap-5">
            {isLoading ? (
              <View className="items-center justify-center py-20">
                 <Text className="text-primary text-2xl font-bold mb-2">...</Text>
                 <Text className="text-gray-500 font-bold">جاري تحميل سجل المرضى...</Text>
              </View>
            ) : filteredPatients.length === 0 ? (
              <View className="items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-sm mb-6">
                  {searchQuery ? <Search size={40} color="#D1D5DB" /> : <BrandLogo width={48} height={48} />}
                </View>
                <Text className="text-lg font-extrabold text-gray-900 mb-2 text-center">
                  {searchQuery ? "عذراً، لم نجد أي مريض يطابق بحثك" : "لا يوجد مرضى في السجل"}
                </Text>
                <Text className="text-sm text-gray-400 font-bold px-6 text-center mb-4">
                  {searchQuery ? "جرب البحث برقم جوال آخر أو جزء من الاسم." : "سيظهر المرضى هنا بعد صرف أول وصفة طبية لهم."}
                </Text>
                {searchQuery !== "" && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Text className="text-primary font-extrabold text-base">إلغاء البحث</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filteredPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  onPress={() => router.push(`/pharmacist/ScanPatient`)}
                  className="bg-white rounded-[2.5rem] p-5 border border-gray-100 shadow-sm flex-row items-center justify-between"
                  activeOpacity={0.85}
                >
                  {/* Left Side: Prescription Count (Fixed Width) */}
                  <View className="w-[70px] items-center">
                    <View className="bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 w-full items-center">
                      <Text className="text-[10px] font-extrabold text-primary" numberOfLines={1}>{patient.rxCount || 0} وصفة</Text>
                    </View>
                  </View>

                  {/* Center: Patient Details (Flexible space) */}
                  <View className="flex-1 px-4">
                    <Text 
                      className="text-lg font-extrabold text-gray-900 text-right mb-2 leading-tight" 
                      numberOfLines={2}
                    >
                      {patient.name || "مريض غير محدد"}
                    </Text>
                    
                    {/* Metadata Rows */}
                    <View className="items-end gap-1.5">
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-[11px] font-bold text-gray-500" numberOfLines={1}>{patient.phone || "غير متوفر"}</Text>
                        <Phone size={11} color="#05997F" />
                      </View>
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-[11px] font-bold text-gray-400" numberOfLines={1}>{patient.lastVisit || "تاريخ غير متوفر"}</Text>
                        <Calendar size={11} color="#9CA3AF" />
                      </View>
                    </View>
                  </View>

                  {/* Right Side: Profile Icon (Fixed Width) */}
                  <View className="w-16 h-16 bg-primary/5 rounded-[1.8rem] items-center justify-center border border-primary/10 shadow-sm shadow-primary/5">
                    <UserCheck size={32} color="#05997F" strokeWidth={2} />
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