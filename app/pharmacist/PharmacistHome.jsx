import BottomNav from "@/components/mobile/BottomNav";
import BrandLogo from "@/components/mobile/BrandLogo";
import { MOCK_PHARMACIST, MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import { useRouter } from "expo-router";
import {
  FileText,
  QrCode,
  TrendingUp
} from "lucide-react-native";
import { profileApi } from "@/api/profileApi";
import { prescriptionApi } from "@/api/prescriptionApi";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

import MobileShell from "@/components/mobile/MobileShell";
import { useAuth } from "@/lib/AuthContext";

export default function PharmacistHome() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [isLoadingRx, setIsLoadingRx] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchRecentPrescriptions();
  }, []);

  const fetchProfile = async () => {
    const res = await profileApi.getPharmacistProfile();
    if (res.success) {
      setProfile(res.data);
      if (setUser && user) {
        setUser({ ...user, name: res.data.full_name });
      }
    }
  };

  const fetchRecentPrescriptions = async () => {
    setIsLoadingRx(true);
    try {
      const res = await prescriptionApi.getPrescriptions();
      if (res.success) {
        const data = res.data?.results || res.data?.prescriptions || res.data || [];
        const nonDrafts = Array.isArray(data) 
          ? data.filter(rx => !["draft", "pending_draft", "مسودة"].includes(String(rx.status || "").toLowerCase()))
          : [];
        setRecentPrescriptions(nonDrafts.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to fetch recent prescriptions", err);
    } finally {
      setIsLoadingRx(false);
    }
  };

  const getPatientDisplayName = (prescription) => {
    const value =
      prescription?.patient_name ||
      prescription?.patient?.full_name ||
      prescription?.patient?.name ||
      prescription?.patient?.user?.full_name ||
      prescription?.patient?.user?.name ||
      prescription?.session?.patient?.full_name ||
      prescription?.session?.patient?.name ||
      prescription?.patient?.phone_number ||
      prescription?.patient?.user?.phone_number;

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

  const pharmacistName = profile?.full_name || user?.name || "";

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Integrated Hero Section */}
        <View className="bg-pharmacist px-5 pt-4 pb-10 rounded-b-[3rem] shadow-2xl shadow-pharmacist/20 relative overflow-hidden">
          {/* Top Bar */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm p-1">
                <BrandLogo width={32} height={32} />
              </View>
              <View>
                <Text className="text-white/70 text-xs font-bold">لوحة الصيدلي</Text>
                <Text className="text-white text-xl font-extrabold">
                  مرحباً {pharmacistName}
                </Text>
              </View>
            </View>

          </View>

          {/* Connected Scan Card */}
          <TouchableOpacity
            onPress={() => router.push("/pharmacist/ScanPatient")}
            className="bg-white rounded-[2.5rem] p-6 flex-row items-center gap-5 justify-between shadow-xl"
            activeOpacity={0.9}
            style={{ elevation: 10 }}
          >
            <View className="w-16 h-16 bg-pharmacist/10 rounded-3xl items-center justify-center border border-pharmacist/20">
              <QrCode size={36} color="#05997F" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-gray-900 mb-1 text-right">
                امسح رمز المريض
              </Text>
              <Text className="text-xs text-gray-400 font-bold leading-relaxed text-right">
                ابدأ بصرف وصفة طبية جديدة فوراً عبر قراءة الرمز السريع
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-8">

          <View className="mt-6">
            <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
              <Text className="text-sm text-gray-400 font-bold mb-1 text-right">إجمالي الوصفات</Text>
              <Text className="text-3xl font-extrabold text-pharmacist text-right">{recentPrescriptions.length > 0 ? recentPrescriptions.length : "0"}</Text>
              <View className="flex-row items-center gap-1 mt-2">
                <TrendingUp size={14} color="#059669" />
                <Text className="text-[10px] text-emerald-600 font-bold">إحصائيات الوصفات</Text>
              </View>
              <View className="absolute -bottom-4 -left-4 opacity-5">
                <FileText size={80} color="#000000" />
              </View>
            </View>
          </View>

          {/* Recent List */}
          <View className="mt-8 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-extrabold text-gray-900">الوصفات الأخيرة</Text>
              <TouchableOpacity onPress={() => router.push("/pharmacist/PharmacistPrescriptions")}>
                <Text className="text-sm font-bold text-pharmacist">عرض الكل</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {isLoadingRx ? (
                 <ActivityIndicator color="#05997F" className="py-8" />
              ) : recentPrescriptions.length === 0 ? (
                 <View className="bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-200 items-center">
                    <Text className="text-gray-400 font-bold">لا توجد وصفات حديثة</Text>
                 </View>
              ) : (
                recentPrescriptions.map((rx) => (
                  <TouchableOpacity
                    key={rx.id}
                    onPress={() => router.push(`/pharmacist/PharmacistPrescriptionDetail?id=${rx.id}`)}
                    className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex-row-reverse items-center gap-3"
                    activeOpacity={0.7}
                  >
                    <View
                      className="w-16 h-16 min-w-[64px] rounded-2xl items-center justify-center flex-shrink-0 bg-primary/10"
                      style={{ overflow: 'hidden' }}
                    >
                      <FileText size={32} color="#0C6B58" strokeWidth={2.5} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-gray-900 mb-1 text-right">
                        {getPatientDisplayName(rx)}
                      </Text>
                      <Text className="text-xs text-gray-400 font-bold text-right">
                        {(rx.items || rx.medications || []).length} أدوية • {(rx.prescribed_at || rx.created_at || "").split('T')[0]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav role="pharmacist" />
      </View>
    </MobileShell>
  );
}