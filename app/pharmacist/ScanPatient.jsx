import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Camera,
  CheckCircle2,
  ArrowLeft,
  QrCode,
  RefreshCw,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";

export default function ScanPatient() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned || showSuccess) return;
    setScanned(true);
    // In a real app, you would validate 'data' here
    setShowSuccess(true);
  };

  const simulateScan = () => {
    setShowSuccess(true);
  };

  const handleStartSession = () => {
    router.push("/pharmacist/NewPrescription");
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View className="flex-1 bg-black" />;
  }

  return (
    <View className={`flex-1 ${showSuccess ? 'bg-pharmacist' : 'bg-black'} relative`}>
      {/* Dynamic Background */}
      {!showSuccess ? (
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
          }}
          className="absolute inset-0 w-full h-full opacity-40"
          blurRadius={5}
        />
      ) : (
        <View className="absolute inset-0 overflow-hidden">
          {/* Subtle Abstract Shapes */}
          <View className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <View className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-emerald-400/10" />
          <View className="absolute bottom-20 -right-10 w-60 h-60 rounded-full bg-white/10" />
          <View className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-black/5" />
        </View>
      )}

      <MobileShell 
        className={showSuccess ? "bg-pharmacist" : "bg-transparent"} 
        edges={["top", "bottom", "left", "right"]}
      >
        {!showSuccess ? (
          <View className="flex-1 w-full relative">
            {/* Header */}
            <View className="px-5 pt-4" style={{ position: 'relative', minHeight: 44 }}>
              <View style={{ position: 'absolute', right: 20, top: 16, zIndex: 10 }}>
                <HeaderBackButton fallback="/pharmacist/PharmacistHome" color="#05997F" />
              </View>
              <View className="items-center justify-center" style={{ minHeight: 44 }}>
                <Text className="text-xl font-extrabold text-white text-center">
                  مسح رمز المريض
                </Text>
              </View>
            </View>

            {/* Scanning UI Layers */}
            <View className="flex-1 items-center justify-center px-5">
              {!permission.granted ? (
                <View className="items-center px-10">
                  <View className="w-20 h-20 bg-white/10 rounded-full items-center justify-center mb-6">
                    <Camera size={40} color="#FFFFFF" opacity={0.5} />
                  </View>
                  <Text className="text-white font-extrabold text-xl text-center mb-2">
                    الكاميرا غير مفعلة
                  </Text>
                  <Text className="text-white/60 text-sm text-center mb-10 leading-6">
                    يرجى السماح باستخدام الكاميرا لمسح رمز المريض والبدء في صرف الوصفة
                  </Text>
                  <TouchableOpacity
                    onPress={requestPermission}
                    className="bg-pharmacist px-8 py-4 rounded-2xl flex-row items-center gap-3 shadow-lg shadow-pharmacist/20"
                  >
                    <RefreshCw size={20} color="#FFFFFF" />
                    <Text className="text-white font-extrabold text-base">إعادة طلب الإذن</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View className="bg-black/60 px-8 py-5 rounded-3xl items-center mb-10 border border-white/10 shadow-lg">
                    <Text className="text-white font-extrabold text-xl mb-1">
                      امسح رمز QR
                    </Text>
                    <Text className="text-pharmacist text-xs font-bold">
                      ابدأ بصرف الوصفة الجديدة
                    </Text>
                  </View>

                  {/* Camera Scanner Square */}
                  <View className="w-[300px] h-[300px] max-w-full border-2 border-pharmacist/30 rounded-[3rem] items-center justify-center bg-black/40 relative overflow-hidden">
                    <CameraView
                      style={StyleSheet.absoluteFill}
                      facing="back"
                      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                      barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                      }}
                    />
                    
                    {/* Corner Borders */}
                    <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-pharmacist rounded-tl-[2.5rem]" />
                    <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-pharmacist rounded-tr-[2.5rem]" />
                    <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-pharmacist rounded-bl-[2.5rem]" />
                    <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-pharmacist rounded-br-[2.5rem]" />

                    {/* Scan Line Animation (Purely Visual) */}
                    <View className="absolute top-1/2 w-full h-1 bg-pharmacist/80 shadow-lg shadow-pharmacist" />
                  </View>

                  {/* Fallback Camera Control */}
                  <View className="flex-row items-center justify-center gap-10 mt-16">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={simulateScan}
                      className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-xl shadow-white/20"
                    >
                      <Camera size={40} color="#05997F" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-16 h-16 bg-pharmacist/20 rounded-full items-center justify-center mb-4 border-4 border-pharmacist/40">
              <CheckCircle2 size={36} color="#FFFFFF" />
            </View>

            <Text className="text-2xl font-extrabold text-white text-center mb-1">
              تم التحقق من المريض
            </Text>
            <Text className="text-xs text-emerald-100 text-center mb-6 opacity-80">
              تم إنشاء جلسة ربط آمنة ومؤقتة
            </Text>

            <View className="w-full bg-white/10 rounded-[2rem] p-5 border border-white/10 mb-6 shadow-2xl">
              <View className="flex-row items-center justify-end mb-4">
                <View className="items-end mr-4">
                  <Text className="text-xl font-extrabold text-white mb-0.5">
                    أحمد الشهري
                  </Text>
                  <Text className="text-white/70 text-xs font-bold">
                    جلسة نشطة • PAT-8821
                  </Text>
                </View>
                <View className="w-14 h-14 rounded-2xl border border-pharmacist/30 bg-white/10 items-center justify-center overflow-hidden">
                   <Text className="text-3xl">👨</Text>
                </View>
              </View>

              <View className="h-px bg-white/10 w-full mb-4" />

              <View className="gap-2">
                 <View className="flex-row justify-between items-center border-b border-white/5 pb-2">
                    <Text className="text-base font-extrabold text-white">28 سنة</Text>
                    <Text className="text-[10px] font-bold text-emerald-100/50">العمر</Text>
                 </View>
                 <View className="flex-row justify-between items-center border-b border-white/5 pb-2">
                    <Text className="text-base font-extrabold text-white">A+</Text>
                    <Text className="text-[10px] font-bold text-emerald-100/50">فصيلة الدم</Text>
                 </View>
                 <View className="flex-row justify-between items-center border-b border-white/5 pb-2">
                    <Text className="text-base font-extrabold text-white">لا يوجد</Text>
                    <Text className="text-[10px] font-bold text-emerald-100/50">الحساسية</Text>
                 </View>
                 <View className="flex-row justify-between items-center border-b border-white/5 pb-2">
                    <Text className="text-base font-extrabold text-white">لا يوجد</Text>
                    <Text className="text-[10px] font-bold text-emerald-100/50">الأمراض المزمنة</Text>
                 </View>
                 <View className="flex-row justify-between items-center border-b border-white/5 pb-2">
                    <Text className="text-base font-extrabold text-white">لا يوجد</Text>
                    <Text className="text-[10px] font-bold text-emerald-100/50">الأدوية الدورية</Text>
                 </View>
                 <View className="flex-row justify-between items-center">
                    <Text className="text-base font-extrabold text-white">لا يوجد</Text>
                    <Text className="text-[10px] font-bold text-emerald-100/50">الحمل / الإرضاع</Text>
                 </View>
              </View>
            </View>

            <TouchableOpacity
              className="w-full h-14 bg-white rounded-full flex-row items-center justify-center gap-3 shadow-2xl shadow-black/20 mt-4"
              activeOpacity={0.9}
              onPress={handleStartSession}
            >
              <Text className="text-xl font-extrabold text-pharmacist">
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