import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { QrCode, ShieldCheck, RefreshCw, HelpCircle, UserCheck, Activity, AlertCircle, Stethoscope, Pill, Baby, User, Calendar } from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActivityIndicator, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { sessionApi } from "@/api/sessionApi";

export default function SessionQR() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [qrData, setQrData] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const refreshTimerRef = React.useRef(null);
  const isFetchingRef = React.useRef(false);

  const fetchQR = async (silent = false) => {
    if (isFetchingRef.current) {
      console.log("[QR Audit] Skip generation: already in progress");
      return;
    }
    
    isFetchingRef.current = true;
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    console.log("[QR Audit] Generating new QR session token...");
    setError("");
    try {
      const res = await sessionApi.createSessionQR();
      if (res.success) {
        setQrData(res.data.qr_payload || res.data.qr_token || "");
        const expiry = res.data.expires_in_seconds || 300;
        setTimeLeft(expiry);
        console.log(`[QR Audit] QR generated successfully. Expiry: ${expiry}s`);
      } else {
        console.log("[QR Audit] QR generation failed:", res.message);
        setError(res.message || "تعذر إنشاء الرمز");
      }
    } catch (err) {
      console.log("[QR Audit] Connection error during QR generation");
      setError("فشل الاتصال بالخادم");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchQR();
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, []);

  // Countdown logic (Auto-refresh DISABLED for stability)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const nextValue = prev > 0 ? prev - 1 : 0;
        
        if (nextValue === 0 && prev > 0) {
          console.log("[QR Audit] QR token expired.");
        }
        
        return nextValue;
      });
    }, 1000);
    
    refreshTimerRef.current = timer;
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "غير متوفر";
    const today = new Date();
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return "غير متوفر";
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} سنة`;
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
            <Text className="text-sm text-gray-500 text-center px-6 leading-relaxed font-bold">
              أظهر هذا الرمز للصيدلي لبدء الجلسة. ستمكنه من عرض ملفك الطبي الأساسي وإرسال الوصفة.
            </Text>
          </View>

          {/* QR Container */}
          <View className="items-center justify-center mb-8">
            <View className="bg-white p-8 rounded-[48px] shadow-2xl shadow-primary/20 border border-gray-50 relative w-[300px] h-[300px] items-center justify-center">
              {/* Corner Accents */}
              <View className="absolute top-8 left-8 w-10 h-10 border-t-4 border-l-4 border-patient rounded-tl-2xl" />
              <View className="absolute top-8 right-8 w-10 h-10 border-t-4 border-r-4 border-patient rounded-tr-2xl" />
              <View className="absolute bottom-8 left-8 w-10 h-10 border-b-4 border-l-4 border-patient rounded-bl-2xl" />
              <View className="absolute bottom-8 right-8 w-10 h-10 border-b-4 border-r-4 border-patient rounded-br-2xl" />

              <View className="flex-1 items-center justify-center bg-gray-50 rounded-3xl w-full h-full border border-gray-100 overflow-hidden">
                  {isLoading ? (
                    <View className="items-center">
                      <ActivityIndicator size="large" color="#022451" />
                      <Text className="text-xs text-gray-400 mt-4 font-bold">جاري إنشاء الرمز...</Text>
                    </View>
                  ) : error ? (
                    <View className="items-center px-4">
                      <AlertCircle size={40} color="#EF4444" />
                      <Text className="text-red-500 font-bold text-center mt-2">{error}</Text>
                      <TouchableOpacity onPress={() => fetchQR()} className="mt-4 bg-patient px-6 py-3 rounded-xl shadow-lg shadow-patient/20">
                        <Text className="text-white font-bold">إعادة المحاولة</Text>
                      </TouchableOpacity>
                    </View>
                  ) : qrData && timeLeft > 0 ? (
                    <View className="items-center justify-center relative">
                      {isRefreshing && (
                        <View className="absolute inset-0 z-10 bg-gray-50/50 items-center justify-center rounded-3xl">
                           <ActivityIndicator size="small" color="#022451" />
                        </View>
                      )}
                      <QRCode
                        value={qrData}
                        size={200}
                        color="#022451"
                        backgroundColor="transparent"
                      />
                      {/* Scan Line Animation Simulation */}
                      <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-patient/30 shadow-sm shadow-patient" />
                    </View>
                  ) : (
                    <View className="items-center px-4">
                      <Clock size={40} color="#F59E0B" />
                      <Text className="text-amber-600 font-extrabold text-center mt-2">انتهت صلاحية الرمز</Text>
                      <TouchableOpacity onPress={() => fetchQR()} className="mt-4 bg-patient px-6 py-3 rounded-xl shadow-lg shadow-patient/20">
                        <Text className="text-white font-extrabold">تحديث الرمز</Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </View>
            </View>
          </View>

          {/* Session Expiry & Refresh */}
          <View className="flex-row items-center gap-3 mb-8">
            <TouchableOpacity 
              onPress={() => fetchQR()} 
              disabled={isLoading || isRefreshing}
              className={`bg-white w-14 h-14 rounded-2xl items-center justify-center border border-gray-100 shadow-sm ${isLoading || isRefreshing ? "opacity-50" : ""}`}
            >
              <RefreshCw size={24} color="#022451" className={isLoading || isRefreshing ? "animate-spin" : ""} />
            </TouchableOpacity>
            
            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm items-center flex-row justify-center gap-4">
              <View className="items-center">
                <Text className="text-2xl font-black text-patient">{formatTime(timeLeft)}</Text>
              </View>
              <View className="w-px h-8 bg-gray-100" />
              <View className="items-end">
                <Text className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">صلاحية الرمز</Text>
                <Text className="text-[10px] text-patient/60 font-bold">ينتهي الرمز خلال:</Text>
              </View>
            </View>
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
                <Text className="text-sm font-extrabold text-gray-900">{calculateAge(user?.birth_date || user?.date_of_birth)}</Text>
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
