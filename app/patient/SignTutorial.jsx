import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Pill, Play, Pause, Repeat, Type, Calendar, Bookmark } from "lucide-react-native";
import { MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignTutorial() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id) || null;
  const currentMed = rx?.medications?.[0] || {
    name: "أموكسيسيلين 500mg",
    instructions: "تناول قرصاً واحداً بعد الطعام مرتين يومياً",
    duration: "7 أيام",
    dosage: "14 قرص",
  };

  const handleSave = () => {
    alert("تم حفظ الوصفة في السجل الخاص بك!");
    router.back();
  };

  return (
    <MobileShell className="bg-primary" edges={["top", "left", "right"]}>
      <PageHeader title="مترجم الإشارة" showBackButton />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ 
            paddingHorizontal: 20, 
            paddingTop: 0,
            paddingBottom: 100 + insets.bottom 
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Drug Info Card */}
          <View className="bg-white rounded-3xl p-6 flex-row items-center gap-5 shadow-sm border border-gray-50 mt-8 mb-6">
            <View className="w-20 h-20 bg-primary/5 rounded-2xl items-center justify-center border border-primary/10 shadow-inner">
              <Pill size={36} color="#0C6B58" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-gray-900 mb-2 text-right">
                {currentMed.name}
              </Text>
              <View className="flex-row justify-end">
                <View className="bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                  <Text className="text-[10px] font-extrabold text-amber-700 uppercase">
                    دواء موصوف
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Video Player Card */}
          <View className="w-full aspect-video bg-gray-900 rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl relative border-4 border-white">
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" }}
              className="absolute inset-0 w-full h-full opacity-60"
            />
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <TouchableOpacity 
                onPress={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-3xl bg-primary items-center justify-center shadow-xl shadow-primary/30"
                activeOpacity={0.8}
              >
                {isPlaying ? (
                  <Pause size={30} color="#FFFFFF" strokeWidth={2.5} />
                ) : (
                  <Play size={30} color="#FFFFFF" strokeWidth={2.5} className="ml-1" />
                )}
              </TouchableOpacity>
            </View>
            
            <View className="absolute bottom-4 left-4 right-4">
              <View className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                <Text className="text-white font-extrabold text-xs text-center leading-relaxed">
                  {currentMed.instructions}
                </Text>
              </View>
            </View>
          </View>

          {/* Player Controls */}
          <View className="bg-white rounded-[2.2rem] p-6 flex-row items-center justify-between mb-6 shadow-sm border border-gray-50">
             <View className="flex-row items-center gap-5">
                <TouchableOpacity className="items-center gap-1.5" activeOpacity={0.8}>
                   <View className="w-12 h-12 rounded-2xl bg-primary items-center justify-center shadow-lg shadow-primary/20">
                      <Repeat size={20} color="#FFFFFF" strokeWidth={2.5} />
                   </View>
                   <Text className="text-[10px] font-extrabold text-primary">تكرار</Text>
                </TouchableOpacity>
                
                <View className="w-px h-10 bg-gray-100" />
                
                <TouchableOpacity className="items-center gap-1.5" activeOpacity={0.8}>
                   <View className="w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center border border-gray-100">
                      <Type size={20} color="#0C6B58" strokeWidth={2.5} />
                   </View>
                   <Text className="text-[10px] font-extrabold text-gray-500">تسميات</Text>
                </TouchableOpacity>
             </View>

             <View className="flex-1 ml-8 items-end">
                <View className="flex-row justify-between w-full mb-3">
                   <Text className="text-xs font-extrabold text-primary">{speed.toFixed(1)}x</Text>
                   <Text className="text-[10px] font-extrabold text-gray-300 uppercase tracking-tighter">سرعة العرض</Text>
                </View>
                {/* Mock Slider */}
                <View className="w-full h-1.5 bg-gray-100 rounded-full relative overflow-hidden">
                   <View className="absolute left-0 top-0 bottom-0 w-1/2 bg-primary rounded-full shadow-sm" />
                </View>
                <View className="flex-row justify-between w-full mt-2">
                   <Text className="text-[8px] font-extrabold text-gray-300">سريع</Text>
                   <Text className="text-[8px] font-extrabold text-gray-300">بطيء</Text>
                </View>
             </View>
          </View>

          {/* Info Details Bento */}
          <View className="flex-row gap-4 mb-6">
             <View className="flex-1 bg-amber-50 p-5 rounded-[2rem] flex-row items-center gap-3 border border-amber-100 shadow-sm shadow-amber-900/5">
                <View className="bg-white w-10 h-10 rounded-xl items-center justify-center shadow-sm">
                   <Calendar size={18} color="#D97706" strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                   <Text className="text-[9px] font-extrabold text-amber-700 uppercase tracking-tighter mb-0.5">المدة</Text>
                   <Text className="text-sm font-extrabold text-amber-900">{currentMed.duration}</Text>
                </View>
             </View>

             <View className="flex-1 bg-emerald-50 p-5 rounded-[2rem] flex-row items-center gap-3 border border-emerald-100 shadow-sm shadow-emerald-900/5">
                <View className="bg-white w-10 h-10 rounded-xl items-center justify-center shadow-sm">
                   <Pill size={18} color="#059669" strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                   <Text className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-tighter mb-0.5">الجرعة</Text>
                   <Text className="text-sm font-extrabold text-emerald-900">{currentMed.dosage}</Text>
                </View>
             </View>
          </View>
        </ScrollView>
      </View>

      {/* Footer Button */}
      <View 
        className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-white/80 backdrop-blur-md border-t border-gray-100" 
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <TouchableOpacity 
          className="bg-primary h-16 rounded-2xl flex-row items-center justify-center gap-3 shadow-xl shadow-primary/30"
          onPress={handleSave} 
          activeOpacity={0.8}
        >
           <Bookmark size={22} color="#FFFFFF" strokeWidth={2.5} />
           <Text className="text-white font-extrabold text-lg">حفظ في السجل الطبي</Text>
        </TouchableOpacity>
      </View>
    </MobileShell>
  );
}
