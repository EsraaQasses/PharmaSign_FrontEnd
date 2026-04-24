import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ShieldCheck, FileText, Lock } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";

export default function PrivacyPolicy() {
  const Section = ({ icon: Icon, title, content }) => (
    <View className="mb-8">
      <View className="flex-row items-center gap-2 mb-3">
        <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
          <Icon size={16} color="#0C6B58" />
        </View>
        <Text className="text-base font-bold text-gray-900">{title}</Text>
      </View>
      <Text className="text-sm text-gray-600 leading-relaxed text-left pl-2 pr-1">
        {content}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="الشروط وسياسة الخصوصية" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-6 mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-4">
            <ShieldCheck size={40} color="#0C6B58" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">سياسة الخصوصية</Text>
          <Text className="text-sm text-gray-500 text-center px-4">
            نحن في فارماساين نلتزم بحماية خصوصيتك وبياناتك الطبية بأعلى معايير الأمان المتاحة.
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <Section
            icon={FileText}
            title="جمع البيانات"
            content="نجمع البيانات الأساسية اللازمة لتقديم الخدمة فقط، وتشمل الاسم ورقم الجوال والتاريخ الطبي المتعلق بالوصفات المصروفة من خلال التطبيق لتوفير ترجمات لغة الإشارة الصحيحة."
          />
          
          <Section
            icon={Lock}
            title="حماية البيانات"
            content="جميع بياناتك الطبية والشخصية مشفرة بالكامل ولا يمكن لأي طرف ثالث الوصول إليها دون إذنك الصريح الذي تقدمه من خلال رمز الاستجابة السريعة للصيدلي."
          />
          
          <Section
            icon={ShieldCheck}
            title="مشاركة المعلومات للصيدلي"
            content="عند تقديم رمز الاستجابة السريعة للصيدلي، فإنك توافق على إعطائه صلاحية مؤقتة لعرض الوصفات الطبية الخاصة بك وإضافة وصفات جديدة لحسابك."
          />
          
          <View className="mt-4 pt-4 border-t border-gray-100">
            <Text className="text-xs text-gray-400 text-center">
              آخر تحديث: 24 أبريل 2026
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
