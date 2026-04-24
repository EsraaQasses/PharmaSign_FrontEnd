import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Info, Linkedin, Globe, Twitter, Hand } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";

export default function AboutApp() {
  const SocialLink = ({ icon: Icon, title, color }) => (
    <TouchableOpacity className="flex-row items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100" activeOpacity={0.7}>
      <Icon size={18} color={color} />
      <Text className="text-sm font-bold text-gray-700">{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="عن التطبيق" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-10 mb-8">
          <View className="w-24 h-24 bg-primary/10 rounded-[32px] items-center justify-center mb-4 border border-primary/20 shadow-sm">
            <Hand size={48} color="#0C6B58" strokeWidth={1.5} />
          </View>
          <Text className="text-2xl font-extrabold text-primary mb-1 tracking-tight">PharmaSign</Text>
          <Text className="text-sm text-gray-500 font-medium">الإصدار 1.0.0</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Info size={20} color="#0C6B58" />
            <Text className="text-lg font-bold text-gray-900">رسالتنا</Text>
          </View>
          <Text className="text-sm text-gray-600 leading-relaxed text-justify">
            فارماساين هو تطبيق صُمم خصيصاً لخدمة فئة الصم وضعاف السمع في القطاع الصحي. نهدف إلى كسر حواجز التواصل بين الصيدلي والمريض من خلال توفير ترجمة فورية دقيقة للوصفات الطبية وتعليمات الأدوية إلى لغة الإشارة المعتمدة باستخدام تقنيات الذكاء الاصطناعي المتقدمة وأفاتار لغة الإشارة.
          </Text>
          
          <View className="h-px bg-gray-100 my-6" />
          
          <Text className="text-base font-bold text-gray-900 mb-4 text-center">تواصل معنا</Text>
          
          <View className="flex-row flex-wrap justify-center gap-3">
            <SocialLink icon={Globe} title="الموقع الإلكتروني" color="#3B82F6" />
            <SocialLink icon={Twitter} title="تويتر" color="#1DA1F2" />
            <SocialLink icon={Linkedin} title="لينكد إن" color="#0A66C2" />
          </View>
        </View>

        <View className="mt-10 items-center">
          <Text className="text-xs text-gray-400 font-medium">
            © 2026 PharmaSign. جميع الحقوق محفوظة.
          </Text>
          <Text className="text-[10px] text-gray-400 mt-1">
            تم التطوير بواسطة فريق العمل.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
