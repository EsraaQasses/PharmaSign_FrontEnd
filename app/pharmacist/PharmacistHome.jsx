import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  QrCode,
  TrendingUp,
  Receipt,
  Activity,
  FileText,
  UserCheck,
} from "lucide-react-native";
import { MOCK_PRESCRIPTIONS, MOCK_PHARMACIST } from "@/lib/mockData";
import BottomNav from "@/components/mobile/BottomNav";

export default function PharmacistHome() {
  const router = useRouter();
  
  // Basic mock calculations
  const pharmacist = MOCK_PHARMACIST;
  const recentPrescriptions = MOCK_PRESCRIPTIONS.slice(0, 2);

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="bg-primary px-5 pt-14 pb-6 rounded-b-[2rem]">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white/70 text-sm font-medium">لوحة الصيدلي</Text>
              <Text className="text-white text-xl font-extrabold pr-1">
                مرحباً {pharmacist.name}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => router.push("/pharmacist/PharmacistNotifications")}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center relative"
              >
                <Bell size={20} color="#FFFFFF" />
                <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-primary" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-5 -mt-6">
          {/* Main Action Banner */}
          <TouchableOpacity
            onPress={() => router.push("/pharmacist/ScanPatient")}
            className="bg-primary shadow-lg shadow-primary/40 rounded-3xl p-6 flex-row items-center gap-5 justify-between"
            activeOpacity={0.8}
            style={{ elevation: 8 }}
          >
            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center border border-white/10">
              <QrCode size={32} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white mb-1 text-left">
                امسح رمز المريض
              </Text>
              <Text className="text-xs text-white/80 leading-relaxed text-left">
                ابدأ بصرف وصفة طبية جديدة فوراً عبر قراءة الرمز
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row gap-4 mt-6">
            <View className="flex-1 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden h-[120px]">
              <Text className="text-sm text-gray-500 font-bold mb-1 text-left">الوصفات اليوم</Text>
              <Text className="text-3xl font-extrabold text-primary text-left">48</Text>
              <View className="flex-row items-center gap-1 mt-2">
                <TrendingUp size={14} color="#059669" />
                <Text className="text-[10px] text-emerald-600 font-bold">+12% عن الأمس</Text>
              </View>
              <View className="absolute -bottom-4 -left-4 opacity-5">
                <Receipt size={80} color="#000000" />
              </View>
            </View>

            <View className="flex-1 bg-blue-500 rounded-3xl p-5 shadow-sm relative overflow-hidden h-[120px]">
              <Text className="text-sm text-white/80 font-bold mb-1 text-left">نشط الآن</Text>
              <Text className="text-3xl font-extrabold text-white text-left">03</Text>
              <View className="flex-row items-center gap-2 mt-2 bg-black/10 self-start px-2 py-1 rounded-full">
                <View className="w-2 h-2 bg-emerald-400 rounded-full" />
                <Text className="text-[10px] text-white font-bold">مرضى بالصيدلية</Text>
              </View>
            </View>
          </View>

          {/* Recent List */}
          <View className="mt-8 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">الوصفات الأخيرة</Text>
              <TouchableOpacity onPress={() => router.push("/pharmacist/PharmacistPrescriptions")}>
                <Text className="text-sm font-bold text-primary">عرض الكل</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {recentPrescriptions.map((rx) => (
                <TouchableOpacity
                  key={rx.id}
                  onPress={() => router.push(`/pharmacist/PharmacistPrescriptionDetail?id=${rx.id}`)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center gap-4"
                  activeOpacity={0.7}
                >
                  <View className={`w-12 h-12 rounded-2xl items-center justify-center ${rx.status === 'completed' ? 'bg-emerald-50' : 'bg-primary/10'}`}>
                    {rx.status === 'completed' ? (
                      <UserCheck size={24} color="#059669" />
                    ) : (
                      <FileText size={24} color="#0C6B58" />
                    )}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-sm font-bold text-gray-900">{rx.patientName}</Text>
                      <View className={`px-2 py-0.5 rounded-full ${rx.status === 'completed' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <Text className={`text-[10px] font-bold ${rx.status === 'completed' ? 'text-emerald-700' : 'text-gray-600'}`}>
                          {rx.status === 'completed' ? 'تم الصرف' : 'قيد الانتظار'}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-gray-500">{rx.medications.length} أدوية • {rx.date}</Text>
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
    </View>
  );
}