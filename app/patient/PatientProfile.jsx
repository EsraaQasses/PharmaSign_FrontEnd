import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronLeft,
  FileText,
  Activity,
  Edit,
} from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";
import BottomNav from "@/components/mobile/BottomNav";

export default function PatientProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Handle mock fallback
  const patient = user || {
    name: "أحمد محمد الشهري",
    phone: "0551234567",
    email: "ahmed@email.com",
    bloodType: "A+",
  };

  const handleLogout = () => {
    logout();
    router.replace("/RoleSelect");
  };

  const MenuLink = ({ icon: Icon, title, subtitle, path, color }) => (
    <TouchableOpacity
      onPress={() => router.push(path)}
      className="flex-row items-center p-4 bg-white border-b border-gray-50"
      activeOpacity={0.7}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${color}`}
      >
        <Icon size={20} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      <ChevronLeft size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Header */}
        <View className="bg-primary px-5 pt-16 pb-8 rounded-b-[2rem] items-center">
          <View className="relative">
            <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4 border-2 border-white/40">
              <User size={48} color="#FFFFFF" strokeWidth={1.5} />
            </View>
            <TouchableOpacity
              onPress={() => router.push("/patient/PatientEditProfile")}
              className="absolute bottom-4 -right-2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
            >
              <Edit size={16} color="#0C6B58" />
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-extrabold text-white mb-1">
            {patient.name}
          </Text>
          <Text className="text-sm text-white/80">{patient.phone}</Text>
          
          <View className="flex-row items-center gap-2 mt-4 bg-white/15 px-4 py-2 rounded-full">
            <Activity size={16} color="#FFFFFF" />
            <Text className="text-sm text-white font-bold">
              فصيلة الدم: {patient.bloodType}
            </Text>
          </View>
        </View>

        <View className="px-5 -mt-4">
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <MenuLink
              icon={User}
              title="تعديل الملف الشخصي"
              subtitle="تحديث بياناتك الشخصية والصحية"
              path="/patient/PatientEditProfile"
              color="bg-blue-500"
            />
            <MenuLink
              icon={Settings}
              title="الإعدادات"
              subtitle="التنبيهات، اللغة، والمظهر"
              path="/patient/PatientSettings"
              color="bg-gray-500"
            />
            <MenuLink
              icon={Shield}
              title="الأمان والخصوصية"
              subtitle="كلمة المرور والأجهزة المتصلة"
              path="/patient/PatientSecurity"
              color="bg-emerald-500"
            />
            <MenuLink
              icon={FileText}
              title="الشروط والأحكام"
              subtitle="سياسة الخصوصية واستخدام التطبيق"
              path="/patient/PrivacyPolicy"
              color="bg-amber-500"
            />
            <MenuLink
              icon={HelpCircle}
              title="المساعدة والدعم"
              subtitle="الأسئلة الشائعة والتواصل معنا"
              path="/patient/PatientHelp"
              color="bg-violet-500"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 mt-8 mb-8 bg-red-50 py-4 rounded-2xl border border-red-100"
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="text-red-500 font-bold text-base">تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav role="patient" />
      </View>
    </View>
  );
}
