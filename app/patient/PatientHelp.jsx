import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { HelpCircle, Phone, ChevronLeft } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";

export default function PatientHelp() {
  const FAQItem = ({ question }) => (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100" activeOpacity={0.7}>
      <Text className="text-sm font-bold text-gray-800 text-right flex-1 pl-4 leading-5">{question}</Text>
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
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader 
        title="المساعدة والدعم" 
        showBackButton 
        role="patient" 
        backTo="/patient/PatientSettings"
      />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-5 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
        {/* Support Banner */}
        <View className="bg-patient/10 rounded-2xl p-5 mt-6 border border-patient/20 flex-row items-center gap-4">
          <View className="w-14 h-14 bg-patient/20 rounded-full items-center justify-center">
            <HelpCircle size={32} color="#022451" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-patient mb-1 text-right">كيف يمكننا مساعدتك؟</Text>
            <Text className="text-xs text-patient/80 text-right leading-relaxed">
              فريق الدعم الفني متواجد لمساعدتك. يمكنك التواصل معنا عبر الاتصال فقط.
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
        </View>

        {/* FAQs */}
        <View className="bg-white rounded-2xl p-5 mt-8 border border-gray-100 shadow-sm">
          <Text className="text-base font-bold text-gray-900 mb-2 text-right">الأسئلة الشائعة</Text>
          
          <FAQItem question="كيف يمكنني عرض الوصفة الطبية بلغة الإشارة؟" />
          <FAQItem question="هل يمكن للصيدلي رؤية جميع وصفاتي السابقة؟" />
          <FAQItem question="ماذا أفعل في حال فقدت رمز الاستجابة السريعة (QR)؟" />
          <FAQItem question="كيف يمكنني تحديث بياناتي الصحية؟" />
          
        </View>
        
        {/* Version Info */}
        <View className="mt-10 items-center opacity-50">
          <Text className="text-xs font-bold text-gray-500">PharmaSign App</Text>
          <Text className="text-[10px] text-gray-400 mt-0.5">الإصدار 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  </MobileShell>
  );
}
