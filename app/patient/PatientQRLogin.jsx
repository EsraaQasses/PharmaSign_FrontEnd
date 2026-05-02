import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { QrCode, Upload, Camera, ShieldCheck, HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";

export default function PatientQRLogin() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        setError("تعذر فتح الكاميرا. يرجى السماح بالوصول من إعدادات الجهاز.");
        return;
      }
    }
    
    setError("");
    setScanning(true);
    
    // Simulate QR code detection after 2 seconds
    setTimeout(() => {
      setSuccess(true);
      setScanning(false);
      setTimeout(() => {
        router.replace("/patient/PatientHome");
      }, 1500);
    }, 2500);
  };

  const handleUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setError("");
        setVerifying(true);
        
        // Simulate QR image verification
        setTimeout(() => {
          setSuccess(true);
          setVerifying(false);
          setTimeout(() => {
            router.replace("/patient/PatientHome");
          }, 1500);
        }, 2000);
      } else {
        setError("لم يتم اختيار صورة");
        setTimeout(() => setError(""), 3000);
      }
    } catch (e) {
      setError("تعذر قراءة الرمز من الصورة. يرجى اختيار صورة أوضح.");
      setTimeout(() => setError(""), 3000);
    }
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

          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex-row items-center justify-end gap-3">
              <Text className="text-red-600 font-bold flex-1 text-right">{error}</Text>
              <AlertCircle size={20} color="#DC2626" />
            </View>
          ) : null}

          {success ? (
            <View className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex-row items-center justify-end gap-3">
              <Text className="text-emerald-700 font-bold flex-1 text-right">تم التحقق من الرمز بنجاح</Text>
              <CheckCircle2 size={20} color="#059669" />
            </View>
          ) : null}

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
              onPress={!scanning && !success ? handleScan : null}
              activeOpacity={0.8}
              className="w-full aspect-square bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center relative overflow-hidden"
              disabled={scanning || success || verifying}
            >
              {!scanning ? (
                <>
                  <View className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <QrCode size={48} color={success ? "#059669" : "#D1D5DB"} strokeWidth={1.5} />
                  </View>
                  <Text className={success ? "text-emerald-600 font-extrabold text-base" : "text-patient font-extrabold text-base"}>
                    {success ? "تم التعرف على الرمز" : "ابدأ المسح الضوئي"}
                  </Text>
                </>
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <CameraView className="absolute inset-0" />
                  <View className="w-full h-1 bg-patient absolute top-1/2 shadow-lg shadow-patient" />
                  <View className="bg-black/40 px-4 py-2 rounded-full absolute bottom-6">
                    <Text className="text-white font-bold">جاري قراءة الرمز...</Text>
                  </View>
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
              disabled={verifying || success || scanning}
              className={`w-full py-6 rounded-2xl border items-center justify-center gap-3 ${
                verifying ? "bg-gray-50 border-gray-100" : "bg-patient/5 border-patient/10"
              }`}
            >
              {verifying ? (
                <View className="items-center gap-2">
                  <ActivityIndicator color="#022451" />
                  <Text className="text-patient font-extrabold">جاري التحقق من صورة الرمز...</Text>
                </View>
              ) : (
                <>
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                    <Upload size={20} color="#022451" />
                  </View>
                  <Text className="text-patient font-extrabold">اختر صورة من الاستديو</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Security Status */}
          <View className="mt-12 items-center">
            <View className="bg-emerald-50 px-5 py-3 rounded-2xl flex-row items-center gap-3 border border-emerald-100">
              <ShieldCheck size={18} color="#059669" />
              <Text className="text-xs font-bold text-emerald-700">تشفير وحماية البيانات 256-bit</Text>
            </View>
            <Text className="text-[10px] text-gray-400 mt-2 font-bold">يتم استخدام الرمز للتحقق من حسابك بشكل آمن.</Text>
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
