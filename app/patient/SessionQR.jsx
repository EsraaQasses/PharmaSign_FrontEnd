import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { QrCode, ShieldCheck, RefreshCw, HelpCircle, UserCheck, Activity, AlertCircle, Stethoscope, Pill, Baby, User, Calendar } from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SessionQR() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(119); // 2 minute temporary session

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="رمز ربط الجلسة" showBackButton role="patient" backTo="/patient/PatientHome" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-patient/10 rounded-2xl items-center justify-center mb-4">
              <UserCheck size={32} color="#022451" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 mb-2">
              إنشاء جلسة طبية
            </Text>
            <Text className="text-sm text-gray-500 text-center px-6 leading-relaxed">
              أظهر هذا الرمز للصيدلي لبدء الجلسة. ستمكنه من عرض ملفك الطبي الأساسي وإرسال الوصفة.
            </Text>
          </View>

          {/* Temporary QR Container */}
          <View className="items-center justify-center mb-8">
            <View className="bg-white p-8 rounded-[48px] shadow-2xl shadow-primary/20 border border-gray-50 relative w-[300px] h-[300px] items-center justify-center">
              {/* Corner Accents */}
              <View className="absolute top-8 left-8 w-10 h-10 border-t-4 border-l-4 border-patient rounded-tl-2xl" />
              <View className="absolute top-8 right-8 w-10 h-10 border-t-4 border-r-4 border-patient rounded-tr-2xl" />
              <View className="absolute bottom-8 left-8 w-10 h-10 border-b-4 border-l-4 border-patient rounded-bl-2xl" />
              <View className="absolute bottom-8 right-8 w-10 h-10 border-b-4 border-r-4 border-patient rounded-br-2xl" />

              <View className="flex-1 items-center justify-center bg-gray-50 rounded-3xl w-full h-full border border-gray-100 overflow-hidden">
                  <QrCode size={180} color="#022451" strokeWidth={1} />
                  {/* Scan Line Animation Simulation */}
                  <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-patient/30 shadow-sm shadow-patient" />
              </View>
            </View>
          </View>

          {/* Session Expiry */}
          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm items-center">
            <View className="flex-row items-baseline gap-2 mb-2">
              <Text className="text-3xl font-extrabold text-patient">{formatTime(timeLeft)}</Text>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-tighter">صلاحية الرمز</Text>
            </View>
            <Text className="text-[10px] text-gray-400 font-medium text-center">
              ينتهي هذا الرمز تلقائياً فور استخدامه أو عند انتهاء الوقت لدواعي أمان بياناتك الصحية.
            </Text>
          </View>

          {/* Shared Info Preview */}
          <View className="mt-10">
            <Text className="text-sm font-extrabold text-gray-900 mb-4 px-1 text-right">المعلومات التي ستتم مشاركتها:</Text>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              <View className="w-[48%] bg-white p-4 rounded-2xl items-center border border-gray-100 shadow-sm">
                <User size={20} color="#6B7280" />
                <Text className="text-[10px] font-bold text-gray-400 mt-2">الاسم</Text>
                <Text className="text-sm font-extrabold text-gray-900" numberOfLines={1}>{user?.name?.split(' ')[0] || "أحمد"}</Text>
              </View>
              <View className="w-[48%] bg-white p-4 rounded-2xl items-center border border-gray-100 shadow-sm">
                <Calendar size={20} color="#6B7280" />
                <Text className="text-[10px] font-bold text-gray-400 mt-2">العمر</Text>
                <Text className="text-sm font-extrabold text-gray-900">28 سنة</Text>
              </View>
              <View className="w-[48%] bg-white p-4 rounded-2xl items-center border border-gray-100 shadow-sm">
                <Activity size={20} color="#6B7280" />
                <Text className="text-[10px] font-bold text-gray-400 mt-2">فصيلة الدم</Text>
                <Text className="text-sm font-extrabold text-gray-900">{user?.bloodType || "A+"}</Text>
              </View>
              <View className="w-[48%] bg-white p-4 rounded-2xl items-center border border-gray-100 shadow-sm">
                <AlertCircle size={20} color="#6B7280" />
                <Text className="text-[10px] font-bold text-gray-400 mt-2">الحساسية</Text>
                <Text className="text-sm font-extrabold text-gray-900">لا يوجد</Text>
              </View>
              <View className="w-[48%] bg-white p-4 rounded-2xl items-center border border-gray-100 shadow-sm">
                <Stethoscope size={20} color="#6B7280" />
                <Text className="text-[10px] font-bold text-gray-400 mt-2">الأمراض المزمنة</Text>
                <Text className="text-sm font-extrabold text-gray-900">لا يوجد</Text>
              </View>
              <View className="w-[48%] bg-white p-4 rounded-2xl items-center border border-gray-100 shadow-sm">
                <Pill size={20} color="#6B7280" />
                <Text className="text-[10px] font-bold text-gray-400 mt-2">الأدوية الدورية</Text>
                <Text className="text-sm font-extrabold text-gray-900">لا يوجد</Text>
              </View>
              <View className="w-[100%] bg-white p-4 rounded-2xl items-center border border-gray-100 shadow-sm">
                <Baby size={20} color="#6B7280" />
                <Text className="text-[10px] font-bold text-gray-400 mt-2">الحمل / الإرضاع</Text>
                <Text className="text-sm font-extrabold text-gray-900">لا يوجد</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </MobileShell>
  );
}
