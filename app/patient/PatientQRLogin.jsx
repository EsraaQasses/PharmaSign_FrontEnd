import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Keyboard, Modal } from "react-native";
import { useRouter } from "expo-router";
import { QrCode, Camera, ShieldCheck, HelpCircle, AlertCircle, CheckCircle2, Key, X, Play, RotateCcw } from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";
import { useAuth } from "@/lib/AuthContext";

export default function PatientQRLogin() {
  const router = useRouter();
  const { loginByQR } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const onBarcodeScanned = async ({ data }) => {
    if (verifying || success || !scanning) return;
    
    setScanning(false);
    setVerifying(true);
    setError("");
    
    try {
      const result = await loginByQR(data);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          // TODO: Check result.must_set_password flag from backend
          // If true, router.replace("/patient/SetInitialPassword");
          // else:
          router.replace("/patient/PatientHome");
        }, 1500);
      } else {
        setError(result.message || "رمز الدخول غير صالح أو منتهي. يرجى المحاولة مرة أخرى.");
        setVerifying(false);
      }
    } catch (e) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
      setVerifying(false);
    }
  };

  const handleScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        setError("تعذر تشغيل الكاميرا. يرجى السماح بالكاميرا أو إدخال الرمز يدوياً.");
        return;
      }
    }
    
    setError("");
    setScanning(true);
  };

  const handleManualLogin = async () => {
    const token = manualToken.trim();
    if (!token) {
      setError("يرجى إدخال رمز الدخول");
      return;
    }
    
    Keyboard.dismiss();
    setVerifying(true);
    setError("");
    
    try {
      const result = await loginByQR(token);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          // TODO: Check result.must_set_password flag from backend
          // If true, router.replace("/patient/SetInitialPassword");
          // else:
          router.replace("/patient/PatientHome");
        }, 1500);
      } else {
        setError(result.message || "رمز الدخول غير صالح أو منتهي. يرجى المحاولة مرة أخرى.");
        setVerifying(false);
      }
    } catch (e) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
      setVerifying(false);
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
                  <CameraView 
                    className="absolute inset-0" 
                    onBarcodeScanned={scanning ? onBarcodeScanned : undefined}
                    barcodeScannerSettings={{
                      barcodeTypes: ["qr"],
                    }}
                  />
                  <View className="w-full h-1 bg-patient absolute top-1/2 shadow-lg shadow-patient" />
                  <View className="bg-black/40 px-4 py-2 rounded-full absolute bottom-6">
                    <Text className="text-white font-bold">جاري قراءة الرمز...</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Option 2: Manual Entry */}
          <View className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm mb-6">
            <View className="flex-row items-center justify-end gap-3 mb-6">
              <View className="items-end">
                <Text className="text-lg font-extrabold text-gray-900">إدخال الرمز يدوياً</Text>
                <Text className="text-[10px] text-gray-400 font-bold">أدخل الرمز النصي المقدم لك</Text>
              </View>
              <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                <Key size={22} color="#022451" />
              </View>
            </View>

            <View className="gap-4">
              <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4 py-1">
                <TextInput
                  placeholder="أدخل رمز الدخول النصي"
                  value={manualToken}
                  onChangeText={setManualToken}
                  placeholderTextColor="#9CA3AF"
                  className="text-right py-3 font-bold text-gray-900"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              
              <TouchableOpacity 
                onPress={handleManualLogin}
                activeOpacity={0.8}
                disabled={verifying || success || scanning}
                className={`w-full py-4 rounded-2xl items-center justify-center ${
                  verifying ? "bg-gray-100" : "bg-patient"
                }`}
              >
                {verifying && !scanning ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-extrabold text-base">تسجيل الدخول بالرمز</Text>
                )}
              </TouchableOpacity>
            </View>
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
            onPress={() => setShowHelp(true)}
          >
            <HelpCircle size={20} color="#022451" opacity={0.5} />
            <Text className="text-sm font-bold text-gray-400">
              كيف أحصل على رمز الدخول الخاص بي؟
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Help Modal */}
      <Modal
        visible={showHelp}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity 
                onPress={() => setShowHelp(false)}
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              >
                <X size={20} color="#4B5563" />
              </TouchableOpacity>
              <Text className="text-xl font-extrabold text-gray-900">كيفية الحصول على الرمز</Text>
            </View>

            {/* Content Section */}
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-[60vh]">
              <View className="bg-patient/5 rounded-3xl p-6 mb-8 border border-patient/10">
                <View className="gap-4">
                  <Text className="text-right text-gray-700 font-bold leading-6">
                    • يمكنك الحصول على رمز الدخول من المنظمة أو الجهة الطبية المسؤولة.
                  </Text>
                  <Text className="text-right text-gray-700 font-bold leading-6">
                    • قد تقوم المنظمة بعرض رمز QR لك لتقوم بمسحه مباشرة.
                  </Text>
                  <Text className="text-right text-gray-700 font-bold leading-6">
                    • أو قد ترسل لك الرمز النصي الخاص بالدخول لتقوم بإدخاله يدوياً.
                  </Text>
                  <Text className="text-right text-gray-700 font-bold leading-6">
                    • بعدها يمكنك تسجيل الدخول إما عبر مسح QR أو عبر إدخال الرمز النصي.
                  </Text>
                </View>
              </View>

              {/* Video Placeholder */}
              <View className="items-center">
                <Text className="text-sm font-extrabold text-gray-900 mb-4 text-right w-full">شرح لغة الإشارة</Text>
                <View className="w-full aspect-video bg-gray-900 rounded-[2rem] items-center justify-center overflow-hidden border-4 border-gray-100 relative shadow-sm">
                  <View className="absolute inset-0 bg-patient/10" />
                  <View className="items-center gap-3">
                    <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center border border-white/30 backdrop-blur-md">
                      <Play size={32} color="#FFFFFF" fill="#FFFFFF" opacity={0.8} />
                    </View>
                    <Text className="text-white/60 text-xs font-bold px-10 text-center leading-relaxed">
                      سيتم إضافة فيديو الشرح بلغة الإشارة قريباً
                    </Text>
                  </View>
                  
                  {/* Mock Controls */}
                  <View className="absolute bottom-4 left-4 right-4 flex-row items-center justify-between px-2">
                    <TouchableOpacity disabled className="opacity-50">
                      <RotateCcw size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View className="h-1 flex-1 bg-white/20 mx-4 rounded-full overflow-hidden">
                      <View className="w-1/3 h-full bg-patient" />
                    </View>
                    <TouchableOpacity disabled className="opacity-50">
                      <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => setShowHelp(false)}
                className="bg-patient w-full py-4 rounded-2xl items-center justify-center mt-10 shadow-lg shadow-patient/20"
                activeOpacity={0.9}
              >
                <Text className="text-white font-extrabold text-base">فهمت ذلك</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </MobileShell>
  );
}
