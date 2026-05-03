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
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import MobileShell from "@/components/mobile/MobileShell";
import { useAuth } from "@/lib/AuthContext";

export default function PharmacistHome() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await profileApi.getPharmacistProfile();
    if (res.success) {
      setProfile(res.data);
      // Sync back to AuthContext to ensure other screens get it
      if (setUser && user) {
        setUser({ ...user, name: res.data.full_name });
      }
    }
  };

  // Prioritize real profile name, then AuthContext, then mock for dev
  const pharmacistName = profile?.full_name || user?.name || "";
  const recentPrescriptions = MOCK_PRESCRIPTIONS.slice(0, 3);

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
              <Text className="text-sm text-gray-400 font-bold mb-1 text-right">الوصفات اليوم</Text>
              <Text className="text-3xl font-extrabold text-pharmacist text-right">48</Text>
              <View className="flex-row items-center gap-1 mt-2">
                <TrendingUp size={14} color="#059669" />
                <Text className="text-[10px] text-emerald-600 font-bold">+12% منذ الأمس</Text>
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
              {recentPrescriptions.map((rx) => (
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
                      {rx.patientName}
                    </Text>
                    <Text className="text-xs text-gray-400 font-bold text-right">
                      {rx.medications.length} أدوية • {rx.date}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
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