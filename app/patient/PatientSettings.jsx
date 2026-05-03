import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Smartphone, Moon, Globe, ShieldAlert, ArrowRight } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { profileApi } from "@/api/profileApi";
import { useEffect } from "react";

export default function PatientSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    prescriptionReminders: true,
    darkMode: false,
    useBiometrics: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const res = await profileApi.getPatientSettings();
    setIsLoading(false);
    if (res.success) {
      setSettings(res.data);
    }
  };

  const toggleSetting = async (key) => {
    const newVal = !settings[key];
    const prevSettings = { ...settings };
    
    // Optimistic update
    setSettings((prev) => ({ ...prev, [key]: newVal }));

    const res = await profileApi.updatePatientSettings({ [key]: newVal });
    if (!res.success) {
      setSettings(prevSettings);
      alert("تعذر تحديث الإعدادات");
    }
  };

  const SettingRow = ({ icon: Icon, title, description, value, onValueChange, showDivider = true }) => (
    <View className={`flex-row items-center justify-between py-5 ${showDivider ? 'border-b border-gray-50' : ''}`}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#022451" }}
        thumbColor={"#FFFFFF"}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
      <View className="flex-1 flex-row items-center gap-4 justify-end">
        <View className="flex-1">
          <Text className="text-base font-extrabold text-gray-900 text-right">{title}</Text>
          {description && <Text className="text-[10px] font-bold text-gray-400 mt-1 text-right leading-relaxed">{description}</Text>}
        </View>
        <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
          <Icon size={22} color="#022451" strokeWidth={2.5} />
        </View>
      </View>
    </View>
  );

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="الإعدادات" showBackButton={false} role="patient" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 + insets.bottom }} 
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-[2.5rem] p-6 mb-5 border border-gray-50 shadow-sm">
            <View className="flex-row items-center justify-end mb-6 gap-2">
               <Text className="text-lg font-extrabold text-gray-900">التنبيهات</Text>
               <View className="w-1 h-6 bg-patient rounded-full" />
            </View>
            <SettingRow
              icon={Bell}
              title="إشعارات التطبيق"
              description="السماح للتطبيق بإرسال تنبيهات عامة"
              value={settings.notifications}
              onValueChange={() => toggleSetting("notifications")}
            />
            <SettingRow
              icon={Smartphone}
              title="تنبيهات الأدوية"
              description="تذكير بمواعيد الأدوية واستلام الوصفات"
              value={settings.prescriptionReminders}
              onValueChange={() => toggleSetting("prescriptionReminders")}
              showDivider={false}
            />
          </View>

          <View className="bg-white rounded-[2.5rem] p-6 mb-5 border border-gray-50 shadow-sm">
            <View className="flex-row items-center justify-end mb-6 gap-2">
               <Text className="text-lg font-extrabold text-gray-900">المظهر واللغة</Text>
               <View className="w-1 h-6 bg-patient rounded-full" />
            </View>
            <SettingRow
              icon={Moon}
              title="الوضع الداكن"
              description="تغيير مظهر التطبيق إلى الألوان الليلية"
              value={settings.darkMode}
              onValueChange={() => toggleSetting("darkMode")}
            />
            
            <TouchableOpacity className="flex-row items-center justify-between py-5 pt-5 border-gray-50">
              <View className="flex-row items-center gap-2">
                 <Text className="text-sm font-extrabold text-patient">العربية</Text>
                 <ArrowRight size={14} color="#022451" style={{ transform: [{ rotate: '180deg' }] }} />
              </View>
              <View className="flex-row items-center gap-4">
                <View className="flex-1">
                   <Text className="text-base font-extrabold text-gray-900 text-right">لغة التطبيق</Text>
                   <Text className="text-[10px] font-bold text-gray-400 mt-1 text-right">تغيير لغة واجهة المستخدم</Text>
                </View>
                <View className="w-12 h-12 bg-patient/5 rounded-2xl items-center justify-center border border-patient/10">
                  <Globe size={22} color="#022451" strokeWidth={2.5} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-[2.5rem] p-6 mb-8 border border-gray-50 shadow-sm">
            <View className="flex-row items-center justify-end mb-6 gap-2">
               <Text className="text-lg font-extrabold text-gray-900">الأمان</Text>
               <View className="w-1 h-6 bg-patient rounded-full" />
            </View>
            <SettingRow
              icon={ShieldAlert}
              title="قفل التطبيق"
              description="استخدام البصمة لتعزيز سرية بياناتك"
              value={settings.useBiometrics}
              onValueChange={() => toggleSetting("useBiometrics")}
              showDivider={false}
            />
          </View>
          
          <Text className="text-center text-[10px] font-extrabold text-gray-300 mb-4 uppercase tracking-widest leading-relaxed">
            تم التطوير بواسطة فريق فارماساين{'\n'}مشروع تخرج - 2024
          </Text>
        </ScrollView>
      </View>
    </MobileShell>
  );
}
