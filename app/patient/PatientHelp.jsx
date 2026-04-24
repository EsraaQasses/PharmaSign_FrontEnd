import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { HelpCircle, Mail, Phone, MessageSquare, ChevronLeft, ExternalLink } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";

export default function PatientHelp() {
  const FAQItem = ({ question }) => (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100" activeOpacity={0.7}>
      <Text className="text-sm font-bold text-gray-800 text-left flex-1 pl-4 leading-5">{question}</Text>
      <ChevronLeft size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const ContactCard = ({ icon: Icon, title, value, color, bg }) => (
    <TouchableOpacity className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 items-center justify-center gap-2 shadow-sm" activeOpacity={0.8}>
      <View className={`w-12 h-12 rounded-full items-center justify-center ${bg}`}>
        <Icon size={24} color={color} />
      </View>
      <Text className="text-sm font-bold text-gray-900 text-center mt-1">{title}</Text>
      <Text className="text-xs text-gray-500 text-center" numberOfLines={1}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="المساعدة والدعم" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Banner */}
        <View className="bg-primary/10 rounded-2xl p-5 mt-6 border border-primary/20 flex-row items-center gap-4">
          <View className="w-14 h-14 bg-primary/20 rounded-full items-center justify-center">
            <HelpCircle size={32} color="#0C6B58" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-primary mb-1 text-left">كيف يمكننا مساعدتك؟</Text>
            <Text className="text-xs text-primary/80 text-left leading-relaxed">
              فريق الدعم الفني متواجد لمساعدتك في أي وقت. يمكنك التواصل معنا من خلال القنوات التالية.
            </Text>
          </View>
        </View>

        {/* Contact Options Grid */}
        <View className="flex-row gap-4 mt-6">
          <ContactCard 
            icon={Phone} 
            title="اتصل بنا" 
            value="920000000" 
            color="#3B82F6" 
            bg="bg-blue-100" 
          />
          <ContactCard 
            icon={Mail} 
            title="راسلنا" 
            value="support@pharmasign.com" 
            color="#D97706" 
            bg="bg-amber-100" 
          />
          <ContactCard 
            icon={MessageSquare} 
            title="محادثة فورية" 
            value="متوفر 24/7" 
            color="#059669" 
            bg="bg-emerald-100" 
          />
        </View>

        {/* FAQs */}
        <View className="bg-white rounded-2xl p-5 mt-8 border border-gray-100 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2 text-left">الأسئلة الشائعة</Text>
          
          <FAQItem question="كيف يمكنني عرض الوصفة الطبية بلغة الإشارة؟" />
          <FAQItem question="هل يمكن للصيدلي رؤية جميع وصفاتي السابقة؟" />
          <FAQItem question="ماذا أفعل في حال فقدت رمز الاستجابة السريعة (QR)؟" />
          <FAQItem question="كيف يمكنني تحديث بياناتي الصحية؟" />
          
          <TouchableOpacity className="mt-4 flex-row items-center justify-center gap-2 py-2">
            <Text className="text-sm font-bold text-primary">عرض جميع الأسئلة</Text>
            <ExternalLink size={16} color="#0C6B58" />
          </TouchableOpacity>
        </View>
        
        {/* Version Info */}
        <View className="mt-10 items-center opacity-50">
          <Text className="text-xs font-bold text-gray-500">PharmaSign App</Text>
          <Text className="text-[10px] text-gray-400 mt-0.5">الإصدار 1.0.0</Text>
        </View>

      </ScrollView>
    </View>
  );
}
