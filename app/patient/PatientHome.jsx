import BottomNav from "@/components/mobile/BottomNav";
import BrandLogo from "@/components/mobile/BrandLogo";
import { useAuth } from "@/lib/AuthContext";
import {
  MOCK_PATIENTS,
} from "@/lib/mockData";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronLeft,
  Clock,
  FileText,
  Hand,
  MapPin,
  QrCode,
  Shield,
  Thermometer,
} from "lucide-react-native";
import { prescriptionApi } from "@/api/prescriptionApi";
import { profileApi } from "@/api/profileApi";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

function QuickAction({ icon: Icon, label, path, color }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(path)}
      className="items-center gap-2"
      activeOpacity={0.7}
    >
      <View
        style={{ backgroundColor: color }}
        className="w-14 h-14 rounded-2xl items-center justify-center shadow-sm"
      >
        <Icon size={24} color="#FFFFFF" strokeWidth={2.5} />
      </View>
      <Text className="text-[11px] font-bold text-[#022451]">{label}</Text>
    </TouchableOpacity>
  );
}

import MobileShell from "@/components/mobile/MobileShell";

const getPharmacyName = (prescription) => {
  const nestedName = prescription?.pharmacy?.name;
  const flatName = prescription?.pharmacy_name;
  const name = nestedName || flatName;
  if (!name) return "";
  const clean = String(name).trim();
  if (!clean || clean === "صيدلية غير محددة" || clean === "غير محدد" || clean === "null" || clean === "undefined") {
    return "";
  }
  return clean;
};

export default function PatientHome() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoadingRx, setIsLoadingRx] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchLatestPrescriptions();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await profileApi.getPatientProfile();
      if (res.success) {
        setProfile(res.data);
        // Sync back to AuthContext to ensure other screens get it
        if (setUser && user) {
          setUser({ ...user, name: res.data.full_name, phone: res.data.phone });
        }
      }
    } catch (err) {
      console.log("Failed to fetch profile:", err);
    }
  };

  const fetchLatestPrescriptions = async () => {
    setIsLoadingRx(true);
    try {
      const res = await prescriptionApi.getPatientPrescriptions();
      if (res.success) {
        // Handle nested response shapes
        const data = res.data?.results || res.data?.prescriptions || res.data || [];
        // Sort by date descending and take top 3
        const sorted = (Array.isArray(data) ? data : [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setPrescriptions(sorted);
      }
    } catch (err) {
      console.log("Failed to fetch latest prescriptions:", err);
    } finally {
      setIsLoadingRx(false);
    }
  };

  const patientName = profile?.full_name || user?.name || "";

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-patient px-5 pt-4 pb-12 rounded-b-[2rem]">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm p-1">
                <BrandLogo width={32} height={32} />
              </View>
              <View>
                <Text className="text-white/70 text-sm font-bold">مرحباً 👋</Text>
                <Text className="text-white text-xl font-extrabold">
                  {patientName}
                </Text>
              </View>
            </View>
            <View className="w-10" />
          </View>

          {/* QR Session Card */}
          <TouchableOpacity
            onPress={() => router.push("/patient/SessionQR")}
            className="bg-white/10 rounded-2xl p-4 flex-row items-center gap-4"
            activeOpacity={0.9}
          >
            <View className="w-16 h-16 bg-white rounded-xl items-center justify-center">
              <QrCode size={40} color="#022451" />
            </View>
            <View className="flex-1">
              <Text className="text-white/80 text-xs text-right font-bold">
                ربط الوصفة الطبية
              </Text>
              <Text className="text-white font-bold text-sm my-0.5 text-right">
                إنشاء رمز جلسة مؤقت
              </Text>
              <Text className="text-white/60 text-[10px] text-right">
                أظهره للصيدلي لبدء صرف الدواء
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5 -mt-6 space-y-6">
          {/* Quick Actions */}
          <View
            className="bg-white rounded-2xl p-5 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row justify-around">
              <QuickAction
                icon={FileText}
                label="الوصفات"
                path="/patient/PatientPrescriptions"
                color="#022451"
              />
              <QuickAction
                icon={Hand}
                label="لغة الإشارة"
                path="/patient/AppGuide"
                color="#0FAE9B"
              />
              <QuickAction
                icon={MapPin}
                label="صيدليات"
                path="/patient/PatientPharmacies"
                color="#4C8FB5"
              />
              <QuickAction
                icon={Shield}
                label="حسابي"
                path="/patient/PatientProfile"
                color="#6E7FA3"
              />
            </View>
          </View>

          {/* Recent Prescriptions */}
          <View className="mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-extrabold text-gray-900">
                آخر الوصفات
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/patient/PatientPrescriptions")}
                className="flex-row items-center gap-0.5"
              >
                <Text className="text-xs text-patient font-bold">
                  عرض الكل
                </Text>
                <ChevronLeft size={12} color="#022451" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              {isLoadingRx ? (
                <View className="py-10 items-center">
                  <ActivityIndicator size="small" color="#022451" />
                  <Text className="text-gray-400 font-bold mt-2">جاري تحميل الوصفات الحديثة...</Text>
                </View>
              ) : prescriptions.length === 0 ? (
                <View className="py-10 bg-gray-50 rounded-2xl items-center border border-dashed border-gray-200">
                  <Text className="text-gray-400 font-bold">لا توجد وصفات حديثة حالياً</Text>
                </View>
              ) : (
                prescriptions.map((rx) => {
                  const hasSignVideo = (rx.items || []).some(item => item.sign_status === "completed" || item.video_url);
                  
                  return (
                    <TouchableOpacity
                      key={rx.id}
                      onPress={() => router.push(`/patient/PrescriptionDetail?id=${rx.id}`)}
                      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4"
                      activeOpacity={0.8}
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
                        <Text className="text-[11px] font-bold text-gray-400">{rx.created_at?.split('T')[0] || "---"}</Text>
                      </View>

                      {/* Doctor & Pharmacy Info */}
                      <View className="space-y-1.5 mb-5">
                        <View className="flex-row items-center gap-2">
                          <View className="bg-blue-50 p-1.5 rounded-lg">
                             <Thermometer size={14} color="#3B82F6" />
                          </View>
                          <Text className="text-base font-extrabold text-gray-900 text-right">
                            {rx.doctor_name || "طبيب غير محدد"}
                          </Text>
                        </View>
                        <Text className="text-xs text-gray-400 text-right mr-9">
                          {rx.doctor_specialty || "تخصص غير محدد"}
                        </Text>
                        
                        {getPharmacyName(rx) ? (
                          <View className="flex-row items-center gap-2 mt-1">
                            <MapPin size={14} color="#9CA3AF" />
                            <Text className="text-xs text-gray-500 font-medium text-right">
                              {getPharmacyName(rx)}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Medications Summary */}
                      <View className="flex-row flex-wrap gap-2 mb-6">
                        {(rx.items || []).map((med, idx) => (
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
                        onPress={() => router.push(`/patient/PrescriptionDetail?id=${rx.id}`)}
                        className="w-full bg-patient/5 border border-patient/10 rounded-2xl py-4 items-center justify-center"
                      >
                        <Text className="text-sm font-extrabold text-patient">
                          عرض التفاصيل
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>


        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav role="patient" />
      </View>
    </MobileShell>
  );
}
