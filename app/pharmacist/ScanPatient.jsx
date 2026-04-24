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

export default function ScanPatient() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const simulateScan = () => {
    setShowSuccess(true);
  };

  const handleStartSession = () => {
    // Go to new prescription or patient profile
    router.push("/pharmacist/NewPrescription");
  };

  return (
    <View className="flex-1 bg-black relative">
      {/* Background Mock Camera Feed */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
        }}
        className="absolute inset-0 w-full h-full opacity-50"
        blurRadius={5}
      />

      <SafeAreaView className="flex-1 z-10 w-full relative">
        {!showSuccess ? (
          <>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-8">
              <View className="w-10" />
              <Text className="text-xl font-bold text-white text-center">
                مسح رمز المريض
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10"
              >
                <ChevronRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Scanning UI Layers */}
            <View className="flex-1 items-center justify-center px-5">
              <View className="bg-black/50 px-6 py-4 rounded-3xl items-center mb-10 border border-white/10">
                <Text className="text-white font-bold text-lg mb-1">
                  امسح رمز QR للمريض
                </Text>
                <Text className="text-emerald-400 text-xs">
                  لبدء الجلسة وعرض الملف الطبي
                </Text>
              </View>

              {/* Focus Square */}
              <View className="w-[280px] h-[280px] border-2 border-emerald-500/50 rounded-2xl items-center justify-center bg-black/30 relative">
                <View className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
                <View className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
                <View className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
                <View className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />

                <QrCode size={120} color="rgba(255,255,255,0.8)" strokeWidth={1} />

                {/* Scan Line Animation Mock */}
                <View className="absolute top-1/2 w-full h-0.5 bg-emerald-400 shadow-sm shadow-emerald-400 opacity-80" />
              </View>

              {/* Camera Controls */}
              <View className="flex-row items-center justify-center gap-8 mt-16">
                <TouchableOpacity className="w-14 h-14 rounded-full bg-white/10 border border-white/20 items-center justify-center">
                  <Flashlight size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={simulateScan}
                  className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-lg shadow-white/30"
                >
                  <Camera size={36} color="#0C6B58" />
                </TouchableOpacity>

                <TouchableOpacity className="w-14 h-14 rounded-full bg-white/10 border border-white/20 items-center justify-center">
                  <RefreshCw size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          /* Success State Overlay */
          <View className="absolute inset-0 bg-primary/95 items-center justify-center p-8 z-50 w-full">
            <View className="w-24 h-24 bg-emerald-500/30 rounded-full items-center justify-center mb-6 border-2 border-emerald-400">
              <CheckCircle2 size={48} color="#A7F3D0" />
            </View>

            <Text className="text-2xl font-bold text-white text-center mb-2">
              تم التعرف على المريض
            </Text>
            <Text className="text-sm text-emerald-100 text-center mb-12">
              يمكنك الآن استعراض وصفاته وصرف الدواء
            </Text>

            <View className="w-full bg-white/10 rounded-[24px] p-6 border border-white/20 mb-8">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 items-end pr-4">
                  <Text className="text-xl font-bold text-white mb-1">
                    أحمد محمد الشهري
                  </Text>
                  <Text className="text-sm text-white/70">
                    رقم الهوية: 10452***
                  </Text>
                </View>
                <View className="w-16 h-16 rounded-2xl border-2 border-emerald-400 bg-white/20 items-center justify-center">
                  <Text className="text-2xl text-white">👨</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="w-full bg-emerald-400 py-4 rounded-xl flex-row items-center justify-center gap-3 shadow-lg"
              activeOpacity={0.8}
              onPress={handleStartSession}
            >
              <Text className="text-lg font-bold text-emerald-950">
                بدء الجلسة الطبية
              </Text>
              <ArrowLeft size={24} color="#022C22" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}