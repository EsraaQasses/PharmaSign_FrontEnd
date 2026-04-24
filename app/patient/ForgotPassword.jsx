import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { KeyRound, Mail, ArrowRight, CheckCircle2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForgotPassword() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      alert("الرجاء إدخال البريد الإلكتروني أو رقم الجوال");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100 shadow-sm mb-8"
        >
          <ArrowRight size={20} color="#0C6B58" />
        </TouchableOpacity>

        {!isSubmitted ? (
          <View className="flex-1">
            <View className="mb-8">
              <View className="w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-6">
                <KeyRound size={32} color="#0C6B58" />
              </View>
              <Text className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight text-left">
                نسيت كلمة المرور؟
              </Text>
              <Text className="text-base text-gray-500 leading-relaxed text-left">
                لا تقلق! أدخل البريد الإلكتروني أو رقم الجوال المرتبط بحسابك وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني أو رقم الجوال</Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl bg-white px-4 h-14 relative focus:border-primary">
                <TextInput
                  className="flex-1 text-base text-gray-900 h-full"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="right"
                />
                <View className="mr-3">
                  <Mail size={20} color="#9CA3AF" />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              className="bg-primary h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/30 mt-4"
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">إرسال رابط التعيين</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-10">
            <View className="w-24 h-24 bg-emerald-50 rounded-full items-center justify-center mb-6 border-8 border-emerald-100/50">
              <CheckCircle2 size={40} color="#059669" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 mb-3 text-center">
              تم إرسال الرابط!
            </Text>
            <Text className="text-base text-gray-500 text-center leading-relaxed px-4 mb-10">
              لقد أرسلنا تعليمات استعادة كلمة المرور إلى {email}. يرجى التحقق من صندوق الوارد الخاص بك.
            </Text>
            
            <TouchableOpacity 
              className="w-full bg-primary h-14 rounded-xl flex-row items-center justify-center shadow-sm"
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">العودة لتسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
