import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
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
  const tabs = role === "pharmacist" ? pharmacistTabs : patientTabs;

  return (
    <View
      className="flex-row bg-white border-t border-gray-100 px-2 pb-6 pt-2"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || pathname?.startsWith(tab.path);
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.path}
            onPress={() => router.push(tab.path)}
            className="flex-1 items-center py-2"
            activeOpacity={0.7}
          >
            <Icon
              size={22}
              color={isActive ? "#0C6B58" : "#9CA3AF"}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text
              className={`text-[10px] mt-1 font-medium ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}