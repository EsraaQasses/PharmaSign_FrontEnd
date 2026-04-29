import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { 
  Hand, 
  Cpu, 
  CheckCircle2
} from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";

export default function GeneratingSign() {
  const router = useRouter();

  useEffect(() => {
    // Simulate generation delay
    const timer = setTimeout(() => {
      // In a real app, we'd go back to the meds list
      // For this flow, we'll go to the "Finalize Prescription" or back to NewPrescription
      router.push("/pharmacist/NewPrescription?addedMed=true");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "bottom", "left", "right"]}>
      {/* Rounded Integrated Header Overlay */}
      <View className="absolute top-0 left-0 right-0 h-1/4 bg-pharmacist rounded-b-[4rem] shadow-2xl shadow-pharmacist/40" />
      
      <View className="flex-1 items-center justify-center p-8">
        <View className="w-32 h-32 bg-white/20 rounded-full items-center justify-center mb-10 border border-white/20">
          <View className="absolute inset-0 items-center justify-center">
             <ActivityIndicator size="large" color="#FFFFFF" scale={2} />
          </View>
          <Hand size={48} color="#FFFFFF" strokeWidth={2.5} />
        </View>

        <Text className="text-3xl font-extrabold text-white text-center mb-2">
          جاري إنشاء الفيديو
        </Text>
        <Text className="text-base text-white/70 text-center mb-12 font-medium">
          نعمل الآن على تحويل النص إلى رسومات متحركة بلغة الإشارة الوصفية...
        </Text>

        <View className="w-full bg-white/10 rounded-3xl p-6 border border-white/10">
          <View className="flex-row items-center gap-4 justify-end mb-5">
            <Text className="text-sm font-bold text-white">تحليل القواعد النحوية للغة الإشارة</Text>
            <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center">
              <CheckCircle2 size={16} color="#FFFFFF" />
            </View>
          </View>
          
          <View className="flex-row items-center gap-4 justify-end mb-5">
            <Text className="text-sm font-bold text-white">توليد حركات اليدين والوجه</Text>
            <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
               <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          </View>

          <View className="flex-row items-center gap-4 justify-end">
            <Text className="text-sm font-bold text-white/40">دمج الفيديو النهائي</Text>
            <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center" />
          </View>
        </View>

        <View className="mt-16 flex-row items-center gap-2 bg-black/20 px-6 py-3 rounded-2xl">
          <Cpu size={18} color="#FFFFFF" opacity={0.5} />
          <Text className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
            AI Engine • Sigma-V2 Processing
          </Text>
        </View>
      </View>
    </MobileShell>
  );
}
