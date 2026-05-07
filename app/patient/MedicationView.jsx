import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
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
  AlertCircle,
} from "lucide-react-native";
import { Video, ResizeMode } from "expo-av";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { prescriptionApi } from "@/api/prescriptionApi";

export default function MedicationView() {
  const { id, medIndex } = useLocalSearchParams();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [rx, setRx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRx = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await prescriptionApi.getPatientPrescriptionDetail(id);
        if (res.success) {
          setRx(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRx();
  }, [id]);

  const index = parseInt(medIndex, 10) || 0;
  const currentMed = rx?.items?.[index] || null;

  if (isLoading) {
    return (
      <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
        <PageHeader title="طريقة الاستخدام" showBackButton role="patient" backTo={id ? `/patient/PrescriptionDetail?id=${id}` : "/patient/PatientPrescriptions"} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#022451" />
        </View>
      </MobileShell>
    );
  }

  if (error || !currentMed) {
    return (
      <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
        <PageHeader title="طريقة الاستخدام" showBackButton role="patient" backTo={id ? `/patient/PrescriptionDetail?id=${id}` : "/patient/PatientPrescriptions"} />
        <View className="flex-1 items-center justify-center p-8">
          <AlertCircle size={48} color="#D1D5DB" />
          <Text className="text-gray-500 font-bold mt-4 text-center">{error || "بيانات الدواء غير متوفرة"}</Text>
        </View>
      </MobileShell>
    );
  }

  const instructions = currentMed.approved_instruction_text || currentMed.instructions || currentMed.raw_transcript || "لا توجد تعليمات إضافية";
  const videoUrl = currentMed.video_url;

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="طريقة الاستخدام" showBackButton role="patient" backTo={id ? `/patient/PrescriptionDetail?id=${id}` : "/patient/PatientPrescriptions"} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-[24px] p-4 flex-row items-center gap-4 shadow-sm border border-gray-100 mt-4 mb-6">
          <View className="w-[80px] h-[80px] bg-patient/5 rounded-2xl items-center justify-center">
            <Pill size={36} color="#022451" />
          </View>
          <View className="flex-1 items-start">
            <Text className="text-lg font-bold text-gray-900 mb-1 text-right w-full">
              {currentMed.medication_name}
            </Text>
            <View className="bg-patient/10 px-3 py-1 rounded-full mb-1">
              <Text className="text-[10px] font-bold text-patient">
                دواء موصوف
              </Text>
            </View>
            <Text className="text-xs text-gray-600 text-right w-full" numberOfLines={2}>
              {instructions}
            </Text>
          </View>
        </View>

        {!videoUrl ? (
          <View className="w-full aspect-video bg-gray-50 rounded-[24px] overflow-hidden mb-6 items-center justify-center border border-gray-100 p-6">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
              <Type size={32} color="#D1D5DB" />
            </View>
            <Text className="text-gray-400 font-extrabold text-base text-center px-4">فيديو لغة الإشارة غير متوفر حالياً لهذه المادة. يرجى قراءة التعليمات النصية أدناه.</Text>
          </View>
        ) : (
          <View className="w-full aspect-video bg-gray-900 rounded-[24px] overflow-hidden mb-6 relative">
            <Video
              style={{ width: '100%', height: '100%' }}
              source={{ uri: videoUrl }}
              useNativeControls={false}
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={isPlaying}
              rate={speed}
            />
            
            <View className="absolute inset-0 items-center justify-center">
              {!isPlaying && (
                <TouchableOpacity 
                  onPress={() => setIsPlaying(true)}
                  className="w-16 h-16 rounded-full bg-patient/90 items-center justify-center shadow-xl"
                  activeOpacity={0.8}
                >
                  <Play size={32} color="#FFFFFF" className="ml-1" />
                </TouchableOpacity>
              )}
            </View>

            {isPlaying && (
              <TouchableOpacity 
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                onPress={() => setIsPlaying(false)}
              />
            )}
            
            <View className="absolute bottom-0 left-0 right-0 p-4">
              <View className="bg-black/60 px-4 py-3 rounded-xl self-start max-w-[90%]">
                <Text className="text-white font-medium text-xs text-right">
                  {instructions}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className="bg-white rounded-[24px] p-5 flex-row items-center justify-between mb-6 shadow-sm border border-gray-100">
           <View className="flex-row items-center gap-4">
              <TouchableOpacity 
                className="items-center gap-1"
                onPress={() => setIsPlaying(true)}
              >
                 <View className="w-12 h-12 rounded-full bg-patient items-center justify-center shadow-sm">
                    <Repeat size={20} color="#FFFFFF" />
                 </View>
                 <Text className="text-xs font-bold text-patient">إعادة</Text>
              </TouchableOpacity>
              
              <View className="w-px h-10 bg-gray-200" />
              
              <TouchableOpacity className="items-center gap-1">
                 <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                    <Type size={20} color="#022451" />
                 </View>
                 <Text className="text-xs font-medium text-gray-700">تسميات</Text>
              </TouchableOpacity>
           </View>

           <View className="flex-1 ml-6 relative items-center">
              <View className="flex-row justify-between w-full mb-2">
                 <Text className="text-xs font-bold text-patient">{speed.toFixed(1)}x</Text>
                 <Text className="text-xs text-gray-500">سرعة العرض</Text>
              </View>
              <View className="w-full h-1.5 bg-gray-100 rounded-full my-1">
                 <View 
                    className="absolute left-0 top-0 bottom-0 bg-patient rounded-full" 
                    style={{ width: `${(speed / 2) * 100}%` }}
                 />
              </View>
              <View className="flex-row justify-between w-full mt-1">
                 <TouchableOpacity onPress={() => setSpeed(Math.max(0.5, speed - 0.25))}>
                   <Text className="text-[10px] text-gray-400 font-bold">أبطأ</Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={() => setSpeed(Math.min(2.0, speed + 0.25))}>
                   <Text className="text-[10px] text-gray-400 font-bold">أسرع</Text>
                 </TouchableOpacity>
              </View>
           </View>
        </View>

         <View className="flex-row gap-4 mb-6">
            {currentMed.duration && currentMed.duration !== "غير محدد" && currentMed.duration !== "غير محددة" && (
              <View className="flex-1 bg-amber-50 p-4 rounded-2xl flex-row items-center gap-3">
                 <View className="bg-amber-100 w-10 h-10 rounded-xl items-center justify-center">
                    <Calendar size={20} color="#D97706" />
                 </View>
                 <View className="flex-1">
                    <Text className="text-[10px] text-amber-700 mb-0.5 text-right">المدة</Text>
                    <Text className="text-sm font-bold text-amber-900 text-right">{currentMed.duration}</Text>
                 </View>
              </View>
            )}

           {currentMed.dosage && currentMed.dosage !== "غير محدد" && currentMed.dosage !== "غير محددة" && (
             <View className="flex-1 bg-emerald-50 p-4 rounded-2xl flex-row items-center gap-3">
                <View className="bg-emerald-100 w-10 h-10 rounded-xl items-center justify-center">
                   <Pill size={20} color="#059669" />
                </View>
                <View className="flex-1">
                   <Text className="text-[10px] text-emerald-700 mb-0.5 text-right">الجرعة</Text>
                   <Text className="text-sm font-bold text-emerald-900 text-right">{currentMed.dosage}</Text>
                </View>
             </View>
           )}
        </View>
      </ScrollView>
    </MobileShell>
  );
}
