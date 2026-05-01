import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  FileText
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VerifyText() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Mock extracted text
  const [extractedText, setExtractedText] = useState(
    "تناول قرصاً واحداً بعد الإفطار وقرصاً واحداً قبل النوم لمدة أسبوع. تجنب شرب العصائر الحمضية مع هذا الدواء."
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleContinue = () => {
    router.push("/pharmacist/GeneratingSign");
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-background">
        {/* Rounded Integrated Header */}
        <View className="bg-pharmacist pt-4 pb-12 px-6 rounded-b-[4rem] shadow-2xl shadow-pharmacist/30 relative overflow-hidden">
          {/* Background decorative element */}
          <View className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />

          <View className="mb-8" style={{ position: 'relative', minHeight: 44 }}>
            <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
              <HeaderBackButton fallback="/pharmacist/RecordAudio" color="#05997F" />
            </View>
            <View className="items-center justify-center" style={{ minHeight: 44 }}>
              <Text className="text-white text-xl font-extrabold">مراجعة النص</Text>
            </View>
          </View>

          {/* Integrated Step Indicator */}
          <View>
            <View className="flex-row items-end justify-between mb-3">
              <Text className="text-[10px] text-white/60 font-extrabold uppercase tracking-tighter">80% مكتمل</Text>
              <View className="items-end">
                <Text className="text-[11px] text-white/90 font-extrabold mb-1 uppercase tracking-wider">
                  الخطوة 3 من 3
                </Text>
                <Text className="text-2xl font-extrabold text-white">
                  تحقيق النص المستخرج
                </Text>
              </View>
            </View>
            <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <View className="w-4/5 h-full bg-white rounded-full shadow-sm" />
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 100 + insets.bottom
          }}
          showsVerticalScrollIndicator={false}
        >

          {/* Info Card */}
          <View className="bg-primary/5 rounded-3xl p-5 border border-primary/10 flex-row items-start gap-4 mb-6">
            <AlertCircle size={20} color="#05997F" />
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-primary mb-1 text-right">يرجى المراجعة بعناية</Text>
              <Text className="text-xs text-primary/70 leading-relaxed text-right font-medium">
                تأكد من أن النص أدناه يطابق التعليمات الصوتية التي سجلتها بدقة قبل تحويله إلى لغة إشارة.
              </Text>
            </View>
          </View>

          {/* Text Content Area */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 min-h-[200px]">
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-50">
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                className="flex-row items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
              >
                <Edit3 size={14} color={isEditing ? "#05997F" : "#6B7280"} />
                <Text className={`text-xs font-bold ${isEditing ? "text-primary" : "text-gray-500"}`}>
                  {isEditing ? "حفظ التعديل" : "تعديل النص"}
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-extrabold text-gray-900">النص المستخرج</Text>
                <FileText size={18} color="#05997F" />
              </View>
            </View>

            {isEditing ? (
              <TextInput
                className="text-base text-gray-800 leading-relaxed text-right font-medium min-h-[120px]"
                multiline
                value={extractedText}
                onChangeText={setExtractedText}
                autoFocus
              />
            ) : (
              <Text className="text-base text-gray-800 leading-relaxed text-right font-medium">
                {extractedText}
              </Text>
            )}
          </View>

          <View className="mt-8 items-center">
            <CheckCircle2 size={40} color="#05997F" opacity={0.1} />
            <Text className="text-[10px] text-gray-300 font-extrabold mt-2 uppercase tracking-widest text-center px-10">
              بمجرد النقر على متابعة، سيتم إنشاء فيديو لغة الإشارة آلياً
            </Text>
          </View>
        </ScrollView>

        {/* Fixed Footer */}
        <View
          className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex-row gap-3"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <TouchableOpacity
            className="flex-1 bg-gray-50 border border-gray-100 h-14 rounded-2xl flex-row items-center justify-center gap-2"
            onPress={() => router.replace("/pharmacist/RecordAudio")}
            activeOpacity={0.8}
          >
            <ArrowRight size={20} color="#6B7280" strokeWidth={2.5} />
            <Text className="font-bold text-gray-500 text-base">السابق</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-[2] bg-pharmacist h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-pharmacist/20"
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text className="font-extrabold text-white text-lg">متابعة وإنشاء الفيديو</Text>
            <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </MobileShell>
  );
}
