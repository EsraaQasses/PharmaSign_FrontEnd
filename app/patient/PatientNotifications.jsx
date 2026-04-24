import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Bell, Pill, Calendar, Info, Check, Trash2 } from "lucide-react-native";
import { MOCK_NOTIFICATIONS } from "@/lib/mockData";
import PageHeader from "@/components/mobile/PageHeader";

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
        return <Pill size={20} color="#059669" />;
      case "reminder":
        return <Calendar size={20} color="#D97706" />;
      case "info":
      default:
        return <Info size={20} color="#3B82F6" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case "prescription":
        return "bg-emerald-100";
      case "reminder":
        return "bg-amber-100";
      case "info":
      default:
        return "bg-blue-100";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("ar-SA")} • ${date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="الإشعارات" showBackButton />

      <View className="px-5 py-4 flex-row items-center justify-between">
        <Text className="text-base font-bold text-gray-900">
          أحدث الإشعارات ({unreadCount} جديد)
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-sm font-bold text-primary">
              تحديد الكل مقروء
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Bell size={48} color="#D1D5DB" />
            <Text className="text-gray-500 font-medium mt-4">
              لا توجد إشعارات حالياً
            </Text>
          </View>
        ) : (
          <View className="gap-3 border-t border-gray-100 pt-3">
            {notifications.map((n) => (
              <TouchableOpacity
                key={n.id}
                className={`bg-white rounded-2xl p-4 flex-row gap-4 border shadow-sm ${
                  n.read ? "border-gray-100 opacity-70" : "border-primary/20"
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
                  className={`w-12 h-12 rounded-full items-center justify-center ${getIconBg(
                    n.type
                  )}`}
                >
                  {getIcon(n.type)}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className={`text-sm font-bold ${
                        n.read ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {n.title}
                    </Text>
                    {!n.read && (
                      <View className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </View>

                  <Text
                    className={`text-xs mb-2 ${
                      n.read ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {n.body}
                  </Text>

                  <Text className="text-[10px] text-gray-400">
                    {formatDate(n.date)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
