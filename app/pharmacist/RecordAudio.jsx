import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Mic, MicOff, CheckCircle, RefreshCw, Lightbulb, Square, ArrowRight, ArrowLeft } from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";

export default function RecordAudio() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60).toString().padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleNext = () => {
    router.push("/pharmacist/PharmacistHome");
  };

  return (
    <View className="flex-1 bg-background relative">
      <PageHeader title="تسجيل التعليمات" showBackButton={false} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <View className="mt-4 mb-6">
          <View className="flex-row items-end justify-between mb-3">
            <Text className="text-xs text-gray-500 font-bold">60% مكتمل</Text>
            <View className="items-end">
              <Text className="text-xs text-primary font-bold mb-1">الخطوة 2 من 3</Text>
              <Text className="text-2xl font-extrabold text-gray-900">تسجيل التعليمات</Text>
            </View>
          </View>
          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="w-3/5 h-full bg-primary rounded-full" />
          </View>
        </View>

        {/* Recording Card */}
        <View className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 items-center justify-center mb-6">
          <Text className="text-sm font-bold text-gray-600 text-center mb-8 px-4 leading-6">
            قم بتسجيل التعليمات الصوتية بوضوح باللغة العربية لتحويلها تلقائياً إلى لغة الإشارة
          </Text>

          {/* Mic Button */}
          <View className="mb-8 items-center justify-center relative w-40 h-40">
            {isRecording && (
              <>
                <View className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
                <View className="absolute inset-4 bg-primary/10 rounded-full animate-pulse" />
              </>
            )}
            <View className={`w-24 h-24 rounded-full items-center justify-center shadow-lg ${isRecording ? "bg-primary shadow-primary/40" : "bg-gray-300 shadow-gray-200"}`}>
              {isRecording ? <Mic size={40} color="#FFFFFF" /> : <MicOff size={40} color="#FFFFFF" />}
            </View>
          </View>

          {/* Status Row */}
          {isRecording ? (
            <View className="bg-red-50 px-5 py-3 rounded-full flex-row items-center gap-2 border border-red-100">
              <View className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <Text className="text-sm font-bold text-red-600">
                جاري التسجيل... {formatTime(seconds)}
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <View className="bg-emerald-50 px-5 py-3 rounded-full flex-row items-center gap-2 border border-emerald-100 mb-4">
                <CheckCircle size={18} color="#059669" />
                <Text className="text-sm font-bold text-emerald-700">تم إيقاف التسجيل</Text>
              </View>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => { setIsRecording(true); setSeconds(0); }}
                className="flex-row items-center gap-1.5 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200"
              >
                <RefreshCw size={16} color="#4B5563" />
                <Text className="text-sm font-bold text-gray-700">إعادة التسجيل</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tip */}
        <View className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex-row items-start gap-3 shadow-sm">
          <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mt-1">
            <Lightbulb size={18} color="#D97706" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-amber-900 mb-1 text-left">نصيحة للمحتوى:</Text>
            <Text className="text-xs text-amber-700 leading-relaxed text-left">
              "تناول قرصاً واحداً بعد الإفطار وقرصاً واحداً قبل النوم لمدة أسبوع"
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View className="absolute bottom-4 left-0 right-0 flex-row px-5 gap-3 bg-transparent">
        <TouchableOpacity
          className="flex-1 bg-white border border-gray-200 h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowRight size={20} color="#4B5563" />
          <Text className="font-bold text-gray-700 text-base">السابق</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`flex-[2] h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg ${
            isRecording ? "bg-red-500 shadow-red-500/30" : "bg-primary shadow-primary/30"
          }`}
          onPress={isRecording ? stopRecording : handleNext}
          activeOpacity={0.8}
        >
          {isRecording ? (
            <>
              <Square size={20} color="#FFFFFF" fill="#FFFFFF" />
              <Text className="font-bold text-white text-lg">إيقاف التسجيل</Text>
            </>
          ) : (
            <>
              <Text className="font-bold text-white text-lg">معالجة وحفظ</Text>
              <ArrowLeft size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}