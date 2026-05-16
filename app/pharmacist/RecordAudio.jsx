import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Mic,
  MicOff,
  RefreshCw,
  Square
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { tokenStorage } from "@/utils/tokenStorage";
import { fetchClient, API_BASE_URL } from "@/api/client";

export default function RecordAudio() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [recording, setRecording] = useState(null);

  const params = useLocalSearchParams();
  const { prescription_id, item_id } = params;

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

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("تنبيه", "يجب السماح بالوصول إلى الميكروفون لبدء التسجيل.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setSeconds(0);
      setIsRecording(true);
      setHasRecorded(false);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("خطأ", "حدث خطأ أثناء محاولة بدء التسجيل.");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      console.log("Stopping recording...");
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      setRecordingUri(uri);
      setHasRecorded(true);
      setRecording(null);
      
      console.log("Recording stopped and stored at:", uri);

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (err) {
      console.error("Failed to stop recording", err);
      Alert.alert("خطأ", "حدث خطأ أثناء إيقاف التسجيل.");
    }
  };


  const handleContinue = async () => {
    if (!hasRecorded) {
      Alert.alert("تنبيه", "يرجى تسجيل التعليمات أولاً قبل المتابعة.");
      return;
    }

    if (!prescription_id || !item_id) {
      Alert.alert("خطأ", "بيانات الوصفة غير مكتملة. يرجى العودة والمحاولة مرة أخرى.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      
      if (!recordingUri) {
        Alert.alert("خطأ", "لم يتم العثور على ملف صوتي. يرجى إعادة التسجيل.");
        return;
      }
      
      const uri = recordingUri;
      
      // Strict React Native FormData structure for file upload
      formData.append("audio", {
        uri: uri,
        name: "instructions.m4a",
        type: "audio/m4a",
      });

      console.log(`Uploading audio via fetchClient: /pharmacist/prescriptions/${prescription_id}/items/${item_id}/transcribe-audio/`);

      const res = await fetchClient(`/pharmacist/prescriptions/${prescription_id}/items/${item_id}/transcribe-audio/`, {
        method: "POST",
        body: formData,
        requiresAuth: true,
      });

      if (res.success) {
        const transcript = res.data.raw_transcript 
          || res.data.instructions_transcript_edited 
          || res.data.transcript 
          || res.data.text;
          
        console.log("Transcription successful:", transcript);
        router.push({
          pathname: "/pharmacist/VerifyText",
          params: { 
            ...params,
            transcript: transcript
          }
        });
      } else {
        // Detailed error from backend
        console.log("Transcription failed from backend API:", res.data?.detail || res.message);
        const errorMsg = res.data?.detail || "تعذر تحويل الصوت إلى نص. يرجى إعادة التسجيل أو المحاولة مرة أخرى.";
        throw new Error(errorMsg);
      }
    } catch (err) {
      if (err.message !== "تعذر تحويل الصوت إلى نص. يرجى إعادة التسجيل أو المحاولة مرة أخرى.") {
         console.log("Transcription request error details:", err.message);
      }
      Alert.alert("فشل العملية", err.message || "فشل تحويل الصوت إلى نص. يرجى المحاولة مرة أخرى.");
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
                  pathname: "/pharmacist/NewPrescription",
                  params: { 
                    ...params, 
                    keepDraft: "true",
                    medName: params.medName,
                    medDosage: params.medDosage,
                    medDuration: params.medDuration,
                    medFrequency: params.medFrequency
                  }
                })}
                color="#05997F" 
              />
            </View>
            <View className="items-center justify-center" style={{ minHeight: 44 }}>
              <Text className="text-white text-xl font-extrabold">تسجيل التعليمات</Text>
            </View>
          </View>

          {/* Integrated Step Indicator */}
          <View>
            <View className="flex-row items-end justify-between mb-3">
              <Text className="text-[10px] text-white/60 font-extrabold uppercase tracking-tighter">60% مكتمل</Text>
              <View className="items-end">
                <Text className="text-[11px] text-white/90 font-extrabold mb-1 uppercase tracking-wider">
                  الخطوة 2 من 3
                </Text>
                <Text className="text-2xl font-extrabold text-white">
                  تسجيل التعليمات
                </Text>
              </View>
            </View>
            <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <View className="w-3/5 h-full bg-white rounded-full shadow-sm" />
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

          {/* Recording Card */}
          <View className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 items-center justify-center mb-6">
            <Text className="text-sm font-bold text-gray-400 text-center mb-10 px-4 leading-6">
              قم بتسجيل التعليمات الصوتية بوضوح باللغة العربية لتحويلها تلقائياً إلى لغة الإشارة
            </Text>

            {/* Mic Button */}
            <View className="mb-10 items-center justify-center relative w-48 h-48">
              {isRecording && (
                <>
                  <View className="absolute inset-0 bg-pharmacist/5 rounded-full" />
                  <View className="absolute inset-6 bg-pharmacist/10 rounded-full" />
                </>
              )}
              <View
                className={`w-28 h-28 rounded-full items-center justify-center shadow-2xl ${isRecording ? "bg-pharmacist shadow-pharmacist/40" : "bg-gray-200 shadow-gray-200/50"
                  }`}
              >
                {isRecording ? (
                  <Mic size={48} color="#FFFFFF" strokeWidth={2.5} />
                ) : (
                  <MicOff size={48} color="#FFFFFF" strokeWidth={2.5} />
                )}
              </View>
            </View>

            {/* Status Row */}
            {isRecording ? (
              <View className="bg-red-50 px-6 py-4 rounded-2xl flex-row items-center gap-3 border border-red-100">
                <View className="w-3 h-3 rounded-full bg-red-500" />
                <Text className="text-base font-extrabold text-red-600">
                  جاري التسجيل... {formatTime(seconds)}
                </Text>
              </View>
            ) : hasRecorded ? (
              <View className="items-center">
                <View className="bg-emerald-50 px-6 py-4 rounded-2xl flex-row items-center gap-3 border border-emerald-100 mb-6">
                  <CheckCircle size={20} color="#05997F" strokeWidth={2.5} />
                  <Text className="text-base font-extrabold text-pharmacist">تم إيقاف التسجيل</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={startRecording}
                  className="flex-row items-center gap-2 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100"
                >
                  <RefreshCw size={18} color="#4B5563" strokeWidth={2.5} />
                  <Text className="text-sm font-bold text-gray-600">إعادة التسجيل</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-pharmacist/5 px-6 py-4 rounded-2xl flex-row items-center gap-3 border border-pharmacist/10">
                <View className="w-3 h-3 rounded-full bg-gray-300" />
                <Text className="text-base font-extrabold text-gray-500">
                  جاهز للتسجيل
                </Text>
              </View>
            )}
          </View>

          {/* Tip */}
          <View className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex-row items-start gap-4 shadow-sm shadow-amber-900/5">
            <View className="w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center shadow-sm">
              <Lightbulb size={22} color="#D97706" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-amber-900 mb-1 text-right">نصيحة للمحتوى:</Text>
              <Text className="text-xs text-amber-700 leading-relaxed text-right font-medium">
                اذكر اسم الدواء، الجرعة، عدد مرات الاستخدام، وقت تناول الدواء، مدة العلاج، وأي تحذيرات مهمة.{"\n"}
                مثال: تناول حبة واحدة من الدواء مرتين يومياً، صباحاً ومساءً، بعد الطعام لمدة أسبوع. تجنب تناوله مع العصير الحمضي.
              </Text>
            </View>
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
              pathname: "/pharmacist/NewPrescription",
              params: { 
                ...params, 
                keepDraft: "true",
                medName: params.medName,
                medDosage: params.medDosage,
                medDuration: params.medDuration,
                medFrequency: params.medFrequency
              }
            })}
            activeOpacity={0.8}
          >
            <ArrowRight size={20} color="#6B7280" strokeWidth={2.5} />
            <Text className="font-bold text-gray-500 text-base">السابق</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-[2] h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl ${isRecording ? "bg-red-500 shadow-red-500/20" : isProcessing ? "bg-pharmacist/70" : "bg-pharmacist shadow-pharmacist/20"
              }`}
            onPress={isRecording ? stopRecording : hasRecorded ? handleContinue : startRecording}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Text className="font-extrabold text-white text-lg">جاري المعالجة...</Text>
            ) : isRecording ? (
              <>
                <Square size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text className="font-extrabold text-white text-lg">إيقاف</Text>
              </>
            ) : hasRecorded ? (
              <>
                <Text className="font-extrabold text-white text-lg">حفظ ومتابعة</Text>
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
              </>
            ) : (
              <>
                <Mic size={22} color="#FFFFFF" strokeWidth={2.5} />
                <Text className="font-extrabold text-white text-lg">بدء التسجيل</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </MobileShell>
  );
}