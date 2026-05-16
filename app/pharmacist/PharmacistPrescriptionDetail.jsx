import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  ShieldCheck, 
  Activity, 
  Phone, 
  User, 
  Stethoscope,
  MapPin, 
  Calendar, 
  Plus, 
  Pill,
  FileX,
  AlertCircle
} from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";
import { prescriptionApi } from "@/api/prescriptionApi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";

export default function PharmacistPrescriptionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = React.useState(true);
  const [rx, setRx] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (id) {
      fetchDetail();
    } else {
      setIsLoading(false);
      setError("معرف الوصفة مفقود");
    }
  }, [id]);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await prescriptionApi.getPrescriptionDetail(id);
      if (res.success) {
        setRx(res.data);
      } else {
        setError(res.message || "تعذر تحميل تفاصيل الوصفة");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  const getPharmacyName = (prescription) => {
    const nestedName = prescription?.pharmacy?.name;
    const flatName = prescription?.pharmacy_name;
    const name = nestedName || flatName;
    if (!name) return "";
    const clean = String(name).trim();
    if (!clean || ["صيدلية غير محددة", "none", "null", "undefined"].includes(clean)) return "";
    return clean;
  };

  const getItemPrice = (item) => parseFloat(item.price || 0);
  const getItemQuantity = (item) => parseInt(item.quantity || 1);
  const getItemSubtotal = (item) => getItemPrice(item) * getItemQuantity(item);
  const getPrescriptionTotal = (items) => (items || []).reduce((sum, item) => sum + getItemSubtotal(item), 0);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  const getPatientDisplayName = (prescription) => {
    const value =
      prescription?.patient_name ||
      prescription?.patient?.full_name ||
      prescription?.patient?.name ||
      prescription?.patient?.user?.full_name ||
      prescription?.patient?.user?.name ||
      prescription?.session?.patient?.full_name ||
      prescription?.session?.patient?.name ||
      prescription?.patient?.phone_number ||
      prescription?.patient?.user?.phone_number;

    const clean = String(value || "").trim();

    if (
      !clean ||
      clean === "مريض" ||
      clean === "غير محدد" ||
      clean === "null" ||
      clean === "undefined" ||
      clean === "." ||
      clean === "-"
    ) {
      return "مريض غير محدد";
    }

    return clean;
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <PageHeader title="تفاصيل الوصفة" showBackButton role="pharmacist" backTo="/pharmacist/PharmacistPrescriptions" />

      <View className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40 + insets.bottom
          }}
          showsVerticalScrollIndicator={false}
        >


          {isLoading ? (
            <View className="items-center justify-center py-32">
               <ActivityIndicator size="large" color="#05997F" />
               <Text className="text-gray-500 font-bold mt-4">جاري تحميل تفاصيل الوصفة...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-32 bg-red-50 rounded-3xl border border-red-100 px-6">
              <AlertCircle size={40} color="#EF4444" />
              <Text className="text-red-500 font-bold mt-2 text-center">{error}</Text>
              <TouchableOpacity onPress={fetchDetail} className="mt-4 bg-red-500 px-6 py-2 rounded-xl">
                <Text className="text-white font-bold">إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          ) : !rx ? (
            <View className="items-center justify-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-4">
              <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-sm mb-4">
                 <FileX size={40} color="#D1D5DB" />
              </View>
              <Text className="text-lg font-extrabold text-gray-900 mb-2">الوصفة غير موجودة</Text>
              <Text className="text-sm font-bold text-gray-400">لا يمكن العثور على تفاصيل هذه الوصفة.</Text>
            </View>
          ) : (
            <>
              {/* Patient Info Card */}
              <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6">
                <View className="flex-row items-center justify-between mb-6 pb-6 border-b border-gray-50">
                  <TouchableOpacity className="w-12 h-12 bg-pharmacist/5 rounded-2xl items-center justify-center">
                    <Phone size={22} color="#05997F" strokeWidth={2.5} />
                  </TouchableOpacity>

                  <View className="items-end">
                    <Text className="text-lg font-extrabold text-gray-900">{getPatientDisplayName(rx)}</Text>
                    <Text className="text-xs text-gray-400 font-bold mt-1 uppercase">ID: {String(rx.id).toUpperCase()}</Text>
                  </View>

                  <View className="w-14 h-14 bg-gray-50 rounded-2xl items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                    <User size={30} color="#9CA3AF" strokeWidth={1.5} />
                  </View>
                </View>

                <View className="flex-row items-center justify-between px-2">
                  <View className="items-end flex-1">
                    <Text className="text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider text-right">العيادة / الطبيب</Text>
                    <View className="flex-row items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-xl self-end">
                      <Text className="text-xs font-bold text-gray-800 text-right">
                        {rx.doctor_name || "طبيب غير محدد"}
                        {rx.doctor_specialty ? ` - ${rx.doctor_specialty}` : ""}
                      </Text>
                      <Stethoscope size={12} color="#05997F" />
                    </View>
                  </View>
                  <View className="items-end ml-4">
                    <Text className="text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider">تاريخ الوصفة</Text>
                    <View className="flex-row items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                      <Text className="text-xs font-bold text-gray-800">{(rx.prescribed_at || rx.created_at || rx.date || "").split('T')[0] || "---"}</Text>
                      <Calendar size={12} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
                {getPharmacyName(rx) ? (
                   <View className="mt-4 pt-4 border-t border-gray-50">
                      <Text className="text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider text-right">الصيدلية</Text>
                      <View className="flex-row items-center justify-end gap-1.5">
                         <Text className="text-xs font-bold text-gray-600 text-right">{getPharmacyName(rx)}</Text>
                         <MapPin size={12} color="#9CA3AF" />
                      </View>
                   </View>
                ) : null}

                {/* Prescription Total (Subtle) */}
                {rx.items && rx.items.length > 0 && getPrescriptionTotal(rx.items) > 0 && (
                  <View className="mt-4 pt-4 border-t border-gray-50 flex-row items-center justify-between">
                     <View className="flex-row items-center gap-1">
                        <Text className="text-lg font-extrabold text-pharmacist">{formatPrice(getPrescriptionTotal(rx.items))}</Text>
                        <Text className="text-[10px] font-bold text-pharmacist mt-1">ل.س</Text>
                     </View>
                     <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">إجمالي الوصفة</Text>
                  </View>
                )}
              </View>

              {/* Medications */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-5 px-1">
                  <Text className="text-lg font-extrabold text-gray-900">الأدوية الموصوفة ({(rx.items || rx.medications || []).length})</Text>
                </View>

                <View className="gap-4">
                  {(rx.items || rx.medications || []).length === 0 ? (
                    <Text className="text-center font-bold text-gray-400 py-4">لا توجد أدوية في هذه الوصفة.</Text>
                  ) : (
                    (rx.items || rx.medications || []).map((med, index) => (
                      <View
                        key={index}
                        className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50"
                      >
                        <View className="flex-row items-center gap-4 mb-4">
                          <View className="w-14 h-14 bg-pharmacist/5 rounded-2xl items-center justify-center border border-pharmacist/10 overflow-hidden">
                            {med.image_url || med.medicine_image ? (
                              <Image 
                                source={{ uri: med.image_url || med.medicine_image }} 
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                              />
                            ) : (
                              <Pill size={28} color="#05997F" strokeWidth={2} />
                            )}
                          </View>
                           <View className="flex-1">
                             <Text className="text-base font-extrabold text-gray-900 mb-1 text-right">{med.medication_name || med.medicine_name || med.name || "دواء"}</Text>
                             <View className="flex-row justify-end gap-3 mt-1">
                                <View className="flex-row items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                   <Text className="text-[11px] font-bold text-gray-700">{formatPrice(getItemSubtotal(med))}</Text>
                                   <Text className="text-[9px] text-gray-400">ل.س</Text>
                                </View>
                                <View className="flex-row items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                   <Text className="text-[11px] font-bold text-gray-700">الكمية: {getItemQuantity(med)}</Text>
                                </View>
                             </View>
                           </View>
                        </View>

                        <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <Text className="text-xs font-bold text-gray-700 mb-2 text-right leading-relaxed">
                            {(() => {
                              const text = med.approved_instruction_text || med.instructions_text || med.dosage || med.instructions || "";
                              const hiddenValues = ["غير محدد", "غير محددة", "null", "undefined", ".", "-"];
                              return (text && !hiddenValues.includes(String(text).trim())) ? text : "لا توجد تعليمات مسجلة";
                            })()}
                          </Text>
                          
                          <View className="flex-row flex-wrap justify-end gap-2 mt-2">
                             {(() => {
                               const val = String(med.duration || "").trim();
                               const hidden = ["غير محدد", "غير محددة", "null", "undefined", ".", "-", ""];
                               return val && !hidden.includes(val) ? (
                                 <View className="bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">
                                   <Text className="text-[10px] font-bold text-gray-500">{val}</Text>
                                 </View>
                               ) : null;
                             })()}
                             {(() => {
                               const val = String(med.frequency || "").trim();
                               const hidden = ["غير محدد", "غير محددة", "null", "undefined", ".", "-", ""];
                               return val && !hidden.includes(val) ? (
                                 <View className="bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">
                                   <Text className="text-[10px] font-bold text-gray-500">{val}</Text>
                                 </View>
                               ) : null;
                             })()}
                          </View>
                        </View>

                        <View className="flex-row items-center justify-between mt-4 px-1">
                           <View className="flex-row items-center gap-2">
                              {med.transcription_status === 'approved' || med.transcription_status === 'completed' ? (
                                 <View className="flex-row items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    <Activity size={10} color="#059669" />
                                    <Text className="text-[9px] font-bold text-emerald-600">النص جاهز</Text>
                                 </View>
                              ) : null}
                           </View>
                           <View className="flex-row items-center gap-2">
                               {(med.sign_status === 'completed') ? (
                                  <View className="flex-row items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md">
                                     <ShieldCheck size={10} color="#2563EB" />
                                     <Text className="text-[9px] font-bold text-blue-600">الإشارة جاهزة</Text>
                                  </View>
                               ) : (med.sign_status === 'pending' || med.sign_status === 'processing') ? (
                                  <View className="flex-row items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                                     <Text className="text-[9px] font-bold text-gray-400">قيد المعالجة</Text>
                                  </View>
                               ) : null}
                            </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>


    </MobileShell>
  );
}