import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  FileText
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tokenStorage } from "@/utils/tokenStorage";
import { API_BASE_URL } from "@/api/client";

export default function VerifyText() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { prescription_id, item_id, transcript } = params;
  const insets = useSafeAreaInsets();

  const [extractedText, setExtractedText] = useState(transcript || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = async () => {
    if (extractedText.trim().length === 0) {
      Alert.alert("نص مفقود", "يرجى كتابة أو التأكد من وجود النص قبل تحويله إلى لغة الإشارة.");
      return;
    }

    if (!prescription_id || !item_id) {
      Alert.alert("خطأ", "بيانات الجلسة مفقودة. يرجى البدء من جديد.");
      return;
    }

    setIsProcessing(true);

    try {
      const { access } = await tokenStorage.getTokens();
      
      console.log(`Approving transcript for: /pharmacist/prescriptions/${prescription_id}/items/${item_id}/approve-transcript/`);

      const response = await fetch(`${API_BASE_URL}/pharmacist/prescriptions/${prescription_id}/items/${item_id}/approve-transcript/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${access}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          approved_instruction_text: extractedText
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Transcript approved successfully");
        router.push({
          pathname: "/pharmacist/GeneratingSign",
          params: { 
            ...params,
            verifiedText: extractedText 
          }
        });
      } else {
        const errorMsg = data.detail || "فشل اعتماد النص المعدل. يرجى المحاولة مرة أخرى.";
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Approve Transcript Error:", err);
      Alert.alert("خطأ في الاعتماد", err.message || "حدث خطأ أثناء معالجة طلبك.");
    } finally {
      setIsProcessing(false);
    }
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
              <HeaderBackButton 
                onPress={() => router.replace({
                  pathname: "/pharmacist/RecordAudio",
                  params: { ...params }
                })}
                color="#05997F" 
              />
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
                  مراجعة النص المعتمد
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
                <Text className="text-sm font-extrabold text-gray-900">النص المعتمد للتحويل إلى لغة الإشارة</Text>
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
            onPress={() => router.replace({
              pathname: "/pharmacist/RecordAudio",
              params: { ...params }
            })}
            activeOpacity={0.8}
          >
            <ArrowRight size={20} color="#6B7280" strokeWidth={2.5} />
            <Text className="font-bold text-gray-500 text-base">السابق</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-[2] ${isProcessing ? "bg-pharmacist/70" : "bg-pharmacist"} h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-pharmacist/20`}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Text className="font-extrabold text-white text-lg">جاري الإعداد...</Text>
            ) : (
              <>
                <Text className="font-extrabold text-white text-lg">اعتماد ومتابعة</Text>
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </MobileShell>
  );
}
