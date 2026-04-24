import React, { useState } from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Globe, Moon, ShieldAlert, FileText, HelpCircle, LogOut } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";

export default function PharmacistSettings() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    notifications: true,
    autoAccept: false,
    darkMode: false,
    useBiometrics: true,
  });

  const toggleSetting = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const SettingRow = ({ icon: Icon, title, description, value, onValueChange }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-1 flex-row items-center gap-3">
        <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
          <Icon size={20} color="#0C6B58" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-gray-900 text-left">{title}</Text>
          {description && <Text className="text-xs text-gray-500 mt-1 text-left">{description}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: "#0C6B58" }}
        thumbColor={"#FFFFFF"}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="إعدادات الصيدلي" showBackButton />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View className="bg-white rounded-2xl p-5 mt-6 border border-gray-100 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2 text-left">التنبيهات وسير العمل</Text>
          <SettingRow
            icon={Bell}
            title="إشعارات الوصفات الجديدة"
            description="تنبي عند مسح مريض جديد لرمزه بالصيدلية"
            value={settings.notifications}
            onValueChange={() => toggleSetting("notifications")}
          />
          <SettingRow
            icon={FileText}
            title="القبول التلقائي للوصفات"
            description="تخطي مرحلة المراجعة للوصفات المكررة"
            value={settings.autoAccept}
            onValueChange={() => toggleSetting("autoAccept")}
          />
        </View>

        <View className="bg-white rounded-2xl p-5 mt-4 border border-gray-100 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2 text-left">الأمان والمظهر</Text>
          <SettingRow
            icon={ShieldAlert}
            title="تسجيل الدخول بالبصمة"
            value={settings.useBiometrics}
            onValueChange={() => toggleSetting("useBiometrics")}
          />
          <SettingRow
            icon={Moon}
            title="الوضع الليلي"
            value={settings.darkMode}
            onValueChange={() => toggleSetting("darkMode")}
          />
          <TouchableOpacity className="flex-row items-center justify-between py-4 pt-4 border-t border-gray-100">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                <Globe size={20} color="#3B82F6" />
              </View>
              <Text className="text-sm font-bold text-gray-900">لغة التطبيق</Text>
            </View>
            <Text className="text-sm font-bold text-primary">العربية</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-5 mt-4 border border-gray-100 shadow-sm gap-2">
            <TouchableOpacity className="flex-row items-center gap-3 py-3 border-b border-gray-50">
               <HelpCircle size={20} color="#6B7280" />
               <Text className="text-sm font-bold text-gray-700">المساعدة والدعم الفني</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-3 py-3" onPress={() => router.replace("/RoleSelect")}>
               <LogOut size={20} color="#EF4444" />
               <Text className="text-sm font-bold text-red-500">تسجيل الخروج</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}