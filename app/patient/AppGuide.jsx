import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Play, Pause, Info, HelpCircle, ShieldCheck } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppGuide() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="كيف يعمل فارماساين؟" showBackButton role="patient" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingTop: 32,
            paddingBottom: 60 + insets.bottom 
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-10">
            <Text className="text-2xl font-extrabold text-gray-900 mb-2">دليلك لاستخدام التطبيق</Text>
            <Text className="text-sm text-gray-500 text-center leading-relaxed px-4">
              شاهد الفيديو التعليمي لتتعرف على كيفية استلام وصفاتك الطبية بلغة الإشارة
            </Text>
          </View>

          {/* Video Player Mock */}
          <View className="w-full aspect-video bg-gray-900 rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl relative border-4 border-white">
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1576091160550-217359f48f4c?q=80&w=800&auto=format&fit=crop" }}
              className="absolute inset-0 w-full h-full opacity-60"
            />
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <TouchableOpacity 
                onPress={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-3xl bg-patient items-center justify-center shadow-xl shadow-patient/40"
                activeOpacity={0.8}
              >
                {isPlaying ? (
                  <Pause size={36} color="#FFFFFF" strokeWidth={2.5} />
                ) : (
                  <Play size={36} color="#FFFFFF" strokeWidth={2.5} className="ml-1" />
                )}
              </TouchableOpacity>
            </View>
            
            <View className="absolute bottom-4 left-4 right-4 items-center">
               <View className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <Text className="text-white text-[10px] font-bold">عرض توضيحي للمريض</Text>
               </View>
            </View>
          </View>

          {/* Guide Steps */}
          <View className="gap-6">
            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-2xl bg-patient/10 items-center justify-center border border-patient/20">
                <Text className="text-patient font-extrabold text-lg">١</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-extrabold text-gray-900 mb-1 text-right">أظهر رمز QR للصيدلي</Text>
                <Text className="text-xs text-gray-500 text-right leading-relaxed">
                  افتح رمز التعريف الخاص بك من الصفحة الرئيسية وأظهره للصيدلي ليتمكن من ربط الوصفة بحسابك.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center border border-blue-100">
                <Text className="text-blue-600 font-extrabold text-lg">٢</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-extrabold text-gray-900 mb-1 text-right">استلم إشعار الوصفة</Text>
                <Text className="text-xs text-gray-500 text-right leading-relaxed">
                  بمجرد قيام الصيدلي بإدخال التعليمات، ستتلقى إشعاراً فورياً يحتوي على كافة التفاصيل.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-2xl bg-amber-50 items-center justify-center border border-amber-100">
                <Text className="text-amber-600 font-extrabold text-lg">٣</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-extrabold text-gray-900 mb-1 text-right">شاهد لغة الإشارة</Text>
                <Text className="text-xs text-gray-500 text-right leading-relaxed">
                  افتح الوصفة واضغط على أيقونة لغة الإشارة لكل دواء لمشاهدة فيديو توضيحي للتعليمات.
                </Text>
              </View>
            </View>
          </View>

          {/* Footer Info */}
          <View className="mt-12 bg-emerald-50 rounded-3xl p-5 border border-emerald-100 flex-row items-center gap-4">
            <ShieldCheck size={24} color="#059669" />
            <Text className="text-xs text-emerald-800 font-bold flex-1 leading-relaxed text-right">
              بياناتك الطبية مشفرة ومحمية بالكامل ولا يتم مشاركتها إلا مع الصيدلي المصرح له.
            </Text>
          </View>
        </ScrollView>
      </View>
    </MobileShell>
  );
}
