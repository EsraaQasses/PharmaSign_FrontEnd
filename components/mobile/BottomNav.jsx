import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Home,
  FileText,
  MapPin,
  User,
  Pill,
  Users,
  Bell,
  Settings,
} from "lucide-react-native";

const patientTabs = [
  { icon: Home, label: "الرئيسية", path: "/patient/PatientHome" },
  { icon: FileText, label: "الوصفات", path: "/patient/PatientPrescriptions" },
  { icon: MapPin, label: "صيدليات", path: "/patient/PatientPharmacies" },
  { icon: User, label: "حسابي", path: "/patient/PatientProfile" },
];

const pharmacistTabs = [
  { icon: Home, label: "الرئيسية", path: "/pharmacist/PharmacistHome" },
  { icon: FileText, label: "الوصفات", path: "/pharmacist/PharmacistPrescriptions" },
  { icon: Users, label: "المرضى", path: "/pharmacist/PharmacistPatients" },
  { icon: Settings, label: "الإعدادات", path: "/pharmacist/PharmacistSettings" },
];

export default function BottomNav({ role = "patient" }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const tabs = role === "pharmacist" ? pharmacistTabs : patientTabs;
  const activeColor = role === "pharmacist" ? "#05997F" : "#022451";

  const handlePress = (path) => {
    if (pathname === path) return;
    router.replace(path);
  };

  return (
    <View
      className="flex-row bg-white border-t border-gray-100 px-2 pt-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 16),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.path}
            onPress={() => handlePress(tab.path)}
            className="flex-1 items-center py-2"
            activeOpacity={0.7}
          >
            <Icon
              size={24}
              color={isActive ? activeColor : "#9CA3AF"}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text
              style={{ color: isActive ? activeColor : "#9CA3AF" }}
              className={`text-[10px] mt-1 font-bold`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
