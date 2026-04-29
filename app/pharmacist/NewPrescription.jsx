import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Camera, Image as ImageIcon, Search, Upload, ArrowLeft, ArrowRight, Plus, CheckCircle, Hand } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function NewPrescription() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addedMed } = useLocalSearchParams();
  const [drugName, setDrugName] = useState("");
  const [price, setPrice] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  
  const [medications, setMedications] = useState([
    { id: '1', name: 'أوميبرازول 20mg', dosage: 'حبة واحدة قبل الإفطار', duration: '14 يوم' }
  ]);

  const handleNext = () => {
    router.push("/pharmacist/RecordAudio");
  };

  const handleSendPrescription = () => {
    alert("تم إرسال الوصفة الطبية بنجاح");
    router.push("/pharmacist/PharmacistHome");
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1">
          {/* Rounded Integrated Header */}
          <View className="bg-pharmacist pt-4 pb-12 px-6 rounded-b-[4rem] shadow-2xl shadow-pharmacist/30 relative overflow-hidden">
            {/* Background decorative element */}
            <View className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            
            <View className="flex-row items-center justify-between mb-8">
               <TouchableOpacity 
                 onPress={() => router.replace("/pharmacist/PharmacistHome")}
                 className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center border border-white/10"
               >
                  <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />
               </TouchableOpacity>
               <Text className="text-white text-xl font-extrabold">إضافة دواء جديد</Text>
               <View className="w-10" />
            </View>

            {/* Integrated Step Indicator */}
            <View>
              <View className="flex-row items-end justify-between mb-3">
                <Text className="text-[10px] text-white/60 font-extrabold uppercase tracking-tighter">20% مكتمل</Text>
                <View className="items-end">
                  <Text className="text-[11px] text-white/90 font-extrabold mb-1 uppercase tracking-wider">
                    الخطوة 1 من 3
                  </Text>
                  <Text className="text-2xl font-extrabold text-white">
                    معلومات الدواء
                  </Text>
                </View>
              </View>
              <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <View className="w-1/5 h-full bg-white rounded-full shadow-sm" />
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
            keyboardShouldPersistTaps="handled"
          >

            {/* Camera/Upload Area */}
            <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
              <View className="flex-row items-center gap-2 mb-4 justify-end">
                <Text className="text-sm font-extrabold text-gray-900">
                  صورة الدواء
                </Text>
                <ImageIcon size={18} color="#05997F" />
              </View>

              <TouchableOpacity
                className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center mb-5 overflow-hidden"
                activeOpacity={0.7}
              >
                <View className="bg-white p-4 rounded-full shadow-sm mb-2">
                   <Camera size={32} color="#9CA3AF" />
                </View>
                <Text className="text-xs text-gray-400 font-bold">
                   التقط صورة لعلبة الدواء
                </Text>
              </TouchableOpacity>

              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-gray-50 border border-gray-100 py-4 rounded-xl flex-row items-center justify-center gap-2">
                  <Upload size={18} color="#6B7280" />
                  <Text className="text-sm font-bold text-gray-600">رفع ملف</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-pharmacist py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-pharmacist/20">
                  <Camera size={18} color="#FFFFFF" strokeWidth={2.5} />
                  <Text className="text-sm font-extrabold text-white">التقاط</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Details Form */}
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-5">
              <View className="flex-row items-center justify-between mb-4">
                 <TouchableOpacity className="flex-row items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                   <Plus size={14} color="#05997F" />
                   <Text className="text-xs font-bold text-pharmacist">دواء جديد</Text>
                 </TouchableOpacity>
                 <Text className="text-sm font-extrabold text-gray-900">الأدوية المضافة ({addedMed ? medications.length + 1 : medications.length})</Text>
              </View>

              <View className="gap-3 mb-6">
                 {medications.map((med) => (
                   <View key={med.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-row items-center justify-between">
                     <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center">
                       <CheckCircle size={16} color="#FFFFFF" />
                     </View>
                     <View className="items-end">
                       <Text className="text-sm font-bold text-gray-900">{med.name}</Text>
                       <Text className="text-[10px] text-gray-400 mt-0.5">{med.dosage}</Text>
                     </View>
                   </View>
                 ))}
                 
                 {addedMed && (
                   <View className="bg-pharmacist/5 p-4 rounded-2xl border border-pharmacist/20 flex-row items-center justify-between">
                     <View className="w-8 h-8 rounded-full bg-pharmacist items-center justify-center">
                       <Hand size={16} color="#FFFFFF" />
                     </View>
                     <View className="items-end">
                       <Text className="text-sm font-bold text-pharmacist">الدواء الجديد</Text>
                       <Text className="text-[10px] text-pharmacist/60 mt-0.5">تم إنشاء فيديو لغة الإشارة</Text>
                     </View>
                   </View>
                 )}
              </View>

              <View className="h-px bg-gray-100 w-full mb-6" />

              {/* Drug Name Input (for adding more) */}
              <View className="mb-6">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  إضافة دواء إضافي
                </Text>
                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full font-bold"
                    placeholder="ابحث عن اسم الدواء..."
                    placeholderTextColor="#9CA3AF"
                    textAlign="right"
                    value={drugName}
                    onChangeText={setDrugName}
                  />
                  <View className="pl-3">
                    <Search size={22} color="#05997F" strokeWidth={2.5} />
                  </View>
                </View>
              </View>

              {/* Price */}
              <View className="mb-6">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  السعر المتوقع
                </Text>
                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <Text className="text-sm font-extrabold text-gray-400 mr-2 ml-1">ر.س</Text>
                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full pl-2 font-bold"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    textAlign="left"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
              </View>

              <View className="h-px bg-gray-100 w-full mb-6" />

              {/* Doctor Details */}
              <View className="mb-6">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  اسم الطبيب المعالج
                </Text>
                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full font-bold"
                    placeholder="اسم الطبيب كما في الوصفة..."
                    placeholderTextColor="#9CA3AF"
                    textAlign="right"
                    value={doctorName}
                    onChangeText={setDoctorName}
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  تخصص الطبيب
                </Text>
                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full font-bold"
                    placeholder="مثال: باطنة، أطفال، عظام..."
                    placeholderTextColor="#9CA3AF"
                    textAlign="right"
                    value={doctorSpecialty}
                    onChangeText={setDoctorSpecialty}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Footer */}
          <View 
            className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
          >
            {addedMed ? (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-50 border border-gray-200 h-14 rounded-2xl flex-row items-center justify-center gap-2"
                  onPress={() => router.push("/pharmacist/NewPrescription")} // Reset flow for another medicine
                  activeOpacity={0.8}
                >
                  <Plus size={20} color="#6B7280" strokeWidth={2.5} />
                  <Text className="font-bold text-gray-600 text-base">إضافة دواء آخر</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="flex-1 bg-pharmacist h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-pharmacist/20"
                  onPress={handleSendPrescription}
                  activeOpacity={0.8}
                >
                  <CheckCircle size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text className="font-extrabold text-white text-base">إنهاء وإرسال الوصفة</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-50 border border-gray-100 h-14 rounded-2xl items-center justify-center"
                  onPress={() => router.replace("/pharmacist/PharmacistHome")}
                  activeOpacity={0.8}
                >
                  <Text className="font-bold text-gray-500 text-base">إلغاء</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="flex-[2] bg-pharmacist h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-pharmacist/20"
                  onPress={handleNext}
                  activeOpacity={0.8}
                >
                  <Text className="font-extrabold text-white text-lg">الخطوة التالية</Text>
                  <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </MobileShell>
  );
}