import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Camera,
  Upload,
  Search,
  ScanBarcode,
  ArrowLeft,
  X,
  FilePlus,
  Image as ImageIcon,
} from "lucide-react-native";
import PageHeader from "@/components/mobile/PageHeader";

export default function NewPrescription() {
  const router = useRouter();
  const [drugName, setDrugName] = useState("");
  const [price, setPrice] = useState("");

  const handleNext = () => {
    router.push("/pharmacist/RecordAudio");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <PageHeader title="إضافة دواء جديد" showBackButton={false} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step Indicator */}
        <View className="mt-4 mb-6">
          <View className="flex-row items-end justify-between mb-3">
            <Text className="text-xs text-gray-500 font-bold">20% مكتمل</Text>
            <View className="items-end">
              <Text className="text-xs text-primary font-bold mb-1">
                الخطوة 1 من 3
              </Text>
              <Text className="text-2xl font-extrabold text-gray-900">
                معلومات الدواء
              </Text>
            </View>
          </View>
          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="w-1/5 h-full bg-primary rounded-full" />
          </View>
        </View>

        {/* Camera/Upload Area */}
        <View className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 mb-5">
          <View className="flex-row items-center gap-2 mb-4 justify-end">
            <Text className="text-base font-bold text-gray-900">
              صورة الدواء
            </Text>
            <ImageIcon size={20} color="#0C6B58" />
          </View>

          <TouchableOpacity
            className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl items-center justify-center mb-4"
            activeOpacity={0.7}
          >
            <Camera size={40} color="#9CA3AF" />
            <Text className="text-sm text-gray-500 mt-2 font-medium">
              اضغط لتصوير العلبة أو رفع صورة
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-gray-50 border border-gray-200 py-3.5 rounded-xl flex-row items-center justify-center gap-2">
              <Upload size={18} color="#4B5563" />
              <Text className="text-sm font-bold text-gray-700">رفع ملف</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-primary py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm">
              <Camera size={18} color="#FFFFFF" />
              <Text className="text-sm font-bold text-white">التقاط</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Details Form */}
        <View className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 mb-5">
          {/* Drug Name */}
          <View className="mb-5">
            <Text className="text-sm font-bold text-gray-700 mb-2 text-right">
              اسم الدواء / المادة الفعالة
            </Text>
            <View className="flex-row items-center border border-gray-200 bg-gray-50 rounded-xl px-3 h-14 relative focus:border-primary">
              <TextInput
                className="flex-1 text-base text-gray-900 h-full"
                placeholder="ابحث عن اسم الدواء..."
                placeholderTextColor="#9CA3AF"
                textAlign="right"
                value={drugName}
                onChangeText={setDrugName}
              />
              <View className="px-2">
                <Search size={22} color="#0C6B58" />
              </View>
            </View>
            <View className="flex-row items-center justify-end flex-wrap gap-2 mt-3">
              <TouchableOpacity className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                <Text className="text-xs font-bold text-primary">بندول (Panadol)</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                <Text className="text-xs font-bold text-primary">أوجمنتين (Augmentin)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price */}
          <View className="mb-5">
            <Text className="text-sm font-bold text-gray-700 mb-2 text-right">
              سعر الدواء
            </Text>
            <View className="flex-row items-center border border-gray-200 bg-gray-50 rounded-xl px-4 h-14">
              <Text className="text-base font-bold text-gray-400 mr-2">ر.س</Text>
              <TextInput
                className="flex-1 text-base text-gray-900 h-full pl-2"
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                textAlign="left"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          {/* Barcode */}
          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2 text-right">
              مسح الباركود السريع
            </Text>
            <TouchableOpacity className="flex-row items-center justify-center gap-3 h-14 bg-primary/5 border-2 border-primary/20 rounded-xl">
              <Text className="text-base font-bold text-primary">
                فتح الماسح الضوئي
              </Text>
              <ScanBarcode size={22} color="#0C6B58" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View className="absolute bottom-4 left-0 right-0 flex-row px-5 gap-3 bg-transparent">
        <TouchableOpacity
          className="flex-1 bg-white border border-gray-200 h-14 rounded-2xl items-center justify-center shadow-sm"
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text className="font-bold text-gray-700 text-base">إلغاء</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="flex-[2] bg-primary h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-primary/30"
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text className="font-bold text-white text-lg">التالي</Text>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}