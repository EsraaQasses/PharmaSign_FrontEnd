import BottomNav from "@/components/mobile/BottomNav";
import BrandLogo from "@/components/mobile/BrandLogo";
import { useAuth } from "@/lib/AuthContext";
import {
  MOCK_NOTIFICATIONS,
  MOCK_PATIENTS,
  MOCK_PRESCRIPTIONS,
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
} from "lucide-react-native";
import { prescriptionApi } from "@/api/prescriptionApi";
import { profileApi } from "@/api/profileApi";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function QuickAction({ icon: Icon, label, path, color }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(path)}
      className="items-center gap-1.5"
      activeOpacity={0.7}
    >
      <View
        className={`w-14 h-14 rounded-2xl ${color} items-center justify-center shadow-sm`}
      >
        <Icon size={24} color="#FFFFFF" />
      </View>
      <Text className="text-[11px] font-semibold text-gray-800">{label}</Text>
    </TouchableOpacity>
  );
}

import MobileShell from "@/components/mobile/MobileShell";

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
  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

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
                <Text className="text-white/70 text-sm">مرحباً 👋</Text>
                <Text className="text-white text-xl font-extrabold">
                  {patientName}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/patient/PatientNotifications")}
              className="relative"
            >
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Bell size={20} color="#FFFFFF" />
              </View>
              {unreadNotifs > 0 && (
                <View className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full items-center justify-center border border-patient">
                  <Text className="text-[10px] text-white font-bold">
                    {unreadNotifs}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
              <Text className="text-white/80 text-xs text-right">
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
                color="bg-patient"
              />
              <QuickAction
                icon={Hand}
                label="لغة الإشارة"
                path="/patient/AppGuide"
                color="bg-amber-500"
              />
              <QuickAction
                icon={MapPin}
                label="صيدليات"
                path="/patient/PatientPharmacies"
                color="bg-blue-500"
              />
              <QuickAction
                icon={Shield}
                label="حسابي"
                path="/patient/PatientProfile"
                color="bg-violet-500"
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
                  <Text className="text-gray-400 font-bold">جاري تحميل الوصفات الحديثة...</Text>
                </View>
              ) : prescriptions.length === 0 ? (
                <View className="py-10 bg-gray-50 rounded-2xl items-center border border-dashed border-gray-200">
                  <Text className="text-gray-400 font-bold">لا توجد وصفات حديثة حالياً</Text>
                </View>
              ) : (
                prescriptions.map((rx) => (
                  <TouchableOpacity
                    key={rx.id}
                    onPress={() => router.push(`/patient/PrescriptionDetail?id=${rx.id}`)}
                    className="bg-white rounded-2xl p-5 border border-gray-100"
                    activeOpacity={0.7}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="items-start">
                        <Text className="font-extrabold text-base text-gray-900">
                          {rx.doctor_name || "طبيب غير محدد"}
                        </Text>
                        <Text className="text-xs text-gray-400 mt-0.5">
                          {rx.doctor_specialty || "تخصص غير محدد"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-4 mt-1">
                      <View className="flex-row items-center gap-1">
                        <Clock size={12} color="#9CA3AF" />
                        <Text className="text-xs text-gray-500">{rx.created_at?.split('T')[0] || "---"}</Text>
                      </View>
                      <Text className="text-xs text-gray-500">
                        {(rx.items || []).length} أدوية
                      </Text>
                      {rx.pharmacy_name && rx.pharmacy_name !== "صيدلية غير محددة" && (
                        <Text className="text-xs text-gray-500" numberOfLines={1}>
                          {rx.pharmacy_name}
                        </Text>
                      )}
                    </View>
                    {/* Check if any item has completed sign status or a video URL */}
                    {(rx.items || []).some(item => item.sign_status === "completed" || item.video_url) && (
                      <View className="mt-4 flex-row items-center gap-1.5 pt-3 border-t border-gray-50">
                        <Hand size={14} color="#022451" />
                        <Text className="text-xs text-patient font-extrabold">
                          لغة إشارة متاحة للمشاهدة
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
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
