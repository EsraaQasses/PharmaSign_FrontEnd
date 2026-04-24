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

const FILTERS = ["الكل", "q", "draft", "viewed", "sent", "cancelled"];

export default function PatientPrescriptions() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const patientId = user?.id || "p1"; // Fallback to p1
  
  const prescriptions = MOCK_PRESCRIPTIONS.filter(
    (p) => p.patientId === patientId
  );

  const filtered = prescriptions.filter((p) => {
    let matchFilter = true;
    if (activeFilter !== "الكل") {
      matchFilter = false;
      // map filter logic
    }
    const matchSearch =
      searchQuery === "" ||
      p.doctorName.includes(searchQuery) ||
      p.pharmacyName.includes(searchQuery) ||
      p.medications.some((m) => m.name.includes(searchQuery));

    return matchFilter && matchSearch; // update filter match properly later
  });

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="وصفاتي الطبية" showBackButton />

      <View className="px-5 py-4">
        {/* Search */}
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm gap-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 text-sm text-gray-800"
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View className="items-center justify-center py-20">
            <FileText size={48} color="#D1D5DB" />
            <Text className="text-gray-500 font-medium mt-4">
              لا توجد وصفات مطابقة
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filtered.map((p) => {
              const statusConfig = STATUS_MAP[p.status] || STATUS_MAP.draft;
              return (
                <View
                  key={p.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  {/* Status & Date */}
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-sm text-gray-500">{p.date}</Text>
                    <View
                      className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bgColor}`}
                    >
                      <Text
                        className={`text-xs font-bold ${statusConfig.textColor}`}
                      >
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {/* Doctor & Pharmacy */}
                  <View className="space-y-2 mb-4">
                    <View className="flex-row items-center gap-2">
                      <Thermometer size={16} color="#4B5563" />
                      <Text className="text-sm font-semibold text-gray-800">
                        {p.doctorName} • {p.doctorSpecialty}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <MapPin size={16} color="#4B5563" />
                      <Text className="text-sm text-gray-600">
                        {p.pharmacyName}
                      </Text>
                    </View>
                  </View>

                  <View className="h-px bg-gray-100 w-full mb-4" />

                  {/* Medications */}
                  <Text className="text-xs text-gray-500 mb-2">الأدوية:</Text>
                  <View className="flex-row flex-wrap gap-2 mb-4">
                    {p.medications.map((med) => (
                      <View
                        key={med.id}
                        className="bg-primary/10 rounded-full px-3 py-1"
                      >
                        <Text className="text-xs text-primary font-bold">
                          {med.name}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Actions */}
                  <View className="flex-row gap-2 mt-2">
                    <TouchableOpacity
                      onPress={() =>
                        router.push(`/patient/PrescriptionDetail?id=${p.id}`)
                      }
                      className="flex-1 bg-gray-50 rounded-xl py-3 items-center justify-center border border-gray-100"
                    >
                      <Text className="text-sm font-semibold text-gray-700">
                        التفاصيل
                      </Text>
                    </TouchableOpacity>
                    {p.signLanguageReady && (
                      <TouchableOpacity
                        onPress={() =>
                          router.push(`/patient/SignTutorial?id=${p.id}`)
                        }
                        className="flex-1 bg-primary/10 rounded-xl py-3 flex-row items-center justify-center gap-1.5 border border-primary/20"
                      >
                        <Hand size={16} color="#0C6B58" />
                        <Text className="text-sm font-bold text-primary">
                          لغة الإشارة
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
