import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  ShieldCheck, 
  Activity, 
  Phone, 
  User, 
  MapPin, 
  Calendar, 
  Plus, 
  Pill 
} from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PharmacistPrescriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id) || MOCK_PRESCRIPTIONS[0];

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <PageHeader title="تفاصيل الوصفة" showBackButton role="pharmacist" backTo="/pharmacist/PharmacistPrescriptions" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40 + insets.bottom
          }}
          showsVerticalScrollIndicator={false}
        >


          {/* Patient Info Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6">
            <View className="flex-row items-center justify-between mb-6 pb-6 border-b border-gray-50">
              <TouchableOpacity className="w-12 h-12 bg-pharmacist/5 rounded-2xl items-center justify-center">
                <Phone size={22} color="#05997F" strokeWidth={2.5} />
              </TouchableOpacity>

              <View className="items-end">
                <Text className="text-lg font-extrabold text-gray-900">{rx.patientName}</Text>
                <Text className="text-xs text-gray-400 font-bold mt-1 uppercase">PAT-8492 • مريض نشط</Text>
              </View>

              <View className="w-14 h-14 bg-gray-50 rounded-2xl items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                <User size={30} color="#9CA3AF" strokeWidth={1.5} />
              </View>
            </View>

            <View className="flex-row items-center justify-between px-2">
              <View className="items-end">
                <Text className="text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider">العيادة / الطبيب</Text>
                <View className="flex-row items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-xl">
                  <Text className="text-xs font-bold text-gray-800">{rx.doctor || "د. محمد الشهري"}</Text>
                  <MapPin size={12} color="#05997F" />
                </View>
              </View>
              <View className="items-end">
                <Text className="text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider">تاريخ الوصفة</Text>
                <View className="flex-row items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                  <Text className="text-xs font-bold text-gray-800">{rx.date}</Text>
                  <Calendar size={12} color="#9CA3AF" />
                </View>
              </View>
            </View>
          </View>

          {/* Medications */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-5 px-1">

              <Text className="text-lg font-extrabold text-gray-900">الأدوية الموصوفة ({rx.medications.length})</Text>
            </View>

            <View className="gap-4">
              {rx.medications.map((med, index) => (
                <View
                  key={index}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex-row items-center gap-4"
                >
                  <View className="w-14 h-14 bg-pharmacist/5 rounded-2xl items-center justify-center border border-pharmacist/10">
                    <Pill size={28} color="#05997F" strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-extrabold text-gray-900 mb-1 text-right">{med.name}</Text>
                    <Text className="text-xs font-bold text-gray-400 mb-3 text-right leading-relaxed" numberOfLines={2}>{med.instructions}</Text>
                    <View className="flex-row justify-end">
                      <View className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        <Text className="text-[10px] font-extrabold text-emerald-700">
                          {med.duration || "لمدة أسبوع"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>


    </MobileShell>
  );
}