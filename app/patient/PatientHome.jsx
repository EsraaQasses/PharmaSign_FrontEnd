import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  QrCode,
  FileText,
  MapPin,
  Clock,
  ChevronLeft,
  Hand,
  Shield,
} from "lucide-react-native";
import {
  MOCK_PRESCRIPTIONS,
  MOCK_PATIENTS,
  MOCK_NOTIFICATIONS,
} from "@/lib/mockData";
import StatusBadge from "@/components/mobile/StatusBadge";
import BottomNav from "@/components/mobile/BottomNav";
import { useAuth } from "@/lib/AuthContext";

function QuickAction({ icon: Icon, label, path, color }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(path)}
      className="items-center gap-1.5"
      activeOpacity={0.7}
    >
      <View
        className={`w-14 h-14 rounded-2xl ${color} items-center justify-center shadow-sm`}
      >
        <Icon size={24} color="#FFFFFF" />
      </View>
      <Text className="text-[11px] font-semibold text-gray-800">{label}</Text>
    </TouchableOpacity>
  );
}

export default function PatientHome() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Fallback to mock if user not present yet (for testing)
  const patient = user || MOCK_PATIENTS[0];
  const prescriptions = MOCK_PRESCRIPTIONS.filter(
    (p) => p.patientId === patient.id
  );
  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="bg-primary px-5 pt-14 pb-12 rounded-b-[2rem]">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white/70 text-sm">مرحباً 👋</Text>
              <Text className="text-white text-xl font-extrabold">
                {patient.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/patient/PatientNotifications")}
              className="relative"
            >
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Bell size={20} color="#FFFFFF" />
              </View>
              {unreadNotifs > 0 && (
                <View className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full items-center justify-center border border-primary">
                  <Text className="text-[10px] text-white font-bold">
                    {unreadNotifs}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* QR Card */}
          <View className="bg-white/15 rounded-2xl p-4 flex-row items-center gap-4">
            <View className="w-16 h-16 bg-white rounded-xl items-center justify-center">
              <QrCode size={40} color="#0C6B58" />
            </View>
            <View className="flex-1">
              <Text className="text-white/80 text-xs">
                رمز التعريف الخاص بك
              </Text>
              <Text className="text-white font-bold text-sm my-0.5">
                {patient.qrCode}
              </Text>
              <Text className="text-white/60 text-[10px]">
                أظهره للصيدلي لربط الوصفة
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 -mt-6 space-y-6">
          {/* Quick Actions */}
          <View
            className="bg-white rounded-2xl p-5 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row justify-around">
              <QuickAction
                icon={FileText}
                label="الوصفات"
                path="/patient/PatientPrescriptions"
                color="bg-primary"
              />
              <QuickAction
                icon={Hand}
                label="لغة الإشارة"
                path="/patient/SignTutorial"
                color="bg-amber-500"
              />
              <QuickAction
                icon={MapPin}
                label="صيدليات"
                path="/patient/PatientPharmacies"
                color="bg-blue-500"
              />
              <QuickAction
                icon={Shield}
                label="حسابي"
                path="/patient/PatientProfile"
                color="bg-violet-500"
              />
            </View>
          </View>

          {/* Recent Prescriptions */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold text-gray-900">
                آخر الوصفات
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/patient/PatientPrescriptions")}
                className="flex-row items-center gap-0.5"
              >
                <Text className="text-xs text-primary font-semibold">
                  عرض الكل
                </Text>
                <ChevronLeft size={12} color="#0C6B58" />
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {prescriptions.slice(0, 2).map((rx) => (
                <TouchableOpacity
                  key={rx.id}
                  onPress={() => router.push(`/patient/PrescriptionDetail?id=${rx.id}`)}
                  className="bg-white rounded-xl p-4 border border-gray-100"
                  activeOpacity={0.7}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View>
                      <Text className="font-bold text-sm text-gray-900">
                        {rx.doctorName}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {rx.doctorSpecialty}
                      </Text>
                    </View>
                    <StatusBadge status={rx.status} />
                  </View>
                  <View className="flex-row items-center gap-4 mt-2">
                    <View className="flex-row items-center gap-1">
                      <Clock size={12} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500">{rx.date}</Text>
                    </View>
                    <Text className="text-xs text-gray-500">
                      {rx.medications.length} أدوية
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {rx.pharmacyName}
                    </Text>
                  </View>
                  {rx.signLanguageReady && (
                    <View className="mt-3 flex-row items-center gap-1.5 pt-2 border-t border-gray-50">
                      <Hand size={14} color="#0C6B58" />
                      <Text className="text-xs text-primary font-semibold">
                        لغة إشارة متاحة
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Health Info */}
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 mb-6">
            <Text className="text-sm font-bold text-amber-800 mb-2">
              ⚠️ تنبيهات صحية
            </Text>
            {patient.allergies?.length > 0 && (
              <Text className="text-xs text-amber-700">
                حساسية: {patient.allergies.join("، ")}
              </Text>
            )}
            {patient.chronicConditions?.length > 0 && (
              <Text className="text-xs text-amber-700 mt-1">
                أمراض مزمنة: {patient.chronicConditions.join("، ")}
              </Text>
            )}
            {(!patient.allergies?.length && !patient.chronicConditions?.length) && (
              <Text className="text-xs text-amber-700 mt-1">
                لا توجد تنبيهات صحية مسجلة حالياً
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav role="patient" />
      </View>
    </View>
  );
}
