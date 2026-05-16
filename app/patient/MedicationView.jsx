import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal, Alert } from "react-native";
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
  Hand,
  Flag,
  Clock,
  X,
} from "lucide-react-native";
import { Video, ResizeMode } from "expo-av";
import PageHeader from "@/components/mobile/PageHeader";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { prescriptionApi } from "@/api/prescriptionApi";

export default function MedicationView() {
  const { id, medIndex, itemId } = useLocalSearchParams();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [rx, setRx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEnlargeModal, setShowEnlargeModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

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
  const realItemId = itemId || currentMed?.id;

  const handleReportSubmit = async () => {
    if (!realItemId || isReporting) return;
    
    setIsReporting(true);
    try {
      const res = await prescriptionApi.reportSignIssue(realItemId);
      if (res.success || res.code === "sign_quality_report_exists") {
        setShowReportModal(false);
        setTimeout(() => {
          Alert.alert("تم الإرسال", "تم إرسال البلاغ للمراجعة");
        }, 500);
      } else {
        Alert.alert("خطأ", res.message || "تعذر إرسال البلاغ، حاول مرة أخرى");
      }
    } catch (err) {
      Alert.alert("خطأ", "تعذر إرسال البلاغ، حاول مرة أخرى");
    } finally {
      setIsReporting(false);
    }
  };

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
      
      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Medication Header Card */}
          <View className="bg-white rounded-[24px] p-5 flex-row items-center gap-4 shadow-sm border border-gray-50 mb-6">
            <TouchableOpacity 
              onPress={() => setShowEnlargeModal(true)}
              disabled={!(currentMed.image_url || currentMed.medicine_image)}
              className="w-[70px] h-[70px] bg-patient/5 rounded-2xl items-center justify-center border border-patient/10 overflow-hidden"
              activeOpacity={0.8}
            >
              {currentMed.image_url || currentMed.medicine_image ? (
                <Image 
                  source={{ uri: currentMed.image_url || currentMed.medicine_image }} 
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <Pill size={32} color="#022451" />
              )}
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-extrabold text-gray-900 mb-1 text-right">
                {currentMed.medication_name || currentMed.medicine_name || currentMed.name || "دواء"}
              </Text>
              <View className="flex-row justify-end">
                <View className="bg-patient/10 px-3 py-1 rounded-full">
                  <Text className="text-[10px] font-extrabold text-patient">
                    دواء موصوف
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sign Language Video Section */}
          {!videoUrl ? (
            <View className="w-full aspect-video bg-white rounded-[32px] overflow-hidden mb-6 items-center justify-center border border-gray-100 shadow-sm p-8">
              <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                <Hand size={32} color="#D1D5DB" />
              </View>
              <Text className="text-gray-400 font-extrabold text-sm text-center leading-relaxed">
                فيديو لغة الإشارة غير متوفر حالياً.{"\n"}يرجى اتباع التعليمات النصية.
              </Text>
            </View>
          ) : (
            <View className="w-full aspect-video bg-gray-900 rounded-[32px] overflow-hidden mb-6 relative shadow-lg shadow-black/20">
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
                    className="w-16 h-16 rounded-full bg-patient/90 items-center justify-center shadow-2xl"
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
            </View>
          )}

          {/* Instructions Card */}
          <View className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 mb-6">
            <View className="flex-row items-center justify-end gap-2 mb-4">
              <Text className="text-sm font-extrabold text-gray-900">التعليمات والإرشادات</Text>
              <Type size={18} color="#022451" />
            </View>
            <Text className="text-sm text-gray-600 leading-relaxed text-right font-medium">
              {instructions}
            </Text>
          </View>

          {/* Playback Controls (Only if video exists) */}
          {videoUrl && (
            <View className="bg-white rounded-[24px] p-5 flex-row items-center justify-between mb-6 shadow-sm border border-gray-50">
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
          )}

          {/* Report Button (Patient only) */}
          <View className="mb-8">
            <TouchableOpacity
              onPress={() => setShowReportModal(true)}
              activeOpacity={videoUrl ? 0.7 : 1}
              disabled={!videoUrl}
              className={`py-4 px-6 rounded-2xl flex-row items-center justify-center gap-3 border ${videoUrl ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}
            >
              <Text className={`${videoUrl ? 'text-red-600' : 'text-gray-400'} font-extrabold text-sm`}>
                الإشارة غير واضحة
              </Text>
              <Flag size={18} color={videoUrl ? "#EF4444" : "#9CA3AF"} />
            </TouchableOpacity>
            {!videoUrl && (
              <Text className="text-[10px] text-gray-400 text-center mt-2 font-bold">
                سيتم تفعيل البلاغ عند توفر فيديو الإشارة
              </Text>
            )}
          </View>

          {/* Details Row */}
          <View className="flex-row flex-wrap gap-4 mb-6">
              {(() => {
                const val = String(currentMed.duration || "").trim();
                const hidden = ["غير محدد", "غير محددة", "none", "null", "undefined", ".", "-", ""];
                return val && !hidden.includes(val) ? (
                  <View className="flex-1 min-w-[140px] bg-amber-50 p-4 rounded-2xl flex-row items-center gap-3">
                     <View className="bg-amber-100 w-10 h-10 rounded-xl items-center justify-center">
                        <Calendar size={20} color="#D97706" />
                     </View>
                     <View className="flex-1">
                        <Text className="text-[10px] text-amber-700 mb-0.5 text-right">المدة</Text>
                        <Text className="text-sm font-bold text-amber-900 text-right">{val}</Text>
                     </View>
                  </View>
                ) : null;
              })()}

             {(() => {
                const val = String(currentMed.dosage || "").trim();
                const hidden = ["غير محدد", "غير محددة", "none", "null", "undefined", ".", "-", ""];
                return val && !hidden.includes(val) ? (
                  <View className="flex-1 min-w-[140px] bg-emerald-50 p-4 rounded-2xl flex-row items-center gap-3">
                     <View className="bg-emerald-100 w-10 h-10 rounded-xl items-center justify-center">
                        <Pill size={20} color="#059669" />
                     </View>
                     <View className="flex-1">
                        <Text className="text-[10px] text-emerald-700 mb-0.5 text-right">الجرعة</Text>
                        <Text className="text-sm font-bold text-emerald-900 text-right">{val}</Text>
                     </View>
                  </View>
                ) : null;
              })()}

             {(() => {
                const val = String(currentMed.frequency || "").trim();
                const hidden = ["غير محدد", "غير محددة", "none", "null", "undefined", ".", "-", ""];
                return val && !hidden.includes(val) ? (
                  <View className="flex-1 min-w-[140px] bg-blue-50 p-4 rounded-2xl flex-row items-center gap-3">
                     <View className="bg-blue-100 w-10 h-10 rounded-xl items-center justify-center">
                        <Clock size={20} color="#3B82F6" />
                     </View>
                     <View className="flex-1">
                        <Text className="text-[10px] text-blue-700 mb-0.5 text-right">التكرار</Text>
                        <Text className="text-sm font-bold text-blue-900 text-right">{val}</Text>
                     </View>
                  </View>
                ) : null;
              })()}
          </View>
        </ScrollView>
      </View>

      {/* Report Confirmation Modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-white w-full rounded-[32px] p-8 shadow-2xl">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-6 self-center">
              <AlertCircle size={32} color="#EF4444" />
            </View>
            
            <Text className="text-xl font-extrabold text-gray-900 text-center mb-4">تأكيد إرسال بلاغ</Text>
            
            <Text className="text-sm text-gray-500 text-center leading-relaxed font-bold mb-8">
              هل تريد إرسال بلاغ بأن فيديو الإشارة غير واضح؟ سيتم مراجعة البلاغ من قبل المشرف.
            </Text>

            <View className="gap-3">
              <TouchableOpacity
                onPress={handleReportSubmit}
                disabled={isReporting}
                className={`py-4 rounded-2xl items-center justify-center shadow-lg ${isReporting ? 'bg-gray-300' : 'bg-red-500 shadow-red-500/20'}`}
              >
                {isReporting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-white font-extrabold text-base">إرسال البلاغ</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowReportModal(false)}
                className="bg-gray-50 py-4 rounded-2xl items-center justify-center border border-gray-100"
              >
                <Text className="text-gray-500 font-extrabold text-base">إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Enlargement Modal */}
      <Modal
        visible={showEnlargeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEnlargeModal(false)}
      >
        <View className="flex-1 bg-black/90 items-center justify-center relative">
          <TouchableOpacity 
            style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
            onPress={() => setShowEnlargeModal(false)}
            className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            activeOpacity={1} 
            className="w-full h-full items-center justify-center p-4"
            onPress={() => setShowEnlargeModal(false)}
          >
            <Image 
              source={{ uri: currentMed.image_url || currentMed.medicine_image }} 
              style={{ width: '100%', height: '80%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </MobileShell>
  );
}
