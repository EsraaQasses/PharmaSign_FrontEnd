import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Lock, Smartphone, Shield, KeyRound, AlertTriangle } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";

export default function PatientSecurity() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = () => {
    alert("تم تحديث كلمة المرور بنجاح");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const InputField = ({ label, value, onChangeText, placeholder }) => (
    <View className="mb-4">
      <Text className="text-sm font-bold text-gray-700 mb-2">{label}</Text>
      <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-3 relative h-12">
        <TextInput
          className="flex-1 text-sm text-gray-900 h-full"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          textAlign="right"
        />
        <View className="mr-3">
          <KeyRound size={18} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="الأمان والخصوصية" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6">
          <View className="flex-row items-center gap-2 mb-4">
            <Lock size={20} color="#0C6B58" />
            <Text className="text-lg font-bold text-primary">تغيير كلمة المرور</Text>
          </View>
          
          <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <InputField
              label="كلمة المرور الحالية"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="أدخل كلمة المرور الحالية"
            />
            <InputField
              label="كلمة المرور الجديدة"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="أدخل كلمة المرور الجديدة"
            />
            <InputField
              label="تأكيد كلمة المرور الجديدة"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="أعد إدخال كلمة المرور الجديدة"
            />
            
            <TouchableOpacity 
              className="bg-primary py-3.5 rounded-xl flex-row items-center justify-center mt-2"
              onPress={handleUpdatePassword}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">تحديث كلمة المرور</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Smartphone size={20} color="#0C6B58" />
            <Text className="text-lg font-bold text-primary">الأجهزة المتصلة</Text>
          </View>
          
          <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm gap-4">
            <View className="flex-row items-center justify-between pb-4 border-b border-gray-50">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                  <Smartphone size={20} color="#0C6B58" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-gray-900 text-left">iPhone 13 Pro</Text>
                  <Text className="text-[10px] text-gray-500 mt-0.5 text-left">الرياض، السعودية • نشط الآن</Text>
                </View>
              </View>
              <View className="bg-emerald-100 px-2 py-1 rounded">
                <Text className="text-[10px] font-bold text-emerald-700">هذا الجهاز</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between pt-2">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <Globe size={20} color="#6B7280" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-gray-900 text-left">متصفح Chrome</Text>
                  <Text className="text-[10px] text-gray-500 mt-0.5 text-left">آخر ظهور: قبل 3 أيام</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text className="text-xs font-bold text-red-500">تسجيل الخروج</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View className="bg-red-50 rounded-2xl p-4 mt-8 border border-red-100 flex-row gap-3">
          <AlertTriangle size={24} color="#EF4444" />
          <View className="flex-1">
            <Text className="text-sm font-bold text-red-700 mb-1 text-left">حذف الحساب</Text>
            <Text className="text-xs text-red-600 text-left mb-3">سيؤدي هذا إلى حذف جميع بياناتك وسجلك الطبي نهائياً ولن تتمكن من استعادتها.</Text>
            <TouchableOpacity className="bg-red-100 self-start px-4 py-2 rounded-lg">
              <Text className="text-xs font-bold text-red-700">طلب حذف الحساب</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// Ensure Globe is imported
import { Globe } from "lucide-react-native";
