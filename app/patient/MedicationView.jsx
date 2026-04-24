import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Play,
  Repeat,
  Type,
  Bookmark,
  Calendar,
  Pill,
  Pause,
} from "lucide-react-native";
import { MOCK_PRESCRIPTIONS } from "@/lib/mockData";
import PageHeader from "@/components/mobile/PageHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MedicationView() {
  const { id, medIndex } = useLocalSearchParams();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id) || null;
  const index = parseInt(medIndex, 10) || 0;
  const currentMed = rx?.medications?.[index] || {
    name: "أموكسيسيلين 500mg",
    instructions: "تناول قرصاً واحداً بعد الطعام مرتين يومياً",
    duration: "7 أيام",
    dosage: "14 قرص",
  };

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="طريقة الاستخدام" showBackButton />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-[24px] p-4 flex-row items-center gap-4 shadow-sm border border-gray-100 mt-4 mb-6">
          <View className="w-[80px] h-[80px] bg-primary/5 rounded-2xl items-center justify-center">
            <Pill size={36} color="#0C6B58" />
          </View>
          <View className="flex-1 items-start">
            <Text className="text-lg font-bold text-gray-900 mb-1 text-left">
              {currentMed.name}
            </Text>
            <View className="bg-amber-100 px-3 py-1 rounded-full mb-1">
              <Text className="text-xs font-bold text-amber-700">
                مضاد حيوي
              </Text>
            </View>
            <Text className="text-xs text-gray-600">
              {currentMed.instructions}
            </Text>
          </View>
        </View>

        <View className="w-full aspect-video bg-gray-900 rounded-[24px] overflow-hidden mb-6 relative">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" }}
            className="absolute inset-0 w-full h-full opacity-60"
          />
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <TouchableOpacity 
              onPress={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-primary/90 items-center justify-center"
              activeOpacity={0.8}
            >
              {isPlaying ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" className="ml-1" />
              )}
            </TouchableOpacity>
          </View>
          
          <View className="absolute bottom-0 left-0 right-0 p-4">
            <View className="bg-black/60 px-4 py-3 rounded-xl self-start">
              <Text className="text-white font-medium text-sm">
                {currentMed.instructions}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-[24px] p-5 flex-row items-center justify-between mb-6 shadow-sm border border-gray-100">
           <View className="flex-row items-center gap-4">
              <TouchableOpacity className="items-center gap-1">
                 <View className="w-12 h-12 rounded-full bg-primary items-center justify-center shadow-sm">
                    <Repeat size={20} color="#FFFFFF" />
                 </View>
                 <Text className="text-xs font-bold text-primary">تكرار</Text>
              </TouchableOpacity>
              
              <View className="w-px h-10 bg-gray-200" />
              
              <TouchableOpacity className="items-center gap-1">
                 <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                    <Type size={20} color="#0C6B58" />
                 </View>
                 <Text className="text-xs font-medium text-gray-700">تسميات</Text>
              </TouchableOpacity>
           </View>

           <View className="flex-1 ml-6 relative items-center">
              <View className="flex-row justify-between w-full mb-2">
                 <Text className="text-xs font-bold text-primary">{speed.toFixed(1)}x</Text>
                 <Text className="text-xs text-gray-500">سرعة الأفاتار</Text>
              </View>
              <View className="w-full h-1.5 bg-gray-100 rounded-full my-1">
                 <View className="absolute left-0 top-0 bottom-0 w-1/2 bg-primary rounded-full" />
                 <View className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-primary -mt-2 -ml-2" />
              </View>
              <View className="flex-row justify-between w-full mt-1">
                 <Text className="text-[10px] text-gray-400">سريع</Text>
                 <Text className="text-[10px] text-gray-400">بطيء</Text>
              </View>
           </View>
        </View>

        <View className="flex-row gap-4 mb-6">
           <View className="flex-1 bg-amber-50 p-4 rounded-2xl flex-row items-center gap-3">
              <View className="bg-amber-100 w-10 h-10 rounded-xl items-center justify-center">
                 <Calendar size={20} color="#D97706" />
              </View>
              <View>
                 <Text className="text-[10px] text-amber-700 mb-0.5">المدة</Text>
                 <Text className="text-sm font-bold text-amber-900">{currentMed.duration}</Text>
              </View>
           </View>

           <View className="flex-1 bg-emerald-50 p-4 rounded-2xl flex-row items-center gap-3">
              <View className="bg-emerald-100 w-10 h-10 rounded-xl items-center justify-center">
                 <Pill size={20} color="#059669" />
              </View>
              <View>
                 <Text className="text-[10px] text-emerald-700 mb-0.5">الجرعة</Text>
                 <Text className="text-sm font-bold text-emerald-900">{currentMed.dosage}</Text>
              </View>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
