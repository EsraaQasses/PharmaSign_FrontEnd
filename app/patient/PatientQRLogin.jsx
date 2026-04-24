import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { QrCode, ShieldCheck, RefreshCw, HelpCircle } from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/mobile/PageHeader";

export default function PatientQRLogin() {
  const router = useRouter();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(165); // 2:45 mock

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 165)); // loop for mock purposes
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const patientId = user?.qrCode || "PAT-001-AHMED";

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="رمز المعرّف الخاص بك" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-8 mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            رمز الاستجابة السريعة
          </Text>
          <Text className="text-base text-gray-500 text-center px-4">
            اعرض هذا الرمز للصيدلي لربط الوصفة الطبية بحسابك
          </Text>
        </View>

        {/* QR Code Container */}
        <View className="items-center justify-center">
          <View className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 shadow-primary/10 relative w-[280px] h-[280px]">
            {/* Corner Borders */}
            <View className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
            <View className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
            <View className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
            <View className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

            {/* Scan animation line mock */}
            <View className="absolute top-[30%] left-6 right-6 h-0.5 bg-primary/40 shadow-sm shadow-primary z-10" />

            <View className="flex-1 items-center justify-center bg-gray-50 rounded-2xl w-full h-full border border-gray-100">
                <QrCode size={180} color="#0C6B58" strokeWidth={1} />
            </View>
          </View>
        </View>

        <View className="items-center mt-6">
          <Text className="text-sm font-bold text-gray-600 mb-1">
            {patientId}
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity className="flex-row items-center gap-1">
              <RefreshCw size={14} color="#0C6B58" />
              <Text className="text-xs text-primary font-bold">تحديث الرمز</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status */}
        <View className="mt-12 items-center w-full">
          <View className="bg-emerald-50 px-6 py-3 rounded-full flex-row items-center gap-2 border border-emerald-100">
            <ShieldCheck size={20} color="#059669" />
            <Text className="text-sm font-bold text-emerald-700">
              الجلسة مشفرة وآمنة
            </Text>
          </View>

          <View className="items-center mt-6">
            <View className="flex-row items-baseline gap-1">
              <Text className="text-3xl font-extrabold text-primary">
                {formatTime(timeLeft)}
              </Text>
              <Text className="text-sm font-bold text-primary/70">دقيقة</Text>
            </View>
            <Text className="text-xs text-gray-500 mt-2">
              يتغير الرمز تلقائياً لدواعي الأمان والحماية
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          className="mt-12 flex-row items-center justify-center gap-2 py-4"
          activeOpacity={0.8}
        >
          <HelpCircle size={20} color="#0C6B58" />
          <Text className="text-base font-bold text-primary">
            هل تواجه مشكلة؟
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
