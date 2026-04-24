import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Save, User, Phone, Mail, Droplet, AlertTriangle } from "lucide-react-native";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/mobile/PageHeader";

export default function PatientEditProfile() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "أحمد محمد الشهري",
    phone: user?.phone || "0551234567",
    email: user?.email || "ahmed@email.com",
    bloodType: user?.bloodType || "A+",
    allergies: user?.allergies?.join("، ") || "بنسلين",
    chronic: user?.chronicConditions?.join("، ") || "سكري نوع 2، ضغط دم",
  });

  const handleSave = () => {
    // Save logic
    alert("تم حفظ البيانات بنجاح");
    router.back();
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, multiline = false }) => (
    <View className="mb-4">
      <Text className="text-sm font-bold text-gray-700 mb-2">{label}</Text>
      <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-3 relative">
        <TextInput
          className={`flex-1 text-sm text-gray-900 py-3 ${multiline ? 'h-24' : ''}`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          textAlign="right"
          textAlignVertical={multiline ? "top" : "center"}
        />
        <View className="mr-3">
          <Icon size={18} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="تعديل الملف الشخصي" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6">
          <Text className="text-lg font-bold text-primary mb-4">البيانات الشخصية</Text>
          <InputField
            icon={User}
            label="الاسم الكامل"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <InputField
            icon={Phone}
            label="رقم الجوال"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
          <InputField
            icon={Mail}
            label="البريد الإلكتروني"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <View className="h-px bg-gray-200 my-4" />
          <Text className="text-lg font-bold text-primary mb-4">البيانات الصحية</Text>

          <InputField
            icon={Droplet}
            label="فصيلة الدم"
            value={formData.bloodType}
            onChangeText={(text) => setFormData({ ...formData, bloodType: text })}
          />
          
          <InputField
            icon={AlertTriangle}
            label="الحساسية (افصل بينها بفاصلة)"
            value={formData.allergies}
            onChangeText={(text) => setFormData({ ...formData, allergies: text })}
            multiline
          />
          
          <InputField
            icon={AlertTriangle}
            label="الأمراض المزمنة (افصل بينها بفاصلة)"
            value={formData.chronic}
            onChangeText={(text) => setFormData({ ...formData, chronic: text })}
            multiline
          />
        </View>

        <TouchableOpacity 
          className="bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2 mt-8 shadow-sm"
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Save size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-base">حفظ التغييرات</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
