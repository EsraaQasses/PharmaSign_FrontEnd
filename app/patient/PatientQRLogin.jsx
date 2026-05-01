import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { QrCode, Upload, Camera, ShieldCheck, HelpCircle } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";

export default function PatientQRLogin() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    // Simulate scan success
    setTimeout(() => {
      router.replace("/patient/PatientHome");
    }, 2000);
  };

  const handleUpload = () => {
    // Simulate file picker and scan success
    router.replace("/patient/PatientHome");
  };

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="تسجيل الدخول بالرمز" showBackButton role="patient" backTo="/patient/PatientLogin" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-10">
            <Text className="text-2xl font-extrabold text-gray-900 mb-2">
               اختر طريقة الدخول
            </Text>
            <Text className="text-sm text-gray-500 text-center px-6 leading-relaxed">
              يرجى استخدام رمز QR الخاص بك والمقدم من المؤسسة الطبية لتسجيل الدخول السريع
            </Text>
          </View>

          {/* Option 1: Live Scan */}
          <View className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm mb-6">
            <View className="flex-row items-center justify-end gap-3 mb-6">
              <View className="items-end">
                <Text className="text-lg font-extrabold text-gray-900">مسح الرمز المباشر</Text>
                <Text className="text-[10px] text-gray-400 font-bold">استخدام الكاميرا للمسح المباشر</Text>
              </View>
              <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                <Camera size={22} color="#022451" />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleScan}
              activeOpacity={0.8}
              className="w-full aspect-square bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center relative overflow-hidden"
            >
              {!scanning ? (
                <>
                  <View className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <QrCode size={48} color="#D1D5DB" strokeWidth={1.5} />
                  </View>
                  <Text className="text-patient font-extrabold text-base">ابدأ المسح الضوئي</Text>
                </>
              ) : (
                <View className="items-center">
                  <View className="w-full h-1 bg-patient absolute top-1/2 shadow-lg shadow-patient" />
                  <Text className="text-patient font-extrabold mt-4">جاري قراءة الرمز...</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Option 2: Upload */}
          <View className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm">
            <View className="flex-row items-center justify-end gap-3 mb-6">
              <View className="items-end">
                <Text className="text-lg font-extrabold text-gray-900">تحميل صورة الرمز</Text>
                <Text className="text-[10px] text-gray-400 font-bold">رفع الرمز المرسل لك من المؤسسة</Text>
              </View>
              <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                <Upload size={22} color="#022451" />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleUpload}
              activeOpacity={0.8}
              className="w-full py-6 bg-patient/5 rounded-2xl border border-patient/10 items-center justify-center gap-3"
            >
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                <Upload size={20} color="#022451" />
              </View>
              <Text className="text-patient font-extrabold">اختر صورة من الاستديو</Text>
            </TouchableOpacity>
          </View>

          {/* Security Status */}
          <View className="mt-12 items-center">
            <View className="bg-emerald-50 px-5 py-3 rounded-2xl flex-row items-center gap-3 border border-emerald-100">
              <ShieldCheck size={18} color="#059669" />
              <Text className="text-xs font-bold text-emerald-700">تشفير وحماية البيانات 256-bit</Text>
            </View>
          </View>

          <TouchableOpacity 
            className="mt-10 flex-row items-center justify-center gap-2 py-4"
            activeOpacity={0.8}
          >
            <HelpCircle size={20} color="#022451" opacity={0.5} />
            <Text className="text-sm font-bold text-gray-400">
              كيف أحصل على رمز الدخول الخاص بي؟
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </MobileShell>
  );
}
