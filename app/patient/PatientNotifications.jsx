import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Pill, Calendar, Info } from "lucide-react-native";
import { MOCK_NOTIFICATIONS } from "@/lib/mockData";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";

export default function PatientNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "prescription":
        return <Pill size={22} color="#059669" strokeWidth={2.5} />;
      case "reminder":
        return <Calendar size={22} color="#D97706" strokeWidth={2.5} />;
      case "info":
      default:
        return <Info size={22} color="#3B82F6" strokeWidth={2.5} />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case "prescription":
        return "bg-emerald-50";
      case "reminder":
        return "bg-amber-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return `${year}-${month}-${day} • ${time}`;
  };

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="الإشعارات" showBackButton role="patient" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <View className="px-6 py-6 flex-row items-center justify-between border-b border-gray-50 bg-white">
          <View>
            <Text className="text-xl font-extrabold text-gray-900">
              التنبيهات
            </Text>
            <Text className="text-xs font-bold text-gray-400 mt-0.5">
              لديك {unreadCount} إشعار جديد لم يقرأ
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity 
              onPress={markAllAsRead}
              className="bg-patient/5 px-4 py-2 rounded-xl"
            >
              <Text className="text-xs font-extrabold text-patient">
                تحديد الكل
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View className="items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <View className="w-20 h-20 bg-white rounded-full shadow-sm items-center justify-center mb-4">
                 <Bell size={32} color="#D1D5DB" />
              </View>
              <Text className="text-base font-extrabold text-gray-400">لا توجد إشعارات حالياً</Text>
            </View>
          ) : (
            <View className="gap-4">
              {notifications.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  className={`bg-white rounded-3xl p-5 flex-row gap-4 border shadow-sm ${
                    n.read ? "border-gray-50 opacity-60" : "border-patient/10"
                  }`}
                  activeOpacity={0.8}
                  onPress={() => {
                    setNotifications(
                      notifications.map((notif) =>
                        notif.id === n.id ? { ...notif, read: true } : notif
                      )
                    );
                  }}
                >
                  <View
                    className={`w-14 h-14 rounded-2xl items-center justify-center ${getIconBg(
                      n.type
                    )}`}
                  >
                    {getIcon(n.type)}
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <Text
                        className={`text-base font-extrabold ${
                          n.read ? "text-gray-500" : "text-gray-900"
                        }`}
                      >
                        {n.title}
                      </Text>
                      {!n.read && (
                        <View className="w-2.5 h-2.5 rounded-full bg-patient shadow-sm shadow-patient/40" />
                      )}
                    </View>

                    <Text
                      className={`text-sm font-medium leading-relaxed mb-3 text-right ${
                        n.read ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {n.body}
                    </Text>

                    <View className="flex-row items-center gap-1.5 justify-end">
                       <Text className="text-[10px] font-extrabold text-gray-300 uppercase tracking-tighter">
                        {formatDate(n.date)}
                      </Text>
                      <View className="w-1 h-1 rounded-full bg-gray-200" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </MobileShell>
  );
}
