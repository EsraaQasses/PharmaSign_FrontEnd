import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Flashlight,
  Camera,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  QrCode,
} from "lucide-react-native";

import MobileShell from "@/components/mobile/MobileShell";

export default function ScanPatient() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const simulateScan = () => {
    setShowSuccess(true);
  };

  const handleStartSession = () => {
    router.push("/pharmacist/NewPrescription");
  };

  return (
    <View className="flex-1 bg-black relative">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
        }}
        className="absolute inset-0 w-full h-full opacity-40"
        blurRadius={5}
      />

      <MobileShell className="bg-transparent" edges={["top", "bottom", "left", "right"]}>
        {!showSuccess ? (
          <View className="flex-1 w-full relative">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4">
              <View className="w-10" />
              <Text className="text-xl font-extrabold text-white text-center">
                مسح رمز المريض
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/pharmacist/PharmacistHome")}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10"
              >
                <ChevronRight size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Scanning UI Layers */}
            <View className="flex-1 items-center justify-center px-5">
              <View className="bg-black/60 px-8 py-5 rounded-3xl items-center mb-10 border border-white/10 shadow-lg">
                <Text className="text-white font-extrabold text-xl mb-1">
                  امسح رمز QR
                </Text>
                <Text className="text-pharmacist text-xs font-bold">
                  ابدأ بصرف الوصفة الجديدة
                </Text>
              </View>

              {/* Focus Square */}
              <View className="w-[300px] h-[300px] max-w-full border-2 border-pharmacist/30 rounded-3xl items-center justify-center bg-black/20 relative">
                <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-pharmacist rounded-tl-3xl" />
                <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-pharmacist rounded-tr-3xl" />
                <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-pharmacist rounded-bl-3xl" />
                <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-pharmacist rounded-br-3xl" />

                <QrCode size={140} color="rgba(255,255,255,0.7)" strokeWidth={1} />

                {/* Scan Line Animation Mock */}
                <View className="absolute top-1/2 w-full h-1 bg-pharmacist/80 shadow-lg shadow-pharmacist" />
              </View>

              {/* Camera Controls */}
              <View className="flex-row items-center justify-center gap-10 mt-16">
                <TouchableOpacity className="w-14 h-14 rounded-full bg-white/10 border border-white/20 items-center justify-center">
                  <Flashlight size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={simulateScan}
                  className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-xl shadow-white/20"
                >
                  <Camera size={40} color="#05997F" />
                </TouchableOpacity>

                <TouchableOpacity className="w-14 h-14 rounded-full bg-white/10 border border-white/20 items-center justify-center">
                  <RefreshCw size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1 bg-pharmacist/95 items-center justify-center p-8">
            <View className="w-24 h-24 bg-pharmacist/20 rounded-full items-center justify-center mb-8 border-4 border-pharmacist/40">
              <CheckCircle2 size={56} color="#FFFFFF" />
            </View>

            <Text className="text-3xl font-extrabold text-white text-center mb-2">
              تم التحقق من المريض
            </Text>
            <Text className="text-base text-emerald-100 text-center mb-10 opacity-80">
              تم إنشاء جلسة ربط آمنة ومؤقتة
            </Text>

            <View className="w-full bg-white/10 rounded-[2.5rem] p-8 border border-white/10 mb-10 shadow-2xl">
              <View className="flex-row items-center justify-end mb-8">
                <View className="items-end mr-5">
                  <Text className="text-2xl font-extrabold text-white mb-1">
                    أحمد الشهري
                  </Text>
                  <Text className="text-pharmacist text-sm font-bold">
                    جلسة نشطة • PAT-8821
                  </Text>
                </View>
                <View className="w-20 h-20 rounded-3xl border border-pharmacist/30 bg-white/10 items-center justify-center overflow-hidden">
                   <Text className="text-4xl">👨</Text>
                </View>
              </View>

              <View className="h-px bg-white/10 w-full mb-8" />

              <View className="flex-row gap-4">
                 <View className="flex-1 items-center gap-2">
                    <Text className="text-[10px] text-emerald-100/50 font-bold uppercase tracking-widest">فصيلة الدم</Text>
                    <Text className="text-xl font-extrabold text-white">A+</Text>
                 </View>
                 <View className="w-px h-10 bg-white/5" />
                 <View className="flex-1 items-center gap-2">
                    <Text className="text-[10px] text-emerald-100/50 font-bold uppercase tracking-widest">العمر</Text>
                    <Text className="text-xl font-extrabold text-white">28 سنة</Text>
                 </View>
                 <View className="w-px h-10 bg-white/5" />
                 <View className="flex-1 items-center gap-2">
                    <Text className="text-[10px] text-emerald-100/50 font-bold uppercase tracking-widest">الطول</Text>
                    <Text className="text-xl font-extrabold text-white">175سم</Text>
                 </View>
              </View>
            </View>

            <TouchableOpacity
              className="w-full bg-white py-4.5 rounded-2xl flex-row items-center justify-center gap-3 shadow-xl"
              activeOpacity={0.8}
              onPress={handleStartSession}
            >
              <Text className="text-lg font-extrabold text-pharmacist">
                متابعة وصرف الوصفة
              </Text>
              <ArrowLeft size={24} color="#05997F" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        )}
      </MobileShell>
    </View>
  );
}